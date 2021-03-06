const DB = require("./db").DB
const notif = require("./notification.controller")
const upload = require("./upload.controller")
const axios = require('axios')


modelToJSON = (event) => {
    return {
        id: event.id_evenement,
        titre: event.titre,
        description: event.description,
        departement: event.departement,
        debut: event.debut,
        fin: event.fin,
        archivage: event.archivage,
        etat: event.etat,
        img_banniere: event.img_banniere,
        id_proprietaire: event.id_proprietaire,
    }
}

module.exports.search = async (req, res) => {
    let date = ""
    let dep = ""
    let tri1 = ""
    let tri2 = ""

    //critere date debut / fin
    if (req.query.datedebut)
        date += "and debut >= " + DB.connection.escape(req.query.datedebut)
    if (req.query.datefin)
        date += "and debut <= " + DB.connection.escape(req.query.datefin)

    // critere ville
    if (req.query.ville) {
        dep = "and ("
        let result = await axios.get('https://geo.api.gouv.fr/communes', {
            params: {
                nom: req.query.ville,
                fields: 'departement',
                limit: 5
            }
        })

        let tab = result.data.map(e => "'"+e.departement.nom+"'" )
        let unique = {};
        tab.forEach(i => {
            if (!unique[i]) {
                unique[i] = true;
            }
        })
        tab = Object.keys(unique);
        i = 1
        tab.forEach(e => {
            if (i == 1)
                dep += "departement = " + e
            else
                dep += " or departement = " + e
            i++
        })
        dep += ")"
    }

    //critere popularite = nombre de partcipants
    //critere recent
    if (req.query.tri === "populaire") {
        tri2 = "order BY count(id_compte) desc"
    } else if (req.query.tri === "récent") {
        //date debut plus proche date courante
        tri2 = "order by abs(CURRENT_DATE()-debut)"
    }

    //requete
    let query = `SELECT *, count(id_compte) as nb FROM evenement inner join participant on participant.id_evenement=evenement.id_evenement WHERE etat = 1 ${date} ${dep} group by evenement.id_evenement ${tri2}`

    //critere barre de recherche (nb occurence du mot dans barre de recherche)
    //https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/5912746#5912746
    let regex = new RegExp(req.params.search, "gi")
    let tmp = await DB.query(query)

    tmp.forEach(tuple => {
        tuple["occurence"] = (tuple["titre"].match(regex) || []).length + (tuple["description"].match(regex) || []).length
    })
    //ordre decroissant nombre occurence
    tmp.sort((a, b) => b["occurence"] - a["occurence"])
    events = []
    let etmp
    tmp.forEach(e => {
        etmp = modelToJSON(e)
        etmp.nb_participant = e.nb
        events.push(etmp)
    })

    return res.status(200).json(events);
}

