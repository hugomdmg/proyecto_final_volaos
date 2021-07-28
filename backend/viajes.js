const express = require("express");
const router = express.Router();

let paises = require('./paises');

router.post('/', function(req, res){
    let db = req.app.locals.db;
    let lista = paises[req.body.continente];
    let coordenadas = '';

    for(let i = 0; i<lista.length; i++){
        if(lista[i].nom == req.body.pais){
            coordenadas = lista[i];
        }
    }


    db.collection("usuarios")
    .find({ email: req.body.email })
    .toArray((err, datos) => {
      if (err !== null) {
        res.send({ error: true, mensaje: err, control:null });
      } else{
        db.collection('usuarios').updateOne({ email: req.body.email }, {$push: {viajes: {$each:[{pais:{coordenadas, notas:[], fotos:[]}}]}}});
        console.log(datos);
        datos[0].viajes.push({pais:{coordenadas, notas:[], fotos:[]}});
        res.send({ estado: true, mensaje: "", contenido: datos, paises: paises });
          
        
      }
    })

})

router.delete("/eliminar", (req, res) => {
  let db = req.app.locals.db;
  db.collection("usuarios")
    .find({ email: req.body.email })
    .toArray((err, data) => {
      if (err !== null) {
        res.send({ error: true, mensaje: err, control: null });
      } else {
        
        data[0].viajes.splice(req.body.index, 1, {
          pais: {
            coordenadas: { nom: 0, lat: "vacio", lon: "vacio" },
            notas: [],
          },
        });
        db.collection("usuarios").updateOne(
          { email: req.body.email },
          { $set: { viajes: data[0].viajes } }
        );
        res.send({ data });
      }
    });
});


module.exports = router;