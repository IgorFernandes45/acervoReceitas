import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast, ToastMessage } from "primereact/toast";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  let navigate = useNavigate();
  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");

  const toast = useRef<Toast>(null);

  const show = (
    severity: ToastMessage["severity"],
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail });
  };

  async function LogUser(e: any) {
    e.preventDefault();
    if (user !== "" && senha !== "") {
      try {
        const result = await axios
          .post("http://localhost:3000/auth/adminlogin", {
            email: user,
            password: senha,
          })
          .then((result) => {
            if (result.data.loginStatus) {
              navigate("/dashboard");
              sessionStorage.setItem(
                "access_token",
                result?.data.idToken.jwtToken
              );
              sessionStorage.setItem(
                "refresh_token",
                result?.data.idToken.refreshToken
              );
            } else {
              show("error", "Erro", "Usuário não credenciado");
            }
          });
      } catch (err: any) {
        console.log(err);
        show("error", "Erro", "Usuário não credenciado");
      }
    } else {
      show("warn", "Atenção!", "Insira os dados em todos os campos.");
    }
  }

  return (
    <div className="container">
      <div className="fitting">
        <img
          width="100%"
          height="100%"
          style={{ objectFit: "cover" }}
          src="/img/panela.png"
        >
          {/* <source src={Image} type="video/mp4" /> */}
        </img>
      </div>

      <div className="login">
        <div className="pull-everybody">
          <div className="logo">
            <img width={250} height={250} src="/img/pelegoLogo.svg"></img>
            {/* <SVGLogo fill="#2B2B2B" width={250} height={250} /> */}
          </div>

          <form onSubmit={(e) => LogUser(e)}>
            <Toast ref={toast} />
            <div className="login-user" style={{ width: "100%" }}>
              <label>Usuário</label>
              <InputText
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <div style={{ marginTop: "1%", width: "100%" }}>
              <label>Senha</label>
              <InputText
                id="password"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                // feedback={false}
                // toggleMask
              />
            </div>
            <Button
              label="Entrar"
              onClick={(e) => LogUser(e)}
              style={{ marginTop: "10%" }}
            />

            <div className="Register" style={{ marginTop: "5%" }}>
              {/* <Link to={`/register`}>Não possuo conta</Link> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
