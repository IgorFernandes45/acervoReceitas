import "./ingrediente.css";
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
import IncluirIngrediente from "./IncluirIngredientes/IncluirIngredientes";
import EditarIngrediente from "./EditarIngredientes/EditarIngredientes";
import { Toast, ToastMessage } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { IngredientesDTO } from "../../models/IngredientesDTO";

export default function Ingredientes() {
  const [find, setFind] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIngredientes, setSelectedIngredientes] =
    useState<IngredientesDTO | null>(null);
  const [showNewIngredientes, setShowNewIngredientes] = useState(false);
  const [showEditIngredientes, setShowEditIngredientes] = useState(false);
  const [showDeleteIngredientes, setShowDeleteIngredientes] = useState(false);
  const [ingredientes, setIngredientes] = useState<IngredientesDTO[]>([]);
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

  const deleteIngredientes = async (idIngredientes: number) => {
    axios
      .delete(
        `http://localhost:3000/chef/delete_ingredientes/${idIngredientes}`
      )
      .then((result) => {
        if (result.data.Status) {
          setIngredientes(
            ingredientes.filter(
              (ingrediente) => ingrediente.idIngredientes !== idIngredientes
            )
          );
          showToast("success", "Sucesso", "Ingrediente deletado com sucesso!");
        } else {
          showToast("error", "Erro", "Ingrediente sendo utilizado");
        }
      })
      .catch((err) => {
        console.log(err);
        showToast("error", "Erro", "Erro ao deletar ingrediente.");
      });
  };

  return (
    <div className="wallet-container">
      <Toast ref={toast} />
      <div className="wallet-main-content">
        <h1>Ingredientes</h1>

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
                onClick={() => setShowNewIngredientes(true)}
              />
            </div>
          </div>
        </div>

        <DataTable
          loading={loading}
          selectionMode="single"
          selection={selectedIngredientes}
          onSelectionChange={(e) => {
            setSelectedIngredientes(e.value);
          }}
          tableStyle={{ minWidth: "50rem" }}
          value={ingredientes}
        >
          <Column
            field="nome"
            header="Nome"
            body={(data) => (
              <div>
                <span>{data.Nome}</span>
              </div>
            )}
          ></Column>
          <Column
            field="descricao"
            header="Descrição"
            body={(data) => (
              <div>
                <span>{data.descricao}</span>
              </div>
            )}
          ></Column>
          <Column
            field="action"
            header="Ações"
            body={(data) => (
              <div>
                {selectedIngredientes != undefined ? (
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => {
                      setShowEditIngredientes(true);
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
                      header: "Deletar Ingrediente",
                      accept: () => deleteIngredientes(data.idIngredientes),
                    });
                  }}
                />
              </div>
            )}
          />
        </DataTable>
      </div>

      <Dialog
        header="Incluir Ingrediente"
        visible={showNewIngredientes}
        style={{ width: "50vw" }}
        onHide={() => setShowNewIngredientes(false)}
      >
        <IncluirIngrediente
          closeDialog={() => setShowNewIngredientes(false)}
          onSuccess={showToast}
          onError={showToast}
        />
      </Dialog>

      <Dialog
        header="Editar Ingrediente"
        visible={showEditIngredientes}
        style={{ width: "50vw" }}
        onHide={() => setShowEditIngredientes(false)}
      >
        <EditarIngrediente
          ingrediente={selectedIngredientes}
          closeDialog={() => setShowEditIngredientes(false)}
          onSuccess={showToast}
          onError={showToast}
        />
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
