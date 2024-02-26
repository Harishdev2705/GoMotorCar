const { Unauthorized } = require("../utility/apiError");

function checkRole(roles) {
  return function (req, res, next) {
    if (!roles.includes(req.decoded.role))
      throw new Unauthorized("Unauthenticated user role");
    else next();
  };
}

function requireRole(req, res, next) {
  if (!req.decoded.role)
    throw new Unauthorized("Unauthenticated user role");
  else next();
}

module.exports = { checkRole, requireRole };
