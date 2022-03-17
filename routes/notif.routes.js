const router = require("express").Router();


const { checkUser, requireAuth } = require('../middleware/auth.middleware');
const notif = require('../controllers/notification');

router.get('/:id', notif.getNotification);
router.get('/:id', notif.getNotificationSpe);

router.post('/:id/', notif.supprimerNotif);
