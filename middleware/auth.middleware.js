const jwt = require("jsonwebtoken");
const compte = require("../serveur/compte")

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (token) {
    
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await compte.getCompte(decodedToken.id);
        if(user == -1 || user == -2) user = null;
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.status(400).json('no token')
      } else {
        next();
      }
    });
  } else {
    //console.log('No token');
    res.status(400).json('no token');
  }
};