let mysql = require('mysql');
let connection = mysql.createConnection({
    host: '',
    user: '',
    password: ''
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
})