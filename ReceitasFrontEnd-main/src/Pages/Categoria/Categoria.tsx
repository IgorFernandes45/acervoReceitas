import "./categoria.css";
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
import IncluirCategoria from "./IncluirCategoria/IncluirCategoria";
import EditarCategoria from "./EditarCategoria/EditarCategoria";
import { CategoriaDTO } from "../../models/CategoriaDTO";

export default function Categoria() {
  const [find, setFind] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<any>();
  const [showNovoCategoria, setShowNovoCategoria] = useState(false);
  const [showEditCategoria, setShowEditCategoria] = useState(false);
  const [showDeleteCategoria, setShowDeleteCategoria] = useState(false);
  const [categoria, setCategoria] = useState<CategoriaDTO[]>([]);
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
      .get("http://localhost:3000/chef/categoria")
      .then((result) => {
        if (result.data.Status) {
          setCategoria(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const deleteCategoria = async (id: number) => {
    axios
      .delete(`http://localhost:3000/chef/delete_categoria/` + id)
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
        <h1>Categoria</h1>

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
                label="Categoria"
                icon="pi pi-plus"
                onClick={() => setShowNovoCategoria(true)}
              />
            </div>
          </div>
        </div>

        <DataTable
          loading={loading}
          selectionMode="single"
          selection={selectedCategoria}
          onSelectionChange={(e) => {
            setSelectedCategoria(e.value);
          }}
          tableStyle={{ minWidth: "50rem" }}
          value={categoria}
        >
          <Column
            body={(data) => {
              return (
                <span>
                  {data.idCategoria}
                </span>
              );
            }}
            header="Id"
          ></Column>
          <Column
            field="role"
            header="Categoria"
            body={(data) => (
              <div>
                <span>{data.nome}</span>
              </div>
            )}
          ></Column>
          <Column
            field="action"
            header="Ações"
            body={(data) => (
              <div>
                {selectedCategoria != undefined ? (

                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => {
                      setShowEditCategoria(true);
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
                      accept: () => deleteCategoria(data.idCategoria),
                      reject: () => setShowDeleteCategoria(false),
                    });
                  }}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        header="Editar Categoria"
        visible={showEditCategoria}
        style={{ width: "50vw" }}
        onHide={() => setShowEditCategoria(false)}
      >
        <EditarCategoria
          categoriaId={selectedCategoria}
          closeDialog={() => {
            setShowEditCategoria(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></EditarCategoria>
      </Dialog>
      <Dialog
        header="Incluir Categoria"
        visible={showNovoCategoria}
        style={{ width: "50vw" }}
        onHide={() => {
          setShowNovoCategoria(false);
        }}
      >
        <IncluirCategoria
          closeDialog={() => {
            setShowNovoCategoria(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></IncluirCategoria>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
