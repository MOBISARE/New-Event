const DB = require("./db").DB
var async = require('async')
require("sendNotif.js")

//le participant veut se retirer d'un évenment
async function seRetirer(idEve,idPar){

    try {
        result = await DB.query('DELETE FROM ? WHERE idEve=idE AND idPar=idP')
        let idR=await DB.query('SELECT id_compte FROM evenement WHERE id_eve=idEve')
        sendNotif(idR,idPar)
    } catch (err) {
        console.log(err)
        return -1
    }
}
