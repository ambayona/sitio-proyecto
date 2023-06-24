var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel');

var util= require('util');
var cloudinary= require('cloudinary').v2;
const uploader= util.promisify(cloudinary.uploader.upload);


//listas las novedades//
router.get('/', async function (req, res, next) {
    var novedades = await novedadesModel.getNovedades();

    res.render('admin/novedades', {
        layout: '/admin/layout',
        persona: req.session.nombre,
        novedades
    });
});

// to delete a novedad
router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;

    await novedadesModel.deleteNovedadById(id);
    res.redirect('/admin/novedades');
});

// to display the add form
router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout'
    });
});

// to add a new novedad through POST method
router.post('/agregar', async (req, res, next) => {
    try {
       
        var img_id= '';
        if (req.files && Object.keys(req.files).length > 0) {
           imagen= req.files.imagen;
           img_id= (await uploader(imagen.tempFilePath)).public_id;
        }

       console.log(req.body)
        if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
            console.log(req.body);
            await novedadesModel.insertNovedad({
                ...req.body, //spread titulo , subtitulo y cuerpo
                img_id
            });
            res.redirect('/admin/novedades');
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos son requeridos'
            });
        }
    } catch (error) {
        console.log(error);
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se cargó la novedad'
        });
    }
});

// muestra el formulario de modificar con los datos de una sola novedad
router.get('/modificar/:id', async (req, res, next) => {
    var id = req.params.id;

    var novedad = await novedadesModel.getNovedadById(id);
    res.render('admin/modificar', {
        layout: 'admin/layout',
        novedad
    });
});

// modifica la novedad
router.post('/modificar', async (req, res, next) => {
    try {
        var obj = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            cuerpo: req.body.cuerpo
        };
        await novedadesModel.modificarNovedadById(obj, req.body.id);
        res.redirect('/admin/novedades');
    } catch (error) {
        console.log(error);
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se modificó la novedad'
        });
    }
});

module.exports = router;