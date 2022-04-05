const DB = require("./db").DB
const upload = require("./upload.controller")
const mail = require("./sendEmail")

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

module.exports.CreerNotification = async(message, type, id_type, id_compte) => {
    try {
        let mailNotif = await DB.query("SELECT notif_email, email FROM compte WHERE id_compte = id_compte");
        mailNotif = mailNotif[0];
        if(mailNotif[0].notif_email) mail.sendEmail(mailNotif[0].email, "Vous avez recu une notification", message);

        await DB.query("INSERT INTO `notification`(`message`, `type`, `etat`, `recu`, `id_type`, `id_compte`) VALUES (?,?,0,?,?,?)", [message, type, new Date(), id_type, id_compte])
        return 0;
    } catch (error) {
        console.log(error)
        return -1; //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifMess = async(id_compte, message) => {
    try {
        await this.CreerNotification(message, Type_Message, 0, id_compte);
        return 0;
    } catch (error) {
        console.log(error)
        return -1; //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifInvitation = async(id_compte, id_event, message, res) => {
    try {
        let insert = await DB.query("INSERT INTO `modele_invitation`(`id_participant`, `id_evenement`) VALUES (?,?);", [id_compte, id_event])
        await this.CreerNotification(message, Type_Invitation, insert.insertId, id_compte);
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
        await this.CreerNotification(message, Type_DemandeRejoindre, insert.insertId, event.id_proprietaire);
        return 0;
    } catch (error) {
        console.log(error)
        return -1; //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifAjoutBesoin = async(description, id_participant, event, user) => {
    try {
        let message = `L'utilisateur ${user.prenom} ${user.nom} propose d'ajouter le besoin ${description} à l'événement ${event.titre}`;

        let insert = await DB.query("INSERT INTO modele_besoin(id_vrai_besoin, description, id_participant, id_evenement) VALUES (0, ?, ?, ?)", [description, id_participant, event.id_evenement]);
        await this.CreerNotification(message, Type_AjoutBesoin, insert.insertId, event.id_proprietaire);
        
        return 0;
    } catch (err) {
        console.log(err)
        return -1 //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifModifBesoin = async(id, description, id_participant, event, user) => {
    try {
        let besoin = await DB.query("SELECT description FROM besoin WHERE id_besoin = ?", [id]);
        let message = `L'utilisateur ${user.prenom} ${user.nom} propose de modifier le besoin ${besoin[0].description}(${event.titre})`;

        let insert = await DB.query("INSERT INTO modele_besoin(id_vrai_besoin, description, id_participant, id_evenement) VALUES (?, ?, ?, ?)", [id, description, id_participant, event.id_evenement]);
        await this.CreerNotification(message, Type_ModifBesoin, insert.insertId, event.id_proprietaire);

        return 0
    } catch (error) {
        console.log(error)
        return -1 //erreur lors de l execution de la requete
    }
}

module.exports.CreerNotifSupprBesoin = async(id, event, user) => {
    try {
        let besoin = await DB.query("SELECT description FROM besoin WHERE id_besoin = ?", [id]);
        let message = `L'utilisateur ${user.prenom} ${user.nom} propose de supprimer le besoin ${besoin[0].description}(${event.titre})`

        let insert = await DB.query("INSERT INTO modele_besoin(id_vrai_besoin) VALUES (?)", [id]);
        await this.CreerNotification(message, Type_SupprBesoin, insert.insertId, event.id_proprietaire);

        return 0
    } catch (error) {
        console.log(error)
        return -1 //erreur lors de l execution de la requete
    }
}


module.exports.CreerNotifModifEvent = async(oldEvent, newData, user) => {
    try {
        let message = `L'utilisateur ${user.prenom} ${user.nom} propose de modifier l'événement ${oldEvent.titre}`;

        let insert = await DB.query("INSERT INTO modele_evenement(id_vrai_evenement, titre, description, departement, debut, fin, img_banniere) VALUES (?,?,?,?,?,?,?);", [oldEvent.id_evenement, newData.titre, newData.description, newData.departement, newData.debut, newData.fin, newData.img_banniere])
        await this.CreerNotification(message, Type_ModifEvent, insert.insertId, oldEvent.id_proprietaire);

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
                res.sendStatus(400);
                return;

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
                await this.AccepterModifBesoin(req, res);
                return;

            case Type_SupprBesoin:
                await this.AccepterSupprBesoin(req, res);
                return;

            case Type_ModifEvent:
                await this.AccepterModifEvent(req, res);
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

module.exports.AccepterModifBesoin = async(req, res) => {
    try {
        let modele = await DB.query('SELECT * FROM modele_besoin WHERE id_m_besoin = ?', [req.notification.id_type]);
        modele = modele[0];

        await DB.query('UPDATE besoin SET description = ?, id_participant = ? WHERE id_besoin = ?', [modele.description, modele.id_participant, modele.id_vrai_besoin]);

        await DB.query('DELETE FROM notification WHERE id_notif = ?', [req.notification.id_notif]);
        await DB.query('DELETE FROM modele_besoin WHERE id_m_besoin = ?', [modele.id_m_besoin]);

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.AccepterSupprBesoin = async(req, res) => {
    try {
        let modele = await DB.query('SELECT * FROM modele_besoin WHERE id_m_besoin = ?', [req.notification.id_type]);
        modele = modele[0];

        await DB.query('DELETE FROM besoin WHERE id_besoin = ?', [modele.id_vrai_besoin]);

        await DB.query('DELETE FROM notification WHERE id_notif = ?', [req.notification.id_notif]);
        await DB.query('DELETE FROM modele_besoin WHERE id_m_besoin = ?', [modele.id_m_besoin]);

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.AccepterModifEvent = async(req, res) => {
    try {
        let modele = await DB.query('SELECT * FROM modele_evenement WHERE id_m_evenement = ?', [req.notification.id_type]);
        modele = modele[0];

        let oldEvent = await DB.query('SELECT img_banniere FROM evenement WHERE id_evenement = ?', [modele.id_vrai_evenement]);
        if(modele.img_banniere !== oldEvent[0].img_banniere) upload.removeImage(oldEvent[0].img_banniere);

        await DB.query('UPDATE evenement SET titre = ?, description = ?, departement = ?, debut = ?, fin = ?, img_banniere = ? WHERE id_evenement = ?', [modele.titre, modele.description, modele.departement, modele.debut, modele.fin, modele.img_banniere, modele.id_vrai_evenement]);

        await DB.query('DELETE FROM notification WHERE id_notif = ?', [req.notification.id_notif]);
        await DB.query('DELETE FROM modele_evenement WHERE id_m_evenement = ?', [modele.id_m_besoin]);

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
                res.sendStatus(400);
                return;

            case Type_Invitation:
                await this.RefuserInvitation(req, res);
                return;

            case Type_DemandeRejoindre:
                await this.RefuserInvitation(req, res);
                return;

            case Type_AjoutBesoin:
                await this.RefuserAjoutBesoin(req, res);
                return;

            case Type_ModifBesoin:
                await this.RefuserModifBesoin(req, res);
                return;

            case Type_SupprBesoin:
                await this.RefuserSupprBesoin(req, res);
                return;

            case Type_ModifEvent:
                await this.RefuserModifEvent(req, res);
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

module.exports.RefuserModifBesoin = async(req, res) => {
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

module.exports.RefuserSupprBesoin = async(req, res) => {
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

module.exports.RefuserModifEvent = async(req, res) => {
    try {
        let modele = await DB.query('SELECT * FROM modele_evenement WHERE id_m_evenement = ?', [req.notification.id_type]);
        modele = modele[0];

        if(modele.img_banniere)
            upload.removeImage(modele.img_banniere);

        await DB.query('DELETE FROM notification WHERE id_notif = ?', [req.notification.id_notif]);
        await DB.query('DELETE FROM modele_evenement WHERE id_m_evenement = ?', [modele.id_m_besoin]);

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}