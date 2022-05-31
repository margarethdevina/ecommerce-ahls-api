const { dbConf, dbQuery } = require("../config/database")

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

            // console.log("isi join cart stocks products", resJoinCartStocksProductsImage)

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
    register: (req, res, next) => {
        res.status(200).send("<h2>REGISTER</h2>")

    },
    login: async (req, res, next) => {
        try {
            // console.log(req.body)
            let resultsLogin = await dbQuery(`Select id, username, email, role FROM users where email="${req.body.email}" and password="${req.body.password}";`)

            if (resultsLogin.length == 1) {
                let resultsCart = await dbQuery(`select p.nama, i.image, p.harga, s.type, s.qty as stockQty, c.* from cart c 
                JOIN stocks s on c.idstock = s.idstock 
                JOIN products p on s.idproducts = p.id 
                JOIN image i on p.id = i.idProduct 
                where c.iduser = ${resultsLogin[0].id} 
                group by c.idcart ;`)

                resultsLogin[0].cart = resultsCart;
                //karena login dan pasti cuma 1 data yg direturn jangan lupa tambah [0] setelah resultsLogin
                return res.status(200).send(resultsLogin[0]);
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
            let resultsLogin = await dbQuery(`Select id, username, email, role FROM users 
            where id="${req.body.id}";`)

            if (resultsLogin.length == 1) {
                let resultsCart = await dbQuery(`select p.nama, i.image, p.harga, s.type, s.qty as stockQty, c.* from cart c 
                JOIN stocks s on c.idstock = s.idstock 
                JOIN products p on s.idproducts = p.id 
                JOIN image i on p.id = i.idProduct 
                where c.iduser = ${resultsLogin[0].id} 
                group by c.idcart ;`)

                resultsLogin[0].cart = resultsCart;
                
                return res.status(200).send(resultsLogin[0]);
            } else {
                return res.status(404).send({
                    success: false,
                    message: "user not found"
                });
            }
        } catch (error) {
            return next(error);
        }
    }
}