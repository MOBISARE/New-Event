const path = require("path");

module.exports.getImage = async(req, res) => {
    res.type('image/jpeg').sendFile(path.join(__dirname, "../upload/" + req.params.name));
}