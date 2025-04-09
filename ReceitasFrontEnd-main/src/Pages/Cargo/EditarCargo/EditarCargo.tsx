import { useState, useEffect, useRef } from "react";
import "./editarCargo.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { Toast, ToastMessage } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { FuncionarioDTO } from "../../../models/FuncionarioDTO";
import { InputNumber } from "primereact/inputnumber";
import { CargoDTO } from "../../../models/CargoDTO";

export default function EditarCargo({
  closeDialog,
  cargoId,
  onSuccess,
  onError,
}: {
  closeDialog: any;
  cargoId: CargoDTO;
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
 
  const [cargo, setCargo] = useState({
    descricao: "",
  });
  const sharedClasses = {
    InputText: "w-full p-2 border rounded mb-4",
    select: "w-full p-2 border rounded mb-4",
    button:
      "w-full bg-green-600 text-white p-3 rounded-lg mt-4 hover:bg-green-700",
  };


  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/auth/edit_cargo/${cargoId?.idCargo}`
      )
      .then((result) => {
        setCargo({
          descricao: result.data.Result[0].descricao,

        });
      })
      .catch((err) => console.log(err));
  }, []);

  const updateCargo = (e: any) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:3000/auth/edit_cargo/${cargoId?.idCargo}`,
        {
          descricao: cargo.descricao,
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
              <label className="block mb-2"></label>
              <InputText
                value={cargo.descricao}
                className={sharedClasses.InputText}
                onChange={(e) =>
                  setCargo({ ...cargo, descricao: e.target.value })
                }
                type="text"
                placeholder="Cargo"
              />
            </div>
          </div>
          <div className="inclusao-button">
            <Button
              severity="success"
              label="Atualizar"
              onClick={(e) => {
                updateCargo(e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}