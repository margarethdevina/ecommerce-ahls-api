const mysql = require('mysql');

const dbConf = mysql.createPool({
    host: 'localhost',
    user: 'devuser',
    password: 'Password123!',
    database: 'ecommerce',
    port: 3306
})

module.exports = {
    dbConf
}