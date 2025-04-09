import "./degustacao.css";
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
import EditarDegustacao from "./EditarDegustacao/EditarDegustacao";
import { Toast, ToastMessage } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DegustacaoDTO } from "../../models/DegustacaoDTO";
import IncluirDegustacao from "./IncluirDegustacao/IncluirDegustacao";

export default function Degustacao() {
  const [find, setFind] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDegustacao, setSelectedDegustacao] = useState<any>();
  const [showNewDegustacao, setShowNewDegustacao] = useState(false);
  const [showEditDegustacao, setShowEditDegustacao] = useState(false);
  const [showDeleteDegustacao, setShowDeleteDegustacao] = useState(false);
  const [degustacao, setDegustacao] = useState<DegustacaoDTO[]>([]);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const showToast = (
    severity: ToastMessage["severity"],
    summary: string,
    detail: string
  ) => {
    toast.current?.show([{ severity, summary, detail }]);
  };

  const fetchDegustacao = async () => {
    await axios
      .get("http://localhost:3000/taster/degustacao")
      .then((result) => {
        if (result.data.Status) {
          setDegustacao(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchDegustacao();
  }, []);

  const deleteDegustacao = async (
    idDegustador: number,
    Receita_nome: string,
    idCozinheiro: number
  ) => {
    axios
      .delete(
        `http://localhost:3000/taster/delete_degustacao/${idDegustador}/${Receita_nome}/${idCozinheiro}`
      )
      .then((result) => {
        if (result.data.Status) {
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
        <h1>Avalição</h1>

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
                onClick={() => setShowNewDegustacao(true)}
              />
            </div>
          </div>
        </div>

        <DataTable
          loading={loading}
          selectionMode="single"
          selection={selectedDegustacao}
          onSelectionChange={(e) => {
            setSelectedDegustacao(e.value);
          }}
          tableStyle={{ minWidth: "50rem" }}
          value={degustacao}
        >
          <Column
            body={(data) => {
              return (
                <span>
                  {new Date(data.Data_Degustacao).toLocaleDateString("pt-BR")}
                </span>
              );
            }}
            header="Data de Avaliação"
          ></Column>
          <Column
            field="degustador"
            header="Degustador"
            body={(data) => (
              <div>
                <span>{data.Degustador}</span>
              </div>
            )}
          ></Column>
          <Column
            field="receita"
            header="Receita"
            body={(data) => (
              <div>
                <span>{data.Receita_nome}</span>
              </div>
            )}
          ></Column>
          <Column
            field="nota"
            header="Nota"
            body={(data) => (
              <div>
                <span>{data.Nota_Degustacao}</span>
              </div>
            )}
          ></Column>
          <Column
            field="foto"
            header="Foto"
            body={(data) =>
              data.Imagem == null ? (
                <></>
              ) : (
                <div>
                  <img
                    src={`http://localhost:3000/Images/${data.Imagem}`}
                    alt="Imagem"
                    style={{ width: "100px", height: "auto" }}
                  />
                </div>
              )
            }
          ></Column>
          <Column
            field="action"
            header="Ações"
            body={(data) => (
              <div>
                {selectedDegustacao != undefined ? (
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => {
                      setShowEditDegustacao(true);
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
                      accept: () => {
                        deleteDegustacao(
                          data.idDegustador,
                          data.Receita_nome,
                          data.idCozinheiro
                        );
                        fetchDegustacao();
                      },
                      reject: () => setShowDeleteDegustacao(false),
                    });
                  }}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        header="Incluir Avaliação"
        visible={showNewDegustacao}
        style={{ width: "80vw" }}
        onHide={() => {
          setShowNewDegustacao(false);
        }}
      >
        <IncluirDegustacao
          closeDialog={() => {
            setShowNewDegustacao(false);
            fetchDegustacao();
          }}
          onSuccess={showToast}
          onError={showToast}
        ></IncluirDegustacao>
      </Dialog>
      <Dialog
        header="Editar Avaliação"
        visible={showEditDegustacao}
        style={{ width: "80vw" }}
        onHide={() => setShowEditDegustacao(false)}
      >
        <EditarDegustacao
          idCozinheiro={selectedDegustacao?.idCozinheiro}
          Receita_nome={selectedDegustacao?.Receita_nome}
          idDegustador={selectedDegustacao?.idDegustador}
          closeDialog={() => {
            setShowEditDegustacao(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></EditarDegustacao>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
