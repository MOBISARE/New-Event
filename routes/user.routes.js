const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: './upload' });

const { checkUser, requireAuth } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const eventController = require('../controllers/event.controller');
const recupController = require('../controllers/recup.controller');

router.get('/', requireAuth, userController.getMonCompte);

// authentification
router.post('/connexion', authController.login);
router.post('/inscription', authController.register);
router.post('/deconnexion', authController.logout);

// user
router.get('/recherche/:search', requireAuth, userController.rechercheUtilisateur);

router.get('/mes-evenements', requireAuth, eventController.getMesEvenements);
router.get('/mes-participations', requireAuth, eventController.getMesParticipations);

router.put('/modifier/:id', requireAuth, userController.putCompteModification);
router.put('/supprimer/:id', requireAuth, userController.supprCompte);

router.post('/recupmdp', recupController.postStartRecuperation)
router.get('/recupmdp', recupController.getStartRecuperation)
router.put('/recupmdp/:token', recupController.putResetMdp)

module.exports = router;