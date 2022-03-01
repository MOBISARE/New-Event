const DB = require("./db").DB
var async = require('async')

async function getEvenement(id) {
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

function getEvenementCreation(id) {
    return {
        "bleg": id
    }
}

module.exports.getEvenement = getEvenement
module.exports.putEvenementModification = putEvenementModification
module.exports.getEvenementCreation = getEvenementCreation