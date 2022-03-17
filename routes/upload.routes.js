const router = require("express").Router();

const { checkUser, requireAuth } = require('../middleware/auth.middleware');
const uploadController = require('../controllers/upload.controller');

router.get('/:name', requireAuth, uploadController.getImage);


module.exports = router;