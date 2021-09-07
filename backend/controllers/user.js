const bcrypt = require('bcrypt'); // pour importer le package bcrypt
const jwt = require('jsonwebtoken'); // pour importer le package jsonwebtoken
const User = require('../models/User'); // pour importer le schéma de données User
//var CryptoJS = require("crypto-js");

exports.signup = (req, res, next) => {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/ // on utilise un regex pour le mot de passe
     if (!regexPassword.test(req.body.password)){ 
        res.status(406).json({ message: 'Mot de passe incorrect' })  
        return false
     }
    /*var encrypted = CryptoJS.AES.encrypt(req.body.email, 'my email').toString();
    //console.log(encrypted)
    var decrypted  = CryptoJS.AES.decrypt(encrypted, 'my email');
    console.log(decrypted)
    var originalText = decrypted.toString(CryptoJS.enc.Utf8);
    console.log(originalText)*/

    bcrypt.hash(req.body.password, 10) // pour appeler la fonction de hachage de bcrypt et "saler" le mot de passe 10 fois
        .then(hash => {
            const user = new User({ // on créé un nouvel utilisateur avec le model mongoose
                email: req.body.email,
                password: hash
            });
            user.save() // pour enregister le nouvel utilisateur dans la base de données
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // on vérifie que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données 
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password) // on utilise la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( // on utilise la fonction sign dejsonwebtoken pour encoder un nouveau token
                          { userId: user._id },
                            process.env.JWT_RAND_SECRET, // on utilise une chaîne secrète de développement temporaire
                            {expiresIn: '24h'} // pour définir la durée de validité du token
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};