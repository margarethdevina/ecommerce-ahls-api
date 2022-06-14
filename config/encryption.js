const jwt = require('jsonwebtoken'); //utk generate tokennya, utk enkripsi smua data yg dimiliki.
const Crypto = require('crypto'); //library node js utk enksripsi password yg kita miliki.

module.exports = {
    hashPassword: (pass) => {
        //yg direturn adalah output enkripsi fungsi crypto
        //.createHmac yg umum dipake jg
        //sha256 algoritmanya, yg umum dipake
        //JCAHLS-01 menjadi kuncinya
        //.update(argumen yg mau diencrypt)
        return Crypto.createHmac("sha256", "JCAHLS-01").update(pass).digest("hex");
    },
    //payload = data2 yg mau dijadikan token
    //sign(payload,key) => key berdasarkan kesepakatan tim juga klo projek sama2
    createToken: (payload, time = "24h") => {
        let token = jwt.sign(payload, "JCAHLS-01", {
            expiresIn: time
        })
        // "5m" >> expired dlm 5 menit, 12h expired dlm 12 jam

        return token;
    },

    readToken: (req, res, next) => {
        jwt.verify(req.token, "JCAHLS-01", (err, decode) => {
            if (err) {
                res.status(401).send({
                    message: "User Not Authentication ❌"
                })
            }
            req.dataUser = decode; //decode berisi hasil terjemahan dr token

            next(); //spy bs jalan ke middleware berikutnya
        })
    }
}

