import { useEffect, useRef, useState } from "react";
import "./editReceita.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { InputNumber } from "primereact/inputnumber";
import { CategoriaDTO } from "../../../models/CategoriaDTO";
import { FuncionarioDTO } from "../../../models/FuncionarioDTO";
import { InputTextarea } from "primereact/inputtextarea";
import { ReceitaDTO } from "../../../models/ReceitaDTO";

export default function EditarReceita({
  closeDialog,
  onSuccess,
  onError,
  idCozinheiro,
  nome,
}: {
  closeDialog: any;
  onSuccess: Function;
  onError: Function;
  idCozinheiro: number;
  nome: string;
}) {
  const [receita, setReceita] = useState({
    nome: "",
    Data: "",
    IndRecInedita: 0,
    idCozinheiro: "",
    Categoria: "",
    QuantidadePorcao: 0,
    ModoPreparo: "",
  });
  const [categoria, setCategoria] = useState<CategoriaDTO[]>([]);
  const [cozinheiro, setCozinheiro] = useState<FuncionarioDTO[]>([]);
  const sharedClasses = {
    InputText: "w-full p-2 border rounded mb-4",
    select: "w-full p-2 border rounded mb-4",
    button:
      "w-full bg-green-600 text-white p-3 rounded-lg mt-4 hover:bg-green-700",
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/chef/categoria")
      .then((result) => {
        if (result.data.Status) {
          setCategoria(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/funcionario")
      .then((result) => {
        if (result.data.Status) {
          const filteredResult = result.data.Result.filter((funcionario: any) =>
            funcionario.Cargo.toLowerCase().includes("cozinheiro")
          );
          setCozinheiro(filteredResult);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/chef/receita/${nome}/${idCozinheiro}`)
      .then((result) => {
        setReceita({
          ...receita,
          nome: result.data.Result[0].nome,
          Data: new Date(result.data.Result[0].Data)
            .toISOString()
            .split("T")[0],
          IndRecInedita: result.data.Result[0].IndRecInedita,
          idCozinheiro: result.data.Result[0].idCozinheiro,
          Categoria: result.data.Result[0].Categoria,
          QuantidadePorcao: result.data.Result[0].QuantidadePorcao,
          ModoPreparo: result.data.Result[0].ModoPreparo,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const updateReceita = (e: any) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/chef/edit_receita/${nome}/${idCozinheiro}`, {
        nome: receita.nome,
        Data: receita.Data,
        IndRecInedita: receita.IndRecInedita,
        idCozinheiro: parseInt(receita.idCozinheiro),
        Categoria: parseInt(receita.Categoria),
        QuantidadePorcao: receita.QuantidadePorcao,
        ModoPreparo: receita.ModoPreparo,
      })
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
              <label className="block mb-2">Nome</label>
              <InputText
                value={receita.nome}
                onChange={(e) =>
                  setReceita({ ...receita, nome: e.target.value })
                }
                type="text"
                className={sharedClasses.InputText}
                placeholder="Nome"
              />
              <label className="block mb-2">Data de criação</label>
              <InputText
                value={receita.Data}
                type="date"
                className={sharedClasses.InputText}
                onChange={(e) =>
                  setReceita({
                    ...receita,
                    Data: e.target.value!,
                  })
                }
              />
              <label className="block mb-2">Índice</label>
              <InputNumber
                value={receita.IndRecInedita}
                locale="pt-BR"
                placeholder="Ídice"
                onChange={(e) =>
                  setReceita({ ...receita, IndRecInedita: e.value! })
                }
              />
              <label className="block mb-2">Porção</label>
              <InputNumber
                value={receita.QuantidadePorcao}
                locale="pt-BR"
                placeholder="Porção"
                maxFractionDigits={1}
                onChange={(e) =>
                  setReceita({ ...receita, QuantidadePorcao: e.value! })
                }
              />
            </div>
            <div>
              <label className="block mb-2">Cozinheiro</label>
              <select
                value={receita.idCozinheiro}
                className={sharedClasses.select}
                onChange={(e) =>
                  setReceita({ ...receita, idCozinheiro: e.target.value })
                }
              >
                <option value="">Selecione um cozinheiro</option>{" "}
                {cozinheiro
                  .filter((cItem) => cItem.Nome !== null)
                  .map((cItem) => (
                    <option
                      key={cItem.idFuncionario}
                      value={cItem.idFuncionario}
                    >
                      {cItem.Nome}
                    </option>
                  ))}
              </select>
              <label className="block mb-2">Categoria</label>
              <select
                value={receita.Categoria}
                className={sharedClasses.select}
                onChange={(e) =>
                  setReceita({ ...receita, Categoria: e.target.value })
                }
              >
                <option value="">Selecione uma categoria</option>{" "}
                {categoria
                  .filter((cItem) => cItem.nome !== null)
                  .map((cItem) => (
                    <option key={cItem.idCategoria} value={cItem.idCategoria}>
                      {cItem.nome}
                    </option>
                  ))}
              </select>
              <label className="block mb-2">Modo de preparo</label>

              <div className="card flex justify-content-center">
                <InputTextarea
                  value={receita.ModoPreparo}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setReceita({ ...receita, ModoPreparo: e.target.value })
                  }
                  rows={5}
                  cols={30}
                />
              </div>
            </div>
          </div>
          <div className="inclusao-button">
            <Button
              severity="success"
              label="Atualizar"
              onClick={(e) => {
                updateReceita(e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
