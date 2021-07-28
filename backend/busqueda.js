const express = require("express");
const router = express.Router();

router.post("/", function (req, res) {
    let db = req.app.locals.db;
    let datos = [];
  
    db.collection("usuarios")
      .find({ usuario: new RegExp(req.body.busqueda) }).limit(10)
      .toArray((err, data) => {
        if (err !== null) {
          res.send({ error: true, mensaje: err, control: null });
        } else {
                console.log(data);
                datos = data.map((usuario)=>{
                    return(
                        {usuario: usuario.usuario,
                        nombre: usuario.nombre,
                        apellidos: usuario.apellidos,
                        email: usuario.email,}
                    )
                }
                )
                if(datos.length>0){
                    res.send({ contenido: datos });
                }else{
                    db.collection("usuarios")
                    .find({ email: new RegExp(req.body.busqueda) }).limit(10)
                    .toArray((err, data) => {
                      if (err !== null) {
                        res.send({ error: true, mensaje: err, control: null });
                      } else {
                             datos = data.map((usuario)=>{
                                  return(
                                      {usuario: usuario.usuario,
                                      nombre: usuario.nombre,
                                      apellidos: usuario.apellidos,
                                      email: usuario.email,}
                                      )
                              }
                              )
                            res.send({ contenido: datos });
                        }
                    });
                }
          }
        
      });
  });

//   router.post("/seguir", function (req, res) {
//     let db = req.app.locals.db;
//     let datos = [];
  
//     db.collection("usuarios")
//       .find({ usuario: new RegExp(req.body.busqueda) }).limit(10)
//       .toArray((err, data) => {
//         if (err !== null) {
//           res.send({ error: true, mensaje: err, control: null });
//         } else {
//                 console.log(data);
//                 datos = data.map((usuario)=>{
//                     return(
//                         {usuario: usuario.usuario,
//                         nombre: usuario.nombre,
//                         apellidos: usuario.apellidos,
//                         email: usuario.email,}
//                     )
//                 }
//                 )
//                 if(datos.length>0){
//                     res.send({ contenido: datos });
//                 }else{
//                     db.collection("usuarios")
//                     .find({ email: new RegExp(req.body.busqueda) }).limit(10)
//                     .toArray((err, data) => {
//                       if (err !== null) {
//                         res.send({ error: true, mensaje: err, control: null });
//                       } else {
//                              datos = data.map((usuario)=>{
//                                   return(
//                                       {usuario: usuario.usuario,
//                                       nombre: usuario.nombre,
//                                       apellidos: usuario.apellidos,
//                                       email: usuario.email,}
//                                       )
//                               }
//                               )
//                             res.send({ contenido: datos });
//                         }
//                     });
//                 }
//           }
        
//       });
//   });

module.exports = router;