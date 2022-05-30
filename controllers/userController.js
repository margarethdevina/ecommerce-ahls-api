const { dbConf } = require("../config/database")

module.exports = {
    getData: (req, res) => {
        dbConf.query('Select id, username, email, role FROM users;', (error, resultsUser) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }

            // res.status(200).send(resultsUser);
            dbConf.query('Select * FROM cart;', (errorCart, resultsCart) => {
                if (errorCart) {
                    console.log(errorCart);
                    res.status(500).send(errorCart);
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

                res.status(200).send(resultsUser);

            })
        })


    },
    register: (req, res) => {
        res.status(200).send("<h2>REGISTER</h2>")

    },
    login: (req, res) => {
        res.status(200).send("<h2>LOGIN</h2>")
    },
    edit: (req, res) => {

    },
    deActiveAccount: (req, res) => {

    }
}