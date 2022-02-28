const mysql = require('mysql');
const fs = require('fs');

//donnees de connexion
let rawdata = fs.readFileSync('bdd.json');
let data = JSON.parse(rawdata);

// source : https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
// https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628
class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: data.host,
            user: data.user,
            password: data.password,
            database: 'new_event'
        });

        this.connection.connect(function (err) {
            if (err) {
                console.error('erreur connexion: ' + err.stack);
                return;
            }
        })
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

/*let connection = mysql.createConnection({
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
})*/
const DB = new Database()
module.exports.DB = DB