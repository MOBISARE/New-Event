const DB = require("./db").DB
const notif = require("./notification.controller")


modelToJSON = (event) => {
    return {
        id: event.id_evenement,
        titre: event.titre,
        description: event.description,
        departement: event.departement,
        debut: event.debut,
        fin: event.fin,
        archivage: event.archivage,
        etat: event.etat,
        img_banniere: event.img_banniere,
        id_proprietaire: event.id_proprietaire,
    }
}

module.exports.search = async(req, res) => {
    //let events = await DB.query('SELECT * FROM evenement WHERE etat = 1 ');
    let query = 'SELECT * FROM evenement WHERE etat = 1 '
    let debut = ""
    let fin = ""
    let dep = ""
    let tri1 = ""
    let tri2 = ""
    if (req.params.datedebut != "")
        debut = "and debut >= ? "
    if (req.params.datefin != "")
        fin = "and fin <= ? "

    //requete api pour connaitre departement par rapport a ville
    req.params.ville
    let data = 'https://geo.api.gouv.fr/communes?nom=Nantes&fields=departement&limit=5'
    console.log(data)

    //popularite = nombre de partcipants
    //recent
    if (req.params.tri == "popularite") {
        tri2 = ' oder by count(id_compte) desc'
        tri1 = ' inner join participant on participant.id_compte=evenement.id_compte'
    } else if (req.params.tri == "recent") {
        //date debut plus proche date courante
        tri2 = ""
        "SELECT * FROM `evenement`  ORDER BY (CURRENT_DATE()-debut);"
    }

    //nb occurence
    let regex = new RegExp(req.params.search, "i")
    let tmp = await DB.query('SELECT * FROM evenement WHERE etat = 1 ')
    tmp.forEach(tuple => {
        tuple["occurence"] = (tuple["titre"].match(regex) || []).length + (tuple["description"].match(regex) || []).length
        console.log(tuple["titre"].match(regex))
    })
    tmp.sort((a, b) => b["occurence"] - a["occurence"])
    console.log(tmp)
    result = []
    tmp.forEach(e => {
            result.push(modelToJSON(e))
        })
        //console.log(result)


    return res.status(200).json(result);
}

