const express = require("express");
const Usuario = require("../models/usuario");
const _ = require("underscore");

const app = express();

const bcrypt = require("bcrypt");

app.get("/usuario", function(req, res) {
  let from = Number(req.query.from) || 0;
  let page = Number(req.query.per_page) || 5;

  Usuario.find({estado:true}, "nombre email role estado img")
    .limit(page)
    .skip(from)
    .exec((err, usuariosDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Usuario.count({estado:true}, (err, conteo) => {
        res.json({
          ok: true,
          usuarios: usuariosDB,
          cantidad: conteo
        });
      });
    });
});

app.post("/usuario", function(req, res) {
  body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});

app.put("/usuario/:id", function(req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true , context: 'query'},
    (err, usuarioUD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        usuario: usuarioUD
      });
    }
  );
});

app.delete("/usuario/:id", function(req, res) {
  let id = req.params.id;

  Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      // if (!usuarioDB) {
      //   return res.status(400).json({
      //     ok: false,
      //     err: {
      //       message:'usuario no encontrado'
      //     }
      //   });
      // }
      res.json({
        ok: true,
        usuarioDB
      });
    }
  );
});

module.exports = app;
