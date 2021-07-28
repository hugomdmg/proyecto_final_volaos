const express = require("express");
const router = express.Router();
const bcryprt = require("bcrypt");

let paises = require("./paises");

router.post("/registrar", function (req, res) {
  let db = req.app.locals.db;
  let contrasena = req.body.contrasena;
  let contrasenaCifrada = bcryprt.hashSync(contrasena, 10);

  db.collection("usuarios")
    .find({ email: req.body.email })
    .toArray((err, datos) => {
      if (err !== null) {
        res.send({ error: true, mensaje: err, control: null });
      } else {
        if (datos.length !== 0) {
          res.send({
            error: false,
            mensaje: "el usuario ya existe, prueba con otro nombre",
            control: 1,
            contenido: datos,
          });
        } else {
          db.collection("usuarios").insertOne(
            {
              email: req.body.email,
              contrasena: contrasenaCifrada,
              usuario: req.body.usuario,
              nombre: req.body.nombre,
              apellidos: req.body.apellidos,

              viajes: [],
              amigos: [{amigo:'', usuario:'', mensajes:[{mensaje:'', estado:''}]}],
            },
            (err2, datos2) => {
              if (err2) {
                res.send({ error: true, mensaje: err2 });
              } else {
                res.send({
                  error: false,
                  mensaje: "usuario registrado",
                  control: 2,
                  contenido: datos2,
                });
              }
            }
          );
        }
      }
    });
});

router.delete('/eliminar', (req, res)=>{
  console.log(req.body.email)
  let db = req.app.locals.db;
  db.collection("usuarios")
    .find({ email: req.body.email })
    .toArray((err, datos) => {
      if (err !== null) {
        res.send({ error: true, mensaje: err, control: null });
      } else {
        db.collection('usuarios').deleteOne({email: req.body.email});
        res.send({mensaje: 'eliminado'})
      }
})
})

router.post(`/usuarios`, function (req, res) {
  let db = req.app.locals.db;
let contrasena = req.body.contrasena;
  db.collection("usuarios")
    .find({ email: req.body.email })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send({ error: true, contenido: err });
      } else {
        if (datos.length !== 0) {
          let coincidencia = bcryprt.compareSync(
            contrasena,
            datos[0].contrasena
          )
          if (coincidencia) {
            res.send({
              estado: true,
              mensaje: "",
              contenido: datos,
              paises: paises,
            });
          } else {
            res.send({ estado: false, mensaje: "la contraseña es incorrecta" });
          }
        } else {
          res.send({ estado: false, mensaje: "el usuario no está registrado" });
        }
      }
    });
});

router.post(`/tarjetas`, function (req, res) {
  let db = req.app.locals.db;
  db.collection("usuarios")
    .find({ email: req.body.email })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send({ error: true, contenido: err });
      } else {
        if (datos.length !== 0) {
          res.send({
            estado: true,
            mensaje: "",
            email: datos[0].email,
            viajes: datos[0].viajes,
            amigos: datos[0].amigos,
          });
        } else {
          res.send({ estado: false, mensaje: "no encontrado" });
        }
      }
    });
});

router.post(`/amigos`, function (req, res) {
  let db = req.app.locals.db;
  db.collection("usuarios")
    .find({ email: req.body.email })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send({ error: true, contenido: err });
      } else {
        if (datos.length !== 0) {
          console.log(datos);
          res.send({ estado: true, mensaje: "", contenido: datos });
        } else {
          res.send({ estado: false, mensaje: "el usuario no está registrado" });
        }
      }
    });
});

router.put(`/amigos/registrar`, (req, res) => {
  function envio(datos, db){
    db.collection("usuarios").updateOne(
      { email: req.body.miEmail },
      {
        $push: {
          amigos: {
            $each: [
              {
                amigo: req.body.emailAmigo,
                usuario: req.body.usuarioAmigo,
                mensajes: [{mensaje:'', estado:''}],
              },
            ],
          },
        },
      }
    );
    datos[0].amigos.push({
      amigos: { amigo: req.body.emailAmigo, mensajes: [] },
    })
    res.send({ estado: true, mensaje: "", contenido: datos[0] });
  }

  
  let db = req.app.locals.db;
  db.collection("usuarios")
    .find({ email: req.body.miEmail })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send({ error: true, contenido: err });
      } else {
        if(datos[0].amigos.length == 0){
          envio(datos, db);
        }else{
          for (let i = 0; i < datos[0].amigos.length; i++) {
            if (datos[0].amigos[i].amigo == req.body.emailAmigo) {
              res.send({ mensaje: "el amigo ya está en la lista" });
              break;
            }else if (i == datos[0].amigos.length-1) {
              envio(datos, db);
              break;
            }
        }
        }
       
      }
    });
});

router.delete(`/amigos/dejarseguir`, (req, res) => {
  let db = req.app.locals.db;
  db.collection('usuarios').find({email: req.body.miEmail}).toArray((err, datos)=>{
    for(let i = 0; i<datos[0].amigos.length; i++){
      if(datos[0].amigos[i].amigo == req.body.emailAmigo){
        datos[0].amigos.splice(i, 1);
        db.collection('usuarios').updateOne({email:req.body.miEmail}, { $set: { amigos: datos[0].amigos } });
        res.send({estado: true})
      }
    }
  })
});

module.exports = router;