module.exports.getEvenement = async (req, res) => {
    try {
        // get event
        let evenement = await DB.query('SELECT id_evenement, titre, description, departement, debut, fin, etat, img_banniere, id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!evenement.length) return res.sendStatus(404); // Not Found
        evenement = modelToJSON(evenement[0]);

        // get state of user (0:user, 1:participant, 2:owner)
        let proprietaire = await DB.query('SELECT nom, prenom, email, img_profil FROM compte WHERE id_compte = ?', [evenement.id_proprietaire]);
        if (!proprietaire.length) return res.sendStatus(500); // Internal Error

        evenement['proprietaire'] = proprietaire[0];

        if (evenement.id_proprietaire === res.locals.user.id_compte) evenement['etatAppartenance'] = 2;
        else {
            part = await DB.query('SELECT id_evenement FROM participant WHERE id_evenement = ? AND id_compte = ?', [req.params.id, res.locals.user.id_compte]);
            if (!part.length) evenement['etatAppartenance'] = 0;
            else evenement['etatAppartenance'] = 1;
        }

        // get nb of participants
        let nbParticipants = await DB.query('SELECT Count(id_compte) as nbParticipants FROM participant WHERE id_evenement = ?', [req.params.id]);
        evenement['nbParticipants'] = nbParticipants[0].nbParticipants;

        // get demande
        let demande = await DB.query('SELECT id_participant, id_evenement FROM modele_invitation INNER JOIN notification ON modele_invitation.id_m_invitation = notification.id_type WHERE type = 2 AND id_evenement = ? AND id_participant = ?', [req.params.id, res.locals.user.id_compte]);
        if (demande.length) evenement['demande'] = true;

        res.status(200).json(evenement);

    } catch (err) {
        console.log(err)
        res.sendStatus(500) //erreur lors de l execution de la requete
    }
}

module.exports.getParticipants = async (req, res) => {
    try {
        // --- CHECK
        let checkPrivileges = await DB.query('SELECT id_compte FROM participant WHERE id_evenement = ? AND id_compte = ?', [req.params.id, res.locals.user.id_compte]);

        if (!checkPrivileges.length) return res.sendStatus(404); // Not found

        // --- REQUEST
        let proprio = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!proprio.length) return res.sendStatus(404); // Not found
        proprio = proprio[0].id_proprietaire;

        let participants = await DB.query('SELECT id_compte, email, img_profil, nom, prenom FROM compte WHERE id_compte IN (SELECT id_compte FROM participant WHERE id_evenement = ?)', [req.params.id]);

        participants.forEach(element => {
            if (element['id_compte'] == proprio) element['proprietaire'] = true;
            else element['proprietaire'] = false;

            if (element['id_compte'] == res.locals.user.id_compte) element['vous'] = true;
            else element['vous'] = false;

            delete element['id_compte'];
        });

        res.status(200).json(participants);

    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal Server Error
    }
}

