const router = require("express").Router();

const { checkUser, requireAuth } = require('../middleware/auth.middleware');
const notif = require('../controllers/notification.controller');

router.get('/getAll', notif.getNotification);
router.get('/:id/:type', notif.getNotificationSpe);

router.post('/:id/supprimer', notif.supprimerNotif);

router.post('/:id/accepter', notif.accepterNotif);
router.post('/:id/refuser', notif.refuserNotif);

module.exports = router;