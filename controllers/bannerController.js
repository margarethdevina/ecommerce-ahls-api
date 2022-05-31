const { dbConf, dbQuery } = require("../config/database")

module.exports = {
    //request untuk baca respon dr user
    //response untuk memberikan respon ke user
    //next untuk melanjutkan ke middleware berikutnya
    //next dipake apabila dalam 1 routing ada lebih dr 1 middleware
    //misal router.get('/get', bannerController.getData, bannerController.getData);
    //klo tidak ada middleware berikutnya, next akan cari middleware di index.js utama.
    getData: async (req, res, next) => {
        try {
            let resultsBanner = await dbQuery('Select * FROM banner;')
            return res.status(200).send(resultsBanner);
        } catch (error) {
            return next(error);
        }

        // dbConf.query('Select * FROM banner;', (error, results) => {
        //     if (error) {
        //         return next(error); //ditambah return untuk menghentikan proses
        //     }
        //     return res.status(200).send(results); //ditambah return untuk menghentikan proses
        // })
    },
    add: (req, res, next) => {
        res.status(200).send("<h2>add</h2>")

    },
    update: (req, res, next) => {
        res.status(200).send("<h2>update</h2>")
    },
    delete: (req, res, next) => {

    }
}