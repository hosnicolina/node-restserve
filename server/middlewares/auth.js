const jwt = require("jsonwebtoken");
/**
 * verificar token
 */

let verificaToken = (req, res, next) => {
  let token = req.get("token");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: "token no valido"
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

/**
 * verificar admin role
 */

let verificaAdminRole = (req, res, next) => {
  let { role } = req.usuario;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      ok: false,
      err: { message: "no tiene el permiso para esto" }
    });
  }else{
    next();
  }

};

/**
 * Verifica token img
 */

 let verificaTokenImg = (req, res, next) => {
  let token = req.query.token;

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: "token no valido"
      });
    }

    req.usuario = decoded.usuario;
    next();
  });

 }

module.exports = {
  verificaToken,
  verificaAdminRole,
  verificaTokenImg
};
