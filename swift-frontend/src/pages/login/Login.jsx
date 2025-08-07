import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Logo from "../../pages/inicio/SW.svg";
import { login } from "../../services/auth/authentication-service.ts";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function signIn() {
    try {
      const response = await login(username, password);
      console.log("Login realizado:", response);
      navigate("/inicio");
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
      alert("Usuário ou senha inválidos");
    }
  }

  const handleLogin = (e) => {
    //definindo handleLogin
    e.preventDefault(); 
    
    signIn();
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={Logo} alt="Logo" className="login-logo" />

       
        <form onSubmit={handleLogin}>
          <h2 className="login-subtitle">Sistema de PDV</h2>

          <p className="login-instruction">Informe usuário e senha para entrar no sistema.</p>

          <input
            type="text"
            placeholder="Usuário"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        
          <button className="login-button" type="submit">
            Login
          </button>
        </form>

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