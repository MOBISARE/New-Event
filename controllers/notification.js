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
module.exports.supprimerNotif = async(req, res) => {
    try {
        switch(req.params.type){
            case 0://Notifs de message
                SupprimerNotifMess(req)
                break;
            case 1: //Notifs d'invitation/demande pour rejoindre un event et ajout à un besoin
                SupprimerNotifAjout(req)
                break;
            case 2:
                SupprimerNotifSuppr(req)
                break;
            case 3://Notifs de modification
                SupprimerNotifModif(req)
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

async function SupprimerNotifMess(req){
    await DB.query("DELETE FROM `notif_message` WHERE `id_n_message` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 0 AND `notification`.id_type = ?);", [req.params.id], [req.params.id_type])
    await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 0 AND `notification`.id_type = ?;", [req.params.id], [req.params.id_type])
}

async function SupprimerNotifAjout(req){
    if(req.params.type_notif == 1 || req.params.type_notif == 2){//Si notification d'invitation/demande d'intégration
        await DB.query("DELETE FROM `modele_invitation` WHERE `modele_invitation`.`id_m_invitation` = (SELECT id_modele FROM `notif_ajouter` JOIN `notification` on `notif_ajouter`.id_n_ajouter = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?);", [req.params.id], [req.params.id_type])
        await DB.query("DELETE FROM `notif_ajouter` WHERE `id_n_ajouter` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?);", [req.params.id], [req.params.id_type])
        await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?;", [req.params.id], [req.params.id_type])
    }
    else{//Si notification d'ajout a un besoin
        await DB.query("DELETE FROM `modele_besoin` WHERE `id_m_besoin` = (SELECT id_modele FROM `notif_ajouter` JOIN `notification` on `notif_ajouter`.id = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [req.params.id], [req.params.id_type])
        await DB.query("DELETE FROM `notif_ajouter` WHERE `id_n_ajouter` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [req.params.id], [req.params.id_type])
        await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?;", [req.params.id], [req.params.id_type])
    }
}

async function SupprimerNotifSuppr(req){//Suppression des notifs de suppression de besoin
    await DB.query("DELETE FROM `modele_besoin` WHERE `id_m_besoin` = (SELECT id_modele FROM `notif_supprimer` JOIN `notification` on `notif_supprimer`.id = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
    await DB.query("DELETE FROM `notif_` WHERE `id` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
    await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?;", [req.params.id], [req.params.Notifid_type])
}

async function SupprimerNotifModif(req){
    if(req.params.type_notif == 1){
        await DB.query("DELETE FROM `modele_evenement` WHERE `id_m_evenement` = (SELECT id_modele FROM `notif_modifier` JOIN `notification` on `notif_supprimer`.id = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
        await DB.query("DELETE FROM `notif_modifier` WHERE `id` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
        await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?;", [req.params.id], [req.params.Notifid_type])    
    }
    else if(req.params.type_notif == 2){//Suppression des notifs de modification d'event
        await DB.query("DELETE FROM `modele_evenement` WHERE `id_m_evenement` = (SELECT id_modele FROM `notif_modifier` JOIN `notification` on `notif_modifier`.id = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
        await DB.query("DELETE FROM `notif_modifier` WHERE `id` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?);", [req.params.id], [req.params.Notifid_type])
        await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?;", [req.params.id], [req.params.Notifid_type])
    }
}