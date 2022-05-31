const { dbConf } = require("../config/database")

module.exports = {
    getData: (req, res, next) => {
        dbConf.query('Select id, username, email, role FROM users;', (error, resultsUser) => {
            if (error) {
                console.log(error);
                return next(error);
            }

            dbConf.query('Select * FROM cart;', (errorCart, resultsCart) => {
                if (errorCart) {
                    return next(errorCart);
                }

                // console.log(resultsUser);
                // console.log(resultsCart);

                resultsUser.forEach((val, idx) => {
                    val.cart = [];
                    resultsCart.forEach((valCart, idxCart) => {
                        if (val.id == valCart.iduser) {
                            val.cart.push(valCart)
                        }
                    })
                })

                return res.status(200).send(resultsUser);

            })
        })


    },
    register: (req, res, next) => {
        res.status(200).send("<h2>REGISTER</h2>")

    },
    login: (req, res, next) => {

        dbConf.query(`Select id, username, email, role FROM users where email="${req.body.email}" and password="${req.body.password}";`, (error, resultsUser) => {
            console.log(req.body)
            if (error) {
                console.log(error);
                return next(error);
            }

            dbConf.query('Select * FROM cart;', (errorCart, resultsCart) => {
                if (errorCart) {
                    return next(errorCart);
                }

                console.log(resultsUser);
                console.log(resultsCart);

                resultsUser.forEach((val, idx) => {
                    val.cart = [];
                    resultsCart.forEach((valCart, idxCart) => {
                        if (val.id == valCart.iduser) {
                            val.cart.push(valCart)
                        }
                    })
                })

                return res.status(200).send(resultsUser);

            })

        })
    },
    edit: (req, res, next) => {

    },
    deActiveAccount: (req, res, next) => {

    }
}