const path = require("path");
const fs = require('fs');

module.exports.getImage = async(req, res) => {
    res.type('image/jpeg').sendFile(path.join(__dirname, "../upload/" + req.params.name));
}

module.exports.removeImage = (pathName) => {
    let sepPath = pathName.split("/");
    let name = sepPath[sepPath.length - 1];

    fs.unlinkSync(path.join(__dirname, "../upload/" + name))
}