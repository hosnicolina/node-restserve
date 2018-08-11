// puerto
require("./config/config");

const express = require("express");
const mongoose = require("mongoose");
const path = require('path')

const app = express();

const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// habilitar el directorio publico
app.use(express.static(path.resolve(__dirname,"../public")));

//configuracion global de ruta

app.use(require("./routes/index"));

mongoose.connect(
  process.env.URLDB,
  { useNewUrlParser: true },
  (err, res) => {
    if (err) throw new err();
    console.log("Base de datos online");
  }
);

app.listen(process.env.PORT, () => {
  console.log("Escuchando el puerto: " + process.env.PORT);
});
