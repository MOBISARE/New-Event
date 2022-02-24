const cbEvenement = require("./serveur/evenement")

const express = require('express');

const app = express();

const port = 5000;

//routage

//modifier evenement
app.get('/api/evenement/modifier/:id', (req, res) => {
    //parametre id
    data = cbEvenement.getEvenementModification(req.params.id)
    //envoie les donnees
    res.json(data)
})

//créer evenement
app.get('api/evenement/creer/:id', (req, res)=>{
    //parametre id
    data = cbEvenement.getEvenementCreation(req.params.id)
    //envoie les donnees
    console.log(data)
    res.json(data)
})

app.post('api/evenement/modifier/:id', (req, res) => {
    //recupere information du formulaire

    //enregistre les modifications
})

app.listen(port, () => console.log(`Server started on port ${port}`));