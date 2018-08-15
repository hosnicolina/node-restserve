const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

const fs = require("fs");
const path = require("path");

// default options
app.use(fileUpload());

app.put("/uploads/:tipo/:id", (req, res) => {
  let { tipo, id } = req.params;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha selecionndo ningun archivo"
      }
    });
  }
  console.log(tipo);
  validarTipo = ["productos", "usuarios"];

  if (validarTipo.indexOf(tipo) < 0) {
    return res.status(403).json({
      ok: false,
      err: {
        message: "tipo no permitido"
      }
    });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split(".");
  let extension = nombreCortado[nombreCortado.length - 1];

  //Extension permitida
  let extensionesPermitidas = ["jpg", "png", "gif", "jpeg"];

  if (extensionesPermitidas.indexOf(extension) < 0) {
    return res.status(403).json({
      ok: false,
      err: {
        message: "archivo no permitido"
      }
    });
  }

  //Cambiar nombre al archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    //Aqui mi imagen cargada
    if (tipo === "usuarios") {
      imgUsuario(id, res, nombreArchivo, tipo);
    } else {
      imgProducto(id, res, nombreArchivo, tipo);
    }
  });
});

function imgProducto(id, res, nombreArchivo, tipo) {
  Producto.findById(id,(err, productoDB) => {
    if (err) {
      borrarArchivo(tipo, nombreArchivo);
      return res.status(403).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      borrarArchivo(tipo, nombreArchivo);
      return res.status(400).json({
        ok: false,
        err: {
          message: "Producto no existe"
        }
      });
    }

    borrarArchivo(tipo,productoDB.img)

    productoDB.img = nombreArchivo

    productoDB.save((err,productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      res.json({ ok: true, producto: productoGuardado });
    })

  });
}

function imgUsuario(id, res, nombreArchivo, tipo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(tipo, nombreArchivo);
      return res.status(403).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB) {
      borrarArchivo(tipo, nombreArchivo);
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no existe"
        }
      });
    }

    borrarArchivo(tipo, usuarioDB.img);

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(403).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      });
    });
  });
}

function borrarArchivo(tipo, NombreImagen) {
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${NombreImagen}`
  );

  try {
    if (fs.statSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  } catch (err) {

  }


}

module.exports = app;
