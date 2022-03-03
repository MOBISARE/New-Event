const cbEvenement = require("./serveur/evenement")  //callback evenement
const cbCompte = require("./serveur/compte")

const express = require('express')

const app = express()
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
    else res.redirect('/api/evenement/modifier/' + req.params.id)
})

//*************************************************************

//créer evenement
//Je n'ai aucune idée de si ça marche 
app.get('/api/evenement/creer/:id', async (req, res) => {
    //parametre id
    console.log("bleg")
    let data = await cbEvenement.getEvenementCreation(req.params.body)

    if (data == -1) res.sendStatus(500)
    else res.json(data)
})

app.put('/api/evenement/creer/:id', async (req, res) => {
    let result = await cbCompte.putEvenementCreation(req.body, req.params.id)
    if (result == -1) res.sendStatus(500)
    else res.redirect('/api/compte/creer/' + req.params.id)
})


// ***********Consulter ses événements******
app.get('api/evenement/consult/:id', async (req, res) => {
    let data = await cbEvenement.getEvenementConsultation(req.params.body)

    //Retourne les id de tout les événements où il participe
    //J'sais pas si il faut retourner juste les id ou le contenu de tout les événements
    if (data == -1) res.sendStatus(500)
    else if (data == -2) res.sendStatus(404)
    else res.json(data)
})

//se connecter
app.get('api/compte/connexion/:id', (req, res) => {
    //parametre id
    data = cbCompte.getCompteConnexion(req.params.id)
    //envoie les donnees
    console.log(data)
    res.json(data)
})

//********************modifier compte*************
app.get('/api/compte/modifier/:id', async (req, res) => {
    console.log("yop")
    //parametre id
    let data = await cbCompte.getCompte(req.params.id)
    if (data == -1) res.sendStatus(500)
    else res.json(data)
})

app.put('/api/compte/modifier/:id', async (req, res) => {
    let result = await cbCompte.putCompteModification(req.body, req.params.id)
    if (result == -1) res.sendStatus(500)
    else res.redirect('/api/compte/modifier/' + req.params.id)
})
//************************************************


//********************supprimer compte*************
app.get('/api/compte/supprimer/:id', async (req, res) => {
    console.log("yop")
    //parametre id
    let data = await cbCompte.getCompte(req.params.id)
    if (data == -1) res.sendStatus(500)
    else res.json(data)
})

app.put('/api/compte/supprimer/:id', async (req, res) => {
    let result = await cbCompte.supprCompte(req.params.id)
    if (result == -1) res.sendStatus(500)
    else res.redirect('/api/compte/supprimer/' + req.params.id)
})
//************************************************



app.listen(port, () => console.log(`Server started on port ${port}`));