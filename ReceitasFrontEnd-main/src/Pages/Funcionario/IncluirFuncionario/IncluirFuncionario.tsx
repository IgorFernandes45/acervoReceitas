import { useEffect, useRef, useState } from "react";
import "./inclusao.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { RestauranteDTO } from "../../../models/RestauranteDTO";
import { CargoDTO } from "../../../models/CargoDTO";
import { InputNumber } from "primereact/inputnumber";

export default function IncluirFuncionario({
  closeDialog,
  onSuccess,
  onError,
}: {
  closeDialog: any;
  onSuccess: Function;
  onError: Function;
}) {
  const [funcionario, setFuncionario] = useState({
    nome: "",
    rg: "",
    data_admissao: '',
    salario: 0,
    idCargo: '',
    email: "",
    password: "",
  });
  const [cargo, setCargo] = useState<CargoDTO[]>([]);
  const sharedClasses = {
    InputText: "w-full p-2 border rounded mb-4",
    select: "w-full p-2 border rounded mb-4",
    button:
      "w-full bg-green-600 text-white p-3 rounded-lg mt-4 hover:bg-green-700",
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/cargo")
      .then((result) => {
        if (result.data.Status) {
          setCargo(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const addFuncionario = (e: any) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/auth/add_funcionario", {
        Nome: funcionario.nome,
        Rg: funcionario.rg,
        Data_admissao: funcionario.data_admissao,
        Salario: funcionario.salario,
        idCargo: parseInt(funcionario.idCargo),
        email: funcionario.email,
        password: funcionario.password
      })
      .then((result) => {if(result.data.Status){
        window.location.reload();
        closeDialog();
      }else{
          alert(result.data.Status)
      }})
      .catch((err) => console.log(err));
  };

  return (
    <div className="">
      {/* <h1>Incluir Funcionário</h1> */}

      <div className="flex-1 p-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Email</label>
              <InputText
                onChange={(e) =>
                  setFuncionario({ ...funcionario, email: e.target.value })
                }
                type="email"
                className={sharedClasses.InputText}
                placeholder="Email"
              />
              <label className="block mb-2">Senha</label>
              <InputText
                type="password"
                className={sharedClasses.InputText}
                placeholder="Senha"
                onChange={(e) =>
                  setFuncionario({ ...funcionario, password: e.target.value })
                }
              />
              <label className="block mb-2">Salário</label>
              <InputNumber
                type="text"
                mode="currency"
                currency="BRL"
                minFractionDigits={2}
                maxFractionDigits={2}
                locale="pt-BR"
                placeholder="Salário"
                onChange={(e) =>
                  setFuncionario({ ...funcionario, salario: e.value! })
                }
              />
            </div>
            <div>
              <label className="block mb-2">Nome</label>
              <InputText
                type="text"
                className={sharedClasses.InputText}
                placeholder="Nome"
                onChange={(e) =>
                  setFuncionario({ ...funcionario, nome: e.target.value })
                }
              />
              <label className="block mb-2">RG</label>
              <InputText
                type="number"
                placeholder="RG"
                onChange={(e) =>
                  setFuncionario({ ...funcionario, rg: e.target.value! })
                }
              />
              <label className="block mb-2">Data de Nascimento</label>
              <InputText
                type="date"
                className={sharedClasses.InputText}
                onChange={(e) =>
                  setFuncionario({
                    ...funcionario,
                    data_admissao: e.target.value!,
                  })
                }
              />
              <label className="block mb-2">Cargo</label>
              <select
                className={sharedClasses.select}
                onChange={(e) =>
                  setFuncionario({ ...funcionario, idCargo: e.target.value })
                }
              >
                <option value="">Selecione um cargo</option>{" "}
                {cargo
                  .filter((cargoItem) => cargoItem.descricao !== null)
                  .map((cargoItem) => (
                    <option key={cargoItem.idCargo} value={cargoItem.idCargo}>
                      {cargoItem.descricao}
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
                addFuncionario(e);
                console.log(funcionario.idCargo);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
