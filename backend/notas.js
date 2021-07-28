const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "galeria/",
  filename: function (req, file, cb) {
    cb("", req.params.nombre + ".jpg");
  },
});

const upload = multer({
  storage: storage,
});

router.post("/registrar", function (req, res) {
  let db = req.app.locals.db;

  db.collection("usuarios")
    .find({ email: req.body.email })
    .toArray((err, data) => {
      if (err !== null) {
        res.send({ error: true, mensaje: err, control: null });
      } else {
        for (let i = 0; i < data[0].viajes.length; i++) {
          if (data[0].viajes[i].pais.coordenadas.nom == req.body.pais) {
            let datos = data[0];
            datos.viajes[i].pais.notas.push(req.body.nota);

            db.collection("usuarios").updateOne(
              { email: req.body.email },
              { $set: { viajes: datos.viajes } }
            );

            res.send({ contenido: datos });
          }
        }
      }
    });
});

router.delete("/eliminar", (req, res) => {
  let db = req.app.locals.db;

  db.collection("usuarios")
    .find({ email: req.body.email })
    .toArray((err, data) => {
      if (err !== null) {
        res.send({ error: true, mensaje: err, control: null });
      } else {
        let datos = data[0];
        datos.viajes[req.body.index1].pais.notas.splice(req.body.index2, 1);

        db.collection("usuarios").updateOne(
          { email: req.body.email },
          { $set: { viajes: datos.viajes } }
        );

        res.send({ contenido: datos });
      }
    });
});

router.get("/fotos/:nombre", (req, res) => {
  res.sendFile(__dirname + `/galeria/${req.params.nombre}`);
});

router.post("/files/:nombre", upload.single("avatar"), (req, res) => {
     res.send(null);
});

module.exports = router;
