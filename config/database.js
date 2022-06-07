const mysql = require('mysql');
const util = require('util'); //libary next js untuk manage api, ubah asyn function yg tdk punya promise mjd ada promise nya
//promise ada then catch yg menjalankan asyn function seperti axios
//dbconf ga punya promise then catch makannya butuh util untuk bisa async await dan try catch

const dbConf = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

const dbQuery = util.promisify(dbConf.query).bind(dbConf);

module.exports = {dbConf,dbQuery};

//port default bawaan platform lain: 3306 mysql, 270017 mongo, 2180 2108 proxy, 22 ssh, 443 https connection / protocol htps bisa dipake tapi perlu konfigurasi lanjutan, 8080, 60
//port2 itu jangan dipakai untuk koneksi database localhost kita 