const cbEvenement = require("./serveur/evenement") //callback evenement
const cbCompte = require("./serveur/compte")
const cbBesoin = require("./serveur/besoin");
const cbRecup = require("./serveur/recupMdp")

require('dotenv').config({ path: './config/.env' });
const cors = require('cors');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const session = require('express-session')
const express = require('express')
const { NULL } = require("mysql/lib/protocol/constants/types")
const { sendStatus } = require("express/lib/response")
const path = require("path")
const multer = require('multer')
const upload = multer({ dest: './images' })
const fs = require("fs")

const { checkUser, requireAuth } = require('./middleware/auth.middleware');

const app = express()

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}
app.use(cors(corsOptions));


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {},
    loggedin: false,
    email: undefined,
    uid: undefined
}));
app.use(cookieParser());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const port = 5000;

app.get('*', checkUser);
app.post('*', checkUser);
app.put('*', checkUser);
app.get('/api/jwtid', requireAuth, (req, res) => {
    res.status(200).json(req.cookies.jwt)
});

//routage

app.get('/api/images/:name', async(req, res) => {
    res.type('image/jpeg').sendFile(path.join(__dirname, "./images/" + req.params.name));
});

//***************modifier evenement**************************
app.get('/api/evenement/modifier/:id', requireAuth, cbEvenement.getEvenement)

//app.put('/api/evenement/modifier/:id', requireAuth, cbEvenement.putEvenementModification)

app.put('/api/evenement/modifier/:id', requireAuth, upload.single('img_banniere'), cbEvenement.saveEvent);
app.post('/api/evenement/publier/:id', requireAuth, cbEvenement.publishEvent);
//*************************************************************

//créer evenement
//requireAuth verifie token connexion
//si pas token, requete avortée
app.put('/api/evenement/creer', requireAuth, cbEvenement.createEvent);

app.post('/api/evenement/creer', async(req, res) => {
    let result = await cbEvenement.putEvenementCreation(
        req.body.titre,
        req.body.description,
        req.body.departement,
        req.body.debut,
        req.body.fin,
        req.body.archivage,
        req.body.etat,
        req.body.img_banniere,
        req.session.uid)
    if (result == -1) res.sendStatus(500)
    else res.sendStatus(200)
})

// *********** Afficher un événement ***********************
app.get('/api/evenement/:id', cbEvenement.getEvenement);

app.get('/api/mes-evenements', requireAuth, cbEvenement.getMesEvenements);
app.get('/api/mes-participations', requireAuth, cbEvenement.getMesParticipations);

// ***********Consulter ses événements******
//Retourne les id des événements auquel participe un compte
app.get('/api/evenement/consulter/:id', async(req, res) => {
        let data = await cbEvenement.getEvenementConsultation(req.params.id)
        console.log(data)
        if (data == -1) res.sendStatus(500)
        else if (data == -2) res.sendStatus(404)
        else res.json(data)
    })
    // **********Supprimer événement **************
app.put('/api/evenement/supprimer', async(req, res) => {
    let result = await cbEvenement.supprEvenement(req.body.id_evenement, req.session.uid)
    if (result == -1) res.sendStatus(500)
    else if (result == -2) res.status(404).send("Le compte n'est pas propriétaire")
    else res.sendStatus(200)
})

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};


//se connecter
app.post('/api/compte/connexion', async(req, res) => {

    let data = await cbCompte.getCompteConnexion(req.body.email, req.body.mot_de_passe)
    if (data == -1) res.status(400).send("Adresse mail/mot de passe incorrect")
    else if (data == -2) res.sendStatus(400)
    else {
        const token = createToken(data.id_compte);
        res.cookie('jwt', token, { httpOnly: true, maxAge });
        res.sendStatus(200);
    }
})

app.post('/api/compte/deconnexion', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.sendStatus(200);
})

//********************modifier compte*************
app.get('/api/compte/modifier/:id', async(req, res) => {
    let data = await cbCompte.getCompte(req.params.id)
    if (data == -1) res.sendStatus(500)
    else res.json(data)
})

app.put('/api/compte/modifier/:id', async(req, res) => {
        let result = await cbCompte.putCompteModification(req.body, req.params.id)
        if (result == -1) res.sendStatus(500)
        else res.sendStatus(200)
    })
    //************************************************


//********************supprimer compte*************
app.get('/api/compte/supprimer/:id', async(req, res) => {
    let data = await cbCompte.getCompte(req.params.id)
    if (data == -1) res.sendStatus(500)
    else res.sendStatus(200)
})

app.put('/api/compte/supprimer/:id', async(req, res) => {
        let result = await cbCompte.supprCompte(req.params.id)
        if (result == -1) res.sendStatus(500)
        res.sendStatus(200)
    })
    //************************************************

//****************recup mot de passe**************
app.get('/api/compte/recup/:id', async(req, res) => {
    //parametre id
    let data = await cbRecup.getStartRecuperation(req.params.id)
    if (data == -1) res.sendStatus(500)
    else res.json(data)
})

app.put('/api/compte/recup/:id', async(req, res) => {
        let result = await cbRecup.putStartRecuperation(req.params.id, req.body.lien)
        if (result == -1) res.sendStatus(500)
        else res.sendStatus(200)
    })
    //************************************************

//****************changement mot de passe**************
app.put('/api/compte/recup/:id/:token', async(req, res) => {
        let result = await cbRecup.putResetMdp(req.params.id, req.params.token, req.body)
        if (result == -1) res.sendStatus(500)
        else res.sendStatus(200)
    })
    //************************************************


//********************* inscription ***************************
app.post('/api/compte/inscription', cbCompte.postInscription)
    //**************************************************************** */

//********************* besoins ***************************
app.post('/api/evenement/:id/besoin/creer', requireAuth, cbBesoin.postAjouterBesoin)

app.put('/api/evenement/:id/besoin/:idbesoin/modifier', requireAuth, cbBesoin.putModifierBesoin)

app.post('/api/evenement/:id/besoin/:idbesoin/supprimer', async(req, res) => {

    let data = await cbBesoin.postSupprBesoin(req.params.idbesoin, req.params.id, req.session.uid)

    if (data == -1) { res.sendStatus(400) } else if (data == -2) { res.sendStatus(401) } else res.sendStatus(200)
})

app.get('/api/evenement/:id/besoin/:idbesoin', async(req, res) => {

    let data = await cbBesoin.getBesoin(req.params.idbesoin, req.params.id)

    if (data == -1) { res.sendStatus(400) } else if (data == -2) { res.sendStatus(404) } else res.json(data)
});
//**************************************************************** */


app.listen(port, () => console.log(`Server started on port ${port}`));