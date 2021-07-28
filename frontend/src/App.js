import "./App.css";
import Orbitas from './orbitas';
import { BrowserRouter, Link, Route } from "react-router-dom";
import Barra from "./barra";
import Login from "./login";
import Registro from "./registro";


function App() {
  

  return <>
  <BrowserRouter>
  <Barra/>
  <Route path = "/login">
    <Login/>
  </Route>
  <Route path = "/registro">
    <Registro/>
  </Route>
  <Route exact path = "/">
    <Orbitas/>
  </Route>
  </BrowserRouter>
  </>;
}

export default App;
