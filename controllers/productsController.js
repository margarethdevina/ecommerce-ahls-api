const { dbConf, dbQuery } = require("../config/database");
const { uploader } = require('../config/uploader'); //impor fungsi uploader
const fs = require('fs');

module.exports = {
    getData: async (req, res, next) => {
        try {

            let resultsProducts = await dbQuery(`select * from products;`)

            let resultsStocks = await dbQuery(`select idstock as id, idproducts, type, qty from stocks;`)
            // console.log("resultsStocks", resultsStocks)

            let resultsImage = await dbQuery(`select idProduct, image from image;`)

            resultsProducts.forEach((val, idx) => {
                val.stock = [];
                val.images = [];
                resultsStocks.forEach((valStock, idxStock) => {
                    if (val.id == valStock.idproducts) {
                        val.stock.push({ id: valStock.id, type: valStock.type, qty: valStock.qty });
                    }
                })

                resultsImage.forEach((valImg, idxImg) => {
                    if (val.id == valImg.idProduct) {
                        val.images.push(valImg.image);
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

        if (req.dataUser.role == "admin") {

            const uploadFile = uploader('/imgProduct', 'IMGPRO').array('images', 5);//array('properti FE',maxJumlahGambarYgBisaDiuplod)
            //di FE untuk melimit mending dikasih remarks/alert/toast untuk info cuma bisa 5 gambar aja yg diuplod.

            uploadFile(req, res, async (error) => { //req mengolah data dr FE langsung jd data yg masuk ini ga dlm bentuk objek tp dlm bentuk form data
                try {

                    console.log(req.body);
                    console.log("pengecekan file: ", req.files);

                    let { nama, deskripsi, brand, kategori, harga, stock } = JSON.parse(req.body.data);

                    let insertProduct = await dbQuery(`INSERT INTO products 
                    (nama, deskripsi, brand, kategori, harga) 
                    VALUES 
                    (${dbConf.escape(nama)}, ${dbConf.escape(deskripsi)}, ${dbConf.escape(brand)}, ${dbConf.escape(kategori)}, ${dbConf.escape(harga)});`);

                    if (insertProduct.insertId) {
                        //add images
                        let imageData = req.files.map(val => {
                            return `(${dbConf.escape(insertProduct.insertId)},${dbConf.escape(`/imgProduct/${val.filename}`)})`
                        })
                        // let imageData = images.map(val => {
                        //     return `(${dbConf.escape(insertProduct.insertId)},${dbConf.escape(val)})`
                        // })

                        let insertImg = await dbQuery(`INSERT INTO image (idProduct, image)
                        VALUES 
                        ${imageData.join(',')};`)

                        //add stocks
                        let stocksData = stock.map(val => {
                            return `(${dbConf.escape(insertProduct.insertId)},${dbConf.escape(val.type)},${dbConf.escape(val.qty)})`
                        })

                        let insertStocks = await dbQuery(`INSERT INTO stocks 
                        (idproducts, type, qty) 
                        VALUES 
                        ${stocksData.join(',')};`)
                        return res.status(200).send({
                            success: true,
                            message: "Add product success"
                        })
                    }

                } catch (error) {
                    req.files.forEach(val => fs.unlinkSync(`./public/imgProduct/${val.filename}`));
                    return next(error);
                }

            })

            ///////////////////////////////////////////

            // //q.AddProduct
            // queryPromise1 = () => {
            //     return new Promise((resolve, reject) => {
            //         dbQuery(`INSERT INTO products 
            //         (nama, deskripsi, brand, kategori, harga) 
            //         VALUES 
            //         ("${req.body.nama}", "${req.body.deskripsi}", "${req.body.brand}", "${req.body.kategori}", ${req.body.harga});`, (error, results) => {
            //             if (error) {
            //                 return reject(error);
            //             }
            //             return resolve(results);
            //         });
            //     });
            // };

            // //q.GetProduct
            // queryPromise2 = () => {
            //     return new Promise((resolve, reject) => {
            //         dbQuery(`select * from products order by id desc limit 0,1;`, (error, results) => {
            //             if (error) {
            //                 return reject(error);
            //             }
            //             return resolve(results);
            //         })
            //     })
            // }

            // //q.AddStocks
            // queryPromise3 = (productId) => {
            //     return new Promise((resolve, reject) => {
            //         req.body.stock.forEach((valStockBody, idxStockBody) => {
            //             dbQuery(`INSERT INTO stocks 
            //                     (idproducts, type, qty) 
            //                     VALUES 
            //                     (${productId}, "${valStockBody.type}", ${valStockBody.qty});`, (error, results) => {
            //                 if (error) {
            //                     return reject(error);
            //                 }
            //                 return resolve(results);
            //             });
            //         });
            //     });
            // };

            // //q.AddImage
            // queryPromise4 = (productId) => {
            //     return new Promise((resolve, reject) => {
            //         req.body.images.forEach((valImageBody, idxImageBody) => {
            //             dbQuery(`INSERT INTO image 
            //                     (idProduct, image) 
            //                     VALUES 
            //                     (${productId}, "${valImageBody}");`, (error, results) => {
            //                 if (error) {
            //                     return reject(error);
            //                 }
            //                 return resolve(results);
            //             });
            //         });
            //     });
            // };

            // //q.GetStocks
            // queryPromise5 = (productId) => {
            //     return new Promise((resolve, reject) => {
            //         dbQuery(`select idstock as id, type, qty from stocks where idproducts = ${productId};`, (error, results) => {
            //             if (error) {
            //                 return reject(error);
            //             }
            //             return resolve(results);
            //         })
            //     })
            // }

            // //q.GetImages
            // queryPromise6 = (productId) => {
            //     return new Promise((resolve, reject) => {
            //         dbQuery(`select idProduct, image from image where idProduct=${productId};`, (error, results) => {
            //             if (error) {
            //                 return reject(error);
            //             }
            //             // setTimeout(()=>resolve(results),1000);
            //             return resolve(results);
            //         })
            //     })
            // }

            // try {
            //     let addProduct = await queryPromise1();
            //     let resultsProducts = await queryPromise2();
            //     let addStocks = await queryPromise3(resultsProducts[0].id);
            //     let addImages = await queryPromise4(resultsProducts[0].id);
            //     let resultsStocks = await queryPromise5(resultsProducts[0].id);
            //     let resultsImage = await queryPromise6(resultsProducts[0].id);

            //     console.log(resultsImage)

            //     resultsProducts[0].stock = [...resultsStocks];

            //     resultsProducts.forEach((valProd, idxProd) => {
            //         valProd.images = [];
            //         resultsImage.forEach((valImg, idxImg) => {
            //             if (valProd.id == valImg.idProduct) {
            //                 valProd.images.push(valImg.image);
            //             }
            //         });
            //     });

            //     return res.status(200).send(resultsProducts[0]);

            // } catch (error) {
            //     return next(error);
            // }
        } else {
            return res.status(401).send('You not authorize for this feature');
        }



    },
    edit: (req, res, next) => {

    },
    delete: (req, res, next) => {

    },
    filter: async (req, res, next) => {
        try {
            console.log(req.query)

            let resultsProducts = []

            let resultsStocks = await dbQuery(`select idstock as id, idproducts, type, qty from stocks;`)

            let resultsImage = await dbQuery(`select idProduct, image from image;`)

            if (req.query._sort && req.query._order) {
                if (req.query.nama) {
                    if (req.query.brand) {
                        if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and brand like "%${req.query.brand}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)} order by ${req.query._sort} ${req.query._order};`)
                        } else {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and brand like "%${req.query.brand}%" order by ${req.query._sort} ${req.query._order};`)
                        }
                    } else if (req.query.kategori) {
                        if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and kategori like "%${req.query.kategori}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)} order by ${req.query._sort} ${req.query._order};`)
                        } else {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and kategori like "%${req.query.kategori}%" order by ${req.query._sort} ${req.query._order};`)
                        }
                    } else if (req.query.brand && req.query.kategori) {
                        if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and brand like "%${req.query.brand}%" and kategori like "%${req.query.kategori}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)} order by ${req.query._sort} ${req.query._order};`)
                        } else {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and brand like "%${req.query.brand}%" and kategori like "%${req.query.kategori}%" order by ${req.query._sort} ${req.query._order};`)
                        }
                    } else if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                        resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)} order by ${req.query._sort} ${req.query._order};`)
                    } else {
                        resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" order by ${req.query._sort} ${req.query._order};`)
                    }
                } else if (req.query.brand) {
                    if (req.query.kategori) {
                        resultsProducts = await dbQuery(`select * from products where brand like "%${req.query.brand}%" and kategori like "%${req.query.kategori}%" order by ${req.query._sort} ${req.query._order};`)
                    } else if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                        resultsProducts = await dbQuery(`select * from products where brand like "%${req.query.brand}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)} order by ${req.query._sort} ${req.query._order};`)
                    } else {
                        resultsProducts = await dbQuery(`select * from products where brand like "%${req.query.brand}%" order by ${req.query._sort} ${req.query._order};`)
                    }
                } else if (req.query.kategori) {
                    if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                        resultsProducts = await dbQuery(`select * from products where kategori like "%${req.query.kategori}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)} order by ${req.query._sort} ${req.query._order};`)
                    } else {
                        resultsProducts = await dbQuery(`select * from products where kategori like "%${req.query.kategori}%" order by ${req.query._sort} ${req.query._order};`)
                    }
                } else if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {

                    resultsProducts = await dbQuery(`select * from products where harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)} order by ${req.query._sort} ${req.query._order};`)

                } else if (req.query.id) {
                    resultsProducts = await dbQuery(`select * from products where id = ${req.query.id} order by ${req.query._sort} ${req.query._order};`)
                }
            } else {
                if (req.query.nama) {
                    if (req.query.brand) {
                        if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and brand like "%${req.query.brand}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)};`)
                        } else {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and brand like "%${req.query.brand}%";`)
                        }
                    } else if (req.query.kategori) {
                        if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and kategori like "%${req.query.kategori}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)};`)
                        } else {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and kategori like "%${req.query.kategori}%";`)
                        }
                    } else if (req.query.brand && req.query.kategori) {
                        if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and brand like "%${req.query.brand}%" and kategori like "%${req.query.kategori}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)};`)
                        } else {
                            resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and brand like "%${req.query.brand}%" and kategori like "%${req.query.kategori}%";`)
                        }
                    } else if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                        resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)};`)
                    } else {
                        resultsProducts = await dbQuery(`select * from products where nama like "%${req.query.nama}%";`)
                    }
                } else if (req.query.brand) {
                    if (req.query.kategori) {
                        resultsProducts = await dbQuery(`select * from products where brand like "%${req.query.brand}%" and kategori like "%${req.query.kategori}%";`)
                    } else if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                        resultsProducts = await dbQuery(`select * from products where brand like "%${req.query.brand}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)};`)
                    } else {
                        resultsProducts = await dbQuery(`select * from products where brand like "%${req.query.brand}%";`)
                    }
                } else if (req.query.kategori) {
                    if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {
                        resultsProducts = await dbQuery(`select * from products where kategori like "%${req.query.kategori}%" and harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)};`)
                    } else {
                        resultsProducts = await dbQuery(`select * from products where kategori like "%${req.query.kategori}%";`)
                    }
                } else if (parseInt(req.query.harga_gte) > 0 && parseInt(req.query.harga_lte) > 0) {

                    resultsProducts = await dbQuery(`select * from products where harga between ${parseInt(req.query.harga_gte)} and ${parseInt(req.query.harga_lte)};`)

                } else if (req.query.id) {
                    resultsProducts = await dbQuery(`select * from products where id = ${req.query.id};`)
                }
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