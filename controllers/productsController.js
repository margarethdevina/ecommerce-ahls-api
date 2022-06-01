const { dbQuery } = require("../config/database");

module.exports = {
    getData: async (req, res, next) => {
        try {
            let resultsProducts = await dbQuery(`select * from products;`)

            let resultsStocks = await dbQuery(`select idstock as id, idproducts, type, qty from stocks;`)

            let resultsImage = await dbQuery(`select idProduct, image from image;`)

            resultsProducts.forEach((val, idx) => {
                val.stock = [];
                resultsStocks.forEach((valStock, idxStock) => {
                    if (val.id == valStock.idproducts) {
                        val.stock.push({ id: valStock.id, type: valStock.type, qty: valStock.qty });
                    }
                })
            })

            resultsProducts.forEach((valProd, idxProd) => {
                valProd.images = [];
                resultsImage.forEach((valImg, idxImg) => {
                    if (valProd.id == valImg.idProduct) {
                        valProd.images.push(valImg.image);
                    }
                })
            })

            return res.status(200).send(resultsProducts);

        } catch (error) {
            return next(error);
        }

    },
    detail: async (req, res, next) => {
        try {
            let resultsProducts = await dbQuery(`select * from products where id="${req.query.id}";`)

            let resultsStocks = await dbQuery(`select idstock as id, idproducts, type, qty from stocks;`)

            let resultsImage = await dbQuery(`select idProduct, image from image;`)

            resultsProducts.forEach((val, idx) => {
                val.stock = [];
                resultsStocks.forEach((valStock, idxStock) => {
                    if (val.id == valStock.idproducts) {
                        val.stock.push({ id: valStock.id, type: valStock.type, qty: valStock.qty });
                    }
                })
            })

            resultsProducts.forEach((valProd, idxProd) => {
                valProd.images = [];
                resultsImage.forEach((valImg, idxImg) => {
                    if (valProd.id == valImg.idProduct) {
                        valProd.images.push(valImg.image);
                    }
                })
            })

            return res.status(200).send(resultsProducts[0]);

        } catch (error) {
            return next(error);
        }
    },
    add: async (req, res, next) => {
        try {

        } catch (error) {
            return next(error);
        }

    },
    edit: (req, res, next) => {

    },
    delete: (req, res, next) => {

    },
    filter: async (req, res, next) => {
        try {
            let resultsProducts = []

            let resultsStocks = await dbQuery(`select idstock as id, idproducts, type, qty from stocks;`)

            let resultsImage = await dbQuery(`select idProduct, image from image;`)

            if (req.query.nama) {
                if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {

                    resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)};`)

                } else {

                    resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%";`)

                }
            } else if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {

                resultsProducts = await dbQuery(`select * from products where harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)};`)

            }

            resultsProducts.forEach((val, idx) => {
                val.stock = [];
                resultsStocks.forEach((valStock, idxStock) => {
                    if (val.id == valStock.idproducts) {
                        val.stock.push({ id: valStock.id, type: valStock.type, qty: valStock.qty });
                    }
                })
            })

            resultsProducts.forEach((valProd, idxProd) => {
                valProd.images = [];
                resultsImage.forEach((valImg, idxImg) => {
                    if (valProd.id == valImg.idProduct) {
                        valProd.images.push(valImg.image);
                    }
                })
            })

            return res.status(200).send(resultsProducts);

        } catch (error) {
            return next(error);
        }
    },
    sort: async (req, res, next) => {
        try {
            let resultsProducts = await dbQuery(`select * from products order by ${req.query._sort} ${req.query._order};`)

            if (resultsProducts[0].id) {
                let resultsStocks = await dbQuery(`select idstock as id, idproducts, type, qty from stocks;`)

                let resultsImage = await dbQuery(`select idProduct, image from image;`)

                resultsProducts.forEach((val, idx) => {
                    val.stock = [];
                    resultsStocks.forEach((valStock, idxStock) => {
                        if (val.id == valStock.idproducts) {
                            val.stock.push({ id: valStock.id, type: valStock.type, qty: valStock.qty });
                        }
                    })
                })

                resultsProducts.forEach((valProd, idxProd) => {
                    valProd.images = [];
                    resultsImage.forEach((valImg, idxImg) => {
                        if (valProd.id == valImg.idProduct) {
                            valProd.images.push(valImg.image);
                        }
                    })
                })

                return res.status(200).send(resultsProducts);
            }

        } catch (error) {
            return next(error);
        }
    },
    getDataPaginate: async (req, res, next) => {
        try {
            console.log("isi req query", req.query)
            let resultsProducts = await dbQuery(`select * from products limit ${parseInt(req.query._page * req.query._limit)},${parseInt(req.query._limit)};`)

            if (resultsProducts.length>0) {
                let resultsStocks = await dbQuery(`select idstock as id, idproducts, type, qty from stocks;`)

                let resultsImage = await dbQuery(`select idProduct, image from image;`)

                resultsProducts.forEach((val, idx) => {
                    val.stock = [];
                    resultsStocks.forEach((valStock, idxStock) => {
                        if (val.id == valStock.idproducts) {
                            val.stock.push({ id: valStock.id, type: valStock.type, qty: valStock.qty });
                        }
                    })
                })

                resultsProducts.forEach((valProd, idxProd) => {
                    valProd.images = [];
                    resultsImage.forEach((valImg, idxImg) => {
                        if (valProd.id == valImg.idProduct) {
                            valProd.images.push(valImg.image);
                        }
                    })
                })

                return res.status(200).send(resultsProducts);
            }

        } catch (error) {
            return next(error);
        }
    }
}