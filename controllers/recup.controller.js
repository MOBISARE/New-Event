const sendEmail = require("./sendEmail");
const crypto = require("./cryptographie");

const DB = require("./db").DB;

/**
 * 
 * @param {*} id Id du compte
 * 
 * Crée un token
 * Rentre le token dans la bd
 * Envoie un mail
 */
module.exports.postStartRecuperation = async(req, res) => {
    try {
        //token de la 
        let tokenStr = generate_token(20);

        //token = await DB.query('INSERT INTO recuperation(token_id, id_compte) VALUES (?, ?)', [tokenStr, id]);
        token = await DB.query('INSERT INTO recuperation(token_id, id_compte) VALUES (?, (SELECT id_compte FROM compte WHERE email = ?))', [tokenStr, req.body.email]);

        if (token.affectedRows == 0) {
            res.sendStatus(404)
        }

        if (await sendEmail(req.body.email, "recup mdp", "lien et tout tmtc: " + tokenStr) != 0) res.sendStatus(500)

        res.sendStatus(200)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

module.exports.getStartRecuperation = async(req, res) => {

    try {
        token = await DB.query('SELECT * FROM recuperation WHERE id_compte = ?', [req.body.id_compte])

        token = token[token.length - 1]

        if (token == undefined) res.sendStatus(404)

        else res.status(200).json({
            id_recuperation: token.id_recuperation,
            token_date: token.token_date,
            token_id: token.token_id,
            id_compte: token.id_compte
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

module.exports.checkRecuperation = async(req, res) => {
    try {
        token = await DB.query('SELECT * FROM recuperation WHERE id_compte = (SELECT id_compte FROM compte WHERE email = ?) AND token_id = ?', [req.body.email, req.body.token])
        if (!token.length) return res.sendStatus(404); // Not Found

        res.sendStatus(200);
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

module.exports.putResetMdp = async(req, res) => {

    try {
        verifToken = await DB.query('SELECT id_compte FROM recuperation WHERE id_compte = (SELECT id_compte FROM compte WHERE email = ?) AND token_id = ?', [req.body.email, req.body.token])

        if (verifToken == undefined || verifToken.length == 0) {
            res.sendStatus(404)
        }

        compteUpdated = await DB.query('UPDATE compte SET mot_de_passe = ? WHERE id_compte = ?', [await crypto.hasherMotDePasse(req.body.mot_de_passe), verifToken[0].id_compte])

        if (compteUpdated == undefined || compteUpdated.affectedRows == 0) {
            res.sendStatus(500)
        }

        supprTokens = await DB.query('DELETE FROM recuperation WHERE id_compte = ?', [verifToken[0].id_compte])

        if (supprTokens == undefined || supprTokens.affectedRows == 0) {
            res.sendStatus(500)
        }

        res.sendStatus(200)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}


function generate_token(length) {
    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}