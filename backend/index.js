const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


const mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;

MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },(err,client)=>{
    if(err!==null){
        console.log(err);
    }else{
        app.locals.db = client.db('proyecto_final_curso_javascript');
    }
});

let usuarios = require('./usuarios');
app.use('/usuarios', usuarios);

let viajes = require('./viajes');
app.use('/registrarPais', viajes);

let notas = require('./notas');
app.use('/notas', notas);

let busqueda = require('./busqueda');
app.use('/busqueda', busqueda);

let mensajes = require('./mensajes');
app.use('/mensajes', mensajes);


app.listen(process.env.PORT || 3000);