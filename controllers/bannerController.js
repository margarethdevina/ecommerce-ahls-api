const { dbConf } = require("../config/database")

module.exports = {
    getData: (req, res) => {
        dbConf.query('Select * FROM banner;', (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }

            res.status(200).send(results);
            
        })
    },
    add: (req, res) => {
        res.status(200).send("<h2>add</h2>")

    },
    update: (req, res) => {
        res.status(200).send("<h2>update</h2>")
    },
    delete: (req, res) => {

    }
}