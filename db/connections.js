const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '678999',
        database: 'cms',
    }
);

module.exports = db;