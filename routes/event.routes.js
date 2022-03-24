const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: './upload' })

const { checkUser, requireAuth } = require('../middleware/auth.middleware');
const eventController = require('../controllers/event.controller');
const needController = require('../controllers/need.controller');



router.get('/:id', eventController.getEvenement);

router.get('/recherche/:search', eventController.search);
router.get('/:id/participants', eventController.getParticipants);

router.put('/creer', requireAuth, eventController.createEvent);
router.put('/modifier/:id', requireAuth, upload.single('img_banniere'), eventController.saveEvent);
router.post('/publier/:id', requireAuth, eventController.publishEvent);
router.post('/supprimer/:id', requireAuth, eventController.supprEvenement);
router.post('/archiver/:id', requireAuth, eventController.archiveEvent);


router.post('/rejoindreEve/:id', requireAuth, eventController.rejoindreEve)
router.post('/seretirer/:id', requireAuth, eventController.seRetirer)

// besoins
router.post('/:id/besoin/creer', requireAuth, needController.postAjouterBesoin)
router.put('/:id/besoin/:idbesoin/modifier', requireAuth, needController.putModifierBesoin)
router.post('/:id/besoin/:idbesoin/supprimer', requireAuth, needController.postSupprBesoin)
router.get('/:id/besoin/:idbesoin', requireAuth, needController.getBesoin)
router.get('/:id/besoins', requireAuth, needController.getListeBesoins)
router.post('/:id/besoin/proposer', requireAuth, needController.postProposerBesoin)

module.exports = router;