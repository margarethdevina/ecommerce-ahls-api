const router = require('express').Router();
const { bannerController } = require('../controllers');

router.get('/get', bannerController.getData);
router.post('/add', bannerController.add);
router.patch('/update', bannerController.update);
router.delete('/delete', bannerController.delete);

module.exports = router;