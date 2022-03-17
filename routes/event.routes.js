const router = require("express").Router();
const { checkUser, requireAuth } = require('../middleware/auth.middleware');
const eventController = require('../controllers/evenement');
const needController = require('../controllers/besoin');
const multer = require("multer");
const upload = multer({ dest: './images' })

router.get('/:id', eventController.getEvenement);

router.put('/modifier/:id', requireAuth, upload.single('img_banniere'), eventController.saveEvent);
router.post('/publier/:id', requireAuth, eventController.publishEvent);

router.put('/creer', requireAuth, eventController.createEvent);




router.post('/rejoindreEve/:id', requireAuth, eventController.rejoindreEve)


router.post('/seretirer/:id', requireAuth, eventController.seRetirer)


router.post('/:id/besoin/creer', requireAuth, needController.postAjouterBesoin)

router.put('/:id/besoin/:idbesoin/modifier', requireAuth, needController.putModifierBesoin)

router.post('/:id/besoin/:idbesoin/supprimer', requireAuth, needController.postSupprBesoin)

router.get('/:id/besoin/:idbesoin', requireAuth, needController.getBesoin)

module.exports = router;