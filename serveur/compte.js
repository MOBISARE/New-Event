const { NULL } = require("mysql/lib/protocol/constants/types")
const { DB } = require("./db")
const fs = require("fs")

async function getCompteConnexion(req, id) { //Recupere les donnees de l'utilisateur
    var res = []
    let result
    try {
        //Récupérer résultat du formulaire
        console.log(req.body)


        //Comparer aux données de la base
        result = await DB.query('SELECT email, mot_de_passe FROM compte WHERE id_compte = ?', [req.body.id_compte])
        res = result[0]
        if ((req.body.email == result.email) && (req.body.mot_de_passe == result.mot_de_passe)) {
            console.log(res)
            return res
        } else {
            res = NULL;
            return res;
        }
    } catch (err) {
        console.log(err)
        return -1
    }
}

async function getCompte(id) {
    let compte;
    try {
        // recupere les informations du compte
        compte = DB.query('SELECT * FROM compte WHERE id_compte = ?', [id])
        compte = compte[0]
    } catch (err) {
        console.log(err)
        return -1 // erreur lors de l execution de la requete (500)
    }

    if (compte == undefined) return -2 // evenement inconnu (404)
    else return {
        id_compte: compte.id_compte,
        email: compte.email,
        mot_de_passe: compte.mot_de_passe,
        prenom: compte.prenom,
        nom: compte.nom,
        naissance: compte.naissance,
        ville: compte.ville,
        departement: compte.departement,
        no_telephone: compte.no_telephone,
        role: compte.role,
        etat: compte.etat,
        img_profil: compte.img_profil,
        notif_email: compte.notif_email
    }
}

//modifier le compte
async function putCompteModification(body, id) {
    let result = 0
    var stringBody = JSON.stringify(body)
    var objectValue = JSON.parse(stringBody)
    try {
        Object.keys(body).forEach(function(key) {
            result = DB.query('UPDATE compte SET ' + key + ' = ? WHERE id_compte = ?', [objectValue[key], id])
        })
    } catch (err) {
        console.log(err)
        return -1 // erreur lors de l execution de la requete (500)
    }
    return result.changedRows
}

//supprimer le compte
async function supprCompte(id) {
    let result = 0
    try {
        result = DB.query('UPDATE compte SET etat=1 WHERE id_compte=?', [id])
    } catch (err) {
        console.log(err)
        return -1 //erreur lors de l execution de la requete (500)
    }
}

module.exports.getCompteConnexion = getCompteConnexion
module.exports.getCompte = getCompte
module.exports.putCompteModification = putCompteModification
module.exports.supprCompte = supprCompte