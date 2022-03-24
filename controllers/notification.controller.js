const DB = require("./db").DB
const { type } = require("express/lib/response");
const { NULL } = require("mysql/lib/protocol/constants/types");
const event = require("./event.controller")

//Consulte toute les notifs liées au compte dont l'id est passé en paramètre
module.exports.getNotification = async(req, res) => {
    let notif = [];
    try {
        notif = await DB.query("SELECT * FROM notification where id_compte = ?", [res.locals.user.id_compte])
        return res.status(200).json(notif);
    } catch (error) {
        console.log(error)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

//Check les notifs de type ajouter (invitation)
module.exports.getNotificationSpe = async(req, res) => {
    let notif = [];
    try {
        notif = await DB.query("SELECT * FROM notification where id_compte = ? and type = ?", [req.params.id], [req.params.type])
        return res.status(200).json(notif);
    } catch (error) {
        console.log(error)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

//Supprime la notification dont l'id est passé en paramètre En cours
module.exports.supprimerNotif = async(id, res) => {
    type = await DB.query("SELECT type FROM notification WHERE id_notif=?;", [id])
    try {
        switch (type) {
            case 0: //Notifs de message
                SupprimerNotifMess(id)
                break;
            case 1: //Notifs d'invitation/demande pour rejoindre un event et ajout à un besoin
                SupprimerNotifAjout(id, type)
                break;
            case 2:
                SupprimerNotifSuppr(id)
                break;
            case 3: //Notifs de modification
                SupprimerNotifModif(id, type)
                break;
            default:
                break
        }
        return res.status(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

async function SupprimerNotifMess(id) {
    id_compte = await DB.query("SELECT id_compte FROM notification WHERE id_notif=?;", [id])
    id_type = await DB.query("SELECT id_type FROM notification WHERE id_notif=?;", [id])
    await DB.query("DELETE FROM `notif_message` WHERE `id_n_message` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 0 AND `notification`.id_type = ?);", [id_compte], [id_type])
    await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 0 AND `notification`.id_type = ?;", [id_compte], [id_type])
}

async function SupprimerNotifAjout(id) {
    id_compte = await DB.query("SELECT id_compte FROM notification WHERE id_notif=?;", [id])
    id_type = await DB.query("SELECT id_type FROM notification WHERE id_notif=?;", [id])
    type = await DB.query("SELECT type FROM notif_ajouter JOIN notification on notif_ajouter.id_n_ajouter = notification.id_type  WHERE id_notif=?;", [id])
    if (type == 1 || type == 2) { //Si notification d'invitation/demande d'intégration
        await DB.query("DELETE FROM `modele_invitation` WHERE `modele_invitation`.`id_m_invitation` = (SELECT id_modele FROM `notif_ajouter` JOIN `notification` on `notif_ajouter`.id_n_ajouter = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?);", [id_compte], [id_type])
        await DB.query("DELETE FROM `notif_ajouter` WHERE `id_n_ajouter` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?);", [id_compte], [id_type])
        await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 1 AND `notification`.id_type = ?;", [id_compte], [id_type])
    } else { //Si notification d'ajout a un besoin
        await DB.query("DELETE FROM `modele_besoin` WHERE `id_m_besoin` = (SELECT id_modele FROM `notif_ajouter` JOIN `notification` on `notif_ajouter`.id_n_ajouter = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [id_compte], [id_type])
        await DB.query("DELETE FROM `notif_ajouter` WHERE `id_n_ajouter` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [id_compte], [id_type])
        await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?;", [id_compte], [id_type])
    }
}

async function SupprimerNotifSuppr(id) { //Suppression des notifs de suppression de besoin
    id_compte = await DB.query("SELECT id_compte FROM notification WHERE id_notif=?;", [id])
    id_type = await DB.query("SELECT id_type FROM notification WHERE id_notif=?;", [id])
    await DB.query("DELETE FROM `modele_besoin` WHERE `id_m_besoin` = (SELECT id_modele FROM `notif_supprimer` JOIN `notification` on `notif_supprimer`.id = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [id_compte], [id_type])
    await DB.query("DELETE FROM `notif_` WHERE `id` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [id_compte], [id_type])
    await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?;", [id_compte], [id_type])
}

async function SupprimerNotifModif(id, type) {
    id_compte = await DB.query("SELECT id_compte FROM notification WHERE id_notif=?;", [id])
    id_type = await DB.query("SELECT id_type FROM notification WHERE id_notif=?;", [id])
    type = await DB.query("SELECT type FROM notif_supprimer JOIN notification on notif_supprimer.id_n_ajouter = notification.id_type  WHERE id_notif=?;", [id])
    if (type == 1) {
        await DB.query("DELETE FROM `modele_evenement` WHERE `id_m_evenement` = (SELECT id_modele FROM `notif_modifier` JOIN `notification` on `notif_supprimer`.id = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [id_compte], [id_type])
        await DB.query("DELETE FROM `notif_modifier` WHERE `id` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?);", [id_compte], [id_type])
        await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 2 AND `notification`.id_type = ?;", [id_compte], [id_type])
    } else if (req.params.type_notif == 2) { //Suppression des notifs de modification d'event
        await DB.query("DELETE FROM `modele_evenement` WHERE `id_m_evenement` = (SELECT id_modele FROM `notif_modifier` JOIN `notification` on `notif_modifier`.id = `notification`.id_type WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?);", [id_compte], [id_type])
        await DB.query("DELETE FROM `notif_modifier` WHERE `id` = (SELECT id_type FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?);", [id_compte], [id_type])
        await DB.query("DELETE FROM `notification` WHERE `notification`.id_compte = ? AND `notification`.type = 3 AND `notification`.id_type = ?;", [id_compte], [id_type])
    }
}


module.exports.CreerNotifMess = async(id_compte, message, res) => {
    try {
        await DB.query("INSERT INTO `notif_message`(`message`) VALUES (?);", [message])
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,0,0,?,?,?)", [message], new Date(), NULL, [id_compte])
        return res.status(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifInvitation = async(id_compte, id_event, message, res) => {
    try {
        await DB.query("INSERT INTO `modele_invitation`(`id_participant`, `id_evenement`) VALUES VALUES (?,?);", [id_compte], [id_event])
        id_mod = await DB.query("SELECT `id_modele` from `modele_invitation` where `id_evenement` = ?", [id_event])
        await DB.query("INSERT INTO `notif_ajouter`(`type`, `id_modele`) VALUES (1,?);", [id_mod])
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,1,0,?,?,?)", [message], new Date(), [id_mod], [id_compte])
        return res.status(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifRejoindre = async(id_compte, id_event, message, res) => {
    try {
        await DB.query("INSERT INTO `modele_invitation`(`id_participant`, `id_evenement`) VALUES VALUES (?,?);", [id_compte], [id_event])
        id_mod = await DB.query("SELECT `id_modele` from `modele_invitation` where `id_evenement` = ?", [id_event])
        await DB.query("INSERT INTO `notif_ajouter`(`type`, `id_modele`) VALUES (2,?);", [id_mod])
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,1,0,?,?,?)", [message], new Date(), [id_mod], [req.params.id_compte])
        return res.status(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifAjoutBesoin = async(id, message) => {
    try {
        await DB.query("INSERT INTO modele_besoin(id_vrai_besoin, message) VALUES (?,?);", [id, message])
        id_mod = await DB.query("SELECT id_m_besoin from modele_besoin where id_vrai_besoin = ?", [id])
        await DB.query("INSERT INTO notif_ajouter(type, id_modele) VALUES (3,?);", [id_mod[0].id_m_besoin])
        var proprio_id = await event.getProprioBesoin(id)

        await DB.query("INSERT INTO notification(message, type, etat, recu, id_type, id_compte) VALUES (?,1,0,?,?,?)", [message, new Date(), id_mod[0].id_m_besoin, proprio_id])

        return 0

    } catch (err) {
        console.log(err)
        return -1 //erreur lors de l execution de la requete
    }
}
module.exports.CreerNotifSupprBesoin = async(id, message) => {
    try {
        await DB.query("INSERT INTO modele_besoin(id_vrai_besoin, message) VALUES (?,?);", [id, message])
        id_mod = await DB.query("SELECT id_m_besoin from modele_besoin where id_vrai_besoin = ?", [id])
        await DB.query("INSERT INTO notif_supprimer(type, id_modele) VALUES (1,?);", [id_mod[0].id_m_besoin])
        var proprio_id = await event.getProprioBesoin(id)

        await DB.query("INSERT INTO notification(message, type, etat, recu, id_type, id_compte) VALUES (?,2,0,?,?,?)", [message, new Date(), id_mod[0].id_m_besoin, proprio_id])

        return 0
    } catch (error) {
        console.log(error)
        return -1 //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifModifBesoin = async(req, res) => {
    try {
        await DB.query("INSERT INTO `modele_besoin`(`id_vrai_besoin`, `message`) VALUES (?,?);", [req.params.id], [req.params.message])
        id_mod = await DB.query("SELECT `id_modele` from `modele_besoin` where `id_vrai_besoin` = ?", [req.params.id])
        await DB.query("INSERT INTO `notif_modifier`(`type`, `id_modele`) VALUES (1,?);", [id_mod])
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,3,0,?,?,?);", [req.params.message], new Date(), [id_mod], [req.params.id_compte])
        return res.status(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifModifEvent = async(req, res) => { //TODO
    try {
        await DB.query("INSERT INTO `modele_evenement`(`id_vrai_evenement`, `titre`, `description`, `departement`, `debut`, `fin`, `img_banniere`) VALUES (?,?,?,?,?,?,?);", [req.params.id_event], [req.params.titre])
        id_mod = await DB.query("SELECT `id_modele` from `modele_evenement` where `id_vrai_evenement` = ?", [req.params.id])
        await DB.query("INSERT INTO `notif_modifier`(`type`, `id_modele`) VALUES (1,?);", [id_mod])
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,3,0,?,?,?);", [req.params.message], new Date(), [id_mod], [req.params.id_compte])
        return res.status(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}