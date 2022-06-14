const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS_EMAIL
    }
})

//klo ada self signed certificate in certificate chain error
//tambah properti di createTransport >> tls: {rejectUnauthorized: false}

module.exports = { transporter };