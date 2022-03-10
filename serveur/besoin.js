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

module.exports.postAjouterBesoin = postAjouterBesoin
module.exports.putModifierBesoin = putModifierBesoin