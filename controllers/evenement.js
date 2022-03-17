const DB = require("./db").DB

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

module.exports.getEvenement = async(req, res) => {
    let evenement;
    let participants = []
    let besoins = []
    try {
        // recupere les informations de l evenement
        evenement = await DB.query('SELECT evenement.id_evenement, titre, description, departement, debut, fin, archivage, etat, img_banniere, id_proprietaire ' +
            'FROM evenement ' +
            'WHERE id_evenement = ?', [req.params.id])

        evenement = evenement[0]

        let rows = []
            // recupere les participants de l evenement
        rows = await DB.query('SELECT id_compte FROM participant WHERE id_evenement = ?', [req.params.id])
        rows.forEach(e => {
            participants.push(e.id_compte)
        })

        // recupere les besoins de l evenement
        // nom prenom id participant
        rows = await DB.query('SELECT id_besoin, description, id_participant, nom, prenom' +
            ' FROM besoin INNER JOIN compte ON besoin.id_participant=compte.id_compte WHERE id_evenement = ?', [req.params.id])

        rows.forEach(e => {
            besoins.push({
                id_besoin: e.id_besoin,
                description: e.description,
                id_participant: e.id_participant,
                nom_participant: e.nom,
                prenom_participant: e.prenom
            })
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }

    if (evenement == undefined) res.sendStatus(404) // evenement inconnu (404)
    else res.json({
        id: evenement.id_evenement,
        titre: evenement.titre,
        description: evenement.description,
        departement: evenement.departement,
        debut: evenement.debut,
        fin: evenement.fin,
        archivage: evenement.archivage,
        etat: evenement.etat,
        img_banniere: evenement.img_banniere,
        id_proprietaire: evenement.id_proprietaire,
        id_participants: participants,
        besoins: besoins
    })
}

module.exports.getMesEvenements = async(req, res) => {
    try {
        events = await DB.query('SELECT * FROM evenement WHERE id_proprietaire = ?', [res.locals.user.id_compte]);

        if (events === undefined) res.sendStatus(400);
        else res.status(200).json(events);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.getMesParticipations = async(req, res) => {
    try {
        events = await DB.query('SELECT * FROM evenement WHERE id_evenement IN (SELECT id_evenement FROM participant WHERE id_compte = ?) AND id_proprietaire != ?', [res.locals.user.id_compte, res.locals.user.id_compte]);

        if (events === undefined) res.sendStatus(400);
        else res.status(200).json(events);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.saveEvent = async(req, res) => {
    try {
        // --- CHECK

        let checkPrivileges = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!checkPrivileges.length) {
            res.sendStatus(404) // Not found
            return;
        }

        if (checkPrivileges[0].id_proprietaire !== res.locals.user.id_compte) {
            res.sendStatus(403) // Forbidden
            return;
        }

        // --- REQUEST

        await DB.query('UPDATE evenement SET ? WHERE id_evenement = ?', [{
                titre: req.body.titre,
                description: req.body.description,
                departement: req.body.departement,
                debut: req.body.debut,
                fin: req.body.fin,
                archivage: req.body.archivage,
                etat: req.body.etat,
                img_banniere: req.file ? 'http://localhost:5000/api/upload/' + req.file.filename : ''
            },
            req.params.id
        ]);

        let newEvent = await DB.query('SELECT * FROM evenement WHERE id_evenement = ?', [req.params.id]);

        res.status(200).json(modelToJSON(newEvent[0]));

    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal Server Error
    }
}

module.exports.publishEvent = async(req, res) => {
    try {
        // --- CHECK

        let checkPrivileges = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!checkPrivileges.length) {
            res.sendStatus(404) // Not found
            return;
        }

        if (checkPrivileges[0].id_proprietaire !== res.locals.user.id_compte) {
            res.sendStatus(403) // Forbidden
            return;
        }

        // --- REQUEST

        await DB.query('UPDATE evenement SET etat = 1 WHERE id_evenement = ?', [req.params.id]);

        let newEvent = await DB.query('SELECT * FROM evenement WHERE id_evenement = ?', [req.params.id]);

        res.status(200).json(modelToJSON(newEvent[0]));

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

        if(event.etat !== 1) return res.sendStatus(403); // Forbidden

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
            //let idR=await DB.query('SELECT id_compte FROM evenement WHERE id_eve=idEve')
            //sendNotif(idR,idPar)

        if (result == undefined || result.changedRows == 0) res.sendStatus(404)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

    res.sendStatus(200)
}

//le participant veut rejoindre un evenement

module.exports.rejoindreEve=async(req,res)=>{
    try {

    }catch (err){
        console.log(err)
        res.sendStatus(500)
    }
    res.sendStatus(200)
}