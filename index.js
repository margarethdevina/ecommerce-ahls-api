const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv'); // menyimpan value kedalam environment variabel.
const mongoose = require('mongoose'); //insert library mongoose
const { mongoAccessURL } = require('./config/mongo');//panggil mongoAccessURL nya
dotenv.config(); //untuk aktifkan dotenv nya

const PORT = process.env.PORT; // tadi simpan portnya dalam PORT jadi panggil pakai .PORT

app.use(express.json()); // untuk membaca data req.body di express.js
app.use(express.static('public')); //untuk kasi akses untuk bisa akses langsung direktori public nya
app.use(cors()); // cek rekaman untuk refresh

// DB check connection
const { dbConf } = require('./config/database');
dbConf.getConnection((error, connection) => {
    if (error) {
        console.log("Error MySQL Connection", error.message, error.sqlMessage);
    }
    console.log(`Connected to MySQL Server ✅: ${connection.threadId}`)
})

// Mongo check connection ❗❗❗❗
mongoose.connect(mongoAccessURL,()=>{
    console.log("Connect Mongo Success ✅");
})

/////////////////////////////////////////
app.get('/', (req, res) => {
    res.status(200).send("<h1>JCAHLS Ecommerce API</h1>")
})

const { userRouter, bannerRouter, productsRouter } = require('./routers');
app.use('/users', userRouter);
app.use('/banner', bannerRouter);
app.use('/products', productsRouter);

// Handling error
// Middleware untuk urus error scr global
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send(error);
})

app.listen(PORT, () => console.log(`Running API at PORT ${PORT}`));