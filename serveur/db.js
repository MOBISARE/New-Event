const mysql = require('mysql');
const fs = require('fs');

//donnees de connexion
let rawdata = fs.readFileSync('bdd.json');
let data = JSON.parse(rawdata);

let connection = mysql.createConnection({
    host: data.host,
    user: data.user,
    password: data.password
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
})

module.exports.connexion = connection