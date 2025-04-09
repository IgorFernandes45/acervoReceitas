import { useState, useEffect, useRef } from "react";
import "./editFuncionario.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { Toast, ToastMessage } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { FuncionarioDTO } from "../../../models/FuncionarioDTO";
import { InputNumber } from "primereact/inputnumber";
import { CargoDTO } from "../../../models/CargoDTO";

export default function EditarFuncionario({
  closeDialog,
  funcionarioId,
  onSuccess,
  onError,
}: {
  closeDialog: any;
  funcionarioId: FuncionarioDTO;
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
  const [cargo, setCargo] = useState<CargoDTO[]>([]);
  const [funcionario, setFuncionario] = useState({
    nome: "",
    rg: "",
    data_admissao: "",
    salario: 0,
    idCargo: "",
    email: "",
  });
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

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/auth/edit_funcionario/${funcionarioId?.idFuncionario}`
      )
      .then((result) => {
        console.log(funcionario.data_admissao);
        setFuncionario({
          ...funcionario,
          nome: result.data.Result[0].Nome,
          rg: result.data.Result[0].Rg,
          salario: result.data.Result[0].Salario,
          idCargo: result.data.Result[0].idCargo,
          email: result.data.Result[0].email,
          data_admissao: new Date(result.data.Result[0].Data_admissao)
            .toISOString()
            .split("T")[0],
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const updateFuncionario = (e: any) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:3000/auth/edit_funcionario/${funcionarioId?.idFuncionario}`,
        {
          Nome: funcionario.nome,
          Rg: funcionario.rg,
          Data_admissao: funcionario.data_admissao,
          Salario: funcionario.salario,
          idCargo: parseInt(funcionario.idCargo),
          email: funcionario.email,
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
      {/* <h1>Incluir Funcionário</h1> */}

      <div className="flex-1 p-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Email</label>
              <InputText
                value={funcionario.email}
                className={sharedClasses.InputText}
                onChange={(e) =>
                  setFuncionario({ ...funcionario, email: e.target.value })
                }
                type="email"
                placeholder="Email"
              />
              <label className="block mb-2">Salário</label>
              <InputNumber
                value={funcionario.salario}
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
                value={funcionario.nome}
                type="text"
                placeholder="Nome"
                className={sharedClasses.InputText}
                onChange={(e) =>
                  setFuncionario({ ...funcionario, nome: e.target.value })
                }
              />
              <label className="block mb-2">RG</label>
              <InputText
                value={funcionario.rg}
                className={sharedClasses.InputText}
                type="number"
                placeholder="RG"
                onChange={(e) =>
                  setFuncionario({ ...funcionario, rg: e.target.value! })
                }
              />
              <label className="block mb-2">Data de Nascimento</label>
              <InputText
                value={funcionario.data_admissao}
                className={sharedClasses.InputText}
                type="date"
                onChange={(e) =>
                  setFuncionario({
                    ...funcionario,
                    data_admissao: e.target.value!,
                  })
                }
              />
              <label className="block mb-2">Cargo</label>
              <select
                value={funcionario.idCargo}
                className={sharedClasses.InputText}
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
              label="Atualizar"
              onClick={(e) => {
                updateFuncionario(e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
