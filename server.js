const express = require('express');

const app = express();

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

//routage
app.get('/api/test', (req, res) => {
    const test = { id: "oui" };

    res.json(test);
})

//modifier evenement
app.get('/evenement/modifier/:id', (req, res) => {
    //recupere information de evenement

    //affiche le formulaire
})

app.post('/evenement/modifier/:id', (req, res) => {
    //recupere information du formulaire

    //enregistre les modifications
})