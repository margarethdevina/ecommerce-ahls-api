const { dbQuery } = require("../config/database");

module.exports = {
    getData: async (req, res, next) => {
        try {
            let resultsProducts = await dbQuery(`select * from products;`)

            let resultsStocks = await dbQuery(`select idstock as id, idproducts, type, qty from stocks;`)
            console.log("resultsStocks", resultsStocks)

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

        //q.AddProduct
        queryPromise1 = () => {
            return new Promise((resolve, reject) => {
                dbQuery(`INSERT INTO products 
                (nama, deskripsi, brand, kategori, harga) 
                VALUES 
                ("${req.body.nama}", "${req.body.deskripsi}", "${req.body.brand}", "${req.body.kategori}", ${req.body.harga});`, (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                });
            });
        };

        //q.GetProduct
        queryPromise2 = () => {
            return new Promise((resolve, reject) => {
                dbQuery(`select * from products order by id desc limit 0,1;`, (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                })
            })
        }

        //q.AddStocks
        queryPromise3 = (productId) => {
            return new Promise((resolve, reject) => {
                req.body.stock.forEach((valStockBody, idxStockBody) => {
                    dbQuery(`INSERT INTO stocks 
                            (idproducts, type, qty) 
                            VALUES 
                            (${productId}, "${valStockBody.type}", ${valStockBody.qty});`, (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        return resolve(results);
                    });
                });
            });
        };

        //q.AddImage
        queryPromise4 = (productId) => {
            return new Promise((resolve, reject) => {
                req.body.images.forEach((valImageBody, idxImageBody) => {
                    dbQuery(`INSERT INTO image 
                            (idProduct, image) 
                            VALUES 
                            (${productId}, "${valImageBody}");`, (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        return resolve(results);
                    });
                });
            });
        };

        //q.GetStocks
        queryPromise5 = (productId) => {
            return new Promise((resolve, reject) => {
                dbQuery(`select idstock as id, type, qty from stocks where idproducts = ${productId};`, (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                })
            })
        }

        //q.GetImages
        queryPromise6 = (productId) => {
            return new Promise((resolve, reject) => {
                dbQuery(`select idProduct, image from image where idProduct=${productId};`, (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    // setTimeout(()=>resolve(results),1000);
                    return resolve(results);
                })
            })
        }

        try {
            let addProduct = await queryPromise1();
            let resultsProducts = await queryPromise2();
            let addStocks = await queryPromise3(resultsProducts[0].id);
            let addImages = await queryPromise4(resultsProducts[0].id);
            let resultsStocks = await queryPromise5(resultsProducts[0].id);
            let resultsImage = await queryPromise6(resultsProducts[0].id);

            console.log(resultsImage)

            resultsProducts[0].stock = [...resultsStocks];

            resultsProducts.forEach((valProd, idxProd) => {
                valProd.images = [];
                resultsImage.forEach((valImg, idxImg) => {
                    if (valProd.id == valImg.idProduct) {
                        valProd.images.push(valImg.image);
                    }
                });
            });

            return res.status(200).send(resultsProducts[0]);

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

            if (resultsProducts.length > 0) {
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