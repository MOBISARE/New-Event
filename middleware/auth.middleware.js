const jwt = require("jsonwebtoken")
const DB = require("../controllers/db").DB

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (token) {

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        try {
          let user = await DB.query('SELECT * FROM compte WHERE id_compte = ?', [decodedToken.id]);
          user = user[0];

          res.locals.user = user;
          next();
        }
        catch (err) {
          res.locals.user = null;
          next();
        }
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