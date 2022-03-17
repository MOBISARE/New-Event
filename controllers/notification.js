const DB = require("./db").DB
var async = require('async')

//Consulte toute les notifs liées au compte dont l'id est passé en paramètre
module.exports.getNotification = async(req, res) => {
    let notif = [];
    try {
        notif = await DB.query("SELECT * FROM notification where id_compte = ?", [req.params.id])
        return res.status(200).json(notif);
    } catch (error) {
        console.log(err)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

//Check les notifs de type ajouter (invitation)
module.exports.getEvenement = async(req, res) => {
    let notif = [];
    try {
        notif = await DB.query("SELECT * FROM notification where id_compte = ? and type = ?", [req.params.id], [req.params.type])
        return res.status(200).json(notif);
    } catch (error) {
        console.log(err)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

//Supprime la notification dont l'id est passé en paramètre En cours
//async function supprimerNotif(id, type, Notifid_type){
module.exports.supprimerNotif = async(req, res) => {
    try {
        switch(req.params.type){
            case 1: //Notifs d'invitation/demande pour rejoindre un event
                await DB.query("DELETE FROM `modele_invitation` WHERE `modele_invitation`.`id_m_invitation` = (SELECT id_modele FROM `notif_ajouter` JOIN `notification` on `notif_ajouter`.id_n_ajouter = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
                await DB.query("DELETE FROM `notif_ajouter` WHERE `id_n_ajouter` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
                await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?;", [req.params.id], [req.params.Notifid_type])
                break;
            case 2:
                await DB.query("DELETE FROM `modele_besoin` WHERE `id_m_besoin` = (SELECT id_modele FROM `notif_besoin` JOIN `notification` on `notif_besoin`.id = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
                await DB.query("DELETE FROM `notif_besoin` WHERE `id` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
                await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?;", [req.params.id], [req.params.Notifid_type])
                break;
            case 3://Notifs de modification
                await DB.query("DELETE FROM `modele_evenement` WHERE `id_m_evenement` = (SELECT id_modele FROM `notif_modifier` JOIN `notification` on `notif_modifier`.id = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
                await DB.query("DELETE FROM `notif_modifier` WHERE `id` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
                await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?;", [req.params.id], [req.params.Notifid_type])
                break;
            default:
                break
        }
        return res.status(200)
    } catch (error) {
        console.log(err)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}