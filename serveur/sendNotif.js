const DB = require("./db").DB
var async = require('async')

async function sendNotif(idR,idE){

    try {
        //result = await DB.query('INSERT INTO notification SET ?', { type: ???, id_type: id, etat: 1, id_compte: ??? })
        
    } catch (err) {
        console.log(err)
        return -1
    }
}