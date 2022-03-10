const DB = require("./db").DB

async function putAjouterBesoin(body) {
    try {
        var result = await DB.query('INSERT INTO besoin SET ?', body);
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