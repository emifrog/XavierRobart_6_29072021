const express = require('express'); // pour importer application Express
const router = express.Router(); // pour créer un routeur Express
const auth = require('../middleware/auth'); // pour importer le middleware auth
const multer = require('../middleware/multer-config'); // pour importer le middleware multer
const sauceCtrl = require('../controllers/sauce'); // pour importer le controleur

//pour afficher toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauce);
//pour enregistrer des sauces dans la BDD
router.post('/', auth, multer, sauceCtrl.createSauce);
//pour afficher une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
//pour modifier une sauce  
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//pour liker une sauce  
router.post('/:id/like', auth, sauceCtrl.likeSauce)
//pour supprimer une sauce  
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;