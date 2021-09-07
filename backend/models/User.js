// pour créer un schéma de données qui contient les champs souhaités pour chaque utilisateur
const mongoose = require('mongoose'); // pour importer mongoose
const uniqueValidator = require('mongoose-unique-validator'); // pour importer le package de validation pour pré-valider les informations avant de les enregistrer

const userSchema = mongoose.Schema({ // on utilise la méthode Schema de Mongoose
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // pour appliquer le plugin au schéma 

// on exporte ce schéma en tant que modèle Mongoose
module.exports = mongoose.model('User', userSchema);