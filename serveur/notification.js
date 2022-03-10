const DB = require("./db").DB
var async = require('async')

async function getNotification(id){
    let notif = [];
    try {
        notif = await DB.query("SELECT * FROM notification where id_compte = ?", [id])
        return notif
    } catch (error) {
        console.log(err)
        return -2
    }
}

module.exports.getNotification = getNotification;