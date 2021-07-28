const express = require("express");
const router = express.Router();

router.post(`/`, function (req, res) {
  let db = req.app.locals.db;
  db.collection("usuarios")
    .find({ email: req.body.miEmail })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send({ error: true, contenido: err });
      } else {
        if (datos.length !== 0) {
          console.log("probando");
          let array = [];
          for (let j = 0; j < datos[0].amigos.length; j++) {
            array.push({ amigo: datos[0].amigos[j].amigo, mensajes: [] });
            for(let k = 0; k< 10; k++){
              array[j].mensajes.push(datos[0].amigos[j].mensajes[datos[0].amigos[j].mensajes.length-k])
            }
          }

          res.send(array);
        }
      }
    });
});

router.post(`/enviar`, function (req, res) {
  console.log("hola desde mensajes enviados");
  console.log(req.body.miEmail);
  console.log(req.body.emailAmigo);
  console.log(req.body.mensaje);

  let db = req.app.locals.db;
  db.collection("usuarios")
    .find({ email: req.body.emailAmigo })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send({ error: true, contenido: err });
      } else {
        if (datos.length !== 0) {
          console.log("probando");
          for (let i = 0; i < datos[0].amigos.length; i++) {
            if (datos[0].amigos[i].amigo == req.body.miEmail) {
              console.log("aqui en el condicional");
              console.log(datos[0].amigos[i]);
              datos[0].amigos[i].mensajes.push({
                mensaje: req.body.mensaje,
                estado: "recibido",
              });
              db.collection("usuarios").updateOne(
                { email: req.body.emailAmigo },
                { $set: { amigos: datos[0].amigos } }
              );
            }
          }
        }
      }
    });
  db.collection("usuarios")
    .find({ email: req.body.miEmail })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send({ error: true, contenido: err });
      } else {
        if (datos.length !== 0) {
          let array = [];
          for (let i = 0; i < datos[0].amigos.length; i++) {
            if (datos[0].amigos[i].amigo == req.body.emailAmigo) {
              datos[0].amigos[i].mensajes.push({
                mensaje: req.body.mensaje,
                estado: "enviado",
              });
              db.collection("usuarios").updateOne(
                { email: req.body.miEmail },
                { $set: { amigos: datos[0].amigos } }
              ); //0000000

              for (let j = 0; j < datos[0].amigos.length; j++) {
                array.push({ amigo: datos[0].amigos[j].amigo, mensajes: [] });
                for(let k = 0; k< 10; k++){
                  array[j].mensajes.push(datos[0].amigos[j].mensajes[datos[0].amigos[j].mensajes.length-k])
                }
              }
              
              res.send(array);

              break;
            }
          }
        }
      }
    });
});

module.exports = router;
