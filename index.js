const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv'); // menyimpan value kedalam environment variabel.
dotenv.config(); //untuk aktifkan dotenv nya

const PORT = process.env.PORT; // tadi simpan portnya dalam PORT jadi panggil pakai .PORT

app.use(express.json()); // untuk membaca data req.body di express.js

app.use(cors());

// DB check connection
const { dbConf } = require('./config/database');
dbConf.getConnection((error, connection) => {
    if (error) {
        console.log("Error MySQL Connection", error.message, error.sqlMessage);
    }
    console.log(`Connected to MySQL Server ✅: ${connection.threadId}`)
})

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