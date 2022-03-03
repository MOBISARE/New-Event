const { DB } = require("./db")

function getCompteConnexion(id) { //Recupere les donnees de l'utilisateur
    var res = []
    DB.query('SELECT * FROM `compte`', function(error, results, fields) {
        if (error) throw error
        res = results[0]
    })
    console.log(res)
    return res
}

function inscription(nom, prenom, email, motDePasse, dateDeNaissance, ville, telephone = null, photoProfil = null) {
    DB.query('SELECT count(*) FROM `compte` WHERE email = ?', function(error, results, fields) {
        if (results >= 1) throw error
        else DB.query('INSERT INTO compte SET ?', {
            nom: nom,
            prenom: prenom,
            email: email,
            mot_de_passe: motDePasse,
            naissance: dateDeNaissance,
            ville: ville,
            no_telephone: telephone,
            img_profile: photoProfil
        })
    })
}

module.exports.inscription = inscription;
module.exports.getCompteConnexion = getCompteConnexion;