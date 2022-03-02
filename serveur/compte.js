function getCompteConnexion(id) {//Recupere les donnees de l'utilisateur
    var res = []
    DB.query('SELECT * FROM `compte`', function (error, results, fields) {
        if (error) throw error
        res = results[0]
    })
    console.log(res)
    return res
}

//modifie le compte
async function putCompteModification(body, id) {
    let result = 0
    try {
        result = await DB.query('UPDATE compte SET ? WHERE id_compte = ?', [{
            email: body.email, mot_de_passe:body.mot_de_passe, prenom:body.prenom, nom:body.nom, naissance:body.naissance, ville:body.ville, departement:body.departement,
            no_telephone:body.no_telephone, role:body.role, etat:body.etat, img_profil:body.img_profil, notif_email:body.notif_email
        }, id])
    } catch (err) {
        console.log(err)
        return -1           // erreur lors de l execution de la requete (500)
    }
    return result.changedRows
}

module.exports.getCompteConnexion = getCompteConnexion;
module.exports.putCompteModification = putCompteModification