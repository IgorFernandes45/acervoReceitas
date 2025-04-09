import { useEffect, useState } from "react";
import "./ingrediente.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { InputTextarea } from "primereact/inputtextarea";

export default function IncluirIngrediente({
  closeDialog,
  onSuccess,
  onError,
}: {
  closeDialog: any;
  onSuccess: Function;
  onError: Function;
}) {
  const [ingrediente, setIngrediente] = useState({
    nome: "",
    descricao: "",
  });

  const sharedClasses = {
    InputText: "w-full p-2 border rounded mb-4",
    textarea: "w-full p-2 border rounded mb-4",
    button: "w-full bg-green-600 text-white p-3 rounded-lg mt-4 hover:bg-green-700",
  };

  const addIngrediente = (e: any) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/chef/add_ingrediente", {
        Nome: ingrediente.nome,
        descricao: ingrediente.descricao,
      })
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
          closeDialog();
          onSuccess("success", "Sucesso", "Ingrediente adicionado com sucesso!");
        } else {
          onError("error", "Erro", result.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
        onError("error", "Erro", "Erro ao adicionar ingrediente.");
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
                value={ingrediente.nome}
                onChange={(e) =>
                  setIngrediente({ ...ingrediente, nome: e.target.value })
                }
                type="text"
                className={sharedClasses.InputText}
                placeholder="Nome"
              />
            </div>
            <div>
              <label className="block mb-2">Descrição</label>
              <InputTextarea
                value={ingrediente.descricao}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setIngrediente({ ...ingrediente, descricao: e.target.value })
                }
                rows={5}
                cols={30}
                className={sharedClasses.textarea}
                placeholder="Descrição"
              />
            </div>
          </div>
          <div className="inclusao-button">
            <Button
              severity="success"
              label="Registrar"
              onClick={addIngrediente}
              className={sharedClasses.button}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
