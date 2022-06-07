const { dbConf, dbQuery } = require("../config/database")

module.exports = {
    getData: async (req, res, next) => {
        try {

            let resultsUsers = await dbQuery('Select iduser,username,email,role FROM users');

            let resultsCart = await dbQuery(`Select p.nama, i.urlImg , p.harga, s.type, 
            s.qty as stockQty, c.* FROM cart c 
            JOIN stocks s ON c.idstock = s.idstock
            JOIN products p ON p.idproduct = s.idproduct
            JOIN images i ON i.idproduct = p.idproduct GROUP BY c.idcart;`);

            resultsUsers.forEach((val, idx) => {
                val.cart = [];
                resultsCart.forEach((valCart, idxCart) => {
                    if (val.iduser == valCart.iduser) {
                        val.cart.push(valCart)
                    }
                })
            })

            return res.status(200).send(resultsUsers);
        } catch (error) {
            return next(error)
        }
    },
    register: async (req, res, next) => {
        try {
            console.log(req.body)
            let insertData = await dbQuery(`insert into users (username, email, password, role)
            values (${dbConf.escape(req.body.username)},${dbConf.escape(req.body.email)},
            ${dbConf.escape(req.body.password)},${dbConf.escape(req.body.role)});`);

            // console.log(insertData);
            if (insertData.insertId) {
                let resultsLogin = await dbQuery(`Select iduser,username,email,role FROM users 
                WHERE iduser=${insertData.insertId};`);
                if (resultsLogin.length == 1) {
                    let resultsCart = await dbQuery(`Select p.nama, i.urlImg , p.harga, s.type, 
                    s.qty as stockQty, c.* FROM cart c 
                    JOIN stocks s ON c.idstock = s.idstock
                    JOIN products p ON p.idproduct = s.idproduct
                    JOIN images i ON i.idproduct = p.idproduct WHERE c.iduser=${insertData.insertId}
                    GROUP BY c.idcart;`);
                    resultsLogin[0].cart = resultsCart
                    return res.status(200).send(resultsLogin[0])
                }else{
                    return res.status(404).send({
                        success: false,
                        message: "User not found ⚠️"
                    });
                }

            }
            // res.status(200).send("<h2>REGISTER</h2>")
        } catch (error) {
            return next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            //    console.log(req.body)
            let resultsLogin = await dbQuery(`Select iduser,username,email,role FROM users 
            WHERE email='${req.body.email}' AND password='${req.body.password}' ;`);

            if (resultsLogin.length == 1) {
                let resultsCart = await dbQuery(`Select p.nama, i.urlImg , p.harga, s.type, 
                s.qty as stockQty, c.* FROM cart c 
                JOIN stocks s ON c.idstock = s.idstock
                JOIN products p ON p.idproduct = s.idproduct
                JOIN images i ON i.idproduct = p.idproduct WHERE c.iduser=${resultsLogin[0].iduser}
                GROUP BY c.idcart;`);

                resultsLogin[0].cart = resultsCart;
                return res.status(200).send(resultsLogin[0]);
            } else {
                return res.status(404).send({
                    success: false,
                    message: "User not found ⚠️"
                });
            }

        } catch (error) {
            return next(error);
        }
    },
    keepLogin: async (req, res, next) => {
        try {
            //    console.log(req.body)
            let resultsLogin = await dbQuery(`Select iduser,username,email,role FROM users 
            WHERE iduser=${req.body.iduser} ;`);

            if (resultsLogin.length == 1) {
                let resultsCart = await dbQuery(`Select p.nama, i.urlImg , p.harga, s.type, 
                s.qty as stockQty, c.* FROM cart c 
                JOIN stocks s ON c.idstock = s.idstock
                JOIN products p ON p.idproduct = s.idproduct
                JOIN images i ON i.idproduct = p.idproduct WHERE c.iduser=${resultsLogin[0].iduser}
                GROUP BY c.idcart;`);

                resultsLogin[0].cart = resultsCart;
                return res.status(200).send(resultsLogin[0]);
            } else {
                return res.status(404).send({
                    success: false,
                    message: "User not found ⚠️"
                });
            }

        } catch (error) {
            return next(error);
        }
    },
    edit: (req, res, next) => {

    },
    deActiveAccount: (req, res, next) => {

    }
}