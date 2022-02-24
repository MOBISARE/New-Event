const DB = require("./db").DB
var async = require('async')

function getEvenementModification(req, res) {
    var count;
    // Paul Gsell (Pour demander)
    // Async en série
    async.series( [
        // On met des fonctions à lancer
        function ( callback ) {
            DB.query('SELECT count(*) as C FROM `besoin`', function(err, rows, fields) {
                count = rows[0].C;
                callback();
            });
        }
    // Envoi de la réponse
    ], function ( error, results ) {
        res.json({
            'count' : count
        });
    } );
}

function getEvenementCreation(id) {
    return {
        "bleg": id
    }
}

module.exports.getEvenementModification = getEvenementModification