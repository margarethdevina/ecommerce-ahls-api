const router = require('express').Router();
const { readToken } = require('../config/encryption');
const {productsController} = require('../controllers');

router.get('/get', productsController.getData);
router.get('/paginate', productsController.getDataPaginate);
router.get('/detail', productsController.detail);
router.post('/add', readToken, productsController.add);
router.patch('/edit', productsController.edit);
router.delete('/delete', productsController.delete);
router.get('/filter', productsController.filter);
router.get('/sort', productsController.sort);

module.exports = router;