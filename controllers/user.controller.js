const DB = require("./db").DB


module.exports.getCompte = async(req, res) => {
    let compte;
    try {
        // recupere les informations du compte
        compte = await DB.query('SELECT * FROM compte WHERE id_compte = ?', [req.params.id])
        compte = compte[0]
    } catch (err) {
        console.log(err)
        res.sendStatus(200) // erreur lors de l execution de la requete (500)
    }

    if (compte == undefined) res.sendStatus(404) // evenement inconnu (404)
    else res.json({
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
    })
}

module.exports.rechercheUtilisateur = async(req, res) => {
    try {
        let users = await DB.query('SELECT email, nom, prenom FROM compte WHERE nom LIKE ?', ["%" + req.params.search + "%"]);

        res.status(200).json(users);

    } catch (err) {
        console.log(err)
        res.sendStatus(500) // Internal Error
    }
}

//modifier le compte
module.exports.putCompteModification = async(req, res) => {
    let result = 0
    try {
        result = await DB.query('UPDATE compte SET ? WHERE id_compte = ?', [req.body, req.params.id])
        console.log(result)

    } catch (err) {
        console.log(err)
        res.sendStatus(500) // erreur lors de l execution de la requete (500)
    }
    res.sendStatus(200)
}

//supprimer le compte
module.exports.supprCompte = async(req, res) => {
    let result = 0
    try {
        result = DB.query('UPDATE compte SET etat=1 WHERE id_compte=?', [req.params.id])
    } catch (err) {
        console.log(err)
        res.sendStatus(500) //erreur lors de l execution de la requete (500)
    }
    res.sendStatus(200)
}