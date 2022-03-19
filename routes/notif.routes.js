const router = require("express").Router();

const { checkUser, requireAuth } = require('../middleware/auth.middleware');
const notif = require('../controllers/notification.controller');

router.get('/getAll', notif.getNotification);
router.get('/:id/:type', notif.getNotificationSpe);

router.post('/:id/supprimer/:type/:id_type/:type_notif', notif.supprimerNotif);

module.exports = router;