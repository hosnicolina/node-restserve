const express = require("express");

let { verificaToken, verificaAdminRole } = require("../middlewares/auth");

let app = express();

let Categoria = require("../models/categoria");

// Mostrar todas las categorias
app.get("/categoria", verificaToken, (req, res) => {
  Categoria.find({})
  .sort('descripcion')
  .populate('usuario','nombre email')
  .exec((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(404).json({
        ok: false,
        err: {
          message: "no se encontraron categorias"
        }
      });
    } else {
      res.json({
        ok: true,
        categorias: categoriaDB
      });
    }
  });
});

//Mostrar una categoria por ID

app.get("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err: {
          message: "no se encontraron categorias"
        }
      });
    }

    if (!categoriaDB) {
      return res.status(404).json({
        ok: false,
        err: {
          message: "Id no es correcto"
        }
      });
    } else {
      res.json({
        ok: true,
        categorias: categoriaDB
      });
    }
  });
});

//Crear nueva categoria

app.post("/categoria", verificaToken, (req, res) => {
  let descripcion = req.body.descripcion;
  let { _id: usuario } = req.usuario;

  let categoria = new Categoria({
    descripcion,
    usuario
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

//Actualizar categoria

app.put("/categoria/:id", [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;
  let descripcion = req.body.descripcion;

  Categoria.findByIdAndUpdate(
    id,
    { descripcion },
    { new: true, runValidators: true, context: "query" },
    (err, categoriaDB) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
      if (!categoriaDB) {
        return res.status(404).json({
          ok: false,
          err: {
            message: "El id no existe"
          }
        });
      }
      res.json({
        ok: true,
        categoria: categoriaDB
      });
    }
  );
});

//Actualizar categoria

app.delete("/categoria/:id", [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;
  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(404).json({
        ok: false,
        err: {
          message: "El id no existe"
        }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

module.exports = app;
