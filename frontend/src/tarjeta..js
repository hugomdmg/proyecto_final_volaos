import { Button, Form, Card, Accordion } from "react-bootstrap";
import React, { useEffect, useState } from "react";
//let direccion1 =  'https://backendvolaos.herokuapp.com';
let direccion = 'http://localhost:3000';


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


  function anadirNota(email, pais) {
    let nota = document.getElementById(`${pais}`).value;
    fetch(`${direccion}/notas/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        pais: pais,
        nota: nota,
      }),
    }).then(() => {
       setControlTarjetas(controlTarjetas + 1);
    });
  }

  function Imagenes(props) {
    let [controlImagen, setControlImagen] = useState(0);
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
          <Button
            className="eliminarnota"
            variant="outline-secondary"
            onClick={() => {
              fetch(`${direccion}/notas/eliminar`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  index1: nuevoArray.length - props.index - 1,
                  index2: i,
                  email: props.email,
                }),
              })
                .then((res) => {
                  res.json();
                })
                .then((datos) => {
                  console.log(datos);
                  setControlTarjetas(controlTarjetas + 1);
                });
            }}
          >
            eliminar nota
          </Button>
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
  if (data.viajes.length > 0) {
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
          <Accordion>
            <Card>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <Form.Control
                    type="name"
                    id={`${viaje.pais.coordenadas.nom}`}
                  />
                  <Button
                    variant="outline-success"
                    onClick={() => {
                      anadirNota(props.email, viaje.pais.coordenadas.nom);
                    }}
                  >
                    añadir
                  </Button>
                </Card.Body>
              </Accordion.Collapse>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  <img id={`${"imagen" + (nuevoArray.length - index - 1)}`} className='imagenprueba'/>
                  <div>
                    <input
                      type="file"
                      id={`${"input" + (nuevoArray.length - index - 1)}`}
                      name="avatar"
                      accept="image/*"
                    />
                    <button
                      onClick={() => {
                        var formData = new FormData();
                        var fileField =
                          document.querySelector(`#${"input" + (nuevoArray.length - index - 1)}`);

                        formData.append("avatar", fileField.files[0]);

                        fetch(
                          `${direccion}/notas/files/${
                            props.usuario + (nuevoArray.length - index - 1)
                          }`,
                          {
                            method: "POST",
                            body: formData,
                          }
                        )
                          .then((res) => {
                            res.json();
                          })
                          .then((datos) => {
                            console.log(datos);
                            setControlTarjetas(controlTarjetas + 1);
                          });
                      }}
                    >
                      guardar
                    </button>
                  </div>
                </Card.Body>
              </Accordion.Collapse>
              <Card.Header id="anadirennotas">
                <div>
                  <Accordion.Toggle
                    as={Button}
                    variant="secondary"
                    eventKey="1"
                  >
                    Añadir notas
                  </Accordion.Toggle>
                  <Accordion.Toggle
                    as={Button}
                    variant="secondary"
                    eventKey="2"
                    onClick={() => {
                      if (controlTarjetas === 0) {
                        setControlTarjetas(controlTarjetas + 1);
                      }
                    }}
                  >
                    Añadir imagen
                  </Accordion.Toggle>
                </div>
                <Button
                  variant="alert"
                  onClick={() => {
                    console.log(index);
                    fetch(`${direccion}/registrarPais/eliminar`, {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        index: nuevoArray.length - index - 1,
                        email: props.email,
                      }),
                    })
                      .then((res) => {
                        res.json();
                      })
                      .then((datos) => {
                        console.log(datos);
                        setControlTarjetas(controlTarjetas + 1);
                      });
                  }}
                >
                  eliminar viaje
                </Button>
              </Card.Header>
            </Card>
          </Accordion>
        </div>
      );
    }
  });

  return <>{lista}</>;
}

export default Tarjetas;
