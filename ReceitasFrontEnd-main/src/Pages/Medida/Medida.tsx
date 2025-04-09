import "./medida.css";
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
import IncluirMedida from "./IncluirMedida/IncluirMedida";
import EditarMedida from "./EditarMedida/EditarMedida";
import { Toast, ToastMessage } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { MedidaDTO } from "../../models/MedidaDTO";

export default function Medida() {
  const [find, setFind] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMedida, setSelectedMedida] = useState<any>();
  const [showNewMedida, setShowNewMedida] = useState(false);
  const [showEditMedida, setShowEditMedida] = useState(false);
  const [showDeleteMedida, setShowDeleteMedida] = useState(false);
  const [medida, setMedida] = useState<MedidaDTO[]>([]);
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

  const deleteMedida = async (nome: string, idMedida: number) => {
    axios
      .delete(`http://localhost:3000/chef/delete_medida/${idMedida}`)
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
        <h1>Medida</h1>

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
                onClick={() => setShowNewMedida(true)}
              />
            </div>
          </div>
        </div>

        <DataTable
          loading={loading}
          selectionMode="single"
          selection={selectedMedida}
          onSelectionChange={(e) => {
            setSelectedMedida(e.value);
          }}
          tableStyle={{ minWidth: "50rem" }}
          value={medida}
        >
          <Column
            field="id"
            header="Id"
            body={(data) => (
              <div>
                <span>{data.idMedida}</span>
              </div>
            )}
          ></Column>
          <Column
            field="nome"
            header="Nome"
            body={(data) => (
              <div>
                <span>{data.Descricao}</span>
              </div>
            )}
          ></Column>
          <Column
            field="action"
            header="Ações"
            body={(data) => (
              <div>
                {selectedMedida != undefined ? (
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => {
                      setShowEditMedida(true);
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
                      accept: () => deleteMedida(data.nome, data.idMedida),
                      reject: () => setShowDeleteMedida(false),
                    });
                  }}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        header="Incluir Medida"
        visible={showNewMedida}
        style={{ width: "50vw" }}
        onHide={() => {
          setShowNewMedida(false);
        }}
      >
        <IncluirMedida
          closeDialog={() => {
            setShowNewMedida(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></IncluirMedida>
      </Dialog>
      <Dialog
        header="Editar Medida"
        visible={showEditMedida}
        style={{ width: "50vw" }}
        onHide={() => setShowEditMedida(false)}
      >
        <EditarMedida
          idMedida={selectedMedida?.idMedida}
          closeDialog={() => {
            setShowEditMedida(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></EditarMedida>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
