const DB = require("./db").DB
const event = require("./event.controller")

//Consulte toute les notifs liées au compte dont l'id est passé en paramètre
module.exports.getNotification = async (req, res) => {
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
module.exports.getNotificationSpe = async (req, res) => {
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
module.exports.supprimerNotif = async(req, res) => {
    try {
        // Check 
        let notification = await DB.query("SELECT * FROM notification WHERE id_notif = ?", [req.params.id]);
        if(!notification.length) return res.sendStatus(404); // Not Found
        notification = notification[0];
        if(notification.id_compte != res.locals.user.id_compte) return res.sendStatus(403); // Forbidden
    
        await DB.query("DELETE FROM notification WHERE id_notif = ?", [notification.id_notif]);
        /*
        let type = notification.type;

        switch (type) {
            case 0: //Notifs de message
                SupprimerNotifMess(req.params.id)
                break;
            case 1: //Notifs d'invitation/demande pour rejoindre un event et ajout à un besoin
                SupprimerNotifAjout(req.params.id, type)
                break;
            case 2:
                SupprimerNotifSuppr(req.params.id)
                break;
            case 3: //Notifs de modification
                SupprimerNotifModif(req.params.id, type)
                break;
            default:
                break
        }
        */

        return res.sendStatus(200);
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


module.exports.CreerNotifMess = async (id_compte, message) => {
    try {
        //await DB.query("INSERT INTO `notif_message`(`message`) VALUES (?);", [message]) la table notif_message est inutile !
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,0,0,?,0,?)", [message, new Date(), id_compte])
        return 0;
    } catch (error) {
        console.log(error)
        return -1; //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifInvitation = async (id_compte, id_event, message, res) => {
    try {
        let insert = await DB.query("INSERT INTO `modele_invitation`(`id_participant`, `id_evenement`) VALUES (?,?);", [id_compte, id_event])
        let insertType = await DB.query("INSERT INTO `notif_ajouter`(`type`, `id_modele`) VALUES (1,?);", [insert.insertId])
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,1,0,?,?,?)", [message, new Date(), insertType.insertId, id_compte])
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

module.exports.CreerNotifRejoindre = async (id_event, user) => {
    try {
        let event = await DB.query('SELECT id_proprietaire, titre FROM evenement WHERE id_evenement = ?', [id_event])
        event = event[0];

        let message = `L'utilisateur ${user.prenom} ${user.nom} demande à rejoindre l'événement ${event.titre}`

        let insert = await DB.query("INSERT INTO `modele_invitation`(`id_participant`, `id_evenement`) VALUES (?, ?)", [user.id_compte, id_event])

        let insert2 = await DB.query("INSERT INTO `notif_ajouter`(`type`, `id_modele`) VALUES (2,?);", [insert.insertId])
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,1,0,?,?,?)", [message, new Date(), insert2.insertId, event.id_proprietaire])
        return 0;
    } catch (error) {
        console.log(error)
        return -1; //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifAjoutBesoin = async (id, message) => {
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
module.exports.CreerNotifSupprBesoin = async (id, message) => {
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

module.exports.CreerNotifModifBesoin = async (req, res) => {
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

module.exports.CreerNotifModifEvent = async (oldEvent, newData, user) => {
    try {
        let message = "Nouvelle demande de modification de l'événement " + oldEvent.titre;

        let insertEvent = await DB.query("INSERT INTO `modele_evenement`(`id_vrai_evenement`, `titre`, `description`, `departement`, `debut`, `fin`, `img_banniere`) VALUES (?,?,?,?,?,?,?);", [oldEvent.id_evenement, newData.titre, newData.description, newData.departement, newData.debut, newData.fin, newData.img_banniere])

        let insertType = await DB.query("INSERT INTO `notif_modifier`(`type`, `id_modele`) VALUES (1,?);", [insertEvent.insertId])
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,3,0,?,?,?);", [message, new Date(), insertType.insertId, oldEvent.id_proprietaire])

        return 0;
    } catch (error) {
        console.log(error)
        return -1;
    }
}

module.exports.accepterNotif = async (req, res) => {
    try {
        let notif = await DB.query('SELECT * FROM notification WHERE id_notif = ?', [req.params.id]);
        if(!notif.length) return res.sendStatus(404);
        notif = notif[0];
        if(notif.id_compte != res.locals.user.id_compte) return res.sendStatus(403);

        switch (notif.type) {
            case 0: //Notifs de message
            
                break;
            case 1: //Notifs d'invitation/demande pour rejoindre un event et ajout à un besoin
                req.notification = notif;
                await this.AccepterInvitation(req, res);
                return;
            case 2:
                
                break;
            case 3: //Notifs de modification
            
                break;
            default:
                break
        }

        return res.sendStatus(200);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}

module.exports.AccepterInvitation = async(req, res) => {
    try {
        let notifType = await DB.query('SELECT * FROM notif_ajouter WHERE id_n_ajouter = ?', [req.notification.id_type]);
        notifType = notifType[0];
        let modele = await DB.query('SELECT * FROM modele_invitation WHERE id_m_invitation = ?', [notifType.id_modele]);
        modele = modele[0];

        await DB.query('INSERT INTO participant (id_compte, id_evenement) VALUES (?, ?)', [modele.id_participant, modele.id_evenement]);

        await DB.query('DELETE FROM notification WHERE id_notif = ?', [req.notification.id_notif]);
        await DB.query('DELETE FROM notif_ajouter WHERE id_n_ajouter = ?', [notifType.id_n_ajouter]);
        await DB.query('DELETE FROM modele_invitation WHERE id_m_invitation = ?', [modele.id_m_invitation]);

        res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.refuserNotif = async (req, res) => {
    try {
        let notif = DB.query('SELECT * FROM notification WHERE id_notif = ?', [req.params.id]);
        if(!notif.length) return res.sendStatus(404);
        notif = notif[0];
        if(notif.id_compte != res.locals.user.id_compte) return res.sendStatus(403);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}