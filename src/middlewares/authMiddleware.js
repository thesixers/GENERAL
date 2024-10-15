const jwt = require("jsonwebtoken");
const vendor = require('../models/user')

const checkVendor = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token || token === undefined) {
    return res.redirect("/login");
  }

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async(error, decodedToken) => {
      if (error) {
        if (error.message === "jwt expired") {
          return res.redirect("/login");
        }
        return res.redirect("/login");
      } else {
        const _vendor = await vendor.findOne({_id: decodedToken.id})
        console.log(_vendor);
        
        if (_vendor) {
          req.vendor = decodedToken.id;
          res.locals._vendor = _vendor;
        
        }
        next();
      }
    });
  } else {
    return res.redirect("/login");
  }
};

module.exports = { checkVendor };
