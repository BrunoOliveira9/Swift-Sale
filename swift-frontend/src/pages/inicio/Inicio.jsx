import React, { useState } from 'react';
import './Inicio.css';
import logo from './SW.svg';
import { useAuth } from '../../services/auth/auth-context.service.tsx';
import showToast from '../../components/toast/Toast.jsx';

function Inicio() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { logout } = useAuth();

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const handleLogout = async () => {
    await logout();
    showToast('info', 'Sessão encerrada', 'Você foi desconectado com sucesso.');
  };

  return (
    <div className="container-principal">
      {!menuAberto && (
        <button className="open-menu-button" onClick={toggleMenu}>
          +
        </button>
      )}

      {/* Menu lateral */}
      <aside className={`sidebar ${menuAberto ? 'aberto' : ''}`}>
        <button className="close-menu-button" onClick={toggleMenu}>
          ×
        </button>
        
        <h2 className="sidebar-title">Menu</h2>
        <div className="menu-section">
          <h3>Manutenção</h3>
          <ul>
            <li><button>Cadastro</button></li>
            <li><button>Registro</button></li>
          </ul>
        </div>
        <div className="menu-section">
          <h3>Configuração</h3>
          <ul>
            <li><button>Nota Fiscal</button></li>
          </ul>
        </div>

        <div className="menu-section logout">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="top-header">
          <img src={logo} alt="Swift Logo" className="logo-centered" />
        </div>

        <div className="buttons-section">
          <div className="buttons-grid">
            <button className="grid-button">Cadastro</button>
            <button className="grid-button">Registro</button>
            <button className="grid-button">Nota Fiscal</button>
          </div>
          <p className="instruction">Escolha uma opção</p>
        </div>
      </main>
    </div>
  );
}

export default Inicio;