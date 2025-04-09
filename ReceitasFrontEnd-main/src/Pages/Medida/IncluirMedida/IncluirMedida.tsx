import { useEffect, useRef, useState } from "react";
import "./inclusao.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { Toast, ToastMessage } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";

export default function IncluirMedida({
  closeDialog,
  onSuccess,
  onError,
}: {
  closeDialog: any;
  onSuccess: Function;
  onError: Function;
}) {
  const [Medida, setMedida] = useState("");
  let navigate = useNavigate();
  const sharedClasses = {
    InputText: "w-full p-2 border rounded mb-4",
    select: "w-full p-2 border rounded mb-4",
    button:
      "w-full bg-green-600 text-white p-3 rounded-lg mt-4 hover:bg-green-700",
  };
  const show = (
    severity: ToastMessage["severity"],
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail });
  };
  const toast = useRef<Toast>(null);

  async function addMedida(e: any) {
    e.preventDefault();

    try {
      const result = await axios
        .post("http://localhost:3000/chef/add_medida", {
          descricao: Medida,
        })
        .then((result) => {
          if (result.data.Status) {
            show("success", "Sucesso", "Medida cadastrada com sucesso");
            closeDialog();
            window.location.reload();
          } else {
            alert(result.data.Status);
          }
        });
    } catch (err: any) {
      console.log(err);
    }
  }

  return (
    <div className="">
      <div className="flex-1 p-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <label className="block mb-2">Medida</label>
          <InputText
            value={Medida}
            onChange={(e) => setMedida(e.target.value)}
            type="text"
            className={sharedClasses.InputText}
            placeholder="Digite uma medida"
          />

          <div className="inclusao-button">
            <Button
              severity="success"
              label="Registrar"
              onClick={(e) => addMedida(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
