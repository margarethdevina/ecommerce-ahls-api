const { dbConf, dbQuery } = require("../config/database");
const { mongoBanner } = require("../config/mongo");

module.exports = {
    getData: async (req, res, next) => {
        try {
            // Banner at MySQL
            // let resultsBanner = await dbQuery('Select * FROM banner;')

            // return res.status(200).send(resultsBanner);

            // Banner at MongoDB
            mongoBanner.find({ ...req.query }, (err, data) => {
                return res.status(200).send(data);
            })
        } catch (error) {
            return next(error);
        }
        // dbConf.query('Select * FROM banner;', (error, results) => {
        //     if (error) {
        //         return next(error)
        //     }
        //     return res.status(200).send(results)
        // })
    },
    addData: async (req, res, next) => {
        try {
            console.log(req.body)
            mongoBanner(req.body).save().then((data) => {
                res.status(200).send({
                    success: true,
                    results: data
                })
            })

        } catch (error) {
            return next(error);
        }
    },
    deleteData: async (req, res, next) => {
        try {
            mongoBanner.deleteOne(req.query, (err, data) => {
                res.status(200).send({
                    success: true,
                    results: data
                })
            })
        } catch (error) {
            return next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            mongoBanner.updateOne(req.query, { $set: req.body },
                {}, (err, results) => {
                    res.status(200).send({
                        success: true,
                        results
                    })
                })
        } catch (error) {
            return next(error);
        }
    }
}