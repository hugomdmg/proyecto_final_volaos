import { Button, Form } from "react-bootstrap";
import { useState } from "react";
//let direccion1 =  'https://backendvolaos.herokuapp.com';
let direccion = 'http://localhost:3000';


function Datos() {
  return (
    <Form>
      <Form.Group controlId="formGroupEmail">
        <p>Nombre:</p>
        <Form.Control type="name" placeholder="nombre" id="nombre" />
      </Form.Group>
      <Form.Group controlId="formGroupPassword">
        <p>Apellidos:</p>
        <Form.Control type="apellidos" placeholder="apellidos" id="apellidos" />
      </Form.Group>
      <Form.Group controlId="formGroupPassword">
        <p>Nombre de usuario:</p>
        <Form.Control type="user" placeholder="usuario" id="usuario" />
      </Form.Group>
      <Form.Group controlId="formGroupPassword">
        <p>Email:</p>
        <Form.Control type="email" placeholder="email" id="email" />
      </Form.Group>
      <Form.Group controlId="formGroupPassword">
        <p>contraseña:</p>
        <Form.Control type="password" placeholder="Password" id="contrasena1" />
        <p>repita contraseña:</p>
        <Form.Control type="password" placeholder="Password" id="contrasena2" />
      </Form.Group>
    </Form>
  );
}

function Registro() {
  let [control, setControl] = useState(0);
  let [mensaje, setMensaje] = useState('');
  function registrar() {
    let contrasena1 = document.getElementById("contrasena1").value;
    let contrasena2 = document.getElementById("contrasena2").value;

    if (contrasena1 === contrasena2) {
      fetch(`${direccion}/usuarios/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: document.getElementById("email").value,
          contrasena: document.getElementById("contrasena1").value,
          usuario: document.getElementById("usuario").value,
          nombre: document.getElementById("nombre").value,
          apellidos: document.getElementById("apellidos").value,
        }),
      }).then((res)=>{
        return res.json();
      }).then((data)=>{
        if(data.control==1){
          setMensaje(data.mensaje);
          setTimeout(()=>{
            setMensaje('');
            setControl(0);
          },2000)
        }else if(data.control==2){
          setMensaje(data.mensaje);
          setControl(2);
        }
      })
    } else {
      setMensaje('la contraseña no coincide, intentalo de nuevo');
      setTimeout(()=>{
        setMensaje('');
      },2000)
    }
  }

  if(control===0){
  return (
    <div className="login">
      <Datos />
      <p>{mensaje}</p>
      <Button
        variant="primary"
        onClick={() => {
          registrar();
        }}
      >
        registrarse
      </Button>
    </div>
  );
  }else if(control===2){
    return (
      <div className="login">
        <Datos />
        <p>{mensaje}</p>
        <Button
          variant="primary"
          href='/login'
        >
          entrar
        </Button>
      </div>
    );
  }
}

export default Registro;
