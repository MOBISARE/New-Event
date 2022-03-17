const bcrypt = require('bcrypt')

const saltRounds = 10

async function hasherMotDePasse(mdp) {
    return await bcrypt.hash(mdp, saltRounds)
}

async function verifierMotDePasse(mdp, hash) {
    return await bcrypt.compare(mdp, hash)
}

module.exports.hasherMotDePasse = hasherMotDePasse
module.exports.verifierMotDePasse = verifierMotDePasse