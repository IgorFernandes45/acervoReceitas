import { useState, useEffect, useRef } from "react";
import "./editarMedida.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { Toast, ToastMessage } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { MedidaDTO } from "../../../models/MedidaDTO";

export default function EditarMedida({
  closeDialog,
  onSuccess,
  onError,
  idMedida
}: {
  closeDialog: any;
  onSuccess: Function;
  onError: Function;
  idMedida: number;
}) {
  const Edittoast = useRef<Toast>(null);
  const show = (
    severity: ToastMessage["severity"],
    summary: string,
    detail: string
  ) => {
    Edittoast.current?.show({ severity, summary, detail });
  };
 
  const [medida, setMedida] = useState({
    nome: "",
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
        `http://localhost:3000/chef/medida/${idMedida}`
      )
      .then((result) => {
        setMedida({
          nome: result.data.Result[0].Descricao,

        });
      })
      .catch((err) => console.log(err));
  }, []);

  const updateMedida = (e: any) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:3000/chef/edit_medida/${idMedida}`,
        {
          descricao: medida.nome,
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
                value={medida.nome}
                className={sharedClasses.InputText}
                onChange={(e) =>
                  setMedida({ ...medida, nome: e.target.value })
                }
                type="text"
                placeholder="Medida"
              />
            </div>
          </div>
          <div className="inclusao-button">
            <Button
              severity="success"
              label="Atualizar"
              onClick={(e) => {
                updateMedida(e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
