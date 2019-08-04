var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');

// app.get('/:tipo/:img', (req, res, next) => {
app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImage = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);

    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'La petición imagenes se resolvió correctamentexxx.'

    // })


    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/img-no-disponible.jpg');
        res.sendFile(pathNoImage);
    }


    // if (err) {
    //     return res.status(500).json({
    //         ok: false,
    //         mensaje: 'Error al actualizar hospital.',
    //         errors: err
    //     });

    // }
});

module.exports = app;