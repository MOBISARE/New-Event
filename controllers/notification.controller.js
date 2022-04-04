const DB = require("./db").DB
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
module.exports.supprimerNotif = async(req, res) => {
    try {
        // Check 
        let notification = await DB.query("SELECT * FROM notification WHERE id_notif = ?", [req.params.id]);
        if (!notification.length) return res.sendStatus(404); // Not Found
        notification = notification[0];
        if (notification.id_compte != res.locals.user.id_compte) return res.sendStatus(403); // Forbidden

        await DB.query("DELETE FROM notification WHERE id_notif = ?", [notification.id_notif]);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

// NOTIF : 
const Type_Message = 0;
const Type_Invitation = 1;
const Type_DemandeRejoindre = 2;
const Type_AjoutBesoin = 3;
const Type_ModifBesoin = 4;
const Type_SupprBesoin = 5;
const Type_ModifEvent = 6;

module.exports.CreerNotifMess = async(id_compte, message) => {
    try {
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,?,0,?,0,?)", [message, Type_Message, new Date(), id_compte])
        return 0;
    } catch (error) {
        console.log(error)
        return -1; //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifInvitation = async(id_compte, id_event, message, res) => {
    try {
        let insert = await DB.query("INSERT INTO `modele_invitation`(`id_participant`, `id_evenement`) VALUES (?,?);", [id_compte, id_event])
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,?,0,?,?,?)", [message, Type_Invitation, new Date(), insert.insertId, id_compte])
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

module.exports.CreerNotifRejoindre = async(id_event, user) => {
    try {
        let event = await DB.query('SELECT id_proprietaire, titre FROM evenement WHERE id_evenement = ?', [id_event])
        event = event[0];
        let message = `L'utilisateur ${user.prenom} ${user.nom} demande à rejoindre l'événement ${event.titre}`

        let insert = await DB.query("INSERT INTO `modele_invitation`(`id_participant`, `id_evenement`) VALUES (?, ?)", [user.id_compte, id_event])
        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,?,0,?,?,?)", [message, Type_DemandeRejoindre, new Date(), insert.insertId, event.id_proprietaire])
        return 0;
    } catch (error) {
        console.log(error)
        return -1; //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifAjoutBesoin = async(message, description, id_participant, event) => {
    try {
        let insert = await DB.query("INSERT INTO modele_besoin(id_vrai_besoin, description, id_participant, id_evenement) VALUES (0, ?, ?, ?)", [description, id_participant, event.id_evenement]);
        await DB.query("INSERT INTO notification(message, type, etat, recu, id_type, id_compte) VALUES (?,?,0,?,?,?)", [message, Type_AjoutBesoin, new Date(), insert.insertId, event.id_proprietaire])

        return 0;

    } catch (err) {
        console.log(err)
        return -1 //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifModifBesoin = async(id, message, description, id_participant, event) => {
    try {
        let insert = await DB.query("INSERT INTO modele_besoin(id_vrai_besoin, description, id_participant, id_evenement) VALUES (?, ?, ?, ?)", [id, description, id_participant, event.id_evenement]);

        await DB.query("INSERT INTO notification(message, type, etat, recu, id_type, id_compte) VALUES (?,?,0,?,?,?);", [message, Type_ModifBesoin, new Date(), insert.insertId, event.id_proprietaire]);
        return 0
    } catch (error) {
        console.log(error)
        return -1 //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifSupprBesoin = async(id, message) => {
    try {
        let insert = await DB.query("INSERT INTO modele_besoin(id_vrai_besoin, message) VALUES (?,?);", [id, message])
        var proprio_id = await event.getProprioBesoin(id)

        await DB.query("INSERT INTO notification(message, type, etat, recu, id_type, id_compte) VALUES (?,?,0,?,?,?)", [message, Type_SupprBesoin, new Date(), id_mod[0].id_m_besoin, proprio_id])

        return 0
    } catch (error) {
        console.log(error)
        return -1 //erreur lors de l execution de la requete
    }
}


module.exports.CreerNotifModifEvent = async(oldEvent, newData, user) => {
    try {
        let message = "Nouvelle demande de modification de l'événement " + oldEvent.titre;

        let insert = await DB.query("INSERT INTO `modele_evenement`(`id_vrai_evenement`, `titre`, `description`, `departement`, `debut`, `fin`, `img_banniere`) VALUES (?,?,?,?,?,?,?);", [oldEvent.id_evenement, newData.titre, newData.description, newData.departement, newData.debut, newData.fin, newData.img_banniere])

        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,?,0,?,?,?);", [message, Type_ModifEvent, new Date(), insert.insertId, oldEvent.id_proprietaire])

        return 0;
    } catch (error) {
        console.log(error)
        return -1;
    }
}

// === ACCEPTER ===

module.exports.accepterNotif = async(req, res) => {
    try {
        let notif = await DB.query('SELECT * FROM notification WHERE id_notif = ?', [req.params.id]);
        if (!notif.length) return res.sendStatus(404);
        notif = notif[0];
        if (notif.id_compte != res.locals.user.id_compte) return res.sendStatus(403);
        req.notification = notif;

        switch (notif.type) {
            case Type_Message:

                break;

            case Type_Invitation:
                await this.AccepterInvitation(req, res);
                return;

            case Type_DemandeRejoindre:
                await this.AccepterInvitation(req, res);
                return;

            case Type_AjoutBesoin:
                await this.AccepterAjoutBesoin(req, res);
                return;

            case Type_ModifBesoin:

                return;

            case Type_SupprBesoin:

                return;

            case Type_ModifEvent:

                return;
        }

        return res.sendStatus(200);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}

module.exports.AccepterInvitation = async(req, res) => {
    try {
        let modele = await DB.query('SELECT * FROM modele_invitation WHERE id_m_invitation = ?', [req.notification.id_type]);
        modele = modele[0];

        await DB.query('INSERT INTO participant (id_compte, id_evenement) VALUES (?, ?)', [modele.id_participant, modele.id_evenement]);

        await DB.query('DELETE FROM notification WHERE id_notif = ?', [req.notification.id_notif]);
        await DB.query('DELETE FROM modele_invitation WHERE id_m_invitation = ?', [modele.id_m_invitation]);

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.AccepterAjoutBesoin = async(req, res) => {
    try {
        let modele = await DB.query('SELECT * FROM modele_besoin WHERE id_m_besoin = ?', [req.notification.id_type]);
        modele = modele[0];

        await DB.query('INSERT INTO besoin (description, id_participant, id_evenement) VALUES (?, ?, ?)', [modele.description, modele.id_participant, modele.id_evenement]);

        await DB.query('DELETE FROM notification WHERE id_notif = ?', [req.notification.id_notif]);
        await DB.query('DELETE FROM modele_besoin WHERE id_m_besoin = ?', [modele.id_m_besoin]);

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.refuserNotif = async(req, res) => {
    try {
        let notif = await DB.query('SELECT * FROM notification WHERE id_notif = ?', [req.params.id]);
        if (!notif.length) return res.sendStatus(404);
        notif = notif[0];
        if (notif.id_compte != res.locals.user.id_compte) return res.sendStatus(403);
        req.notification = notif;

        switch (notif.type) {
            case Type_Message:

                break;

            case Type_Invitation:
                await this.RefuserInvitation(req, res);
                return;

            case Type_DemandeRejoindre:
                await this.RefuserInvitation(req, res);
                return;

            case Type_AjoutBesoin:
                this.RefuserAjoutBesoin(req, res);
                return;

            case Type_ModifBesoin:

                return;

            case Type_SupprBesoin:

                return;

            case Type_ModifEvent:

                return;
        }

        return res.sendStatus(200);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}

module.exports.RefuserInvitation = async(req, res) => {
    try {
        let modele = await DB.query('SELECT * FROM modele_invitation WHERE id_m_invitation = ?', [req.notification.id_type]);
        modele = modele[0];

        if (req.notification.type == Type_DemandeRejoindre) // rejoindre
        {
            let event = await DB.query('SELECT * FROM evenement WHERE id_evenement = ?', [modele.id_evenement]);
            event = event[0];
            await this.CreerNotifMess(modele.id_participant, `Votre demande pour rejoindre l'événement ${event.titre} a été refusé`);
        }

        await DB.query('DELETE FROM notification WHERE id_notif = ?', [req.notification.id_notif]);
        await DB.query('DELETE FROM modele_invitation WHERE id_m_invitation = ?', [modele.id_m_invitation]);

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.RefuserAjoutBesoin = async(req, res) => {
    try {
        let modele = await DB.query('SELECT * FROM modele_besoin WHERE id_m_besoin = ?', [req.notification.id_type]);
        modele = modele[0];

        await DB.query('DELETE FROM notification WHERE id_notif = ?', [req.notification.id_notif]);
        await DB.query('DELETE FROM modele_besoin WHERE id_m_besoin = ?', [modele.id_m_besoin]);

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}