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

//console.log(putAjouterBesoin({ id_participant: 1, id_evenement: 1 }))