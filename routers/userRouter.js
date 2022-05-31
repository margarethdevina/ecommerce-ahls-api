const router = require('express').Router();
const { userController } = require('../controllers');

router.get('/get', userController.getData);
router.post('/regis', userController.register);
router.post('/login', userController.login); //klo get username dan password ga bisa masuk ke body, klo dimasukin ke url kebaca passwordnya
router.post('/keeplogin', userController.keeplogin); 

module.exports = router;
