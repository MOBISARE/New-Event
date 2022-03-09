const sendEmail = require("./sendEmail");

const DB = require("./db").DB

/**
 * 
 * @param {*} id Id du compte
 * 
 * Crée un token
 * Rentre le token dans la bd
 * Envoie un mail
 */
async function putStartRecuperation(id, lien) {
    let token = 0;
    let email;
    try {
        //token de la 
        let tokenStr = generate_token(20);

        token = await DB.query('INSERT INTO recuperation(token_id, id_compte) VALUES (?, ?)', [tokenStr, id]);

        email = await DB.query('SELECT email FROM compte WHERE id_compte = ?', [id]);
        email = email[0];
        sendEmail(email.email, "recup mdp", "lien et tout tmtc: " + lien); //A completer avec la forme voulue

    } catch (err) {
        console.log(err);
        return -1;
    }
    return token.changedRows;
}

async function getStartRecuperation(id) {
    let token = 0;

    try {
        token = await DB.query('SELECT * FROM recuperation WHERE id_compte = ?', [id])

        token = token[token.length - 1]
        console.log(token)
    } catch (err) {
        console.log(err)
        return -1
    }

    if (token == undefined) return -2
    else return {
        id_recuperation: token.id_recuperation,
        token_date: token.token_date,
        token_id: token.token_id,
        id_compte: token.id_compte
    }
}

async function putResetMdp(id, token, newMdp) {
    let compteUpdated;

    try {
        verifToken = await DB.query('SELECT token_id FROM recuperation WHERE id_compte = ?', [id])
        console.log(verifToken)

        let tokenIsCorrect = false;
        verifToken.forEach(element => {
            if (element.token_id == token) {
                tokenIsCorrect = true;
            }
        });

        if (!tokenIsCorrect || token == undefined) {
            return -1
        }

        compteUpdated = await DB.query('UPDATE compte SET mot_de_passe = ? WHERE id_compte = ?', [newMdp, id])
        console.log(compteUpdated)

        if (compteUpdated == undefined) {
            return -2
        }

    } catch (err) {
        console.log(err)
        return -1
    }

    return compteUpdated.changedRows;
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

module.exports.getStartRecuperation = getStartRecuperation
module.exports.putStartRecuperation = putStartRecuperation
module.exports.putResetMdp = putResetMdp