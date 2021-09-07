const multer = require('multer'); // pour imporetr multer

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => { // pour indiquer à multer d'enregistrer les fichiers dans le dossier images
        callback(null, 'images');
    },
    filename: (req, file, callback) => { // pour indiquer à multer comment configurer le nom des fichiers téléchargés
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image'); // on exporte l'élément multer configuré, on lui passe notre constante storage et on lui indique de gérer uniquement les téléchargements de fichiers image