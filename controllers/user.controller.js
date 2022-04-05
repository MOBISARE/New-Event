const crypto = require("./cryptographie");
const jwt = require("jsonwebtoken");
const DB = require("./db").DB

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

module.exports.getMonCompte = async(req, res) => {
    let compte;
    try {
        // recupere les informations du compte
        compte = await DB.query('SELECT * FROM compte WHERE id_compte = ?', [res.locals.user.id_compte])
        if (!compte.length) return res.sendStatus(404); // Not Found
        compte = compte[0];

        delete compte.id_compte;
        delete compte.mot_de_passe;
        res.status(200).json(compte);
    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal error
    }
}

module.exports.getCompte = async(req, res) => {
    let compte;
    try {
        // recupere les informations du compte
        compte = await DB.query('SELECT * FROM compte WHERE email = ?', [req.params.email])
        if (!compte.length) return res.sendStatus(404); // Not Found
        compte = compte[0];

        delete compte.id_compte;
        delete compte.mot_de_passe;
        res.status(200).json(compte);
    } catch (err) {
        console.log(err);
        res.sendStatus(500); // Internal error
    }
}

//modifier le compte
module.exports.putCompteModification = async(req, res) => {
    let result = 0
    try {
        let data = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            naissance: req.body.naissance,
            ville: req.body.ville,
            departement: req.body.departement,
            no_telephone: ((req.body.no_telephone == "") ? null : req.body.no_telephone),
            img_profil: ((req.file) ? 'http://localhost:5000/api/upload/' + req.file.filename : null),
        };

        result = await DB.query('UPDATE compte SET ? WHERE id_compte = ?', [data, res.locals.user.id_compte])

    } catch (err) {
        console.log(err)
        res.sendStatus(500) // erreur lors de l execution de la requete (500)
    }
    res.sendStatus(200)
}

module.exports.putMDPModification = async(req, res) => {
    try {
        let user = await DB.query('SELECT mot_de_passe FROM compte WHERE id_compte = ?', [res.locals.user.id_compte]);

        if (!user.length) return res.sendStatus(400); // Bad Request
        user = user[0];

        if(await crypto.verifierMotDePasse(req.body.old_password, user.mot_de_passe)){
            /*
            const token = createToken(user.id_compte);
            res.cookie('jwt', token, { httpOnly: true, maxAge });
             */
            res.cookie('jwt', '', { maxAge: 1 });

            await DB.query('UPDATE compte SET mot_de_passe = ? WHERE id_compte = ?',
                [await crypto.hasherMotDePasse(req.body.new_password), res.locals.user.id_compte])

            return res.sendStatus(200);
        }

        res.sendStatus(400)
    } catch (err) {
        console.log(err)
        res.sendStatus(500) // erreur lors de l execution de la requete (500)
    }
}

//supprimer le compte
module.exports.supprCompte = async(req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 1 });
        await DB.query('UPDATE compte SET etat=1 WHERE id_compte=?', [res.locals.user.id_compte])
    } catch (err) {
        console.log(err)
        res.sendStatus(500) //erreur lors de l execution de la requete (500)
    }
    res.sendStatus(200)
}