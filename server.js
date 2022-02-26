const cbEvenement = require("./serveur/evenement")  //callback evenement
const cbCompte = require("./serveur/compte")

const express = require('express');

const app = express();

const port = 5000;

//routage

//***************modifier evenement**************************
app.get('/api/evenement/modifier/:id', (req, res) => {
    //parametre id
    cbEvenement.getEvenementModification(req.params.id, res)
    //envoie les donnees
    //res.json(data)
})

app.post('api/evenement/modifier/:id', (req, res) => {
    //recupere information du formulaire

    //enregistre les modifications
})

//*************************************************************

//créer evenement
app.get('/api/evenement/creer/:id', (req, res) => {
    //parametre id
    data = cbEvenement.getEvenementCreation(req.params.id)
    //envoie les donnees
    console.log(data)
    res.json(data)
    app.get('/evenement/modifier/:id', (req, res) => {
        cbEvenement.getEvenementModification(req, res)
    })
})

//se connecter
app.get('api/compte/connexion/:id', (req, res)=>{
    //parametre id
    data = cbCompte.getCompteConnexion(req.params.id)
    //envoie les donnees
    console.log(data)
    res.json(data)
})

app.listen(port, () => console.log(`Server started on port ${port}`));