module.exports.getEvenement = async(req, res) => {
    try {
        // get event
        let evenement = await DB.query('SELECT id_evenement, titre, description, departement, debut, fin, etat, img_banniere, id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!evenement.length) return res.sendStatus(404); // Not Found
        evenement = modelToJSON(evenement[0]);

        // get state of user (0:user, 1:participant, 2:owner)
        let proprietaire = await DB.query('SELECT nom, prenom FROM compte WHERE id_compte = ?', [evenement.id_proprietaire]);
        if (!proprietaire.length) return res.sendStatus(500); // Internal Error

        evenement['proprietaire'] = proprietaire[0];

        if (evenement.id_proprietaire === res.locals.user.id_compte) evenement['etatAppartenance'] = 2;
        else {
            part = await DB.query('SELECT id_evenement FROM participant WHERE id_evenement = ? AND id_compte = ?', [req.params.id, res.locals.user.id_compte]);
            if (!part.length) evenement['etatAppartenance'] = 0;
            else evenement['etatAppartenance'] = 1;
        }

        // get nb of participants
        let nbParticipants = await DB.query('SELECT Count(id_compte) as nbParticipants FROM participant WHERE id_evenement = ?', [req.params.id]);
        evenement['nbParticipants'] = nbParticipants[0].nbParticipants;


        res.status(200).json(evenement);

    } catch (err) {
        console.log(err)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

module.exports.getParticipants = async(req, res) => {
    try {
        // --- CHECK
        let checkPrivileges = await DB.query('SELECT id_compte FROM participant WHERE id_evenement = ? AND id_compte = ?', [req.params.id, res.locals.user.id_compte]);

        if (!checkPrivileges.length) return res.sendStatus(404); // Not found

        // --- REQUEST
        let proprio = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!proprio.length) return res.sendStatus(404); // Not found
        proprio = proprio[0].id_proprietaire;

        let participants = await DB.query('SELECT id_compte, email, img_profil, nom, prenom FROM compte WHERE id_compte IN (SELECT id_compte FROM participant WHERE id_evenement = ?)', [req.params.id]);

        participants.forEach(element => {
            if (element['id_compte'] == proprio) element['proprietaire'] = true;
            else element['proprietaire'] = false;

            if (element['id_compte'] == res.locals.user.id_compte) element['vous'] = true;
            else element['vous'] = false;

            delete element['id_compte'];
        });

        res.status(200).json(participants);

    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal Server Error
    }
}

module.exports.getMesEvenements = async(req, res) => {
    try {
        events = await DB.query('SELECT * FROM evenement WHERE id_proprietaire = ?', [res.locals.user.id_compte]);

        return res.status(200).json(events);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.getMesParticipations = async(req, res) => {
    try {
        events = await DB.query('SELECT * FROM evenement WHERE id_evenement IN (SELECT id_evenement FROM participant WHERE id_compte = ?) AND id_proprietaire != ?', [res.locals.user.id_compte, res.locals.user.id_compte]);

        return res.status(200).json(events);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.saveEvent = async(req, res) => {
    try {
        // --- CHECK

        let checkPrivileges = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!checkPrivileges.length) return res.sendStatus(404); // Not found

        if (checkPrivileges[0].id_proprietaire !== res.locals.user.id_compte) return res.sendStatus(403); // Forbidden

        // --- REQUEST

        data = {
            titre: req.body.titre,
            description: req.body.description,
            departement: req.body.departement,
            debut: req.body.debut,
            fin: req.body.fin,
        }

        if (req.file) data['img_banniere'] = 'http://localhost:5000/api/upload/' + req.file.filename;


        await DB.query('UPDATE evenement SET ? WHERE id_evenement = ?', [data, req.params.id]);

        //let newEvent = await DB.query('SELECT * FROM evenement WHERE id_evenement = ?', [req.params.id]);

        //res.status(200).json(modelToJSON(newEvent[0]));

        await this.getEvenement(req, res);

    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal Server Error
    }
}

module.exports.publishEvent = async(req, res) => {
    try {
        // --- CHECK

        let checkPrivileges = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!checkPrivileges.length) return res.sendStatus(404); // Not found

        if (checkPrivileges[0].id_proprietaire !== res.locals.user.id_compte) return res.sendStatus(403); // Forbidden

        // --- REQUEST

        await DB.query('UPDATE evenement SET etat = 1 WHERE id_evenement = ?', [req.params.id]);

        let newEvent = await DB.query('SELECT * FROM evenement WHERE id_evenement = ?', [req.params.id]);

        //res.status(200).json(modelToJSON(newEvent[0]));
        await this.getEvenement(req, res);

    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal Server Error
    }
}

module.exports.createEvent = async(req, res) => {
    try {
        let insert = await DB.query('INSERT INTO evenement (titre, debut, fin, id_proprietaire, img_banniere) VALUES (?, ?, ?, ?, ?)', ["Nouvel événement", new Date(), new Date(), res.locals.user.id_compte, '']);
        await DB.query('INSERT INTO participant VALUES(?, ?)', [res.locals.user.id_compte, insert.insertId])
        res.status(200).json(insert.insertId);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.archiveEvent = async(req, res) => {
    try {
        let event = await DB.query('SELECT id_proprietaire, etat FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!event.length) return res.sendStatus(404); // 	Not Found
        event = event[0];

        if (event.id_proprietaire !== res.locals.user.id_compte) return res.sendStatus(403); // Forbidden

        if (event.etat !== 1) return res.sendStatus(403); // Forbidden

        await DB.query('UPDATE evenement SET etat = 2 WHERE id_evenement = ?', [req.params.id]);

        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.supprEvenement = async(req, res) => {
    try {
        let event = await DB.query('SELECT id_proprietaire, etat FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!event.length) return res.sendStatus(404); // 	Not Found
        event = event[0];

        if (event.id_proprietaire !== res.locals.user.id_compte) return res.sendStatus(403); // Forbidden

        if (event.etat === 1) return res.sendStatus(403); // Forbidden

        await DB.query('DELETE FROM participant WHERE id_evenement = ?', [req.params.id]);
        await DB.query('DELETE FROM besoin WHERE id_evenement = ?', [req.params.id]);
        await DB.query('DELETE FROM evenement WHERE id_evenement = ?', [req.params.id]);

        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

//le participant veut se retirer d'un évenment

module.exports.seRetirer = async(req, res) => {

    try {
        result = await DB.query('DELETE FROM participant WHERE id_evenement=? AND id_compte=?', [req.params.id, res.locals.user.id_compte])
        proprio = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement=?', [req.params.id])
            //faire la notif

        if (result == undefined || result.affectedRows == 0) res.sendStatus(404)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

    res.sendStatus(200)
}

//le participant veut rejoindre un evenement

module.exports.rejoindreEve = async(req, res) => {
    try {
        var proprio=await this.getProprioEve(req.params.id_evenement)
        notif.CreerNotifRejoindre(proprio,req.params.id_evenement,req.body.message,res)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
    res.sendStatus(200)
}



module.exports.getProprioEve = async(id) => {
    var proprio = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement=?', [id])

    return proprio[0].id_proprietaire
}

module.exports.getProprioBesoin = async(id) => {
    var proprio = await DB.query('SELECT id_proprietaire FROM evenement e, besoin b WHERE e.id_evenement = b.id_evenement AND id_besoin = ?', [id])

    return proprio[0].id_proprietaire
}