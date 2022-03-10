const cbEvenement = require("./serveur/evenement") //callback evenement
const cbCompte = require("./serveur/compte")
const cbBesoin = require("./serveur/besoin");
const cbRecup = require("./serveur/recupMdp")
const session = require('express-session')
const express = require('express')
const { NULL } = require("mysql/lib/protocol/constants/types")
const { sendStatus } = require("express/lib/response")
const path = require("path")
const multer = require('multer')
const upload = multer({ dest: './images' })
const fs = require("fs")

const app = express()
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {},
    loggedin: false,
    email: undefined,
    uid: undefined
}));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const port = 5000;

//routage

//***************modifier evenement**************************
app.get('/api/evenement/modifier/:id', async (req, res) => {
    //parametre id
    let data = await cbEvenement.getEvenement(req.params.id)
    if (data == -1) res.sendStatus(500)
    else if (data == -2) res.sendStatus(404)
    else res.json(data)
})

app.put('/api/evenement/modifier/:id', async (req, res) => {
    let result = await cbEvenement.putEvenementModification(req.body, req.params.id)
    if (result == -1) res.sendStatus(500)
    else res.sendStatus(200)
})
//*************************************************************

//créer evenement
app.post('/api/evenement/creer', async (req, res) => {
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
app.get('/api/evenement/:id', async (req, res) => {
    let data = await cbEvenement.getEvenement(req.params.id)
    if (data == -1) res.sendStatus(500)
    else if (data == -2) res.sendStatus(404)
    else res.json(data)
})

// ***********Consulter ses événements******
//Retourne les id des événements auquel participe un compte
app.get('/api/evenement/consulter/:id', async (req, res) => {
    let data = await cbEvenement.getEvenementConsultation(req.params.id)
    console.log(data)
    if (data == -1) res.sendStatus(500)
    else if (data == -2) res.sendStatus(404)
    else res.json(data)
})
// **********Supprimer événement **************
app.put('/api/evenement/supprimer', async (req, res) => {
    let result = await cbEvenement.supprEvenement(req.body.id_evenement, req.session.uid)
    if (result == -1) res.sendStatus(500)
    else if (result == -2) res.status(404).send("Le compte n'est pas propriétaire")
    else res.sendStatus(200)
})

//se connecter
app.post('/api/compte/connexion', async (req, res) => {
    //console.log(req.body);
    let data = await cbCompte.getCompteConnexion(req.body.email, req.body.mot_de_passe)
    if (data == -1) res.status(404).send("Adresse mail/mot de passe incorrect")
    else if (data == -2) res.sendStatus(500)
    else {
        //console.log(data)
        req.session.loggedin = true;
        req.session.email = data.email;
        req.session.uid = data.id_compte;
        console.log(req.session);
        res.sendStatus(200)
    }
})

app.post('/api/compte/deconnexion', async (req, res) => {

    if (req.session == false) return res.sendStatus(500)


    req.session.loggedin = false
    req.session.uid = undefined
    req.session.email = undefined

    return res.sendStatus(200)
})

//********************modifier compte*************
app.get('/api/compte/modifier/:id', async (req, res) => {
    //console.log("yop")
    //parametre id
    let data = await cbCompte.getCompte(req.params.id)
    if (data == -1) res.sendStatus(500)
    else res.json(data)
})

app.put('/api/compte/modifier/:id', async (req, res) => {
    let result = await cbCompte.putCompteModification(req.body, req.params.id)
    if (result == -1) res.sendStatus(500)
    else res.sendStatus(200)
})
//************************************************


//********************supprimer compte*************
app.get('/api/compte/supprimer/:id', async (req, res) => {
    console.log("yop")
    //parametre id
    let data = await cbCompte.getCompte(req.params.id)
    if (data == -1) res.sendStatus(500)
    else res.sendStatus(200)
})

app.put('/api/compte/supprimer/:id', async (req, res) => {
    let result = await cbCompte.supprCompte(req.params.id)
    if (result == -1) res.sendStatus(500)
    res.sendStatus(200)
})
//************************************************

//****************recup mot de passe**************
app.get('/api/compte/recup/:id', async (req, res) => {
    //parametre id
    let data = await cbRecup.getStartRecuperation(req.params.id)
    if (data == -1) res.sendStatus(500)
    else res.json(data)
})

app.put('/api/compte/recup/:id', async (req, res) => {
    let result = await cbRecup.putStartRecuperation(req.params.id, req.body.lien)
    if (result == -1) res.sendStatus(500)
    else res.sendStatus(200)
})
//************************************************

//****************changement mot de passe**************
app.put('/api/compte/recup/:id/:token', async (req, res) => {
    let result = await cbRecup.putResetMdp(req.params.id, req.params.token, req.body)
    if (result == -1) res.sendStatus(500)
    else res.sendStatus(200)
})
//************************************************


//********************* inscription ***************************
app.post('/api/compte/inscription', async (req, res) => {
    let data = await cbCompte.postInscription(
        req.body.nom,
        req.body.prenom,
        req.body.email,
        req.body.mot_de_passe,
        req.body.naissance,
        req.body.ville,
        req.body.departement,
        req.body.no_telephone,
        req.body.img_profil)
    if (data == -1) res.status(400).send("email already exists")
    else if (data == -2) res.sendStatus(500)
    else {
        /*console.log(req.file)
        const tempPath = req.file.path
        const targetPath = path.join(__dirname, "./images/" + req.body.img_profil);
        fs.rename(tempPath, targetPath)*/
        res.sendStatus(200)
    }
})
//**************************************************************** */

//********************* besoins ***************************
app.post('/api/evenement/:id/besoin/creer', async (req, res) => {

    let data = await cbBesoin.postAjouterBesoin(req.params.id, req.body)
    if (data == -1) return res.status(400)
    else return res.sendStatus(200)
})

app.put('/api/evenement/:id/besoin/:idbesoin/modifier', async (req, res) => {

    let data = await cbBesoin.putModifierBesoin(req.params.idbesoin, req.params.id, req.body)
    if (data == -1) return res.status(400)
    else return res.sendStatus(200)
})

app.post('/api/evenement/:id/besoin/:idbesoin/supprimer', async (req, res) => {

    let data = await cbBesoin.postSupprBesoin(req.params.idbesoin, req.params.id, req.session.uid)

    if (data == -1) { res.sendStatus(400) } else if (data == -2) { res.sendStatus(401) } else res.sendStatus(200)
})
//**************************************************************** */


app.listen(port, () => console.log(`Server started on port ${port}`));