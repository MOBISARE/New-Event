const DB = require("./db").DB
var async = require('async')

function getEvenementModification(id, res) {
    var evenement;
    var participants = [];
    // Paul Gsell (Pour demander)
    // Async en série
    async.series([
        // On met des fonctions à lancer
        function (callback) {
            DB.query('SELECT evenement.id_evenement, titre, description, departement, debut, fin, archivage, etat, img_banniere, id_proprietaire '
                + 'FROM evenement '
                + 'WHERE id_evenement = ?', [id], function (err, rows, fields) {
                    if (err) console.log(err.message)
                    //teste si l evenement existe dans la BDD
                    if (rows[0] == undefined) res.sendStatus(404)
                    evenement = rows[0];
                    callback();
                });
        },
        function (callback) {
            DB.query('SELECT id_compte '
                + 'FROM participant '
                + 'WHERE id_evenement = ?', [id], function (err, rows, fields) {
                    if (err) console.log(err)
                    rows.forEach(e => {
                        participants.push(e.id_compte)
                    });
                    callback();
                });
        }
        // Envoi de la réponse
    ], function (error, results) {
        res.json({
            id: evenement.id_evenement,
            titre: evenement.titre,
            description: evenement.description,
            departement: evenement.departement,
            debut: evenement.debut,
            fin: evenement.fin,
            archivage: evenement.archivage,
            etat: evenement.etat,
            img_banniere: evenement.img_banniere,
            id_proprietaire: evenement.id_proprietaire,
            id_participants: participants
            //id_besoins: besoins
        });
    });
}

function putEvenementModification(body, id, res) {
    async.series([
        // On met des fonctions à lancer
        function (callback) {
            DB.query('UPDATE evenement SET ? WHERE id_evenement = ?', [{
                titre: body.titre, description: body.description, departement: body.departement,
                debut: body.debut, fin: body.fin, archivage: body.archivage, etat: body.etat, img_banniere: body.img_banniere
            }, id],
                function (err, rows, fields) {
                    if (err) console.log(err)
                    callback();
                });
        }
        // Envoi de la réponse
    ], function (error, results) {
        res.redirect('/api/evenement/modifier/' + id)
    });
}

function getEvenementCreation(id) {
    return {
        "bleg": id
    }
}

module.exports.getEvenementModification = getEvenementModification
module.exports.putEvenementModification = putEvenementModification
module.exports.getEvenementCreation = getEvenementCreation