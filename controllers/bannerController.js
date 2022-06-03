const { dbConf, dbQuery } = require("../config/database");
const { mongoBanner } = require("../config/mongo");

module.exports = {
    //request untuk baca respon dr user
    //response untuk memberikan respon ke user
    //next untuk melanjutkan ke middleware berikutnya
    //next dipake apabila dalam 1 routing ada lebih dr 1 middleware
    //misal router.get('/get', bannerController.getData, bannerController.getData);
    //klo tidak ada middleware berikutnya, next akan cari middleware di index.js utama.
    getData: async (req, res, next) => {
        try {
            // BANNER AT MYSQL ❗❗❗
            //     let resultsBanner = await dbQuery('Select * FROM banner;')
            //     return res.status(200).send(resultsBanner);
            // } catch (error) {
            //     return next(error);
            // }

            //SAAT PK DBCONF
            // dbConf.query('Select * FROM banner;', (error, results) => {
            //     if (error) {
            //         return next(error); //ditambah return untuk menghentikan proses
            //     }
            //     return res.status(200).send(results); //ditambah return untuk menghentikan proses
            // })

            // BANNER AT MONGODB ❗❗❗
            mongoBanner.find({ ...req.query }, (err, data) => {
                return res.status(200).send(data);
            })
        } catch (error) {
            return next(error);
        }

    },
    addData: async (req, res, next) => {
        try {
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
    update: async (req, res, next) => {
        try {
            mongoBanner.updateOne(req.query, { $set: req.body }, {}, (err, results) => {
                res.status(200).send({
                    success: true,
                    results
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
    }
}