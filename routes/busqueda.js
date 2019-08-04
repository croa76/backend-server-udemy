var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


// ==============================
// Busqueda por colección
// ==============================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {


    var coleccion = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');

    var promesa;
    switch (coleccion) {
        case 'usuarios':
            promesa = buscarUsuarios(regexp);
            break;
        case 'hospitales':
            promesa = buscarHospitales(regexp);
            break;
        case 'medicos':
            promesa = buscarMedicos(regexp);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando ' + coleccion,
                errors: 'No se ha implementado la solucion'
            });
    }

    promesa
        .then(data => {
            res.status(200).json({
                ok: true,
                [coleccion]: data
            });
        });


});

// ==============================
// Búsqueda general
// ==============================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');

    Promise.all(
            [buscarHospitales(regexp),
                buscarMedicos(regexp),
                buscarUsuarios(regexp)
            ])
        .then(respuestas => {
            console.log('termina');
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

function buscarHospitales(regexp) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regexp })
            .populate('usuario', { password: 0 })
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });

}

function buscarMedicos(regexp) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regexp })
            .populate('usuario', { password: 0 })
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(regexp) {
    return new Promise((resolve, reject) => {
        Usuario.find({})
            .or([{ 'nombre': regexp }, { 'email': regexp }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}


module.exports = app;