const express = require('express'); // pour importer express
const router = express.Router(); // pour créér notre router avec la fonction router de express
const userCtrl = require('../controllers/user'); // pour importer les controleurs
const limiter = require('../middleware/limiter-request');// Gestion du nombre de requêtes utilisateurs

router.post('/signup', userCtrl.signup); // pour importer la fonction avec ('URI', nomDuController.nomDeLaRoute)
router.post('/login', limiter, userCtrl.login);

module.exports = router; // pour exporter le router vers app.js