// untuk meringkas proses import di direktori lain terutama di router
const userController = require('./userController');
const bannerController = require('./bannerController');
const productsController = require('./productsController');

module.exports = {
    userController,
    bannerController,
    productsController
}