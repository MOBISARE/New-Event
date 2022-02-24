const cbEvenement = require("./serveur/evenement")

const express = require('express');

const app = express();

const port = 5000;

//routage

//modifier evenement
app.get('/evenement/modifier/:id', (req, res) => {
    //parametre id
    data = cbEvenement.getEvenementModification(req.params.id)
    //envoie les donnees
    res.json(data)
})

app.post('/evenement/modifier/:id', (req, res) => {
    //recupere information du formulaire

    //enregistre les modifications
})

app.listen(port, () => console.log(`Server started on port ${port}`));