const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv'); // menyimpan value kedalam environment variabel.
const mongoose = require('mongoose'); //insert library mongoose
const { mongoAccessURL } = require('./config/mongo');//panggil mongoAccessURL nya
const bearerToken = require('express-bearer-token');
const passport = require('passport');
const session = require('express-session'); // untuk simpan info session dr google login
dotenv.config(); //untuk aktifkan dotenv nya

// tadi simpan portnya dalam PORT jadi panggil pakai .PORT
const PORT = process.env.PORT; 

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}))

// untuk mengambil data token dari req.header
app.use(bearerToken()); 

// untuk membaca data req.body di express.js
app.use(express.json()); 

//untuk kasi akses untuk bisa akses langsung direktori public nya
app.use(express.static('public')); 

// cek rekaman untuk refresh
app.use(cors()); 

// CONFIG PASSPORT ❗❗❗
// krn di config passport tidak dilakukan export makannya perlu dirun disini
require('./config/passport'); 

app.use(passport.initialize());
app.use(passport.session());

// DB check connection
const { dbConf } = require('./config/database');
dbConf.getConnection((error, connection) => {
    if (error) {
        console.log("Error MySQL Connection", error.message, error.sqlMessage);
    }
    console.log(`Connected to MySQL Server ✅: ${connection.threadId}`)
})

// Mongo check connection ❗❗❗❗
mongoose.connect(mongoAccessURL, () => {
    console.log("Connect Mongo Success ✅");
})

/////////////////////////////////////////
app.get('/', (req, res) => {
    res.status(200).send("<h1>JCAHLS Ecommerce API</h1>")
})

const { userRouter, bannerRouter, productsRouter, authRouter } = require('./routers');
app.use('/users', userRouter);
app.use('/banner', bannerRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter);

// Handling error
// Middleware untuk urus error scr global
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send(error);
})

app.listen(PORT, () => console.log(`Running API at PORT ${PORT}`));