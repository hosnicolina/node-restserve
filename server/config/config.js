/**
 * Puerto
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/**
 * Vencimiento del token
 *
 */

 process.env.CADUCIDAD_TOKEN = '48h';

 /**
  * SEED de autenticacion
  */

 process.env.CLIENT_ID = process.env.CLIENT_ID ||'570722307797-lkutu98e7pgllj2bib2t09hv035sllf2.apps.googleusercontent.com';

  /**
  * Google client id
  */

 process.env.SEED = process.env.SEED ||'este-es-el-seed-desarrollo';

/**
 * Base de datos
 */

let urlDB;
if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB = process.env.MONGO_URi;
}

process.env.URLDB = urlDB;
