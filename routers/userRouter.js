const router = require('express').Router();
const { readToken } = require('../config/encryption');
const { userController } = require('../controllers');

router.get('/get', userController.getData);
router.post('/regis', userController.register);
router.post('/login', userController.login); //klo get username dan password ga bisa masuk ke body, klo dimasukin ke url kebaca passwordnya
router.get('/keeplogin', readToken, userController.keeplogin);
router.patch('/verification', readToken, userController.verification);
router.get('/resendVerif', readToken, userController.resendVerif);
router.post('/forgot', userController.emailReset);
router.patch('/reset', readToken, userController.resetPassword);

module.exports = router;
