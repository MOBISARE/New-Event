function getCompteConnexion(id) {//Recupere les donnees de l'utilisateur
    var res = []
    DB.query('SELECT * FROM `compte`', function (error, results, fields) {
        if (error) throw error
        res = results[0]
    })
    console.log(res)
    return res
}

module.exports.getCompteConnexion = getCompteConnexion;