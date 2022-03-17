const router = require("express").Router();

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/compte');

router.post('/connexion', authController.login)
router.post('/inscription', authController.register);
router.post('/deconnexion', authController.logout);

module.exports = router;