import "./receita.css";
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
import IncluirReceita from "./IncluirReceita/IncluirReceita";
import EditarReceita from "./EditarReceita/editReceita";
import { Toast, ToastMessage } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ReceitaDTO } from "../../models/ReceitaDTO";

export default function Receita() {
  const [find, setFind] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedReceita, setSelectedReceita] = useState<any>();
  const [showNewReceita, setShowNewReceita] = useState(false);
  const [showEditReceita, setShowEditReceita] = useState(false);
  const [showDeleteReceita, setShowDeleteReceita] = useState(false);
  const [receita, setReceita] = useState<ReceitaDTO[]>([]);
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

  const deleteReceita = async (nome: string, idCozinheiro: number) => {
    axios
      .delete(
        `http://localhost:3000/chef/delete_receita/${nome}/${idCozinheiro}`
      )
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
          showToast("success", "Sucesso", "Receita deletada com sucesso!");
        } else {
          showToast("error", "Erro", "Delete a composição ou avaliação dessa receita");
        }
      })
      .catch((err) => {
        showToast("error", "Erro", "Erro ao deletar receita.");
        console.log(err);
      });
  };

  return (
    <div className="wallet-container">
      <Toast ref={toast} />
      <div className="wallet-main-content">
        <h1>Receitas</h1>

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
                onClick={() => setShowNewReceita(true)}
              />
            </div>
            <div className="wallet-last-button">
              <Button
                id="composicao"
                label="Composição"
                onClick={() => navigate("composicao")}
              />
            </div>
          </div>
        </div>

        <DataTable
          loading={loading}
          selectionMode="single"
          selection={selectedReceita}
          onSelectionChange={(e) => {
            setSelectedReceita(e.value);
          }}
          tableStyle={{ minWidth: "50rem" }}
          value={receita}
        >
          <Column
            body={(data) => {
              return (
                <span>{new Date(data.Data).toLocaleDateString("pt-BR")}</span>
              );
            }}
            header="Data de Criação"
          ></Column>
          <Column
            field="name"
            header="Nome"
            body={(data) => (
              <div>
                <span>{data.nome}</span>
              </div>
            )}
          ></Column>
          <Column
            field="indice"
            header="Índice"
            body={(data) => (
              <div>
                <span>{data.IndRecInedita}</span>
              </div>
            )}
          ></Column>
          <Column
            field="categoria"
            header="Categoria"
            body={(data) => (
              <div>
                <span>{data.Categoria}</span>
              </div>
            )}
          ></Column>
          <Column
            field="chef"
            header="Cozinheiro"
            body={(data) => (
              <div>
                <span>{data.Cozinheiro}</span>
              </div>
            )}
          ></Column>
          <Column
            field="action"
            header="Ações"
            body={(data) => (
              <div>
                {selectedReceita != undefined ? (
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => {
                      setShowEditReceita(true);
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
                      header: "Deletar Receita",
                      accept: () => deleteReceita(data.nome, data.idCozinheiro),
                      reject: () => setShowDeleteReceita(false),
                    });
                  }}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        header="Incluir Receita"
        visible={showNewReceita}
        style={{ width: "50vw" }}
        onHide={() => {
          setShowNewReceita(false);
        }}
      >
        <IncluirReceita
          closeDialog={() => {
            setShowNewReceita(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></IncluirReceita>
      </Dialog>
      <Dialog
        header="Editar Receita"
        visible={showEditReceita}
        style={{ width: "50vw" }}
        onHide={() => setShowEditReceita(false)}
      >
        <EditarReceita
          idCozinheiro={selectedReceita?.idCozinheiro}
          nome={selectedReceita?.nome}
          closeDialog={() => {
            setShowEditReceita(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></EditarReceita>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
