const { DB } = require("./db")
const crypto = require("./cryptographie")

function getCompteConnexion(id) { //Recupere les donnees de l'utilisateur
    var res = []
    DB.query('SELECT * FROM `compte`', function (error, results, fields) {
        if (error) throw error
        res = results[0]
    })
    console.log(res)
    return res
}

async function postInscription(nom, prenom, email, motDePasse, dateDeNaissance, ville, departement, telephone = null, photoProfil = null) {

    let result = await DB.query('SELECT count(*) AS nb FROM compte WHERE email = ?', email)
    if (result[0].nb != 0) return -1
    else {
        try {
            let mdp = await crypto.hasherMotDePasse(motDePasse)
            result = await DB.query('INSERT INTO compte SET ?', {
                nom: nom,
                prenom: prenom,
                email: email,
                mot_de_passe: mdp,
                naissance: dateDeNaissance,
                ville: ville,
                departement: departement,
                no_telephone: telephone,
                img_profil: photoProfil,
                role: "ROLE_USER"
            })
        } catch (err) {
            console.log(err)
            return -2
        }

        return result.changedRows
    }
}


module.exports.postInscription = postInscription;
module.exports.getCompteConnexion = getCompteConnexion;