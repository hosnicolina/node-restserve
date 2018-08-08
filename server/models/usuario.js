const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol valido"
};

let usurioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, " El nombre es necesrio"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El email es requerido"]
  },
  password: {
    type: String,
    required: [true, "El password es requerido"]
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

usurioSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

usurioSchema.plugin(uniqueValidator, {
  message: "El {PATH} tiene que ser unico"
});

module.exports = mongoose.model("Usuario", usurioSchema);
