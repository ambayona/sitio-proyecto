var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel');

router.get('/', async function(req, res, next) {
var novedades = await novedadesModel.getNovedades();

    res.render('admin/novedades', {
        layout: '/admin/layout',
        persona: req.session.nombre,
        novedades
    });
});

//para eliminar una novedad//
router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id; //id2

    await novedadesModel.deleteNovedadById(id);
    res.redirect('/admin/novedades')
}); //cierra get de eliminar//

module.exports = router;