module.exports.getMesEvenements = async (req, res) => {
    try {
        events = await DB.query('SELECT *, count(p.id_compte) as nb_participants FROM evenement JOIN participant p on evenement.id_evenement = p.id_evenement WHERE id_proprietaire = ?' +
            ' GROUP BY evenement.id_evenement', [res.locals.user.id_compte]);

        return res.status(200).json(events);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.getMesParticipations = async (req, res) => {
    try {
        events = await DB.query('SELECT *, count(p.id_compte) as nb_participants FROM evenement evt JOIN participant p on evt.id_evenement = p.id_evenement ' +
            'WHERE evt.id_evenement IN (SELECT id_evenement FROM participant WHERE id_compte = ?) AND id_proprietaire != ? GROUP BY evt.id_evenement', [res.locals.user.id_compte, res.locals.user.id_compte]);

        return res.status(200).json(events);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.saveEvent = async (req, res) => {
    try {
        // --- CHECK

        let event = await DB.query('SELECT id_proprietaire, img_banniere FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!event.length) return res.sendStatus(404); // Not found

        if (event[0].id_proprietaire !== res.locals.user.id_compte) return res.sendStatus(403); // Forbidden

        // --- REQUEST

        data = {
            titre: req.body.titre,
            description: req.body.description,
            departement: req.body.departement,
            debut: req.body.debut,
            fin: req.body.fin,
        }

        if (req.file) data['img_banniere'] = '/api/upload/' + req.file.filename;
        if (req.body.supprImg) {
            if (event[0].img_banniere) upload.removeImage(event[0].img_banniere);
            data['img_banniere'] = null;
        }

        await DB.query('UPDATE evenement SET ? WHERE id_evenement = ?', [data, req.params.id]);

        await this.getEvenement(req, res);

    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal Server Error
    }
}

module.exports.proposeToSaveEvent = async (req, res) => {
    try {
        // --- CHECK
        let checkPrivileges = await DB.query('SELECT id_compte FROM participant WHERE id_evenement = ? AND id_compte = ?', [req.params.id, res.locals.user.id_compte]);
        if (!checkPrivileges.length) return res.sendStatus(403); // Forbidden

        // --- REQUEST

        //
        data = {
            titre: req.body.titre,
            description: req.body.description,
            departement: req.body.departement,
            debut: req.body.debut,
            fin: req.body.fin,
        }

        let oldEvent = await DB.query('SELECT * FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (req.file) data['img_banniere'] = '/api/upload/' + req.file.filename;
        else data['img_banniere'] = oldEvent.img_banniere;
        if (req.body.supprImg) {
            data['img_banniere'] = null;
        }

        // TODO : Link to notification controller (waiting)
        let resNotif = await notif.CreerNotifModifEvent(oldEvent[0], data, res.locals.user);
        if (resNotif === -1) return res.sendStatus(500);

        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal Server Error
    }
}

module.exports.publishEvent = async (req, res) => {
    try {
        // --- CHECK

        let checkPrivileges = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!checkPrivileges.length) return res.sendStatus(404); // Not found

        if (checkPrivileges[0].id_proprietaire !== res.locals.user.id_compte) return res.sendStatus(403); // Forbidden

        // --- REQUEST

        await DB.query('UPDATE evenement SET etat = 1 WHERE id_evenement = ?', [req.params.id]);

        let newEvent = await DB.query('SELECT * FROM evenement WHERE id_evenement = ?', [req.params.id]);

        //res.status(200).json(modelToJSON(newEvent[0]));
        await this.getEvenement(req, res);

    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal Server Error
    }
}

module.exports.createEvent = async (req, res) => {
    try {
        let insert = await DB.query('INSERT INTO evenement (titre, debut, fin, id_proprietaire, img_banniere) VALUES (?, ?, ?, ?, ?)', ["Nouvel événement", new Date(), new Date(), res.locals.user.id_compte, '']);
        await DB.query('INSERT INTO participant VALUES(?, ?)', [res.locals.user.id_compte, insert.insertId])
        res.status(200).json(insert.insertId);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.archiveEvent = async (req, res) => {
    try {
        let event = await DB.query('SELECT id_proprietaire, etat FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!event.length) return res.sendStatus(404); // 	Not Found
        event = event[0];

        if (event.id_proprietaire !== res.locals.user.id_compte) return res.sendStatus(403); // Forbidden

        if (event.etat !== 1) return res.sendStatus(403); // Forbidden

        await DB.query('UPDATE evenement SET etat = 2 WHERE id_evenement = ?', [req.params.id]);

        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports.supprEvenement = async (req, res) => {
    try {
        let event = await DB.query('SELECT id_proprietaire, etat FROM evenement WHERE id_evenement = ?', [req.params.id]);

        if (!event.length) return res.sendStatus(404); // 	Not Found
        event = event[0];

        if (event.id_proprietaire !== res.locals.user.id_compte) return res.sendStatus(403); // Forbidden

        if (event.etat === 1) return res.sendStatus(403); // Forbidden

        await DB.query('DELETE FROM participant WHERE id_evenement = ?', [req.params.id]);
        await DB.query('DELETE FROM besoin WHERE id_evenement = ?', [req.params.id]);
        await DB.query('DELETE FROM evenement WHERE id_evenement = ?', [req.params.id]);

        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

//le participant veut se retirer d'un évenment

module.exports.seRetirer = async (req, res) => {
    try {
        await DB.query('DELETE FROM participant WHERE id_evenement=? AND id_compte=?', [req.params.id, res.locals.user.id_compte]);

        res.sendStatus(200);
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

//le participant demande à rejoindre un evenement

module.exports.demanderRejoindreEve = async (req, res) => {
    try {
        let participe = await DB.query('SELECT id_compte FROM participant WHERE id_compte = ? AND id_evenement = ?', [res.locals.user.id_compte, req.params.id])
        if(participe.length) return res.sendStatus(403); // Forbidden

        let invit = await DB.query('SELECT id_m_invitation FROM modele_invitation WHERE id_participant = ? AND id_evenement = ?', [res.locals.user.id_compte, req.params.id]);
        if(invit.length) {
            // check if already invited
            invit = invit[0];
            let type = await DB.query('SELECT * FROM notification WHERE id_type = ? AND type = 2', [invit.id_m_invitation]);
            if(type.length) return res.sendStatus(400); // already asked
    
            // already invited by owner
            let notification = await DB.query('SELECT * FROM notification WHERE id_type = ? AND type = 1', [invit.id_m_invitation]);
            req.notification = notification[0];
            await notif.AccepterInvitation(req, res);
            return;
        }

        let n = await notif.CreerNotifRejoindre(req.params.id, res.locals.user);
        if(n === -1) return res.sendStatus(500);

        res.sendStatus(200);
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

//le proprietaire d'un evenement ajoute un participant
module.exports.ajouterParticipant = async (req, res) => {
    try {
        var result = await DB.query('INSERT INTO participant (id_compte,id_evenement) VALUES (?,?)', [req.body.id_compte, req.params.id])
        notif.CreerNotifMess(req.body.id_compte, req.body.message, res)

        if (result == undefined || result.affectedRows == 0) res.sendStatus(404)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
    res.sendStatus(200)
}



module.exports.getProprioEve = async (id) => {
    var proprio = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement=?', [id])

    return proprio[0].id_proprietaire
}

module.exports.getProprioBesoin = async (id) => {
    var proprio = await DB.query('SELECT id_proprietaire FROM evenement e, besoin b WHERE e.id_evenement = b.id_evenement AND id_besoin = ?', [id])

    return proprio[0].id_proprietaire
}

module.exports.rechercheUtilisateurAInviter = async(req, res) => {
    try {
        let checkPrivileges = await DB.query('SELECT id_proprietaire FROM evenement WHERE id_evenement = ?', [req.params.id]);
        if (!checkPrivileges.length) return res.sendStatus(404); // Not found
        if (checkPrivileges[0].id_proprietaire != res.locals.user.id_compte) return res.sendStatus(403); // Forbidden

        let ville = ""
        if(req.query.ville) ville = "AND ville LIKE " + DB.connection.escape("%" + req.query.ville + "%")

        let users = await DB.query(`SELECT id_compte, email, nom, prenom, img_profil FROM compte WHERE Concat(prenom, " ", nom, " ", email) LIKE ? ${ville} 
            AND id_compte NOT IN (SELECT id_compte FROM participant WHERE id_evenement = ?)`, ["%" + req.query.search + "%", req.params.id]);

        let invitedUsers = await DB.query(`SELECT id_participant FROM modele_invitation WHERE id_evenement = ?`, [req.params.id]);

        users.forEach((elem) => {
            if(invitedUsers.find(function(element){return element.id_participant == elem.id_compte})) elem['invite'] = true;
            else elem['invite'] = false;
            delete elem['id_compte'];
        })

        res.status(200).json(users);

    } catch (err) {
        console.log(err)
        res.sendStatus(500) // Internal Error
    }
}


module.exports.postInviterParticipant = async (req, res) => {
    try {
        // --- CHECK verifie proprio fait parti evenement + est bien proprietaire evnement
        let checkPrivileges = await DB.query('SELECT id_compte FROM participant WHERE id_evenement = ? AND id_compte = ?', [req.params.id, res.locals.user.id_compte]);
        if (!checkPrivileges.length) return res.sendStatus(404); // Not found

        // verifie l'utilisateur a ajouter
        let user = await DB.query('SELECT id_compte FROM compte WHERE email = ?', [req.params.email]);
        if(!user.length) return res.sendStatus(404); // Not Found
        user = user[0];

        //verifie que utilisateur n est pas participant de evenement
        let checkUtil = await DB.query('SELECT id_compte FROM participant WHERE id_evenement = ? AND id_compte = ?', [req.params.id, user.id_compte]);
        if (checkUtil.length) return res.sendStatus(403); // Forbidden

        //verifie que utilisateur n'est pas déjà invité
        let checkInvit = await DB.query('SELECT id_participant FROM modele_invitation WHERE id_evenement = ? AND id_participant = ?', [req.params.id, user.id_compte]);
        if (checkInvit.length) return res.sendStatus(400);

        let proprio = await DB.query('SELECT id_proprietaire, nom, prenom, titre, evenement.departement FROM evenement INNER JOIN compte ON evenement.id_proprietaire=compte.id_compte WHERE id_evenement = ?', [req.params.id]);
        if (!proprio.length || proprio[0].id_proprietaire != res.locals.user.id_compte) return res.sendStatus(404); // Not found
        proprio = proprio[0]

        // --- REQUEST
        // envoie une notification au participant potentiel
        let msg = proprio.prenom + " " + proprio.nom + " vous invite à l'événement \""
            + proprio.titre + "\" (" + proprio.departement + ")"

        await notif.CreerNotifInvitation(user.id_compte, req.params.id, msg, res)

    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal Server Error
    }
}