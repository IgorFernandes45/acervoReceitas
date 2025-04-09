import { useState, useEffect, useRef } from "react";
import "./editReferencia.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { Toast, ToastMessage } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { FuncionarioDTO } from "../../../models/FuncionarioDTO";
import { InputNumber } from "primereact/inputnumber";
import { RestauranteDTO } from "../../../models/RestauranteDTO";

export default function EditarReferencia({
  closeDialog,
  funcionarioId,
  restauranteId,
  onSuccess,
  onError,
}: {
  closeDialog: any;
  funcionarioId: FuncionarioDTO;
  restauranteId: RestauranteDTO;
  onSuccess: Function;
  onError: Function;
}) {
  const Edittoast = useRef<Toast>(null);
  const show = (
    severity: ToastMessage["severity"],
    summary: string,
    detail: string
  ) => {
    Edittoast.current?.show({ severity, summary, detail });
  };
  const [referencia, setReferencia] = useState({
    Data_Inicio: "",
    Data_Fim: "",
    idFuncionario: "",
    idRestaurante: "",
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

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/auth/referencia/${funcionarioId?.idFuncionario}/${restauranteId?.idRestaurante}`
      )
      .then((result) => {
        setReferencia({
          ...referencia,
          Data_Inicio: new Date(result.data.Result[0].Data_Inicio)
            .toISOString()
            .split("T")[0],
          Data_Fim: new Date(result.data.Result[0].Data_Fim)
            .toISOString()
            .split("T")[0],
          idFuncionario: result.data.Result[0].idFuncionario,
          idRestaurante: result.data.Result[0].idRestaurante,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const updateReferencia = (e: any) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:3000/auth/edit_referencia/${funcionarioId?.idFuncionario}/${restauranteId?.idRestaurante}`,
        {
          Data_Inicio: referencia.Data_Inicio,
          Data_Fim: referencia.Data_Fim,
          idFuncionario: parseInt(referencia.idFuncionario),
          idRestaurante: parseInt(referencia.idRestaurante),
        }
      )
      .then((result) => {
        if (result.data.Status) {
          closeDialog();
          window.location.reload();
        } else {
          alert(result.data.Status);
        }
      })
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
                value={referencia.Data_Inicio}
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
                value={referencia.Data_Fim}
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
              value={referencia.idFuncionario}
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
              value={referencia.idRestaurante}
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
              label="Atualizar"
              onClick={(e) => {
              updateReferencia(e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
