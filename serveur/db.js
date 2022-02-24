const mysql = require('mysql');
const fs = require('fs');

//donnees de connexion
let rawdata = fs.readFileSync('bdd.json');
let data = JSON.parse(rawdata);

let connection = mysql.createConnection({
    host: data.host,
    user: data.user,
    password: data.password,
    database: 'new_event'
});

connection.connect(function (err) {
    if (err) {
        console.error('errur connexion: ' + err.stack);
        return;
    }
})

module.exports.DB = connection