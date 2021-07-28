import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import Esfera from "./esfera";
//let direccion1 =  'https://backendvolaos.herokuapp.com';
let direccion =  'http://localhost:3000';


function Tarjetas(props) {
  let [data, setData] = useState(props);
  let [controlTarjetas, setControlTarjetas] = useState(0);
  

  useEffect(() => {
    fetch(`${direccion}/usuarios/tarjetas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: props.email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((datos) => {
        console.log("tarjetas");
        console.log(datos);
        setData(datos);
      });
  }, [controlTarjetas]);


  function Imagenes(props) {
    let [controlImagen, setControlImagen] = useState(0);
    console.log(props.nombre + "-----------------------");

    useEffect(() => {
      fetch(`${direccion}/notas/fotos/${props.nombre + ".jpg"}`)
        .then(function (response) {
          if (response.ok) {
            const miImagen = document.querySelector(
              `${"#imagen" + props.nombre}`
            );
            response.blob().then(function (miBlob) {
              var objectURL = URL.createObjectURL(miBlob);
              miImagen.src = objectURL;
            });
          }
        })
    }, [controlImagen]);

    return (
      <>
        <p></p>
      </>
    );
  }

  //---------------------------

  function Notas(props) {
    let lista = props.notas.map((nota, i) => {
      return (
        <li className="notas">
          <p className="notas1">↠ {nota}</p>
        </li>
      );
    });
    return (
      <>
        <ol>{lista}</ol>
      </>
    );
  }
  let nuevoArray = [];
  if (data) {
    for (let i = data.viajes.length - 1; i >= 0; i--) {
      nuevoArray.push(data.viajes[i]);
    }
  }
  let lista = nuevoArray.map((viaje, index) => {
    if (controlTarjetas !== 0 && viaje.pais.coordenadas.nom !== 0) {
      const $seleccionArchivos = document.querySelector(
          `#${"input" + (nuevoArray.length - index - 1)}`
        ),
        $imagenPrevisualizacion = document.querySelector(
          `#${"imagen" + (nuevoArray.length - index - 1)}`
        );

      $seleccionArchivos.addEventListener("change", () => {
        const archivos = $seleccionArchivos.files;
        if (!archivos || !archivos.length) {
          $imagenPrevisualizacion.src = "";
          return;
        }
        const primerArchivo = archivos[0];
        const objectURL = URL.createObjectURL(primerArchivo);
        $imagenPrevisualizacion.src = objectURL;
      });
    }
    if (viaje.pais.coordenadas.nom !== 0) {
      return (
        <div className="tarjetas">
          <Card>
            <Card.Body>
              <Card.Title>{viaje.pais.coordenadas.nom}</Card.Title>
              <img
                src=""
                id={`${
                  "imagen" + props.usuario + (nuevoArray.length - index - 1)
                }`}
                className="imagenespaises"
              />
              <Imagenes
                nombre={`${props.usuario + (nuevoArray.length - index - 1)}`}
              />
              <Notas
                notas={viaje.pais.notas}
                index={index}
                email={props.email}
              />
            </Card.Body>
          </Card>
        </div>
      );
    }
  });

  return <>{lista}</>;
}



//====================================================================

function Amigos(props) {
    let [control, setControl] = useState(0);
    let [control2, setControl2] = useState(0);
useEffect(()=>{
  fetch(`${direccion}/usuarios/amigos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: props.email,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
        console.log(data.contenido[0].viajes);
   
     setControl2(data.contenido[0]);
    });
},[control])

function Resultado(props){
  let [seguir, setSeguir] = useState(props.seguir);
    if(control2 !== 0){
        console.log(props)
    return (
        <>
          <div className="cabecera">
            <Esfera coordenadas={props.datos.viajes} />
            <Card>
              <Card.Body>
                <div className="cabecera1">
                  <div className="cabecera2">
                    <h3>{props.datos.nombre}</h3>
                    <h5>{props.datos.apellidos}</h5>
                    <p>{props.datos.usuario}</p>
                    <p>{props.datos.email}</p>
                  </div>
                  <div>
                      <Button variant='outline-success' onClick={()=>{
                        console.log(props.miEmail)
                        console.log(props.datos.email)
                        if(seguir == 'seguir'){
                        fetch(`${direccion}/usuarios/amigos/registrar`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            emailAmigo: props.datos.email,
                            miEmail: props.miEmail,
                            usuarioAmigo: props.datos.usuario,
                          }),
                        })
                          .then((res) => {
                            return res.json();
                          })
                          .then((data) => {
                              console.log(data);
                         
                              setSeguir('seguido');
                          });
                        }else{
                          fetch(`${direccion}/usuarios/amigos/dejarseguir`, {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            emailAmigo: props.datos.email,
                            miEmail: props.miEmail,
                            usuarioAmigo: props.datos.usuario,
                          }),
                        })
                          .then((res) => {
                            return res.json();
                          })
                          .then((data) => {
                              console.log(data);
                         
                              setSeguir('seguir');
                          });
                        }
                      
                      }}>{seguir}</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="tarjetafinal">
            <Tarjetas
              viajes={props.datos.viajes}
              email={props.datos.email}
              usuario={props.datos.usuario}
            />
          </div>
        </>
      );
    }else{
        return(
            <p></p>
        )
    }
}


    return(
        <>
        <Resultado datos={control2} miEmail={props.miEmail} seguir={props.seguir}/>
        </>
    )
}

export default Amigos;
