const router = require('express').Router();
const { productsController } = require('../controllers');

router.get('/', productsController.getData);
router.post('/', productsController.addData);

module.exports = router;