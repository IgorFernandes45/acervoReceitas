import { useEffect, useRef, useState } from "react";
import "./editComposicao.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { InputNumber } from "primereact/inputnumber";
import { FuncionarioDTO } from "../../../models/FuncionarioDTO";
import { InputTextarea } from "primereact/inputtextarea";
import { MedidaDTO } from "../../../models/MedidaDTO";
import { IngredientesDTO } from "../../../models/IngredientesDTO";
import { ReceitaDTO } from "../../../models/ReceitaDTO";

export default function IncluirComposicao({
  closeDialog,
  onSuccess,
  onError,
  idCozinheiro,
  nomeReceita,
  idIngredientes
}: {
  closeDialog: any;
  onSuccess: Function;
  onError: Function;
  idCozinheiro: number;
  nomeReceita: string;
  idIngredientes: number;
}) {
  const [composicao, setComposicao] = useState({
    QuantidadeIngrediente: 0,
    idMedida: "",
    idIngredientes: "",
    Receita_nome: "",
    idCozinheiro: 0,
  });
  const [medida, setMedida] = useState<MedidaDTO[]>([]);
  const [cozinheiro, setCozinheiro] = useState<FuncionarioDTO[]>([]);
  const [ingredientes, setIngredientes] = useState<IngredientesDTO[]>([]);
  const [receita, setReceita] = useState<ReceitaDTO[]>([]);
  const sharedClasses = {
    InputText: "w-full p-2 border rounded mb-4",
    select: "w-full p-2 border rounded mb-4",
    button:
      "w-full bg-green-600 text-white p-3 rounded-lg mt-4 hover:bg-green-700",
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/chef/medida")
      .then((result) => {
        if (result.data.Status) {
          setMedida(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/chef/ingredientes")
      .then((result) => {
        if (result.data.Status) {
          setIngredientes(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/chef/receita")
      .then((result) => {
        if (result.data.Status) {
          setReceita(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (composicao.Receita_nome) {
      const selectedCozinheiro = receita.find(
        (r) => r.nome === composicao.Receita_nome
      )?.idCozinheiro;

      setComposicao((prevState) => ({
        ...prevState,
        idCozinheiro: selectedCozinheiro || 0,
      }));
    }
  }, [composicao.Receita_nome, receita]);

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
      .get(`http://localhost:3000/chef/composicao/${idIngredientes}/${nomeReceita}/${idCozinheiro}`)
      .then((result) => {
        if (result.data.Status) {
          setComposicao({
            ...composicao,
            Receita_nome: result.data.Result[0].Receita_nome,
            idCozinheiro: result.data.Result[0].idCozinheiro,
            idIngredientes: result.data.Result[0].idIngredientes,
            idMedida: result.data.Result[0].idMedida,
            QuantidadeIngrediente: result.data.Result[0].QuantidadeIngrediente,
          });
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, [idIngredientes, nomeReceita, idCozinheiro]);

  const updateComposicao = (e: any) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/chef/edit_composicao/${idIngredientes}/${nomeReceita}/${idCozinheiro}`, {
        Receita_nome: composicao.Receita_nome,
        idMedida: parseInt(composicao.idMedida),
        idIngredientes: parseInt(composicao.idIngredientes),
        idCozinheiro: composicao.idCozinheiro,
        QuantidadeIngrediente: composicao.QuantidadeIngrediente,
      })
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
          closeDialog();
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
              <label className="block mb-2">Receita</label>
              <select
              value={composicao.Receita_nome}
                className={sharedClasses.select}
                onChange={(e) =>
                  setComposicao({ ...composicao, Receita_nome: e.target.value })
                }
              >
                <option value="">Selecione uma receita</option>{" "}
                {receita
                  .filter((cItem) => cItem.nome !== null)
                  .map((cItem) => (
                    <option value={cItem.nome}>{cItem.nome}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Cozinheiro</label>
              <select
                className={sharedClasses.select}
                disabled
                value={composicao.idCozinheiro}
              >
                {cozinheiro.map((cItem) => (
                  <option key={cItem.idFuncionario} value={cItem.idFuncionario}>
                    {cItem.Nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Ingrediente</label>
              <select
              value={composicao.idIngredientes}
                className={sharedClasses.select}
                onChange={(e) =>
                  setComposicao({
                    ...composicao,
                    idIngredientes: e.target.value,
                  })
                }
              >
                <option value="">Selecione um ingrediente</option>{" "}
                {ingredientes
                  .filter((iItem) => iItem.Nome !== null)
                  .map((iItem) => (
                    <option
                      key={iItem.idIngredientes}
                      value={iItem.idIngredientes}
                    >
                      {iItem.Nome}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Quantidade</label>
              <InputNumber
                locale="pt-BR"
                value={composicao.QuantidadeIngrediente}
                maxFractionDigits={1}
                placeholder="Quantidade"
                onChange={(e) =>
                  setComposicao({
                    ...composicao,
                    QuantidadeIngrediente: e.value!,
                  })
                }
              />
            </div>
            <div>
              <label className="block mb-2">Medida</label>
              <select
              value={composicao.idMedida}
                className={sharedClasses.select}
                onChange={(e) =>
                  setComposicao({ ...composicao, idMedida: e.target.value })
                }
              >
                <option value="">Selecione uma medida</option>{" "}
                {medida
                  .filter((mItem) => mItem.Descricao !== null)
                  .map((mItem) => (
                    <option key={mItem.idMedida} value={mItem.idMedida}>
                      {mItem.Descricao}
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
                updateComposicao(e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
