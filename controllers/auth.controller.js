const DB = require("./db").DB
const jwt = require('jsonwebtoken');
const crypto = require("./cryptographie")

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

module.exports.register = async(req, res) => {

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
        res.sendStatus(200)
    }
}

module.exports.login = async(req, res) => {
    try {
        let user = await await DB.query('SELECT id_compte, mot_de_passe FROM compte WHERE email = ?', [req.body.email]);

        if (!user.length) return res.sendStatus(400); // Bad Request
        user = user[0];

        if(await crypto.verifierMotDePasse(req.body.mot_de_passe, user.mot_de_passe)){
            const token = createToken(user.id_compte);
            res.cookie('jwt', token, { httpOnly: true, maxAge });
            return res.sendStatus(200);
        }
        
        return res.sendStatus(400); // Bad Request
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

module.exports.logout = async(req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.sendStatus(200);
}