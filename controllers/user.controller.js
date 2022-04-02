const DB = require("./db").DB


module.exports.getMonCompte = async(req, res) => {
    let compte;
    try {
        // recupere les informations du compte
        compte = await DB.query('SELECT * FROM compte WHERE id_compte = ?', [res.locals.user.id_compte])
        if (!compte.length) return res.sendStatus(404); // Not Found
        compte = compte[0];

        res.status(200).json(compte);
    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal error
    }
}

module.exports.rechercheUtilisateur = async(req, res) => {
    try {
        let users = await DB.query('SELECT email, nom, prenom, img_profil FROM compte WHERE Concat(prenom, " ", nom, " ", email) LIKE ?', ["%" + req.params.search + "%"]);

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