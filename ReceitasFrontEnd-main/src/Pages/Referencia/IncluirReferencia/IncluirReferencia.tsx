import { useEffect, useRef, useState } from "react";
import "./inclusao.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { RestauranteDTO } from "../../../models/RestauranteDTO";
import { FuncionarioDTO } from "../../../models/FuncionarioDTO";
import { InputNumber } from "primereact/inputnumber";

export default function IncluirReferencia({
  closeDialog,
  onSuccess,
  onError,
}: {
  closeDialog: any;
  onSuccess: Function;
  onError: Function;
}) {
  const [referencia, setReferencia] = useState({
    
    Data_Inicio: '',
    Data_Fim: '',
    idFuncionario: '',
    idRestaurante: '',
  });
  const [funcionario, setFuncionario] = useState<FuncionarioDTO[]>([]);
  const [restaurante, setRestaurante] = useState<RestauranteDTO[]>([]);
  const sharedClasses = {
    InputText: "w-full p-2 border rounded mb-4",
    select: "w-full p-2 border rounded mb-4",
    button:
      "w-full bg-green-600 text-white p-3 rounded-lg mt-4 hover:bg-green-700",
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/funcionario")
      .then((result) => {
        if (result.data.Status) {
          setFuncionario(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/restaurante")
      .then((result) => {
        if (result.data.Status) {
          setRestaurante(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const addReferencia = (e: any) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/auth/add_referencia", {
        Data_Inicio: referencia.Data_Inicio,
        Data_Fim: referencia.Data_Fim,
        idFuncionario: parseInt(referencia.idFuncionario),
        idRestaurante: parseInt(referencia.idRestaurante),
      })
      .then((result) => {if(result.data.Status){
        closeDialog();
        window.location.reload();
      }else{
          alert(result.data.Status)
      }})
      .catch((err) => console.log(err));
  };

  return (
    <div className="">

      <div className="flex-1 p-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              
              <label className="block mb-2">Data de Início</label>
              <InputText
                type="date"
                className={sharedClasses.InputText}
                onChange={(e) =>
                  setReferencia({
                    ...referencia,
                    Data_Inicio: e.target.value!,
                  })
                }
              />
              <label className="block mb-2">Data de Fim</label>
              <InputText
                type="date"
                className={sharedClasses.InputText}
                onChange={(e) =>
                  setReferencia({
                    ...referencia,
                    Data_Fim: e.target.value!,
                  })
                }
              />
              <label className="block mb-2">Funcionário</label>
              <select
                className={sharedClasses.select}
                onChange={(e) =>
                  setReferencia({ ...referencia, idFuncionario: e.target.value })
                }
              >
                <option value="">Selecione um funcionário</option>{" "}
                {funcionario
                  .filter((funcionarioItem) => funcionarioItem.Nome !== null)
                  .map((funcionarioItem) => (
                    <option key={funcionarioItem.idFuncionario} value={funcionarioItem.idFuncionario}>
                      {funcionarioItem.Nome}
                    </option>
                  ))}
              </select>
              <label className="block mb-2">Restaurante</label>
              <select
                className={sharedClasses.select}
                onChange={(e) =>
                  setReferencia({ ...referencia, idRestaurante: e.target.value })
                }
              >
                <option value="">Selecione um restaurante</option>{" "}
                {restaurante
                  .filter((restauranteItem) => restauranteItem.Nome !== null)
                  .map((restauranteItem) => (
                    <option key={restauranteItem.idRestaurante} value={restauranteItem.idRestaurante}>
                      {restauranteItem.Nome}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="inclusao-button">
            <Button
              severity="success"
              label="Registrar"
              onClick={(e) => {
                addReferencia(e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
