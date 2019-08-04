var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();


var Medico = require('../models/medico');

var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');

// ==============================
// Obtener todos los medicos
// ==============================

app.get('/', (req, res, next) => {
    // Medico.find({}, 'nombre email img role')
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', { password: 0 })
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Medico',
                        errors: err
                    });
                }

                Medico.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });

            })
});

// ==============================
// Actualizar Medico
// ==============================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, Medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Medico.',
                errors: err
            });
        }

        if (!Medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Medico con el id' + id + ' no existe.',
                errors: { message: 'No existe un Medico con ese ID' }
            });
        }

        Medico.nombre = body.nombre;
        Medico.usuario = req.usuario._id;
        Medico.hospital = body.hospital;

        Medico.save((err, MedicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Medico.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                Medico: MedicoGuardado
            });


        });

    });
});

// ==============================
// Crear un nuevo Medico
// ==============================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {


    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, MedicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Medico.',
                errors: err,
                body: body
            });
        }

        res.status(201).json({
            ok: true,
            Medico: MedicoGuardado,
            Usuariotoken: req.usuario
        });
    });
});

// ==============================
// Borrar un Medico
// ==============================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, MedicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Medico.',
                errors: err
            });
        }
        if (!MedicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe Medico con ese ID.',
                errors: { message: 'No existe Medico con ese ID' }
            });
        }

        MedicoBorrado.password = '***';
        res.status(200).json({
            ok: true,
            Medico: MedicoBorrado
        });
    });
});

module.exports = app;