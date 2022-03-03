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
async function startRecuperation(id) {
    let token = 0;
    let email;
    try {
        let tokenStr = generate_token(20);

        token = DB.query('INSERT INTO recuperation(token_id, id_compte) VALUES (?, ?)', [tokenStr, id]);

        email = await DB.query('SELECT email FROM compte WHERE id_compte = ?', [id]);
        email = email[0];
        sendEmail(email.email, "recup mdp", "lien et tout tmtc");

    } catch (err) {
        console.log(err);
        return -1;
    }
    return token.changedRows;
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