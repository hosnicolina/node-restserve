const express = require("express");
const app = express();

const Producto = require("../models/producto");

let { verificaToken } = require("../middlewares/auth");

/**
 * buscar un producto
 */

app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino;

  let regex = new RegExp(termino, "i");

  Producto.find({ nombre: regex })
    .populate("categoria", "descripcion -_id")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(404).json({
          ok: false,
          err: {
            message: "No se encontraron coincidencia"
          }
        });
      }

      res.json({
        ok: true,
        productos: productoDB
      });
    });
});

/**
 * Obtener todos los prroductos
 */

app.get("/productos", verificaToken, (req, res) => {
  // trae todos los productos
  // populate usuario categoria
  // paginado
  let from = Number(req.query.from) || 0;
  let page = Number(req.query.per_page) || 5;
  Producto.find({ disponible: true })
    .limit(page)
    .skip(from)
    .populate("usuario", "nombre email -_id")
    .populate("categoria", "descripcion -_id")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(404).json({
          ok: false,
          err: {
            message: "No se encontraron prroductos"
          }
        });
      }

      Producto.count({ disponible: true }, (err, conteo) => {
        res.json({
          ok: true,
          productos: productoDB,
          cantidad: conteo
        });
      });
    });
});

/**
 * Obtener producto por ID
 */
app.get("/productos/:id", verificaToken, (req, res) => {
  id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email -_id")
    .populate("categoria", "descripcion -_id")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productoDB) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "producto no existe"
          }
        });
      }

      res.json({
        ok: true,
        producto: productoDB
      });
    });
});

/**
 * Crear un nuevo producto
 */

app.post("/productos", verificaToken, (req, res) => {
  //graba el usuario
  //grabar una categoria del listado que tenemos
  let body = req.body;
  let { _id: usuario } = req.usuario;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precio,
    descripcion: body.descripcion,
    categoria: body.categoria,
    disponible: body.disponible,
    usuario
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "producto no puedo ser creado"
        }
      });
    }

    res.json({
      ok: true,
      producto: productoDB
    });
  });
});

/**
 * Actualizar producto
 */

app.put("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let { _id: usuario } = req.usuario;
  let body = req.body;

  let productoUpdate = {
    nombre: body.nombre,
    precioUni: body.precio,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario
  };

  Producto.findByIdAndUpdate(id, productoUpdate, {
    new: true,
    runValidators: true
  })
    .populate("usuario", "nombre -_id")
    .populate("categoria", "descripcion -_id")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productoDB) {
        return res.status(404).json({
          ok: false,
          err: {
            message: "producto no existe"
          }
        });
      }

      res.json({
        ok: true,
        producto: productoDB
      });
    });
});

app.delete("/productos/:id", verificaToken, (req, res) => {
  // disponible pase a falso
  let id = req.params.id;

  let body = req.body;

  let productoUpdate = {
    disponible: false
  };

  Producto.findByIdAndUpdate(id, productoUpdate, {
    new: true,
    runValidators: true
  })
    .populate("usuario", "nombre -_id")
    .populate("categoria", "descripcion -_id")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productoDB) {
        return res.status(404).json({
          ok: false,
          err: {
            message: "producto no existe"
          }
        });
      }

      res.json({
        ok: true,
        producto: productoDB
      });
    });
});

module.exports = app;
