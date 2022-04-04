const DB = require("./db").DB
const notif = require("./notification.controller")
const event = require("./event.controller")
const https = require('https')

module.exports.postAjouterBesoin = async(req, res) => {
    try {
        let participant = []
        if (req.body.email) {
            participant = await DB.query('SELECT id_compte, nom, prenom FROM compte WHERE email=?', [req.body.email])
            if (participant[0] === undefined) {
                console.log(participant)
                return
            }
        }

        if (participant[0])
            await DB.query('INSERT INTO besoin(description, id_participant, id_evenement) VALUES (?, ?, ?)', [req.body.description, participant[0].id_compte, req.params.id])
        else
            await DB.query('INSERT INTO besoin(description, id_evenement) VALUES (?, ?)', [req.body.description, req.params.id])

        res.sendStatus(200)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}

module.exports.putModifierBesoin = async(req, res) => {
    try {
        let compte = []
        if (req.body.email) {
            compte = await DB.query('SELECT id_compte FROM compte WHERE email = ?', [req.body.email])
            if (compte[0] === undefined)
                return res.sendStatus(404)
        }

        let newNeed = {
            description: req.body.description,
            id_participant: compte[0] ? compte[0].id_compte : null
        }
        let result = await DB.query('UPDATE besoin SET ? WHERE id_besoin = ? AND id_evenement = ?', [newNeed, req.params.idbesoin, req.params.id])
        if (compte[0]) {
            if (result.changedRows === 0) {
                return res.sendStatus(404)
            }
        }
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    return res.sendStatus(200)

}

module.exports.postSupprBesoin = async(req, res) => {
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
    try {
        let result = await DB.query('SELECT id_besoin as id, description, id_participant FROM besoin WHERE id_evenement=? AND ' +
            'id_besoin NOT IN (SELECT id_vrai_besoin FROM modele_besoin)', [req.params.id])

        for (let i = 0; i < result.length; i++) {
            let participant = await DB.query('SELECT email, prenom, nom, img_profil FROM compte WHERE id_compte=?', [result[i].id_participant])
            result[i] = {
                ...result[i],
                ...participant[0]
            }
        }

        res.json({
            liste: result,
            usermail: res.locals.user.email
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

module.exports.postProposerBesoin = async(req, res) => {
    try {
        let participant = await DB.query('SELECT id_compte, nom, prenom FROM compte WHERE email=?', [req.body.email])
        let id_participant = undefined;
        if (participant.length) id_participant = participant[0].id_compte;

        let event = await DB.query('SELECT * FROM evenement WHERE id_evenement = ?', [req.params.id])
        let msg = res.locals.user.prenom + " " + res.locals.user.nom + " souhaite ajouter le besoin " + req.body.description + " à l'événement " + event[0].description;
        
        let result = await notif.CreerNotifAjoutBesoin(msg, req.body.description, id_participant, event[0])

        if (result === -1) return res.sendStatus(500)

        res.sendStatus(200)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

module.exports.postProposerModifBesoin = async(req, res) => {
    try {
        var infos = await DB.query("SELECT prenom, nom FROM compte WHERE id_compte = ?", [res.locals.user.id_compte]);
        
        let event = await DB.query('SELECT * FROM evenement WHERE id_evenement = ?', [req.params.id]);
        
        var result = await notif.CreerNotifModifBesoin(req.params.idbesoin, infos[0].prenom + " " + infos[0].nom + " propose de modifier un besoin", req.body.description, req.body.id_participant, event)
        if (result == -1) return res.sendStatus(500);
        
        res.sendStatus(200);
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

module.exports.postProposerSupprBesoin = async(req, res) => {
    try {
        let event = await DB.query('SELECT * FROM evenement WHERE id_evenement = ?', [req.params.id]);

        var result = notif.CreerNotifSupprBesoin(req.params.idbesoin, event)

        if (result === -1) res.sendStatus(500)
        else res.sendStatus(200)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

module.exports.postSeProposerBesoin = async(req, res) => {
    try {
        // !!!! Impossible avec la db actuelle

        var result = DB.query("INSERT INTO ")
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}