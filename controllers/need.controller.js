const DB = require("./db").DB
const notif = require("./notification.controller")
const event = require("./event.controller")
const https = require('https')

module.exports.postAjouterBesoin = async(req, res) => {
    try {
        let participant = await DB.query('SELECT id_compte, nom, prenom FROM compte WHERE email=?', [req.body.email])
        if (participant[0] === undefined) {
            console.log(participant)
            return
        }

        await DB.query('INSERT INTO besoin(description, id_participant, id_evenement) VALUES (?, ?, ?)', [req.body.description, participant[0].id_compte, req.params.id])
        let result = await DB.query('SELECT last_insert_id() as id_besoin')

        if (result === undefined) {
            res.sendStatus(404)
            return
        } else {
            res.json({
                id_besoin: result[0].id_besoin,
                nom: participant[0].nom,
                prenom: participant[0].prenom
            })
            return
        }

    } catch (err) {
        console.error(err)
        res.sendStatus(500)
        return
    }
}

module.exports.putModifierBesoin = async(req, res) => {

    try {
        let compte = await DB.query('SELECT id_compte, nom, prenom FROM compte WHERE email = ?', [req.body.email])
        if (compte[0] === undefined)
            return res.sendStatus(404)

        let newNeed = {
            description: req.body.description,
            id_participant: compte[0].id_compte
        }
        var result = await DB.query('UPDATE besoin SET ? WHERE id_besoin = ? AND id_evenement = ?', [newNeed, req.params.idbesoin, req.params.id])
        result.nom = compte.nom
        result.prenom = compte.prenom
        if (result == undefined || result.changedRows == 0) {
            return res.sendStatus(404)
        }
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    return res.sendStatus(200)

}

module.exports.postSupprBesoin = async(req, res) => {

    /*var proprio = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id])
    if (proprio[0].id_proprietaire != req.params.id) {
        res.sendStatus(401)
    }*/
    try {
        await DB.query('DELETE FROM besoin WHERE id_besoin = ? AND id_evenement = ?', [req.params.idbesoin, req.params.id])
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
        return
    }

    res.sendStatus(200)
}

module.exports.getBesoin = async(req, res) => {

    var result;
    try {
        var result = await DB.query('SELECT * FROM besoin WHERE id_besoin = ? AND id_evenement = ?', [req.params.idbesoin, req.params.id])
        console.log(result)

        if (result == undefined || result.length == 0) { res.sendStatus(404) } else res.json({
            "id_besoin": result[0].id_besoin,
            "description": result[0].description,
            "id_participant": result[0].id_participant,
            "id_evenement": result[0].id_evenement
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

module.exports.getListeBesoins = async(req, res) => {
    let result;
    try {
        result = await DB.query('SELECT id_besoin as id, description, id_participant, email, prenom, nom FROM besoin INNER JOIN compte c on besoin.id_participant = c.id_compte WHERE id_evenement=?', [req.params.id])
        console.log(req.params.id)

        if (result === undefined) { res.sendStatus(404) } else res.json(result)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

module.exports.postProposerBesoin = async(req, res) => {
    try {
        let participant = await DB.query('SELECT id_compte, nom, prenom FROM compte WHERE email=?', [req.body.email])
        if (participant[0] === undefined) {
            console.log(participant)
            return
        }

        await DB.query('INSERT INTO besoin(description, id_participant, id_evenement) VALUES (?, ?, ?)', [req.body.description, participant[0].id_compte, req.params.id])
        let result = await DB.query('SELECT last_insert_id() as id_besoin')

        await notif.CreerNotifAjoutBesoin(result[0].id_besoin, req.body.message, res)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}