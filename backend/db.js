const mysql = require('mysql2/promise');

// Create the connection pool. The pool-specific settings are the defaults
const connection = mysql.createPool({
    host: 'localhost',
    user: 'yash',
    database: 'BlogApp',
    password: "Yash@1234",
    port: 3306
});

module.exports = connection;
