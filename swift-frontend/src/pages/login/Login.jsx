import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Logo from "../../pages/inicio/SW.svg";
import { login } from "../../services/auth/authentication-service.ts";
import showToast from "../../components/toast/Toast.jsx";
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Ver senha digitada
  const [showPassword, setShowPassword] = useState(false);

  async function signIn() {
    try {
      const response = await login(username, password);
      showToast('success', 'Login realizado', 'Bem-vindo ao sistema!');
      setTimeout(() => {
        navigate("/inicio");
      }, 400);
    } catch (error) {
      showToast('error', 'Erro de login', 'Usuário ou senha inválidos');
    }
  }

  const handleLogin = (e) => {
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
          
          
          <div className="password-container">
            <input
              
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/*Botão para ver a senha*/}
            <button
              type="button" 
              className="toggle-password-button"
              onClick={() => setShowPassword(!showPassword)} 
            >
              
              {showPassword ? <LiaEyeSlashSolid /> : <LiaEyeSolid />}
         </button>
          </div>

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