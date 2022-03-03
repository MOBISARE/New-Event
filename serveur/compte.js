const { DB } = require("./db")

function getCompteConnexion(id) {//Recupere les donnees de l'utilisateur
    var res = []
    DB.query('SELECT * FROM `compte`', function (error, results, fields) {
        if (error) throw error
        res = results[0]
    })
    console.log(res)
    return res
}

async function getCompte(id) {
    let compte;
    try {
        // recupere les informations du compte
        compte = DB.query('SELECT * FROM compte WHERE id_compte = ?', [id])
    } catch (err) {
        console.log(err)
        return -1           // erreur lors de l execution de la requete (500)
    }

    if (compte == undefined) return -2       // evenement inconnu (404)
    else return {
        id_compte: compte.id_compte,
        email: compte.email,
        mot_de_passe:compte.mot_de_passe, 
        prenom:compte.prenom, 
        nom:compte.nom, 
        naissance:compte.naissance, 
        ville:compte.ville, 
        departement:compte.departement,
        no_telephone:compte.no_telephone, 
        role:compte.role, 
        etat:compte.etat, 
        img_profil:compte.img_profil, 
        notif_email:compte.notif_email
    }
}

//modifier le compte
async function putCompteModification(body, id) {
    let result = 0
    try {
        result = DB.query('UPDATE compte SET ? WHERE id_compte = ?', [{
            email: body.email, mot_de_passe:body.mot_de_passe, prenom:body.prenom, nom:body.nom, naissance:body.naissance, ville:body.ville, departement:body.departement,
            no_telephone:body.no_telephone, role:body.role, etat:body.etat, img_profil:body.img_profil, notif_email:body.notif_email
        }, id])
    } catch (err) {
        console.log(err)
        return -1           // erreur lors de l execution de la requete (500)
    }
    return result.changedRows
}

//supprimer le compte
async function supprCompte(id){
    let result=0    
    try{
        result= DB.query('UPDATE compte SET etat=1 WHERE id_compte=?',[id])
    }catch(err){
        console.log(err)
        return -1 //erreur lors de l execution de la requete (500)
    }
}

module.exports.getCompteConnexion = getCompteConnexion
module.exports.getCompte=getCompte
module.exports.putCompteModification = putCompteModification
module.exports.supprCompte=supprCompte