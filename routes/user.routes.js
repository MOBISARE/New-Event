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
router.post('/inscription', upload.single('img_profil'), authController.register);
router.post('/deconnexion', authController.logout);

// user
router.get('/mes-evenements', requireAuth, eventController.getMesEvenements);
router.get('/mes-participations', requireAuth, eventController.getMesParticipations);

router.put('/modifier', requireAuth, upload.single('img_profil'), userController.putCompteModification);
router.put('/modifierMdp', requireAuth, userController.putMDPModification)
router.put('/supprimer', requireAuth, userController.supprCompte);

router.post('/recupmdp', recupController.postStartRecuperation)
router.post('/checkToken', recupController.checkRecuperation)
router.put('/modifieMdp', recupController.putResetMdp)

module.exports = router;