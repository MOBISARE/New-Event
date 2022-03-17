const DB = require("./db").DB
var async = require('async')

//Consulte toute les notifs liées au compte dont l'id est passé en paramètre
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

//Check les notifs de type ajouter (invitation)
async function getNotificationSpe(id, type){
    let notif = [];
    try {
        notif = await DB.query("SELECT * FROM notification where id_compte = ? and type = ?", [id], [type])
        return notif
    } catch (error) {
        console.log(err)
        return -2
    }
}

//Supprime la notification dont l'id est passé en paramètre En cours
async function supprimerNotif(id, type, Notifid_type){
    let notif = [];
    try {
        switch(type){
            case 1: //Notifs d'invitation/demande pour rejoindre un event
                await DB.query("DELETE FROM `modele_invitation` WHERE `modele_invitation`.`id_m_invitation` = (SELECT id_modele FROM `notif_ajouter` JOIN `notification` on `notif_ajouter`.id_n_ajouter = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?);", [id], [Notifid_type])
                await DB.query("DELETE FROM `notif_ajouter` WHERE `id_n_ajouter` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?);", [id], [Notifid_type])
                await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?;", [id], [Notifid_type])
                break;
            case 2:
                //TODO
                break;
            case 3://Notifs de modification
                await DB.query("DELETE FROM `modele_evenement` WHERE `id_m_evenement` = (SELECT id_modele FROM `notif_modifier` JOIN `notification` on `notif_modifier`.id = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?);", [id], [Notifid_type])
                await DB.query("DELETE FROM `notif_modifier` WHERE `id` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?);", [id], [Notifid_type])
                await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?;", [id], [Notifid_type])
                break;
            default:
                break
        }
        if(type==1){
            
        }
        
        return notif
    } catch (error) {
        console.log(err)
        return -2
    }
}

module.exports.getNotification = getNotification;
module.exports.getNotificationSpe = getNotificationSpe;
module.exports.supprimerNotif = supprimerNotif;