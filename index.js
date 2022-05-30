const express = require('express');
const app = express();
const dotenv = require('dotenv'); // menyimpan value kedalam environment variabel.
const { userController } = require('./controllers');
dotenv.config(); //untuk aktifkan dotenv nya

const PORT = process.env.PORT; // tadi simpan portnya dalam PORT jadi panggil pakai .PORT

app.use(express.json()); // untuk membaca data req.body di express.js

// DB check connection
const {dbConf} = require('./config/database');
dbConf.getConnection((error,connection)=>{
    if(error){
        console.log("Error MySQL Connection", error.message, error.sqlMessage);
    }
    console.log(`Connected to MySQL Server ✅: ${connection.threadId}`)
})

app.get('/',(req,res)=>{
    res.status(200).send("<h1>JCAHLS Ecommerce API</h1>")
})

const {userRouter, bannerRouter} = require('./routers');
app.use('/users', userRouter);
app.use('/banner', bannerRouter);

app.listen(PORT,()=>console.log(`Running API at PORT ${PORT}`));