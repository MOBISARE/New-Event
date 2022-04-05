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
    try{
        // Check email
        let result = await DB.query('SELECT count(*) AS nb FROM compte WHERE email = ?', req.body.email);
        if (result[0].nb != 0) return res.status(400).send("Email already exists");
        
        // Create data
        let mdp = await crypto.hasherMotDePasse(req.body.mot_de_passe);

        let data = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            mot_de_passe: mdp,
            naissance: req.body.naissance,
            ville: req.body.ville,
            departement: req.body.departement,
            no_telephone: ((req.body.no_telephone == "") ? null : req.body.no_telephone),
            img_profil: ((req.file) ? 'http://localhost:5000/api/upload/' + req.file.filename : null),
            role: "ROLE_USER"
        };

        // Insert data to database
        result = await DB.query('INSERT INTO compte SET ?', data);
        res.sendStatus(200);
    }
    catch (err){
        console.log(err);
        res.sendStatus(500) // Internal Error
    }
    
}

module.exports.login = async(req, res) => {
    try {
        let user = await DB.query('SELECT id_compte, mot_de_passe FROM compte WHERE email = ? AND etat=0', [req.body.email]);

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