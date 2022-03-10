const DB = require("./db").DB
var async = require('async')

async function getEvenement(id) {
    console.log(id)
    let evenement;
    let participants = []
    let besoins = []
    try {
        // recupere les informations de l evenement
        evenement = await DB.query('SELECT evenement.id_evenement, titre, description, departement, debut, fin, archivage, etat, img_banniere, id_proprietaire '
            + 'FROM evenement '
            + 'WHERE id_evenement = ?', [id])

        evenement = evenement[0]

        let rows = []
        // recupere les participants de l evenement
        rows = await DB.query('SELECT id_compte FROM participant WHERE id_evenement = ?', [id])
        rows.forEach(e => {
            participants.push(e.id_compte)
        })

        // recupere les besoins de l evenement
        rows = await DB.query('SELECT id_besoin FROM besoin WHERE id_evenement = ?', [id])
        rows.forEach(e => {
            besoins.push(e.id_besoin)
        })
    } catch (err) {
        console.log(err)
        return -1           // erreur lors de l execution de la requete (500)
    }

    if (evenement == undefined) return -2       // evenement inconnu (404)
    else return {
        id: evenement.id_evenement,
        titre: evenement.titre,
        description: evenement.description,
        departement: evenement.departement,
        debut: evenement.debut,
        fin: evenement.fin,
        archivage: evenement.archivage,
        etat: evenement.etat,
        img_banniere: evenement.img_banniere,
        id_proprietaire: evenement.id_proprietaire,
        id_participants: participants,
        id_besoins: besoins
    }
}

async function putEvenementModification(body, id) {
    // comparer ancien et nouveau champs avant update ?
    let result = 0
    try {
        result = await DB.query('UPDATE evenement SET ? WHERE id_evenement = ?', [{
            titre: body.titre, description: body.description, departement: body.departement,
            debut: body.debut, fin: body.fin, archivage: body.archivage, etat: body.etat, img_banniere: body.img_banniere
        }, id])

        //la notification est envoyee a tous les particiapnts
        //si il y a une modification
        if (result.changedRows != 0) {
            let rows = await DB.query('SELECT id_compte FROM participant WHERE id_evenement = ?', [id])
            rows.forEach(e => {
                DB.query('INSERT INTO notification SET ?', { type: 4, id_type: id, etat: 1, id_compte: e.id_compte })
            })
        }
    } catch (err) {
        console.log(err)
        return -1           // erreur lors de l execution de la requete (500)
    }
    return result.changedRows
}

async function getEvenementCreation(id) {
    let lastEvent;
    try {
        lastEvent = DB.query('SELECT MAX(evenement.id_evenement) FROM evenement')
        lastEvent = lastEvent[0]
        console.log("0")
    } catch (err) {
        console.log(err)
    }
    if (lastEvent == undefined) return { //Si c'est le premier événement à être créé
        id: 0,
        titre: null,
        description: null,
        departement: null,
        debut: null,
        fin: null,
        archivage: null,
        etat: null,
        img_banniere: null,
        id_proprietaire: null,
        id_participants: null,
        id_besoins: null
    }
    else return {
        id: lastEvent + 1,
        titre: null,
        description: null,
        departement: null,
        debut: null,
        fin: null,
        archivage: null,
        etat: null,
        img_banniere: null,
        id_proprietaire: null,
        id_participants: null,
        id_besoins: null
    }
}

async function putEvenementCreation(body, id) {
    let result = 0
    try {
        result = await DB.query('INSERT INTO evenement SET ?', [{
            id_evenement: id,
            titre: body.titre,
            description: body.description,
            departement: body.departement,
            debut: body.debut,
            fin: body.fin,
            archivage: body.archivage,
            etat: body.etat,
            img_banniere: body.img_banniere,
            id_proprietaire: body.id_proprietaire,
        }])
    } catch (err) {
        console.log(err)
        return -1
    }
    return result.changedRows
}

<<<<<<< HEAD
async function getIdEvenementConsultation(id){
=======
async function getEvenementConsultation(id) {
>>>>>>> b3db64ccf0b32c4d1cb1aaafd59de4600001acc0
    let evenements = []
    //titre image description 
    try {
        let rows = []
<<<<<<< HEAD
            // recupere les participants de l evenement
            rows = await DB.query('SELECT e.id_evenement, e.titre, e.description, e.departement, e.debut, e.fin, e.img_banniere FROM evenement e, participant p WHERE e.id_evenement=p.id_evenement AND p.id_compte=?', [id])
            rows.forEach(e => {
                evenements.push(e)
            })
    } catch (err){
=======
        // recupere les participants de l evenement
        rows = await DB.query('SELECT id_evenement FROM participant WHERE id_compte = ?', [id])
        rows.forEach(e => {
            evenements.push(e.id_evenement)
        })
    } catch (err) {
>>>>>>> b3db64ccf0b32c4d1cb1aaafd59de4600001acc0
        console.log(err)
        return -1
    }
    if (evenements.length == 0) return -2
    else return evenements
}

async function getInfoEvenementConsultation(id){
    let infos;
    try{
        infos = await DB.query("SELECT * FROM evenement WHERE id_evenement=?", id)
    } catch(err){
        return -1
    }
    return infos
}

module.exports.getEvenement = getEvenement
module.exports.putEvenementModification = putEvenementModification
module.exports.getEvenementCreation = getEvenementCreation
module.exports.putEvenementCreation = putEvenementCreation
module.exports.getEvenementConsultation = getIdEvenementConsultation
module.exports.getInfoEvenementConsultation = getInfoEvenementConsultation
