import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { IngredientesDTO } from "../../../models/IngredientesDTO";
import "./EditarIngrediente.css";
import { InputTextarea } from "primereact/inputtextarea";
interface EditarIngredienteProps {
  ingrediente: IngredientesDTO | null;
  closeDialog: () => void;
  onSuccess: (
    severity: "success" | "error" | "info" | "warn" | undefined,
    summary: string,
    detail: string
  ) => void;
  onError: (
    severity: "success" | "error" | "info" | "warn" | undefined,
    summary: string,
    detail: string
  ) => void;
}

export default function EditarIngrediente({
  ingrediente,
  closeDialog,
  onSuccess,
  onError,
}: EditarIngredienteProps) {
  const [nome, setNome] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const sharedClasses = {
    InputText: "w-full p-2 border rounded mb-4",
    select: "w-full p-2 border rounded mb-4",
    button:
      "w-full bg-green-600 text-white p-3 rounded-lg mt-4 hover:bg-green-700",
  };

  useEffect(() => {
    if (ingrediente) {
      setNome(ingrediente.Nome || "");
      setDescricao(ingrediente.descricao || "");
    }
  }, [ingrediente]);

  const updateIngrediente = (e: any) => {
    e.preventDefault();
    if (!ingrediente) return;
    axios
      .put(
        `http://localhost:3000/chef/edit_ingrediente/${ingrediente.idIngredientes}`,
        {
          Nome: nome,
          descricao: descricao,
        }
      )
      .then((result) => {
        if (result.data.Status) {
          closeDialog();
          window.location.reload();
          onSuccess(
            "success",
            "Sucesso",
            "Ingrediente atualizado com sucesso!"
          );
        } else {
          onError("error", "Erro", result.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
        onError("error", "Erro", "Erro ao atualizar ingrediente.");
      });
  };

  return (
    <div className="">
      <div className="flex-1 p-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Nome</label>
              <InputText
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                type="text"
                className={sharedClasses.InputText}
                placeholder="Nome"
              />
            </div>
            <div>
              <label className="block mb-2">Descrição</label>
              <InputTextarea
                value={descricao}
                className={sharedClasses.InputText}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                cols={30}
              />
            </div>
          </div>
          <div className="inclusao-button">
            <Button
              severity="success"
              label="Atualizar"
              onClick={updateIngrediente}
            />
          </div>
        </div>
      </div>
    </div>
  );
}  