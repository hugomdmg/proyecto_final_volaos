import React, { useRef, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import continentes1 from "./continentes";

let puntosCartesianos = [];
let puntosRotados = [];
let puntosProyectados = [];
let continentes = [];
let viajes = [];
let puntosProyectadosViajes = [];
let puntos = [];

function linearContientes() {
  continentes = [];
  for (let i = 0; i < continentes1.length; i++) {
    continentes.push({
      latitud: (-continentes1[i].lat * Math.PI) / 180 + Math.PI / 2,
      longitud: (-continentes1[i].lon * Math.PI) / 180,
      id: "continentes",
    });
  }
}
linearContientes();

function linearViajes(props) {
  viajes = [];
  for (let i = 0; i < props.coordenadas.length; i++) {
    viajes.push({
      latitud: (-props.coordenadas[i].pais.coordenadas.lat * Math.PI) / 180 + Math.PI / 2,
      longitud: (-props.coordenadas[i].pais.coordenadas.lon * Math.PI) / 180,
      id: "viajes",
    });
  }
    cartesianas();
  return viajes;
}

function lineas() {
  puntos = [];
  for (let i = 0; i < 1; i = i + 0.25) {
    for (let j = 0; j < 2; j = j + 0.01) {
      puntos.push({
        longitud: i * Math.PI,
        latitud: j * Math.PI,
        id: "lineas",
      });
    }
  }
  for (let i = 0; i < 3; i = i + Math.PI / 8) {
    for (let j = 0; j < 2; j = j + 0.01) {
      puntos.push({ longitud: j * Math.PI, latitud: i, id: "lineas" });
    }
  }
}

lineas();
function cartesianas() {
  puntosCartesianos = [];
  for (let i = 0; i < puntos.length; i++) {
    puntosCartesianos.push({
      x: Math.sin(puntos[i].latitud) * Math.cos(puntos[i].longitud),
      y: Math.sin(puntos[i].latitud) * Math.sin(puntos[i].longitud),
      z: Math.cos(puntos[i].latitud),
      id: puntos[i].id,
    });
  }
  for (let i = 0; i < continentes.length; i++) {
    puntosCartesianos.push({
      x: Math.sin(continentes[i].latitud) * Math.cos(continentes[i].longitud),
      y: Math.sin(continentes[i].latitud) * Math.sin(continentes[i].longitud),
      z: Math.cos(continentes[i].latitud),
      id: continentes[i].id,
    });
  }

  for (let i = 0; i < viajes.length; i++) {
    puntosCartesianos.push({
      x: Math.sin(viajes[i].latitud) * Math.cos(viajes[i].longitud),
      y: Math.sin(viajes[i].latitud) * Math.sin(viajes[i].longitud),
      z: Math.cos(viajes[i].latitud),
      id: "viajes",
    });
  }
}

//------------------------------------------

function rotarz(alfa, n) {
  puntosRotados = puntosCartesianos.map((punto) => {
    let puntos = {
      x: Math.cos(alfa) * punto.x + n * Math.sin(alfa) * punto.y,
      y: -n * Math.sin(alfa) * punto.x + Math.cos(alfa) * punto.y,
      z: punto.z,
      id: punto.id,
    };
    return puntos;
  });
  puntosCartesianos = puntosRotados;
  proyectar();
}

function rotarx(alfa, n) {
  puntosRotados = puntosCartesianos.map((punto) => {
    let puntos = {
      x: punto.x,
      y: Math.cos(alfa) * punto.y - n * Math.sin(alfa) * punto.z,
      z: n * Math.sin(alfa) * punto.y + Math.cos(alfa) * punto.z,
      id: punto.id,
    };
    return puntos;
  });
  puntosCartesianos = puntosRotados;
  proyectar();
}

function rotary(alfa, n) {
  puntosRotados = puntosCartesianos.map((punto) => {
    let puntos = {
      x: Math.cos(alfa) * punto.x + n * Math.sin(alfa) * punto.z,
      y: punto.y,
      z: -n * Math.sin(alfa) * punto.x + Math.cos(alfa) * punto.z,
      id: punto.id,
    };
    return puntos;
  });
  puntosCartesianos = puntosRotados;
  proyectar();
}

function proyectar() {
  puntosProyectados = [];
  puntosProyectadosViajes = {superficie:[],aire:[]};
  for (let i = 0; i < puntosCartesianos.length; i++) {
    if (
      puntosCartesianos[i].z >= -0.1
    ) {
      puntosProyectados.push({
        x: 200 * puntosCartesianos[i].x + 250,
        y: 200 * puntosCartesianos[i].y + 250,
        id: puntosCartesianos[i].id,
      });
      if(puntosCartesianos[i].id == 'viajes'){
        puntosProyectadosViajes.superficie.push({
          x: 200 * puntosCartesianos[i].x + 250,
          y: 200 * puntosCartesianos[i].y + 250,
          id: puntosCartesianos[i].id,
        });
        puntosProyectadosViajes.aire.push({
          x: 240 * puntosCartesianos[i].x + 250,
          y: 240 * puntosCartesianos[i].y + 250,
          id: puntosCartesianos[i].id,
        });
      }
    }
  }
}

//-------------------------------------------

function Esfera(props) {
  let [t, setT] = useState(1.9);
  let [giro, setGiro] = useState(".0");

  let [marcas, setMarcas] = useState(0);
  
  useEffect(() => {
    linearViajes(props);
  }, [marcas]);

  const canvasRef = useRef(null);

  const draw = (ctx) => {
    if (giro === ".0") {
      rotarz(t / 6, 1);
    } else if (giro === "0.") {
      rotarz(t / 6, -1);
    } else if (giro === ">") {
      rotary(t / 6, 1);
    } else if (giro === "<") {
      rotary(t / 6, -1);
    } else if (giro === "^") {
      rotarx(t / 6, 1);
    } else if (giro === "v") {
      rotarx(t / 6, -1);
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < 2 * Math.PI; i = i + 0.04) {
      ctx.beginPath();
      ctx.strokeStyle = "#bfe8f3";
      ctx.lineWidth = 10;
      ctx.moveTo(250, 250);
      ctx.lineTo(205 * Math.sin(i) + 250, 205 * Math.cos(i) + 250);
      ctx.stroke();
    }

    for (let i = 0; i < 2 * Math.PI; i = i + 0.04) {
      ctx.beginPath();
      ctx.strokeStyle = "rgb(175, 209, 241)";
      ctx.lineWidth = 8;
      ctx.moveTo(250, 250);
      ctx.lineTo(200 * Math.sin(i - 0.1) + 250, 200 * Math.cos(i - 0.1) + 250);
      ctx.stroke();
    }

    for (let i = 1; i < puntosProyectados.length; i++) {
      if (
        Math.pow(
          Math.pow(puntosProyectados[i].x - puntosProyectados[i - 1].x, 2) +
            Math.pow(puntosProyectados[i - 1].y - puntosProyectados[i].y, 2),
          1 / 2
        ) < 40
      ) {
        if (puntosProyectados[i].id == "lineas") {
          ctx.beginPath();
          ctx.strokeStyle = "grey";
          ctx.lineWidth = 0.1;
          ctx.moveTo(puntosProyectados[i - 1].x, puntosProyectados[i - 1].y);
          ctx.lineTo(puntosProyectados[i].x, puntosProyectados[i].y);
          ctx.stroke();
        } else if (puntosProyectados[i].id == "continentes") {
          ctx.beginPath();
          ctx.strokeStyle = "green";
          ctx.lineWidth = 1.5;
          ctx.moveTo(puntosProyectados[i - 1].x, puntosProyectados[i - 1].y);
          ctx.lineTo(puntosProyectados[i].x, puntosProyectados[i].y);
          ctx.stroke();
        }
      } 
    }
    for(let i = 0; i<puntosProyectadosViajes.aire.length; i++){
    
      ctx.beginPath();
      ctx.strokeStyle = "brown";
      ctx.lineWidth = 2;
      ctx.moveTo(puntosProyectadosViajes.aire[i].x, puntosProyectadosViajes.aire[i].y);
      ctx.lineTo(puntosProyectadosViajes.superficie[i].x+2, puntosProyectadosViajes.superficie[i].y);
      ctx.stroke();
  }

  };

  

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    function dibujar() {
      t = t + 0.1 * Math.PI;
      if (t < Math.PI / 2) {
        draw(context);
        window.requestAnimationFrame(dibujar);
      } else {
        setT(0.1);
      }
    }
    dibujar();
  }, [t]);

  //-------------------------------

  return (
    <div id="esfera">
      <canvas ref={canvasRef} width="500px" height="500px" />
      <div id="botones1">
        <Button
          variant="info"
          onClick={() => {
            setT(0);
            setGiro("<");
          }}
        >
          {`⬅`}
        </Button>
        <Button
          variant="info"
          onClick={() => {
            setT(0);
            setGiro("^");
          }}
        >
          {`⬆`}
        </Button>
        <Button
          variant="info"
          onClick={() => {
            setT(0);
            setGiro(">");
          }}
        >
          {`➡`}
        </Button>
      </div>
      <div id='botones2'>
      <Button
        variant="info"
        onClick={() => {
          setT(0);
          setGiro(".0");
        }}
      >
        ↪
      </Button>
      <Button
        variant="info"
        onClick={() => {
          setT(0);
          setGiro("v");
        }}
      >
        {`⬇`}
      </Button>
      <Button
        variant="info"
        onClick={() => {
          setT(0);
          setGiro("0.");
        }}
      >
        ↩
      </Button>
      </div>
    </div>
  );
}

export default Esfera;
