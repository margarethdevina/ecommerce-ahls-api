const router = require('express').Router();
const { bannerController } = require('../controllers');

router.get('/get', bannerController.getData);
router.post('/add', bannerController.addData);
router.patch('/update', bannerController.update);
router.delete('/del', bannerController.deleteData);

module.exports = router;