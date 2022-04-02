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
router.put('/proposermodifier/:id', requireAuth, upload.single('img_banniere'), eventController.proposeToSaveEvent);
router.post('/publier/:id', requireAuth, eventController.publishEvent);
router.post('/supprimer/:id', requireAuth, eventController.supprEvenement);
router.post('/archiver/:id', requireAuth, eventController.archiveEvent);

router.put('/rejoindreEve/:id', requireAuth, eventController.ajouterParticipant)
router.post('/demanderRejoindreEve/:id', requireAuth, eventController.demanderRejoindreEve)
router.post('/seretirer/:id', requireAuth, eventController.seRetirer)
router.get('/inviter/m1/:id', requireAuth, eventController.getInviterParticipantMethode1)
router.get('/inviter/m2/:id', requireAuth, eventController.getInviterParticipantMethode2)

router.post('/:id/inviter/:email', requireAuth, eventController.postInviterParticipant)

// besoins
router.post('/:id/besoin/creer', requireAuth, needController.postAjouterBesoin)
router.put('/:id/besoin/:idbesoin/modifier', requireAuth, needController.putModifierBesoin)
router.post('/:id/besoin/:idbesoin/supprimer', requireAuth, needController.postSupprBesoin)
router.get('/:id/besoin/:idbesoin', requireAuth, needController.getBesoin)
router.get('/:id/besoins', requireAuth, needController.getListeBesoins)
router.post('/:id/besoin/proposer', requireAuth, needController.postProposerBesoin)
router.post('/:id/besoin/:idbesoin/demande/suppression', requireAuth, needController.postProposerSupprBesoin)

module.exports = router;