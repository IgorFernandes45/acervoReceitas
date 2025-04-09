//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";
import { InputText } from 'primereact/inputtext';
import { useState } from "react";
//import {useState} from 'react'  


import "./App.scss"
import Rotas from "./Routes/routes";
import { Casket } from "./Shared/Casket/Casket";




function App() {

  return (

    <div>    <div>
      <Rotas></Rotas>
    </div>

    </div>

  );
}

export default App;
