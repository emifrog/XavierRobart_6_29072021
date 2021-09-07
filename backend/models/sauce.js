// pour créer un schéma de données qui contient les champs souhaités pour chaque sauce
const mongoose = require('mongoose'); // pour importer mongoose

const sauceSchema = mongoose.Schema({ // on utilise la méthode Schema de Mongoose
  userId: { type: String },
  name: { type: String },
  manufacturer: { type: String },
  description: { type: String },
  mainPepper: { type: String },
  heat: { type: Number },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0},
  usersLiked: { type: Array, default: [] },
  usersDisliked: { type: Array, default: [] },
});

// on exporte ce schéma en tant que modèle Mongoose
module.exports = mongoose.model('Sauce', sauceSchema);