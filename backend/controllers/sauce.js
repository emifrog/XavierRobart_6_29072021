// importation du modèle mongoose pour l'utiliser dans l'appli
const Sauce = require('../models/Sauce');
const fs = require('fs'); // permet de modifier le systeme de fichier y compris les supprimer

// Permet de créer une nouvelle sauce

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);  //on stocke les donées envoyées pa le front
    delete sauceObject._id; // pour supprimer l'id envoyé par le frontend
    const sauce = new Sauce({
      ...sauceObject, // pour faire une copie de tous les éléments de req.body.sauce
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(sauce)
    sauce.save() // pour enregister la nouvelle sauce dans la base de données
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // On utilise la méthode findOne() pour trouver la Sauce unique ayant le même _id que le paramètre de la requête
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    const sauceObject = req.body
    const userId = sauceObject.userId
    const like = sauceObject.like

    Sauce.findOne({ _id: req.params.id }) // On utilise la méthode findOne() pour trouver la Sauce unique ayant le même _id que le paramètre de la requête
      .then((sauce) => { 
        if (like == 1 && sauce.usersLiked.includes(userId) == false) { // on vérifie si la sauce n'a pas déjà été likée par le même utilisateur
            sauce.usersLiked.push(userId) 
            sauce.likes++
            console.log(sauce)
        } else if (like == -1 && sauce.usersDisliked.includes(userId) == false) { // on vérifie si la sauce n'a pas déjà été dislikée par le même utilisateur
            sauce.usersDisliked.push(userId) 
            sauce.dislikes++
            console.log(sauce)
        } else if (like == 0 && sauce.usersLiked.includes(userId)) { // on vérifie si l'userId est présent
            sauce.likes--
            let index = sauce.usersLiked.indexOf(userId) // on récupère l'index du userId ciblé
            sauce.usersLiked.splice(index, 1) // on supprime l'userId du tableau usersLiked
            console.log(sauce)
        } else if (like == 0 && sauce.usersDisliked.includes(userId)) { // on vérifie si l'userId est présent
            sauce.dislikes--
            let index = sauce.usersDisliked.indexOf(userId) // on récupère l'index du userId ciblé
            sauce.usersDisliked.splice(index, 1) // on supprime l'userId du tableau usersDisliked
            console.log(sauce)
        }
        Sauce.updateOne({ _id: req.params.id }, { usersLiked: sauce.usersLiked, usersDisliked: sauce.usersDisliked, dislikes: sauce.dislikes, likes: sauce.likes, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée !' })) 
            .catch(error => res.status(400).json({ error })); 
      })
      .catch(error => res.status(400).json({ error })); 
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // condition ternaire
      { // si req.file (fichier image) existe
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //On modifie l'URL de l'image de manière dynamique 
      } : { ...req.body }; // si req.file n'existe pas, on fait une copie de req.body
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // on passe en premier argument, l'objet qu'on souhaite modifier et end euxième argument, la nuvelle version de l'objet
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1]; // on récupère le nom du fichier à supprimer
        fs.unlink(`images/${filename}`, () => { // on utilise la fonction unlink du package fs pour supprimer le fichier 
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getAllSauce = (req, res, next) => {
    Sauce.find() // find() renvoit un tableau de toutes les sauces dans la BDD
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};