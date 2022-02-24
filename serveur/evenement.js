function getEvenementModification(id) {
    //recupere les donnees de l evenement
    return { "id": id }
}

function getEvenementCreation(id){
    return{
        "bleg":id
    }
}

module.exports.getEvenementModification = getEvenementModification