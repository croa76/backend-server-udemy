var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

app.get('/', (req, res, next) => {
    return res.status(200).json({
        ok: true,
        mensaje: 'La petición se resolvió correctamente.'

    })
});

app.put('/:tipo/:idColeccion', (req, res, next) => {
    var tipo = req.params.tipo;
    var idColeccion = req.params.idColeccion;

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válido.',
            errors: { message: 'Tipo de colección no válido.' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó ninguna imagen .',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreTokens = archivo.name.split('.');
    var extensionArchivo = nombreTokens[nombreTokens.length - 1];


    // Solo estas extensiones son válidas

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'bmp'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida.',
            archivo: archivo.name,
            extension: extensionArchivo,
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });

    }


    // Nombre de archivo personalizado

    var nombreArchivo = `${ idColeccion }-${ new Date().getMilliseconds()}.${ extensionArchivo}`;

    // Mover archivo del temporal a un path 
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;
    archivo.mv(path, err => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo.',
                errors: err
            });
        }

        return subirPorTipo(tipo, idColeccion, nombreArchivo, res);

    });


});

function subirPorTipo(tipo, idColeccion, nombreArchivo, res) {

    if (tipo === 'usuarios') {


        Usuario.findById(idColeccion, (err, usuario) => {
            var pathAnterior = './uploads/usuarios/' + usuario.img;
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al recuperar usuario.',
                    errors: err
                });
            }

            // Si existe la imagen anterior, la borra
            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior, (err) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: `Error al borrar archivo ${ pathAnterior }  .`,
                            errors: err
                        });
                    }
                });
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario.',
                        errors: err
                    });

                }
                usuarioActualizado.password = '***';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada.',
                    usuario: usuarioActualizado

                });
            });
        });
    }
    if (tipo === 'medicos') {


        Medico.findById(idColeccion, (err, medico) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al recuperar hospital.',
                    errors: err
                });

            }

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el hospital .',
                    errors: { message: 'Debe enviar un hospital válido' }
                });

            }

            if (!(medico.img === null)) {
                var pathAnterior = './uploads/medicos/' + medico.img;
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al recuperar medico.',
                        errors: err
                    });
                }
            }

            // Si existe la imagen anterior, la borra
            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior, (err) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: `Error al borrar archivo ${ pathAnterior }  .`,
                            errors: err
                        });
                    }
                });
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar medico.',
                        errors: err
                    });

                }
                // medicoActualizado.password = '***';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada.',
                    medico: medicoActualizado

                });
            });
        });
    }
    if (tipo === 'hospitales') {


        Hospital.findById(idColeccion, (err, hospital) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al recuperar hospital.',
                    errors: err
                });

            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el hospital .',
                    errors: { message: 'Debe enviar un hospital válido' }
                });

            }

            if (!(hospital.img === null)) {
                var pathAnterior = './uploads/hospitales/' + hospital.img;
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al recuperar hospital.',
                        errors: err
                    });
                }
            }

            // Si existe la imagen anterior, la borra
            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior, (err) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: `Error al borrar archivo ${ pathAnterior }  .`,
                            errors: err
                        });
                    }
                });
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital.',
                        errors: err
                    });

                }
                // hospitalActualizado.password = '***';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada.',
                    hospital: hospitalActualizado

                });
            });
        });
    }

}
module.exports = app;