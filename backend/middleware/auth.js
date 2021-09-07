const jwt = require('jsonwebtoken'); // pour importer le package jsonwebtoken

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // on extrait le token du header Authorization de la requête entrante
        const decodedToken = jwt.verify(token, process.env.JWT_RAND_SECRET); // on utilise la méthode verify pour décoder le token
        const userId = decodedToken.userId; // on extrait l'id utilisateur du token
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valide';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Requête non authentifiée')
        });
    }
};