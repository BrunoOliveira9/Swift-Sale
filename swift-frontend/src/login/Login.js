import React from "react";
import { useNavigate } from "react-router-dom";  // Importar useNavigate
import "./Login.css";
import Logo from "../SW.svg";

function Login() {
  const navigate = useNavigate();  // Hook para navegação

  // Função que será chamada ao clicar no botão
  const handleLoginClick = () => {
    navigate("/inicio");  // Redireciona para a rota /inicio
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={Logo} alt="Logo" className="login-logo" />
        <h2 className="login-subtitle">Sistema de PDV</h2>

        <p className="login-instruction">Informe usuário e senha para entrar no sistema.</p>

        <input type="text" placeholder="Usuário" className="login-input" />
        <input type="password" placeholder="Senha" className="login-input" />

        {/* Botão Login com evento onClick */}
        <button className="login-button" onClick={handleLoginClick}>
          Login
        </button>

        <div className="login-remember">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Permanecer conectado</label>
        </div>

        <footer className="login-footer">© Swift Sistemas</footer>
      </div>
    </div>
  );
}

export default Login;
