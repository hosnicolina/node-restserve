const express = require("express");
const fs = require("fs");
const path = require("path");

const { verificaTokenImg } = require('../middlewares/auth')

const app = express();

app.get("/imagen/:tipo/:img",verificaTokenImg, (req, res) => {
  let tipo = req.params.tipo;
  let img = req.params.img;

  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

  try {
    if (fs.statSync(pathImagen)) {
      res.sendFile(pathImagen);
    }
  } catch (err) {
    let noImagenPath = path.resolve(__dirname, "../assets/no-image.jpg");
    res.sendFile(noImagenPath);
  }
});

module.exports = app;
