const cbEvenement = require("./serveur/evenement") //callback evenement
const cbCompte = require("./serveur/compte")

const express = require('express')

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const port = 5000;

//routage

//***************modifier evenement**************************
app.get('/api/evenement/modifier/:id', async (req, res) => {
    console.log("yop")
    //parametre id
    let data = await cbEvenement.getEvenement(req.params.id)
    if (data == -1) res.sendStatus(500)
    else if (data == -2) res.sendStatus(404)
    else res.json(data)
})

app.put('/api/evenement/modifier/:id', async (req, res) => {
    let result = await cbEvenement.putEvenementModification(req.body, req.params.id)
    if (result == -1) res.sendStatus(500)
    else res.redirect('/api/evenement/modifier/' + req.params.id)
})

//*************************************************************

//créer evenement
app.get('/api/evenement/creer/:id', async (req, res) => {
    //parametre id
    console.log("bleg")
    data = cbEvenement.getEvenementCreation(req.body)
    //envoie les donnees
    console.log(data)
    res.json(data)
})

//se connecter
app.get('/api/compte/connexion/:id', (req, res) => {
    //parametre id
    data = cbCompte.getCompteConnexion(req.params.id)
    //envoie les donnees
    console.log(data)
    res.json(data)
})

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
    if (data == -1) res.status(500).send("email already exists")
    else if (data == -2) res.sendStatus(500)
    else res.sendStatus(200)
})

app.listen(port, () => console.log(`Server started on port ${port}`));