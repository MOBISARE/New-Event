const cbEvenement = require("./serveur/evenement")  //callback evenement

const express = require('express')

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const port = 5000;

//routage

//***************modifier evenement**************************
app.get('/api/evenement/modifier/:id', (req, res) => {
    //parametre id
    cbEvenement.getEvenementModification(req.params.id, res)
})

app.put('/api/evenement/modifier/:id', (req, res) => {
    cbEvenement.putEvenementModification(req.body, req.params.id, res)
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

app.listen(port, () => console.log(`Server started on port ${port}`));