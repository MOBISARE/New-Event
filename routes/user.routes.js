const router = require("express").Router();

const userController = require('../controllers/compte');


router.post('/inscription', userController.postInscription)

module.exports = router;