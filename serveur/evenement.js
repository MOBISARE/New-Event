const DB = require("./db").DB

function getEvenementModification(id) {
    //recupere les donnees de l evenement
    var vara = []
    DB.query('SELECT count(*) as C FROM `besoin`', function (error, results, fields) {
        if (error) throw error
        vara = results[0].C
    })
    console.log(vara)
    return vara
}

function getEvenementCreation(id) {
    return {
        "bleg": id
    }
}

module.exports.getEvenementModification = getEvenementModification