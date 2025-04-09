import "./Admin.css";
import { useEffect, useState } from "react";
import { Menu } from "primereact/menu";
import "primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

interface DecodedToken {
    name: string;
    cargo: string;
}


export default function Dashboard() {
    const [cargoName, setCargoName] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
      const token = sessionStorage.getItem("access_token");
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        setCargoName(decoded.cargo);
      } else {
        navigate("login");
      }
    }, [navigate]);


  return (
    <div className="container">
      <div className="admin-main-content">
        <h1>Bem vindo, {cargoName.toUpperCase()}</h1>
        <div className="grid">
          <div className="col-11"></div>
        </div>
      </div>
    </div>
  );
}
