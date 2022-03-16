const DB = require("./db").DB
var async = require('async')

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

module.exports.getEvenement = async (req, res) => {
    let evenement;
    let participants = []
    let besoins = []
    try {
        // recupere les informations de l evenement
        evenement = await DB.query('SELECT evenement.id_evenement, titre, description, departement, debut, fin, archivage, etat, img_banniere, id_proprietaire '
            + 'FROM evenement '
            + 'WHERE id_evenement = ?', [req.params.id])

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
        res.sendStatus(500)     //erreur lors de l execution de la requete
    }

    if (evenement == undefined) res.sendStatus(404)       // evenement inconnu (404)
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

module.exports.getMesEvenements = async (req, res) => {
    try {
        events = await DB.query('SELECT * FROM evenement WHERE id_proprietaire = ?', [res.locals.user.id_compte]);

        if (events === undefined) res.sendStatus(400);
        else res.status(200).json(events);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.getMesParticipations = async (req, res) => {
    try {
        events = await DB.query('SELECT * FROM evenement WHERE id_evenement IN (SELECT id_evenement FROM participant WHERE id_compte = ?) AND id_proprietaire != ?', [res.locals.user.id_compte, res.locals.user.id_compte]);

        if (events === undefined) res.sendStatus(400);
        else res.status(200).json(events);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.saveEvent = async (req, res) => {
    try {
        // --- CHECK

        let checkPrivileges = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if(!checkPrivileges.length) {
            res.sendStatus(404) // Not found
            return;
        }

        if(checkPrivileges[0].id_proprietaire !== res.locals.user.id_compte){
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
            img_banniere: req.body.img_banniere
            }, 
            req.params.id]
        );

        let newEvent = await DB.query('SELECT * FROM evenement WHERE id_evenement = ?', [req.params.id]);

        res.status(200).json(modelToJSON(newEvent[0]));

    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal Server Error
    }
}

module.exports.publishEvent = async (req, res) => {
    try {
        // --- CHECK

        let checkPrivileges = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if(!checkPrivileges.length) {
            res.sendStatus(404) // Not found
            return;
        }

        if(checkPrivileges[0].id_proprietaire !== res.locals.user.id_compte){
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

module.exports.putEvenementModification = async (req, res) => {
    // comparer ancien et nouveau champs avant update ?
    let result = 0
    try {
        result = await DB.query('UPDATE evenement SET ? WHERE id_evenement = ?', [{
            titre: req.body.titre, description: req.body.description, departement: req.body.departement,
            debut: req.body.debut, fin: req.body.fin, archivage: req.body.archivage, etat: req.body.etat,
            img_banniere: req.body.img_banniere
        }, req.params.id])

        //la notification est envoyee a tous les particiapnts
        //si il y a une modification
        if (result.changedRows != 0) {
            let rows = await DB.query('SELECT id_compte FROM participant WHERE id_evenement = ?', [req.params.id])
            rows.forEach(e => {
                DB.query('INSERT INTO notification SET ?', { type: 4, id_type: req.params.id, etat: 1, id_compte: e.id_compte })
            })
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)           // erreur lors de l execution de la requete (500)
    }
    res.sendStatus(200)
}

module.exports.createEvent = async (req, res) => {
    try {
        let insert = await DB.query('INSERT INTO evenement (titre, debut, fin, id_proprietaire) VALUES (?, ?, ?, ?)', ["Titre", new Date(), new Date(), res.locals.user.id_compte]);
        await DB.query('INSERT INTO participant VALUES(?, ?)', [res.locals.user.id_compte, insert.insertId])
        res.status(200).json(insert.insertId);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function putEvenementCreation(titre, description, departement, debut, fin, archivage, etat = 0, img_banniere, id_proprietaire) {
    let result = 0
    try {
        result = await DB.query('INSERT INTO evenement SET ?', {
            titre: titre,
            description: description,
            departement: departement,
            debut: debut,
            fin: fin,
            archivage: archivage,
            etat: etat,
            img_banniere: img_banniere,
            id_proprietaire: id_proprietaire,
        })
    } catch (err) {
        console.log(err)
        return -1
    }
    return result.changedRows
}

async function getIdEvenementConsultation(id) {
    let evenements = []
    //titre image description 
    try {
        let rows = []
        // recupere les participants de l evenement
        rows = await DB.query('SELECT e.id_evenement, e.titre, e.description, e.departement, e.debut, e.fin, e.img_banniere FROM evenement e, participant p WHERE e.id_evenement=p.id_evenement AND p.id_compte=?', [id])
        rows.forEach(e => {
            evenements.push(e)
        })
    } catch (err) {
        console.log(err)
        return -1
    }
    if (evenements.length == 0) return -2
    else return evenements
}


async function supprEvenement(id_evenement, id_compte) {
    let result = 0
    let id_proprietaire = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [id_evenement])
    id_proprietaire = id_proprietaire[0].id_proprietaire
    if (id_proprietaire == id_compte) {
        try {
            result = await DB.query('UPDATE evenement SET etat=1 WHERE id_evenement=?', [id_evenement])
        } catch (err) {
            console.log(err)
            return -1 //erreur lors de l execution de la requete (500)
        }
    } else return -2
}

module.exports.putEvenementCreation = putEvenementCreation
module.exports.getEvenementConsultation = getIdEvenementConsultation
module.exports.supprEvenement = supprEvenement
