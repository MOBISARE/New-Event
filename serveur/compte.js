const { NULL } = require("mysql/lib/protocol/constants/types")
const DB = require("./db").DB
const crypto = require("./cryptographie")
const fs = require("fs")


async function getCompteConnexion(email, mdp) { //Recupere les donnees de l'utilisateur

    let result
    try {
        result = await DB.query('SELECT email, mot_de_passe, id_compte FROM compte WHERE email = ?', [email])
        result = result[0]
        if ((email == result.email) && await crypto.verifierMotDePasse(mdp, result.mot_de_passe)) {
            return result
        } else {
            return -1
        }
    } catch (err) {
        console.log(err)
        return -2
    }
}

module.exports.getCompte = async(req, res) => {
    let compte;
    try {
        // recupere les informations du compte
        compte = await DB.query('SELECT * FROM compte WHERE id_compte = ?', [req.params.id])
        compte = compte[0]
    } catch (err) {
        console.log(err)
        return -1 // erreur lors de l execution de la requete (500)
    }

    if (compte == undefined) return -2 // evenement inconnu (404)
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

async function postInscription(req, res) {

    let result = await DB.query('SELECT count(*) AS nb FROM compte WHERE email = ?', req.body.email)
    if (result[0].nb != 0) res.status(400).send("email already exists")
    else {
        try {
            let mdp = await crypto.hasherMotDePasse(req.body.mot_de_passe)
            result = await DB.query('INSERT INTO compte SET ?', {
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                mot_de_passe: mdp,
                naissance: req.body.naissance,
                ville: req.body.ville,
                departement: req.body.departement,
                no_telephone: ((req.body.no_telephone == "") ? null : req.body.no_telephone),
                img_profil: ((req.body.img_profil == "") ? null : req.body.img_profil),
                role: "ROLE_USER"
            })
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
        /*console.log(req.file)
        const tempPath = req.file.path
        const targetPath = path.join(__dirname, "./images/" + req.body.img_profil);
        fs.rename(tempPath, targetPath)*/
        res.sendStatus(200)
    }
}


module.exports.postInscription = postInscription;
module.exports.getCompteConnexion = getCompteConnexion;