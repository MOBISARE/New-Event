const { NULL } = require("mysql/lib/protocol/constants/types")
const { DB } = require("./db")
const crypto = require("./cryptographie")

function getCompteConnexion(id) { //Recupere les donnees de l'utilisateur
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
        }
        else {
            res = NULL;
            return res;
        }
    }
    catch (err) {
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
        return -1           // erreur lors de l execution de la requete (500)
    }

    if (compte == undefined) return -2       // evenement inconnu (404)
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
    try {
        result = DB.query('UPDATE compte SET ? WHERE id_compte = ?', [{
            email: body.email, mot_de_passe: body.mot_de_passe, prenom: body.prenom, nom: body.nom, naissance: body.naissance, ville: body.ville, departement: body.departement,
            no_telephone: body.no_telephone, role: body.role, etat: body.etat, img_profil: body.img_profil, notif_email: body.notif_email
        }, id])
    } catch (err) {
        console.log(err)
        return -1           // erreur lors de l execution de la requete (500)
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
module.exports.getCompte = getCompte
module.exports.putCompteModification = putCompteModification
module.exports.supprCompte = supprCompte
