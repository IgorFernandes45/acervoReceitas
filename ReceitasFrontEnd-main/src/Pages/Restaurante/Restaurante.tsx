import "./Restaurante.css";
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
import { Toast, ToastMessage } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import IncluirRestaurante from "./IncluirRestaurante/IncluirRestaurante";
import EditarRestaurante from "./EditarRestaurante/EditarRestaurante";
import { RestauranteDTO } from "../../models/RestauranteDTO";

export default function Restaurante() {
  const [find, setFind] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRestaurante, setSelectedRestaurante] = useState<any>();
  const [showNovoRestaurante, setShowNovoRestaurante] = useState(false);
  const [showEditRestaurante, setShowEditRestaurante] = useState(false);
  const [showDeleteRestaurante, setShowDeleteRestaurante] = useState(false);
  const [restaurante, setRestaurante] = useState<RestauranteDTO[]>([]);
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
      .get("http://localhost:3000/auth/restaurante")
      .then((result) => {
        if (result.data.Status) {
          setRestaurante(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const deleteFuncionario = async (id: number) => {
    axios
      .delete(`http://localhost:3000/auth/delete_restaurante/` + id)
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
        <h1>Restaurante</h1>

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
                id="inclusaoRestaurante"
                label="Restaurante"
                icon="pi pi-plus"
                onClick={() => setShowNovoRestaurante(true)}
              />
            </div>
          </div>
        </div>

        <DataTable
          loading={loading}
          selectionMode="single"
          selection={selectedRestaurante}
          onSelectionChange={(e) => {
            setSelectedRestaurante(e.value);
          }}
          tableStyle={{ minWidth: "50rem" }}
          value={restaurante}
        >
          <Column
            body={(data) => {
              return (
                <span>
                  {data.idRestaurante}
                </span>
              );
            }}
            header="Id"
          ></Column>
          <Column
            field="restaurante"
            header="Restaurante"
            body={(data) => (
              <div>
                <span>{data.Nome}</span>
              </div>
            )}
          ></Column>
          <Column
            field="action"
            header="Ações"
            body={(data) => (
              <div>
                {selectedRestaurante != undefined ? (

                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => {
                      setShowEditRestaurante(true);
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
                      header: "Deletar Cargo",
                      accept: () => deleteFuncionario(data.idRestaurante),
                      reject: () => setShowDeleteRestaurante(false),
                    });
                  }}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        header="Editar Cargo"
        visible={showEditRestaurante}
        style={{ width: "50vw" }}
        onHide={() => setShowEditRestaurante(false)}
      >
        <EditarRestaurante
          restauranteId={selectedRestaurante}
          closeDialog={() => {
            setShowEditRestaurante(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></EditarRestaurante>
      </Dialog>
      <Dialog
        header="Incluir Restaurante"
        visible={showNovoRestaurante}
        style={{ width: "50vw" }}
        onHide={() => {
          setShowNovoRestaurante(false);
        }}
      >
        <IncluirRestaurante
          closeDialog={() => {
            setShowNovoRestaurante(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></IncluirRestaurante>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
