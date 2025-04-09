import "./composicao.css";
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
import IncluirComposicao from "./IncluirComposicao/IncluirCompsicao";
import EditarComposicao from "./EditarComposicao/editComposicao";
import { Toast, ToastMessage } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ComposicaoDTO } from "../../models/ComposicaoDTO";

export default function Composicao() {
  const [find, setFind] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedComposicao, setSelectedComposicao] = useState<any>();
  const [showNewComposicao, setShowNewComposicao] = useState(false);
  const [showEditComposicao, setShowEditComposicao] = useState(false);
  const [showDeleteComposicao, setShowDeleteComposicao] = useState(false);
  const [composicao, setComposicao] = useState<ComposicaoDTO[]>([]);
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
      .get("http://localhost:3000/chef/composicao")
      .then((result) => {
        if (result.data.Status) {
          setComposicao(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const deleteComposicao = async (
    idIngredientes: number,
    Receita_nome: string,
    idCozinheiro: number
  ) => {
    axios
      .delete(
        `http://localhost:3000/chef/delete_composicao/${idIngredientes}/${Receita_nome}/${idCozinheiro}`
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
        <h1>Composição</h1>

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
                onClick={() => setShowNewComposicao(true)}
              />
            </div>
            <div className="wallet-last-button">
              <Button
                id="return"
                label="Voltar"
                onClick={() => navigate('/criarReceita')}
              />
            </div>
          </div>
        </div>

        <DataTable
          loading={loading}
          selectionMode="single"
          selection={selectedComposicao}
          onSelectionChange={(e) => {
            setSelectedComposicao(e.value);
          }}
          tableStyle={{ minWidth: "50rem" }}
          value={composicao}
        >
          <Column
            body={(data) => {
              return (
                <span>
                  <span>{data.Receita_nome}</span>
                </span>
              );
            }}
            header="Receita"
          ></Column>
          <Column
            field="cozinheiro"
            header="Cozinheiro"
            body={(data) => (
              <div>
                <span>{data.Cozinheiro}</span>
              </div>
            )}
          ></Column>
          <Column
            field="ingrediente"
            header="Ingredientes"
            body={(data) => (
              <div>
                <span>{data.Ingredientes}</span>
              </div>
            )}
          ></Column>
          <Column
            field="medida"
            header="Medida"
            body={(data) => (
              <div>
                <span>{data.Medida}</span>
              </div>
            )}
          ></Column>
          <Column
            field="qtd"
            header="Quantidade"
            body={(data) => (
              <div>
                <span>{data.QuantidadeIngrediente}</span>
              </div>
            )}
          ></Column>
          <Column
            field="action"
            header="Ações"
            body={(data) => (
              <div>
                {selectedComposicao != undefined ? (

                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => {
                      setShowEditComposicao(true);
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
                      header: "Deletar Composicao",
                      accept: () =>
                        deleteComposicao(
                          data.idIngredientes,
                          data.Receita_nome,
                          data.idCozinheiro
                        ),
                      reject: () => setShowNewComposicao(false),
                    });
                  }}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        header="Incluir Composicao"
        visible={showNewComposicao}
        style={{ width: "50vw" }}
        onHide={() => {
          setShowNewComposicao(false);
        }}
      >
        <IncluirComposicao
          closeDialog={() => {
            setShowNewComposicao(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></IncluirComposicao>
      </Dialog>
      <Dialog
        header="Editar Composicao"
        visible={showEditComposicao}
        style={{ width: "50vw" }}
        onHide={() => setShowEditComposicao(false)}
      >
        <EditarComposicao
          idCozinheiro={selectedComposicao?.idCozinheiro}
          nomeReceita={selectedComposicao?.Receita_nome}
          idIngredientes={selectedComposicao?.idIngredientes}
          // idIngrediente={selectedComposicao?.idIngrediente}
          closeDialog={() => {
            setShowEditComposicao(false);
          }}
          onSuccess={showToast}
          onError={showToast}
        ></EditarComposicao>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
