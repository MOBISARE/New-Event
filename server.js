const cbEvenement = require("./controllers/evenement") //callback evenement
const cbCompte = require("./controllers/compte")
const cbBesoin = require("./controllers/besoin");
const cbRecup = require("./controllers/recupMdp")
const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");

require('dotenv').config({ path: './config/.env' });
const cors = require('cors');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const session = require('express-session')
const express = require('express')
const path = require("path")

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

app.use('/api/compte', userRoutes);
app.use('/api/evenement', eventRoutes);

// V V V V V V V Doit être déplacé vers les routeurs (voir './routes') V V V V V V V V

//routage

app.get('/api/images/:name', async(req, res) => {
    res.type('image/jpeg').sendFile(path.join(__dirname, "./images/" + req.params.name));
});

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




//se connecter




//********************modifier compte*************
//app.get('/api/compte/modifier/:id', requireAuth, cbCompte.getCompte)

app.put('/api/compte/modifier/:id', requireAuth, cbCompte.putCompteModification)
    //************************************************


//********************supprimer compte*************
//app.get('/api/compte/supprimer/:id', requireAuth, cbCompte.getCompte)

app.put('/api/compte/supprimer/:id', requireAuth, cbCompte.supprCompte)
    //************************************************

//**********se retirer d'un evenement*************


//************************************************************


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

    //**************************************************************** */

//********************* besoins ***************************

    //**************************************************************** */


app.listen(port, () => console.log(`Server started on port ${port}`));