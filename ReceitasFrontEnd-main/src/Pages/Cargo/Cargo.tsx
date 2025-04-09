import "./cargo.css";
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
import IncluirCargo from "./IncluirCargo/IncluirCargo";
import EditarCargo from "./EditarCargo/EditarCargo";
import { CargoDTO } from "../../models/CargoDTO";

export default function Cargo() {
  const [find, setFind] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<any>();
  const [showNovoCargo, setShowNovoCargo] = useState(false);
  const [showEditCargo, setShowEditCargo] = useState(false);
  const [showDeleteCargo, setShowDeleteCargo] = useState(false);
  const [cargo, setCargo] = useState<CargoDTO[]>([]);
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

  const deleteCargo = async (id: number) => {
    axios
      .delete(`http://localhost:3000/auth/delete_cargo/` + id)
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
        <h1>Cargo</h1>

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
                id="inclusaoCargo"
                label="Cargo"
                icon="pi pi-plus"
                onClick={() => setShowNovoCargo(true)}
              />
            </div>
          </div>
        </div>

        <DataTable
          loading={loading}
          selectionMode="single"
          selection={selectedCargo}
          onSelectionChange={(e) => {
            setSelectedCargo(e.value);
          }}
          tableStyle={{ minWidth: "50rem" }}
          value={cargo}
        >
          <Column
            body={(data) => {
              return <span>{data.idCargo}</span>;
            }}
            header="Id"
          ></Column>
          <Column
            field="role"
            header="Cargo"
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
                {selectedCargo != undefined ? (
                  <Button
                    id="editBtn"
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => {
                      setShowEditCargo(true);
                    }}
                  />
                ) : (
                  <></>
                )}
                <Button
                  id="deleteBtn"
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-text"
                  onClick={() => {
                    confirmDialog({
                      message: "Deseja deletar?",
                      header: "Deletar Cargo",
                      accept: () => deleteCargo(data.idCargo),
                      reject: () => setShowDeleteCargo(false),
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
        visible={showEditCargo}
        style={{ width: "50vw" }}
        onHide={() => setShowEditCargo(false)}
      >
        <EditarCargo
          cargoId={selectedCargo}
          closeDialog={() => {
            setShowEditCargo(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></EditarCargo>
      </Dialog>
      <Dialog
        header="Incluir Cargo"
        visible={showNovoCargo}
        style={{ width: "50vw" }}
        onHide={() => {
          setShowNovoCargo(false);
        }}
      >
        <IncluirCargo
          closeDialog={() => {
            setShowNovoCargo(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></IncluirCargo>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
