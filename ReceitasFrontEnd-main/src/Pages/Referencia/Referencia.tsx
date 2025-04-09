import "./referencia.css";
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
import IncluirReferencia from "./IncluirReferencia/IncluirReferencia";
import { Toast, ToastMessage } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ReferenciaDTO } from "../../models/ReferenciaDTO";
import EditarReferencia from "./EditarReferencia/editReferencia";

export default function Referencia() {
  const [find, setFind] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedReferencia, setSelectedReferencia] = useState<any>();
  const [showNewReferencia, setShowNewReferencia] = useState(false);
  const [showEditReferencia, setShowEditReferencia] = useState(false);
  const [showDeleteReferencia, setShowDeleteReferencia] = useState(false);
  const [referencia, setReferencia] = useState<ReferenciaDTO[]>([]);
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
    console.log(selectedReferencia)
  }, [selectedReferencia]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/referencia")
      .then((result) => {
        if (result.data.Status) {
          setReferencia(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const deleteReferencia = async (
    idFuncionario: number,
    idRestaurante: number
  ) => {
    axios
      .delete(
        `http://localhost:3000/auth/delete_referencia/${idFuncionario}/${idRestaurante}`
      )
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Status);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="wallet-container">
      <Toast ref={toast} />
      <div className="wallet-main-content">
        <h1>Referencias</h1>

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
                onClick={() => setShowNewReferencia(true)}
              />
            </div>
          </div>
        </div>

        <DataTable
          loading={loading}
          selectionMode="single"
          selection={selectedReferencia}
          onSelectionChange={(e) => {
            setSelectedReferencia(e.value);
          }}
          tableStyle={{ minWidth: "50rem" }}
          value={referencia}
        >
          <Column
            body={(data) => {
              return (
                <span>
                  {new Date(data.Data_Inicio).toLocaleDateString("pt-BR")}
                </span>
              );
            }}
            header="Data de Início"
          ></Column>
          <Column
            body={(data) => {
              return (
                <span>
                  {new Date(data.Data_Fim).toLocaleDateString("pt-BR")}
                </span>
              );
            }}
            header="Data de fim"
          ></Column>
          <Column
            field="name"
            header="Funcionario"
            body={(data) => (
              <div>
                <span>{data.NomeFuncionario}</span>
              </div>
            )}
          ></Column>
          <Column
            field="restaurant"
            header="Restaurante"
            body={(data) => (
              <div>
                <span>{data.NomeRestaurante}</span>
              </div>
            )}
          ></Column>
          <Column
            field="action"
            header="Ações"
            body={(data) => (
              <div>
                {selectedReferencia != undefined ? (

                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => {
                      setShowEditReferencia(true);
                    }}
                  />
                )
                
                : (<></>)}
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-text"
                  onClick={() => {
                    confirmDialog({
                      message: "Deseja deletar?",
                      header: "Deletar Funcionário",
                      accept: () =>
                        deleteReferencia(
                          data.idFuncionario,
                          data.idRestaurante
                        ),
                      reject: () => setShowDeleteReferencia(false),
                    });
                  }}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        header="Incluir Referência"
        visible={showNewReferencia}
        style={{ width: "50vw" }}
        onHide={() => {
          setShowNewReferencia(false);
        }}
      >
        <IncluirReferencia
          closeDialog={() => {
            setShowNewReferencia(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></IncluirReferencia>
      </Dialog>
      <Dialog
        header="Editar Referência"
        visible={showEditReferencia}
        style={{ width: "50vw" }}
        onHide={() => setShowEditReferencia(false)}
      >
        <EditarReferencia
          funcionarioId={selectedReferencia}
          closeDialog={() => {
            setShowEditReferencia(false);
          }}
          onSuccess={showToast}
          onError={showToast}
          restauranteId={selectedReferencia}
        ></EditarReferencia>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
