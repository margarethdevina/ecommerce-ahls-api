const { dbConf, dbQuery } = require("../config/database");
const { hashPassword, createToken } = require('../config/encryption');
const { transporter } = require("../config/nodemailer");

module.exports = {
    getData: async (req, res, next) => {
        try {
            let resultsUsers = await dbQuery('Select id, username, email, role FROM users;')

            let resultsCart = await dbQuery(`select p.nama, i.image, p.harga, s.type, s.qty as stockQty, c.* from cart c 
            JOIN stocks s on c.idstock = s.idstock 
            JOIN products p on s.idproducts = p.id 
            JOIN image i on p.id = i.idProduct 
            group by c.idcart;`)

            // let resJoinCartStocksProductsImage = await dbQuery('select c.idcart, c.iduser, c.idstock, c.qty, c.subTotal, s.idstock, s.idproducts, s.type, s.qty as stockQty, p.nama, p.harga, i.image from cart c JOIN stocks s on c.idstock = s.idstock JOIN products p JOIN image i on s.idproducts = p.id = i.idProduct;')

            resultsUsers.forEach((val, idx) => {
                val.cart = [];
                resultsCart.forEach((valCart, idxCart) => {
                    if (val.id == valCart.iduser) {
                        val.cart.push(valCart)
                    }
                })
            })

            return res.status(200).send(resultsUsers);

        } catch (error) {
            return next(error);
        }

        // dbConf.query('Select id, username, email, role FROM users;', (error, resultsUser) => {
        //     if (error) {
        //         console.log(error);
        //         return next(error);
        //     }

        //     dbConf.query('Select * FROM cart;', (errorCart, resultsCart) => {
        //         if (errorCart) {
        //             return next(errorCart);
        //         }

        //         resultsUser.forEach((val, idx) => {
        //             val.cart = [];
        //             resultsCart.forEach((valCart, idxCart) => {
        //                 if (val.id == valCart.iduser) {
        //                     val.cart.push(valCart)
        //                 }
        //             })
        //         })

        //         return res.status(200).send(resultsUser);

        //     })
        // })


    },
    register: async (req, res, next) => {
        try {
            // console.log("isi hashPassword", hashPassword(req.body.password));

            let insertData = await dbQuery(`INSERT INTO users 
            (username, email, password, role) 
            VALUES (${dbConf.escape(req.body.username)},${dbConf.escape(req.body.email)},${dbConf.escape(hashPassword(req.body.password))},${dbConf.escape(req.body.role)});`)

            if (insertData.insertId) {
                let resultsLogin = await dbQuery(`Select id,username,email,role,status FROM users 
                WHERE id=${insertData.insertId};`);

                //Generate token untuk dikirimkan via email ❗❗❗
                let { id, username, email, role, status } = resultsLogin[0];

                let token = createToken({ id, username, email, role, status }, "1h");

                //Mengirimkan email ❗❗❗
                //link BE ga boleh dishare secara utuh, jadi perlu dikirim ke FE dulu
                //middleware untuk ubah status dibuat sendiri saat sudah masuk ke page verified account
                await transporter.sendMail({
                    from: "Admin Commerce",
                    to: email,
                    subject: "Verification Email Account",
                    html: `<div>
                            <h3>Click Link Below</h3>
                            <a href="${process.env.FE_URL}/verification/${token}">Verified Account Here</a>
                        </div>`
                })

                return res.status(200).send({ ...resultsLogin[0], token })

            } else {
                return res.status(404).send({
                    success: false,
                    message: "User not found ⚠️"
                });
            }

            //////////////////////////

            //Cara devina
            // await dbQuery(`INSERT INTO users 
            // (username, email, password, role) 
            // VALUES 
            // ("${req.body.username}", "${req.body.email}", "${req.body.password}", "${req.body.role}");`)

            // let resultsLogin = await dbQuery(`Select id, username, email, role FROM users where email="${req.body.email}" and password="${req.body.password}";`)

            // if (resultsLogin.length == 1) {
            //     let resultsCart = await dbQuery(`select p.nama, i.image, p.harga, s.type, s.qty as stockQty, c.* from cart c 
            //     JOIN stocks s on c.idstock = s.idstock 
            //     JOIN products p on s.idproducts = p.id 
            //     JOIN image i on p.id = i.idProduct 
            //     where c.iduser = ${resultsLogin[0].id} 
            //     group by c.idcart ;`)

            //     resultsLogin[0].cart = resultsCart;

            //     return res.status(200).send(resultsLogin[0]);

            // }

        } catch (error) {
            console.log(error)
            return next(error);
        }

    },
    login: async (req, res, next) => {
        try {
            // console.log(req.body)
            let resultsLogin = await dbQuery(`Select id, username, email, role, status FROM users where email="${req.body.email}" and password="${hashPassword(req.body.password)}";`)

            if (resultsLogin.length == 1) {
                let resultsCart = await dbQuery(`select p.nama, i.image, p.harga, s.type, s.qty as stockQty, c.* from cart c 
                JOIN stocks s on c.idstock = s.idstock 
                JOIN products p on s.idproducts = p.id 
                JOIN image i on p.id = i.idProduct 
                where c.iduser = ${resultsLogin[0].id} 
                group by c.idcart ;`)

                resultsLogin[0].cart = resultsCart;

                // Destructuring data untuk dibuat tokennya
                let { id, username, email, role, status } = resultsLogin[0];

                // Mengenerate token lewat jwt ❗❗❗
                let token = createToken({ id, username, email, role, status });

                //karena login dan pasti cuma 1 data yg direturn jangan lupa tambah [0] setelah resultsLogin
                return res.status(200).send({ ...resultsLogin[0], token });
            } else {
                return res.status(404).send({
                    success: false,
                    message: "user not found"
                });
            }

        } catch (error) {
            return next(error);
        }

        // dbConf.query(`Select id, username, email, role FROM users where email="${req.body.email}" and password="${req.body.password}";`, (error, resultsUser) => {
        //     console.log(req.body)
        //     if (error) {
        //         console.log(error);
        //         return next(error);
        //     }

        //     dbConf.query('Select * FROM cart;', (errorCart, resultsCart) => {
        //         if (errorCart) {
        //             return next(errorCart);
        //         }

        //         resultsUser.forEach((val, idx) => {
        //             val.cart = [];
        //             resultsCart.forEach((valCart, idxCart) => {
        //                 if (val.id == valCart.iduser) {
        //                     val.cart.push(valCart)
        //                 }
        //             })
        //         })

        //         return res.status(200).send(resultsUser);

        //     })

        // })
    },
    edit: (req, res, next) => {

    },
    deActiveAccount: (req, res, next) => {

    },
    keeplogin: async (req, res, next) => {
        try {
            console.log("req.dataUser", req.dataUser)
            if (req.dataUser.id) {

                let resultsLogin = await dbQuery(`Select id, username, email, role, status FROM users 
                where id="${req.dataUser.id}";`)

                if (resultsLogin.length == 1) {
                    let resultsCart = await dbQuery(`select p.nama, i.image, p.harga, s.type, s.qty as stockQty, c.* from cart c 
                    JOIN stocks s on c.idstock = s.idstock 
                    JOIN products p on s.idproducts = p.id 
                    JOIN image i on p.id = i.idProduct 
                    where c.iduser = ${resultsLogin[0].id} 
                    group by c.idcart ;`)

                    resultsLogin[0].cart = resultsCart;

                    let { id, username, email, role, status } = resultsLogin[0];

                    // Mengenerate token lewat jwt ❗❗❗
                    let token = createToken({ id, username, email, role, status });

                    return res.status(200).send({ ...resultsLogin[0], token });
                }

            } else {
                return res.status(401).send({
                    success: false,
                    message: "Token expired"
                });
            }
        } catch (error) {
            return next(error);
        }
    },
    verification: async (req, res, next) => {
        try {
            if (req.dataUser) {
                let updateStatus = await dbQuery(`UPDATE users SET status = "verified" WHERE id = ${dbConf.escape(req.dataUser.id)};`)

                let resultsLogin = await dbQuery(`Select id,username,email,role,status FROM users WHERE id=${req.dataUser.id};`);

                //Generate token untuk dikirimkan via email ❗❗❗
                let { id, username, email, role, status } = resultsLogin[0];

                let token = createToken({ id, username, email, role, status });
                return res.status(200).send({ ...resultsLogin[0], token, success: true });

            } else {
                return res.status(404).send({
                    success: false,
                    message: "user not found"
                });
            }

        } catch (error) {
            return next(error);
        }
    },
    resendVerif: async (req, res, next) => {
        try {

            if (req.dataUser) {
                let resultsLogin = await dbQuery(`Select id,username,email,role,status FROM users WHERE id=${req.dataUser.id};`);

                //Generate token untuk dikirimkan via email ❗❗❗
                let { id, username, email, role, status } = resultsLogin[0];

                // WAKTU EXPIRED YANG BAIK ❗❗❗
                //link verifikasi paling lama 1 jam, minimal 10-15 menit
                //keep login paling bagus 24 jam
                let token = createToken({ id, username, email, role, status }, "1h");

                await transporter.sendMail({
                    from: "Admin Commerce",
                    to: email,
                    subject: "Re-verification Email Account",
                    html: `<div>
                        <h3>Click Link Below</h3>
                        <a href="${process.env.FE_URL}/verification/${token}">Verified Account Here</a>
                    </div>`
                })

                return res.status(200).send({ ...resultsLogin[0], token, success: true,
                message: "Reverification email sent ✅" })
            }

        } catch (error) {
            return next(error);
        }
    },
    emailReset: async (req, res, next) => {
        try {

            console.log(req.body.email);

            let resultsLogin = await dbQuery(`Select id,username,email,role,status FROM users WHERE email=${dbConf.escape(req.body.email)};`);

            let { id, username, email, role, status } = resultsLogin[0];

            let token = createToken({ id, username, email, role, status });

            await transporter.sendMail({
                from: "Admin Commerce",
                to: email,
                subject: "Request Reset Password",
                html: `<div>
                    <h3>Click Link Below</h3>
                    <a href="${process.env.FE_URL}/newpassword/${token}">Reset your password here</a>
                </div>`
            })

            return res.status(200).send({ ...resultsLogin[0], token, success: true })

        } catch (error) {
            return next(error);
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            console.log(req.body.email);

            let updateStatus = await dbQuery(`UPDATE users SET password = ${dbConf.escape(hashPassword(req.body.password))} WHERE id = ${dbConf.escape(req.dataUser.id)};`)

            let resultsLogin = await dbQuery(`Select id,username,email,role,status FROM users WHERE id=${dbConf.escape(req.dataUser.id)};`);

            let { id, username, email, role, status } = resultsLogin[0];

            let token = createToken({ id, username, email, role, status });

            return res.status(200).send({ ...resultsLogin[0], token, success: true })

        } catch (error) {
            return next(error);
        }
    }
}