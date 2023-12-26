const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'test',
    password:'1234',
    port:3306,
    database:'cooperation'
});

function getAllBoard(callback) {
    connection.query(`SELECT * FROM board`, (err, rows, fields) => {
        if(err) throw err;
        callback(rows);
    });
}

module.exports = {
    getAllBoard
}