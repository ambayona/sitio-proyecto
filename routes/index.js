var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async (req, res, next) => {
  console.log(req.body); // ¿Hay datos?

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var telefono = req.body.telefono;
  var mensaje = req.body.mensaje;

  var obj = {
    to: 'ambayona9@gmail.com',
    subject: 'Contacto desde la web',
    html: `El usuario ${nombre} ${apellido} se contactó a través de la web y quiere más información en este correo: ${email}. Además, hizo el siguiente comentario: ${mensaje}. Su teléfono es ${telefono}.`
  };

  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  var info = await transporter.sendMail(obj);
  res.render('index', {
    title: 'express',
    message: 'Mensaje enviado correctamente'
  });
});

module.exports = router;
