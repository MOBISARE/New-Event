const cbEvenement = require("./serveur/evenement")

const express = require('express');

const app = express();

const port = 5000;

//routage

//modifier evenement
app.get('/evenement/modifier/:id', (req, res) => {
    cbEvenement.getEvenementModification(req, res)
})

//créer evenement
app.get('/evenement/creer/:id', (req, res)=>{
    cbEvenement.getEvenementCreation(req, res)
})

app.post('/evenement/modifier/:id', (req, res) => {
    //recupere information du formulaire

    //enregistre les modifications
})

app.listen(port, () => console.log(`Server started on port ${port}`));