import React, { useState } from 'react';
import './Inicio.css';
import logo from './SW.svg';
import { useAuth } from '../../services/auth/auth-context.service.tsx';
import showToast from '../../components/toast/Toast.jsx';

import { Link } from 'react-router-dom'; 

// Icones
import { FaChartPie, FaFileInvoiceDollar, FaChartLine, FaBoxOpen, FaUserFriends, FaCreditCard, FaTools, FaShippingFast, FaFileAlt} from 'react-icons/fa';

// novos icones
const menuItems = [
  { title: 'Vendas', icon: <FaChartPie />, color: '#42a5f5', path: '/vendas' },
  { title: 'Faturamento', icon: <FaFileInvoiceDollar />, color: '#42a5f5', path: '/faturamento' },
  { title: 'Usuário e Segurança', icon: <FaChartLine />, color: '#42a5f5', path: '/usuarios' },
  { title: 'Produtos', icon: <FaBoxOpen />, color: '#6d4c41', path: '/produtos' },
  { title: 'Clientes', icon: <FaUserFriends />, color: '#78909c', path: '/clientes' },
  { title: 'Financeiro', icon: <FaCreditCard />, color: '#26a69a', path: '/financeiro' },
  { title: 'Serviços', icon: <FaTools />, color: '#ab47bc', path: '/servicos' },
  { title: 'Logística', icon: <FaShippingFast />, color: '#00bcd4', path: '/logistica' },
  { title: 'Relatórios', icon: <FaFileAlt />, color: '#ffa726', path: '/relatorios' },
];

function Inicio() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { logout } = useAuth();

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="container-principal">
      {!menuAberto && (
        <button className="open-menu-button" onClick={toggleMenu}>
          +
        </button>
      )}

      
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
            <li><button>Vendas</button></li>
            <li><button>Faturamento</button></li>
            <li><button>Usuário e segurança</button></li>
            <li><button>Produtos</button></li>
            <li><button>Clientes</button></li>
            <li><button>Financeiro</button></li>
          </ul>
        </div>
        <div className="menu-section">
          <h3>Configuração</h3>
          <ul>
            <li><button>Relatórios</button></li>
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

        
        <div className="modules-grid">
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index} className="module-link">
              <div className="module-card">
                <div className="icon-container" style={{ color: item.color }}>
                  {React.cloneElement(item.icon, { size: 40 })}
                </div>
                <p>{item.title}</p>
              </div>
            </Link>
           ))}
        </div>
      </main>
    </div>
  );
}

export default Inicio;