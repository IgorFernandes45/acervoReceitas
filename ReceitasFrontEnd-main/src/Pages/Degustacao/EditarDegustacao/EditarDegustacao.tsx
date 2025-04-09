import { useEffect, useRef, useState } from "react";
import "./EditarDegustacao.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { InputNumber } from "primereact/inputnumber";
import { CategoriaDTO } from "../../../models/CategoriaDTO";
import { FuncionarioDTO } from "../../../models/FuncionarioDTO";
import { InputTextarea } from "primereact/inputtextarea";
import { ReceitaDTO } from "../../../models/ReceitaDTO";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";

export default function IncluirDegustacao({
  closeDialog,
  onSuccess,
  onError,
  idCozinheiro,
  Receita_nome,
  idDegustador,
}: {
  closeDialog: any;
  onSuccess: Function;
  onError: Function;
  idCozinheiro: number;
  Receita_nome: string;
  idDegustador: number;
}) {
  const [degustacao, setDegustacao] = useState({
    Data_Degustacao: "",
    Nota_Degustacao: 0,
    idDegustador: "",
    Receita_nome: "",
    idCozinheiro: 0,
    Imagem: "",
  });
  const [receita, setReceita] = useState<ReceitaDTO[]>([]);
  const [degustador, setDegustador] = useState<FuncionarioDTO[]>([]);
  const [cozinheiro, setCozinheiro] = useState<FuncionarioDTO[]>([]);
  const sharedClasses = {
    InputText: "w-full p-2 border rounded mb-4",
    select: "w-full p-2 border rounded mb-4",
    button:
      "w-full bg-green-600 text-white p-3 rounded-lg mt-4 hover:bg-green-700",
  };
  const [file, setFile] = useState<File | null>(null);

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
    if (degustacao.Receita_nome) {
      const selectedCozinheiro = receita.find(
        (r) => r.nome === degustacao.Receita_nome
      )?.idCozinheiro;

      setDegustacao((prevState) => ({
        ...prevState,
        idCozinheiro: selectedCozinheiro || 0,
      }));
    }
  }, [degustacao.Receita_nome, receita]);

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
      .get("http://localhost:3000/auth/funcionario")
      .then((result) => {
        if (result.data.Status) {
          const filteredResult = result.data.Result.filter((funcionario: any) =>
            funcionario.Cargo.toLowerCase().includes("degustador")
          );
          setDegustador(filteredResult);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/taster/degustacao/${idDegustador}/${Receita_nome}/${idCozinheiro}`
      )
      .then((result) => {
        const data = result.data.Result[0];
        setDegustacao({
          ...degustacao,
          Data_Degustacao: new Date(data.Data_Degustacao)
            .toISOString()
            .split("T")[0],
          Nota_Degustacao: data.Nota_Degustacao,
          idCozinheiro: data.idCozinheiro,
          idDegustador: data.idDegustador,
          Receita_nome: data.Receita_nome,
        });

        const imageUrl = `http://localhost:3000/Images/${data.Imagem}`;
        return axios.get(imageUrl, { responseType: "blob" });
      })
      .then((imageResult) => {
        const imageBlob = imageResult.data;
        console.log(imageBlob);
        setFile(imageBlob);
      })
      .catch((err) => console.log(err));
  }, []);
  const updateDegustacao = (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Data_Degustacao", degustacao.Data_Degustacao);
    formData.append("Nota_Degustacao", degustacao.Nota_Degustacao.toString());
    formData.append("idDegustador", degustacao.idDegustador);
    formData.append("Receita_nome", degustacao.Receita_nome);
    formData.append("idCozinheiro", degustacao.idCozinheiro.toString());
    if (file) {
      formData.append("Imagem", file, file.name);
    }
    axios
      .put(
        `http://localhost:3000/taster/edit_degustacao/${idDegustador}/${Receita_nome}/${idCozinheiro}`,
        formData
      )
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

  const onFileChange = (event: any) => {
    if (event.files.length > 0) {
      const selectedFile = event.files[0];
      setFile(selectedFile);
    }
  };

  return (
    <div className="">
      <div className="flex-1 p-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Data de degustação</label>
              <InputText
                type="date"
                value={degustacao.Data_Degustacao}
                className={sharedClasses.InputText}
                onChange={(e) =>
                  setDegustacao({
                    ...degustacao,
                    Data_Degustacao: e.target.value!,
                  })
                }
              />
            </div>
            <div>
              <label className="block mb-2">Degustador</label>
              <select
                value={degustacao.idDegustador}
                className={sharedClasses.select}
                onChange={(e) =>
                  setDegustacao({ ...degustacao, idDegustador: e.target.value })
                }
              >
                <option value="">Selecione um degustador</option>{" "}
                {degustador
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
            </div>
            <div>
              <label className="block mb-2">Receita</label>
              <select
                value={degustacao.Receita_nome}
                className={sharedClasses.select}
                onChange={(e) =>
                  setDegustacao({ ...degustacao, Receita_nome: e.target.value })
                }
              >
                <option value="">Selecione uma receita</option>{" "}
                {receita
                  .filter((cItem) => cItem.nome !== null)
                  .map((cItem) => (
                    <option key={cItem.nome} value={cItem.nome}>
                      {cItem.nome}
                    </option>
                  ))}
              </select>
              <FileUpload
                style={{ marginTop: "6%" }}
                mode="basic"
                name="imagem"
                auto
                accept="image/*"
                customUpload
                uploadHandler={onFileChange}
                chooseLabel="Selecione a foto"
              />
            </div>
            <div>
              <label className="block mb-2">Cozinheiro</label>
              <select
                className={sharedClasses.select}
                disabled
                value={degustacao.idCozinheiro}
              >
                {cozinheiro.map((cItem) => (
                  <option key={cItem.idFuncionario} value={cItem.idFuncionario}>
                    {cItem.Nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Nota</label>
              <InputNumber
                locale="pt-BR"
                placeholder="Nota"
                value={degustacao.Nota_Degustacao}
                maxFractionDigits={1}
                min={0}
                max={10}
                onChange={(e) =>
                  setDegustacao({ ...degustacao, Nota_Degustacao: e.value! })
                }
              />
            </div>
          </div>

          <div className="inclusao-button">
            <Button
              style={{ marginTop: "2%" }}
              severity="success"
              label="Registrar"
              onClick={(e) => {
                updateDegustacao(e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
