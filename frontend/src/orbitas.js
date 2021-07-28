import React, { useRef, useEffect, useState } from "react";

//---------------Coordenadas-----------------------
let puntosCartesianos = [];
let puntosRotados = [];
let puntosProyectados = [];
const puntos = [];

let R = {};
function R1(t, giro, d, r) {
  R = {
    x: d * Math.sin((64*t) / (d / 50)),
    y: d * Math.cos((64*t) / (d / 50)),
    z: 0,
  };
  r = rotarx(giro, r);
  return r;
}

let matrizx = {};
function matriz(alfa) {
  matrizx = {
    x1: Math.cos(alfa),
    x2: Math.sin(alfa),
    x3: 0,
    y1: Math.sin(alfa),
    y2: Math.cos(alfa),
    y3: 0,
    z1: 0,
    z2: 0,
    z3: 1,
  };
}

function lineas() {
  for (let i = 0; i < 1; i = i + 0.1) {
    for (let j = 0; j < 2; j = j + 0.05) {
      puntos.push({ latitud: i * Math.PI, longitud: j * Math.PI });
    }
  }
  for (let i = 0; i < 1; i = i + 0.03) {
    for (let j = 0; j < 2; j = j + 0.05) {
      puntos.push({ latitud: j * Math.PI, longitud: i * Math.PI });
    }
  }
}

lineas();

function cartesianas() {
  for (let i = 0; i < puntos.length; i++) {
    puntosCartesianos.push({
      x: Math.sin(puntos[i].latitud) * Math.cos(puntos[i].longitud),
      y: Math.sin(puntos[i].latitud) * Math.sin(puntos[i].longitud),
      z: Math.cos(puntos[i].latitud),
    });
  }
}

cartesianas();

//---------------Cambios de referencia---------------------------

function rotacion(alfa, n, t, giro, d, r) {
  if (giro === 0) {
    matriz(alfa, 1);
    puntosRotados = puntosCartesianos.map((punto) => {
      let puntos = {
        x: matrizx.x1 * punto.x + n * matrizx.x2 * punto.y,
        y: -n * matrizx.y1 * punto.x + matrizx.y2 * punto.y,
        z: punto.z,
      };
      return puntos;
    });
    puntosCartesianos = puntosRotados;
  } else {
    puntosRotados = puntosCartesianos.map((punto) => {
      let puntos = {
        x: Math.cos(alfa/Math.pow(2,1+alfa)) * punto.x + n * Math.sin(alfa/Math.pow(2,1+alfa)) * punto.z,
        y: punto.y,
        z: -n * Math.sin(alfa/Math.pow(2,1+alfa)) * punto.x + Math.cos(alfa/Math.pow(2,1+alfa)) * punto.z,
      };
      return puntos;
    });
    puntosCartesianos = puntosRotados;
  }
  proyectar(t, giro, d, r);
}

function rotarx(alfa, r) {
  let Rrotado = {
    x: R.x + 250,
    y: Math.cos(alfa) * R.y - Math.sin(alfa) * R.z + 250,
    z: Math.sin(alfa) * R.y + Math.cos(alfa) * R.z,
  };
  R = Rrotado;
  r = Math.abs(r + R.z / 30);
  return r;
}

function rotarx1(alfa, n) {
  puntosRotados = puntosCartesianos.map((punto) => {
    let puntos = {
      x: punto.x,
      y: Math.cos(alfa) * punto.y - n * Math.sin(alfa) * punto.z,
      z: n * Math.sin(alfa) * punto.y + Math.cos(alfa) * punto.z,
    };
    return puntos;
  });
  puntosCartesianos = puntosRotados;
}

function proyectar(t, giro, d, r) {
  if (puntos.length < puntosProyectados.length) {
    puntosProyectados = [];
  }
  r = R1(t, giro, d, r);
  matriz(t, giro);

  for (let i = 0; i < puntosCartesianos.length; i++) {
    if (puntosCartesianos[i].z >= -0.1) {
      puntosProyectados.push({
        x: r * puntosCartesianos[i].x + R.x,
        y: r * puntosCartesianos[i].y + R.y,
        z: r * puntosCartesianos[i].z + R.z,
      });
    }
  }
}

//---------------Modulo-------------------------

function Orbitas() {
  let [t, setT] = useState(0);
  let [giro, setGiro] = useState(1);
  let [acelerador, setAcelerador] = useState(5)

  const canvasRef = useRef(null);

  const draw = (ctx, t) => {
    rotacion(t, 1, t, giro, 250, 10);
    rotacion(t, 1, t, giro, 100, 20);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    function sol(){
    for (let i =  0; i <  2*Math.PI; i = i + 0.1) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 1;
      ctx.moveTo(13*Math.cos(i) + 320, 13*Math.sin(i) + 150);
      ctx.lineTo(-Math.sin(i-0.01) + 320, Math.cos(i - 0.1) + 150);
      ctx.stroke();
    }}
    
function planetas(){
    for (let i = 1; i < puntosProyectados.length; i++) {
      if (
        Math.pow(
          Math.pow(puntosProyectados[i].x - puntosProyectados[i - 1].x, 2) +
            Math.pow(puntosProyectados[i - 1].y - puntosProyectados[i].y, 2),
          1 / 2
        ) < 10
      ) {
        ctx.beginPath();
        if (i <= puntosProyectados.length / 2) {
          ctx.strokeStyle = "red";
        } else{
          ctx.strokeStyle = "blue";
        }
        ctx.lineWidth = 0.5;
        ctx.moveTo(
          puntosProyectados[i - 1].x + 50,
          puntosProyectados[i - 1].y - 100
        );
        ctx.lineTo(puntosProyectados[i].x + 50, puntosProyectados[i].y -100);
        ctx.stroke();
      }
    }
  };
  if(R.z>0){
    sol()
    planetas()
  }else{
    planetas()
    sol()
  }

}

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    function sumar(t) {
      setTimeout(() => {
        if (t < Math.PI * 8) {
          setT(t + 0.001);
        } else {
          setT(0);
        }
        draw(context, t);
      }, acelerador);
    }

    sumar(t);
  }, [t]);

  //-------------------------------

  return (
    <>
    <header><h3 id={'bienvenida'}>↠ Bienvenido a Volaos, el lugar donde compartir tus experiencias cuando viajes</h3></header>
    <div id="esfera">
      <canvas ref={canvasRef} width="600px" height="300px"/>
     
    </div>
    <footer id='footer'>
    <div>
      <button className={'botonorbitas'}
        onClick={() => {
            setGiro(giro + Math.PI*(1/8));
        }}
      >
        {`⬆`}
      </button>
      <button className={'botonorbitas'}
        onClick={() => {
          rotarx(giro, 1);
          rotarx1(giro, 1);
          setGiro(0);
        }}
      >
        {`o`}
      </button>
      <button className={'botonorbitas'}
        onClick={() => {
          if(acelerador<60){
          setAcelerador(acelerador+20)
          }
          }
        }
      >
        {`-`}
      </button>
      <button className={'botonorbitas'}
        onClick={() => {
          if(acelerador>0){
          setAcelerador(acelerador-20)
          }
        }}
      >
        {`+`}
      </button>
    </div>
      <p>Publica tus experiencias alrededor del mundo y contacta con esos amigos que haces en tus aventuras. En volaos podras unirte sin ningún compromiso y dejarnos cuando quieras si no te convence.</p>
    </footer>
    </>
  );
}

export default Orbitas;
