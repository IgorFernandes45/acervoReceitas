import "./funcionario.css";
import { Menu } from "primereact/menu";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { SplitButton } from "primereact/splitbutton";
import { MenuItem } from "primereact/menuitem";
import { Dialog } from "primereact/dialog";
import IncluirFuncionario from "./IncluirFuncionario/IncluirFuncionario";
import EditarFuncionario from "./EditarFuncionario/editFuncionario";
import { Toast, ToastMessage } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FuncionarioDTO } from "../../models/FuncionarioDTO";

export default function Funcionario() {
  const [find, setFind] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<any>();
  const [showNewFuncionario, setShowNewFuncionario] = useState(false);
  const [showEditFuncionario, setShowEditFuncionario] = useState(false);
  const [showDeleteFuncionario, setShowDeleteFuncionario] = useState(false);
  const [funcionario, setFuncionario] = useState<FuncionarioDTO[]>([]);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const showToast = (
    severity: ToastMessage["severity"],
    summary: string,
    detail: string
  ) => {
    toast.current?.show([{ severity, summary, detail }]);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/funcionario")
      .then((result) => {
        if (result.data.Status) {
          setFuncionario(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const deleteFuncionario = async (id: number) => {
    axios
      .delete(`http://localhost:3000/auth/delete_funcionario/` + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
          showToast("success", "Sucesso", "Funcionário deletado com sucesso!");
        } else {
          showToast(
            "error",
            "Erro",
            "Delete as participações desse funcionário"
          );
        }
      })
      .catch((err) => {
        showToast("error", "Erro", "Erro ao deletar ingrediente.");
        console.log(err);
      });
  };

  return (
    <div className="wallet-container">
      <Toast ref={toast} />
      <div className="wallet-main-content">
        <h1>Funcionários</h1>

        <div className="wallet-menu">
          <div className="wallet-text">
            <span className="p-float-label">
              <InputText
                id="text1"
                value={find}
                onChange={(e) => setFind(e.target.value)}
              />
              <label htmlFor="text1">Nome</label>
            </span>
          </div>

          <div className="wallet-buttons-container">
            <div className="wallet-first-button">
              <Button
                label="FILTRAR"
                // onClick={() => {
                //   fetchWallets({ name: find });
                // }}
              />
            </div>

            <div className="wallet-last-button">
              <Button
                id="inclusao"
                label="INCLUIR"
                onClick={() => setShowNewFuncionario(true)}
              />
            </div>
          </div>
        </div>

        <DataTable
          loading={loading}
          selectionMode="single"
          selection={selectedFuncionario}
          onSelectionChange={(e) => {
            setSelectedFuncionario(e.value);
          }}
          tableStyle={{ minWidth: "50rem" }}
          value={funcionario}
        >
          <Column
            body={(data) => {
              return (
                <span>
                  {new Date(data.Data_admissao).toLocaleDateString("pt-BR")}
                </span>
              );
            }}
            header="Data de Admissão"
          ></Column>
          <Column
            field="name"
            header="Nome"
            body={(data) => (
              <div>
                <span>{data.Nome}</span>
              </div>
            )}
          ></Column>
          <Column
            field="rg"
            header="RG"
            body={(data) => (
              <div>
                <span>{data.Rg}</span>
              </div>
            )}
          ></Column>
          <Column
            field="currency"
            header="Salário"
            body={(data) => (
              <div>
                {Number(data.Salario).toLocaleString("pt-BR", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "BRL",
                  useGrouping: true,
                })}
              </div>
            )}
          ></Column>
          <Column
            field="role"
            header="Cargo"
            body={(data) => (
              <div>
                <span>{data.Cargo}</span>
              </div>
            )}
          ></Column>
          <Column
            field="action"
            header="Ações"
            body={(data) => (
              <div>
                {selectedFuncionario != undefined ? (
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => {
                      setShowEditFuncionario(true);
                    }}
                  />
                ) : (
                  <></>
                )}
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-text"
                  onClick={() => {
                    confirmDialog({
                      message: "Deseja deletar?",
                      header: "Deletar Funcionário",
                      accept: () => deleteFuncionario(data.idFuncionario),
                      reject: () => setShowDeleteFuncionario(false),
                    });
                  }}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        header="Incluir Funcionário"
        visible={showNewFuncionario}
        style={{ width: "50vw" }}
        onHide={() => {
          setShowNewFuncionario(false);
        }}
      >
        <IncluirFuncionario
          closeDialog={() => {
            setShowNewFuncionario(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></IncluirFuncionario>
      </Dialog>
      <Dialog
        header="Editar Funcionário"
        visible={showEditFuncionario}
        style={{ width: "50vw" }}
        onHide={() => setShowEditFuncionario(false)}
      >
        <EditarFuncionario
          funcionarioId={selectedFuncionario}
          closeDialog={() => {
            setShowEditFuncionario(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></EditarFuncionario>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
