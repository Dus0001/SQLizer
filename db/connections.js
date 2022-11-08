const mysql = requiew('mysql2');

//connect to database
const db = mysql.createConnetions(
    {
        host: 'localhost',
        user: 'root',
        password: 'Godislove2.',
        database: 'cms',
    }
);

module.exports = db;