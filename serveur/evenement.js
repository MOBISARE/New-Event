const DB = require("./db").DB

function getEvenementModification(id) {
    //recupere les donnees de l evenement
    var res = { 'data': [] }
    DB.query('SELECT count(*) as C FROM besoin', function (error, results, fields, res) {
        if (error) throw error
        console.log(results[0].C)
        res.data = results[0].C
    })
    console.log(res)
    return res
}

function getEvenementCreation(id) {
    return {
        "bleg": id
    }
}

module.exports.getEvenementModification = getEvenementModification