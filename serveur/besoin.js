const DB = require("./db").DB

module.exports.postAjouterBesoin = async(req, res) => {
    try {
        var result = await DB.query('INSERT INTO besoin SET ?', { "description": req.body.description, "id_participant": req.body.id_participant, "id_evenement": req.params.id });

        if (result == undefined) {
            res.sendStatus(404)
        }

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

    res.sendStatus(200)
}

module.exports.putModifierBesoin = async(req, res) => {

    try {
        var result = await DB.query('UPDATE besoin SET ? WHERE id_besoin = ? AND id_evenement = ?', [req.body, req.params.idbesoin, req.params.id])

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
        var result = await DB.query('DELETE FROM besoin WHERE id_besoin = ? AND id_evenement = ?', [req.params.idbesoin, req.params.id])
        if (result == undefined || result.changedRows == 0) {
            res.sendStatus(404)
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
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