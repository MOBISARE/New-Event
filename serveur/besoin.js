const DB = require("./db").DB

async function postAjouterBesoin(id, body) {
    try {
        var result = await DB.query('INSERT INTO besoin SET ?', { "description": body.description, "id_participant": body.id_participant, "id_evenement": id });
    } catch (err) {
        console.log(err)
        return -1
    }

    return result
}

async function putModifierBesoin(id_besoin, id_evenement, body) {
    try {
        var result = await DB.query('UPDATE besoin SET ? WHERE id_besoin = ? AND id_evenement = ?', [body, id_besoin, id_evenement])
    } catch (err) {
        console.log(err)
        return -1
    }

    return result.changedRows
}

async function postSupprBesoin(id_besoin, id_evenement, id_proprietaire) {
    try {
        var proprio = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [id_evenement])
        if (proprio[0].id_proprietaire != id_proprietaire) {
            return -2
        }

        var result = await DB.query('DELETE FROM besoin WHERE id_besoin = ? AND id_evenement = ?', [id_besoin, id_evenement])
    } catch (err) {
        console.log(err)
        return -1
    }

    return result.changedRows
}

module.exports.postAjouterBesoin = postAjouterBesoin
module.exports.putModifierBesoin = putModifierBesoin
module.exports.postSupprBesoin = postSupprBesoin