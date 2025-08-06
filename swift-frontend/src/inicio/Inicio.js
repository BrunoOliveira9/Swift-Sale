import React, { useState } from 'react';
import './Inicio.css';
import logo from './SW.svg'; // ajuste o caminho se necessário

function Inicio() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <div className="container">
      {/* Botão de abrir menu */}
      <button className="toggle-button" onClick={toggleMenu}>
        {menuAberto ? '×' : '+'}
      </button>

      {/* Menu lateral */}
      <aside className={`sidebar ${menuAberto ? 'aberto' : 'fechado'}`}>
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
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        {/* Cabeçalho com logo centralizado */}
        <div className="top-header">
          <img src={logo} alt="Swift Logo" className="logo-centered" />
        </div>

        {/* Botões */}
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
