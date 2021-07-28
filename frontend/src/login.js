import { Button, Form, Card, Accordion } from "react-bootstrap";
import { useState, useEffect } from "react";
import Esfera from "./esfera";
import Tarjetas from "./tarjeta.";
import Amigos from "./amigos";
//let direccion1 = 'https://backendvolaos.herokuapp.com';
let direccion = 'http://localhost:3000';


function Paises(props) {
  let lista = props.paises.map((pais, index) => {
    return (
      <>
        <option>{pais.nom}</option>
      </>
    );
  });
  return lista;
}

function Login() {
  let [datos, setDatos] = useState("");
  let [control2, setControl2] = useState(0);
  let [emailBusqueda, setEmailBusqueda] = useState("");
  let [seguido, setSeguido] = useState('seguir');

  function enviarPais(pais, email, continente) {
    fetch(`${direccion}/registrarPais`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        pais: pais,
        continente: continente,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setDatos(data);
      });
  }

  function Cuenta(props) {
    let [controlAmigos, setControlAmigos] = useState(0);
    let [controlBuscador, setControlBuscador] = useState("");
    let [resultados, setResultados] = useState(<p></p>);

    function Cuadro(props) {
      return (
        <Accordion className="lista1">
          <Card>
            <Card.Header>
              <Accordion.Toggle
                as={Button}
                variant="link"
                eventKey="0"
                className="acordeon"
              >
                Añadir viaje
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <div>
                <div class="lista">
                  <button
                    class="nombrec"
                    onClick={() => {
                      enviarPais(
                        document.getElementById("europa").value,
                        props.datos[0].email,
                        "europa"
                      );
                    }}
                  >
                    Europa
                  </button>
                  <select class="select" id="europa">
                    <Paises paises={props.paises.europa} />
                  </select>
                </div>
                <div class="lista">
                  <button
                    class="nombrec"
                    onClick={() => {
                      enviarPais(
                        document.getElementById("asia").value,
                        props.datos[0].email,
                        "asia"
                      );
                    }}
                  >
                    Asia
                  </button>
                  <select class="select" id="asia">
                    <Paises paises={props.paises.asia} />
                  </select>
                </div>
                <div class="lista">
                  <button
                    class="nombrec"
                    onClick={() => {
                      enviarPais(
                        document.getElementById("america").value,
                        props.datos[0].email,
                        "america"
                      );
                    }}
                  >
                    América
                  </button>
                  <select class="select" id="america">
                    <Paises paises={props.paises.america} />
                  </select>
                </div>
                <div class="lista">
                  <button
                    class="nombrec"
                    onClick={() => {
                      enviarPais(
                        document.getElementById("africa").value,
                        props.datos[0].email,
                        "africa"
                      );
                    }}
                  >
                    África
                  </button>
                  <select class="select" id="africa">
                    <Paises paises={props.paises.africa} />
                  </select>
                </div>
                <div class="lista">
                  <button
                    class="nombrec"
                    onClick={() => {
                      enviarPais(
                        document.getElementById("oceania").value,
                        props.datos[0].email,
                        "oceania"
                      );
                    }}
                  >
                    Oceanía
                  </button>
                  <select class="select" id="oceania">
                    <Paises paises={props.paises.oceania} />
                  </select>
                </div>
              </div>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle
                as={Button}
                variant="link"
                eventKey="1"
                onClick={() => {
                  setControlAmigos(0);
                }}
              >
                Amigos
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <Button
                  variant="ligth"
                  onClick={() => {
                    setControlAmigos(1);
                  }}
                >
                  Buscar
                </Button>
                <Button
                  variant="ligth"
                  onClick={() => {
                    setControlAmigos(2);
                  }}
                >
                  Mis amigos
                </Button>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="2">
                Cuenta
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <Button
                  variant="ligth"
                  onClick={() => {
                    fetch(`${direccion}/usuarios/eliminar`, {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email: props.datos[0].email,
                      }),
                    })
                      .then((res) => {
                        return res.json();
                      })
                      .then((data) => {
                        window.alert("la cuenta ha  sido eliminada");
                        setControl2(0);
                      });
                  }}
                >
                  Eliminar cuenta
                </Button>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    }

    function Buscador() {
      function busqueda() {
        fetch(`${direccion}/busqueda`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            busqueda: controlBuscador,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((datos) => {
            console.log(datos);
            setResultados(
              datos.contenido.map((usuario, index) => {
                return (
                  <Card>
                    <Card.Body>
                      <Button
                        variant="outline-primary"
                        onClick={() => {
                          setControl2(3);
                          setEmailBusqueda(usuario.email);
                          setSeguido('seguir');
                        }}
                      >
                        {usuario.usuario}
                      </Button>
                      <Card.Text>
                        {usuario.nombre + " " + usuario.apellidos}
                      </Card.Text>
                      <Card.Text>{usuario.email}</Card.Text>
                    </Card.Body>
                  </Card>
                );
              })
            );
          });
      }

      return (
        <Card id="busqueda">
          <Form>
            <Form.Group controlId="formGroupEmail">
              <Form.Label>Buscar otros usuarios</Form.Label>
              <Form.Control
                type="email"
                id="email"
                value={controlBuscador}
                onChange={(event) => {
                  busqueda();
                  setControlBuscador(event.target.value);
                }}
              />
            </Form.Group>
          </Form>
          {resultados}
        </Card>
      );
    }

    //-------------------------------------------

    function ListaAmigos(props) {
      let [controlMensajes, setControlMensajes] = useState([]);
      let [enviarMensaje, setEnviarMensaje] = useState("");

      useEffect(() => {
        function sumar() {
          setTimeout(() => {
            fetch(`${direccion}/mensajes`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                miEmail: props.miEmail,
              }),
            })
              .then((res) => {
                return res.json();
              })
              .then((datos) => {
                setControlMensajes(datos);
              });
          }, 1000);
        }

        sumar();
      }, [controlMensajes]);

      function CuadroMensajes(props) {
        let lista1 = "";
        if (controlMensajes.length !== 0) {
          let arrayMensajes = [];

          for (let i = 0; i < controlMensajes.length; i++) {
            if (props.usuarioAmigo == controlMensajes[i].amigo)
              for (
                let j = controlMensajes[i].mensajes.length - 1;
                j >= 0;
                j--
              ) {
                arrayMensajes.push(controlMensajes[i].mensajes[j]);
              }
          }

          lista1 = arrayMensajes.map((mensaje, index) => {
            if (mensaje !== null) {
              if (mensaje.estado == "enviado") {
                return (
                  <div className="mensajeEnviado1">
                    <div></div>
                    <p className="mensajeEnviado">{mensaje.mensaje}</p>
                  </div>
                );
              } else {
                return (
                  <div>
                    <p className="mensajeRecibido">{mensaje.mensaje}</p>
                  </div>
                );
              }
            }
          });
        }
        return <>{lista1}</>;
      }
      let lista = datos.contenido[0].amigos.map((usuario, index) => {
        let colorBotonMensajes = "secondary";
        for (let i = 1; i < datos.contenido[0].amigos.length; i++) {
          if (datos.contenido[0].amigos[i].amigo == usuario.amigo) {
            if (
              datos.contenido[0].amigos[i].mensajes[
                datos.contenido[0].amigos[i].mensajes.length - 1
              ].estado == "recibido"
            ) {
              colorBotonMensajes = "danger";
            }
          }
        }

        if (usuario.amigo == "") {
          return <p></p>;
        } else {
          return (
            <Card>
              <Card.Body>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setControl2(3);
                    setEmailBusqueda(usuario.amigo);
                    setSeguido('seguido');
                  }}
                >
                  {usuario.usuario}
                </Button>
                <Card.Text>{usuario.amigo}</Card.Text>
                <Accordion>
                  <Card className="cuadroChat">
                    <Accordion.Toggle
                      as={Button}
                      variant={colorBotonMensajes}
                      eventKey="5"
                      className="botonChat"
                    >
                      mensajes
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="5">
                      <Card.Body>
                        <div id="cuadroMensajes">
                          <CuadroMensajes
                            mensajes={controlMensajes}
                            usuarioAmigo={usuario.amigo}
                          />
                          <div id="formMensajes">
                            <Form.Control
                              type="name"
                              id={`${usuario.amigo}`}
                              value={enviarMensaje}
                              onChange={(event) => {
                                setEnviarMensaje(event.target.value);
                              }}
                            />
                            <Button
                              variant="success"
                              onClick={() => {
                                fetch(`${direccion}/mensajes/enviar`, {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    miEmail: props.miEmail,
                                    emailAmigo: usuario.amigo,
                                    mensaje: enviarMensaje,
                                  }),
                                })
                                  .then((res) => {
                                    return res.json();
                                  })
                                  .then((datos) => {
                                    setEnviarMensaje("");
                                    console.log(datos);
                                    setControlMensajes(datos);
                                  });
                              }}
                            >
                              enviar
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </Card.Body>
            </Card>
          );
        }
      });
      return lista;
    }

    let buscador = "";
    if (controlAmigos == 0) {
      buscador = "";
    } else if (controlAmigos == 1) {
      buscador = Buscador();
    } else if (controlAmigos > 1) {
      buscador = (
        <ListaAmigos
          miEmail={props.datos[0].email}
          emailAmigo={datos.contenido[0].amigos[0].amigo}
        />
      );
    }

    return (
      <>
        <div className="cabecera">
          <Esfera coordenadas={props.datos[0].viajes} />
          <Card>
            <Card.Body>
              <div className="cabecera1">
                <div className="cabecera2">
                  <Card.Title>{props.datos[0].nombre}</Card.Title>
                  <p>{props.datos[0].apellidos}</p>
                  <p>Tu usuario: {props.datos[0].usuario}</p>
                  <p>Tu correo electrónico: {props.datos[0].email}</p>
                </div>
                <div>
                  <Cuadro paises={props.paises} datos={props.datos} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="cabecera">{buscador}</div>
        <div className="tarjetafinal">
          <Tarjetas
            viajes={props.datos[0].viajes}
            email={props.datos[0].email}
            usuario={props.datos[0].usuario}
          />
        </div>
      </>
    );
  }

  //---------------------------------------------------------------

  function Formulario() {
    let [control, setControl] = useState(0);
    let [email, setEmail] = useState("");
    let [contrasena, setContrasena] = useState("");
    let [aviso, setAviso] = useState(<p></p>);

    useEffect(() => {
      if (control !== 0) {
        fetch(`${direccion}/usuarios/usuarios`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            contrasena: contrasena,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            console.log(data);
            if (!data.estado) {
              setControl(0);
              setAviso(<p>{data.mensaje}</p>);
              setTimeout(() => {
                setAviso(<p></p>);
              }, 1000);
            } else {
              setDatos(data);
              setControl2(1);
            }
          });
      }
    }, [control]);

    return (
      <div className="login">
        <Form>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              id="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              id="contrasena"
              value={contrasena}
              onChange={(event) => {
                setContrasena(event.target.value);
              }}
            />
          </Form.Group>
        </Form>
        <div>
          <Button
            onClick={() => {
              setControl(control + 1);
            }}
          >
            entrar
          </Button>
          {aviso}
          <p>No estás registrado?</p>
          <Button variant="secondary" href="/registro">
            registrarse
          </Button>
        </div>
      </div>
    );
  }
  if (control2 == 0) {
    return <Formulario />;
  } else if (control2 == 1) {
    //------------------------
    return (
      <>
        <Cuenta datos={datos.contenido} paises={datos.paises} />
      </>
    );
  } else if (control2 == 3) {
    return (
      <div>
        <Button
          variant="success"
          onClick={() => {
            setControl2(1);
          }}
        >
          ◀ Volver
        </Button>
        <Amigos email={emailBusqueda} miEmail={datos.contenido[0].email} seguir={seguido}/>
      </div>
    );
  }
}

export default Login;
