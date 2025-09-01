import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Button, Table, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Usuarios.css';
import { UsuarioService } from '../../services/usuarios/usuarios-service.ts';
import { Usuario } from '../../models/usuario.ts';
import ModalEdicaoUsuario from '../../components/modal/ModalEdicaoUsuario.tsx';

const _usuarioService = new UsuarioService();

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [termoBusca, setTermoBusca] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuariosDoServidor = await _usuarioService.getAllUsers();
        setUsuarios(usuariosDoServidor);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
    fetchUsuarios();
  }, []);

  const handleShowModal = (usuario: Usuario | null = null) => {
    setUsuarioAtual(usuario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioAtual(null);
  };

  const handleSave = async (dadosUsuario: Partial<Usuario>) => {
    try {
      if (usuarioAtual && usuarioAtual.id) {
        const usuarioAtualizado = await _usuarioService.updateUser(String(usuarioAtual.id), dadosUsuario);
        setUsuarios(prev => prev.map(u => u.id === usuarioAtual.id ? usuarioAtualizado : u));
      } else {
        const novoUsuario = await _usuarioService.createUser(dadosUsuario);
        setUsuarios(prev => [...prev, novoUsuario]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const usuariosFiltrados = useMemo(() =>
    usuarios.filter(u =>
      u.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      u.sobrenome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      u.username.toLowerCase().includes(termoBusca.toLowerCase())
    ), [usuarios, termoBusca]);

  return (
    <Container fluid className="mt-4">
      {/* Cabeçalho */}
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="h3">Gerenciamento de Usuários</h1>
        </Col>
        <Col className="text-end">
          {/* Botão de Voltar */}
          <Button variant="secondary" className="me-2" onClick={() => navigate('/inicio')}>
            <FaArrowLeft className="me-1" /> Voltar
          </Button>

          {/* Botão de Novo Usuário */}
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FaPlus className="me-2" />
            Novo Usuário
          </Button>
        </Col>
      </Row>

      {/* Campo de busca */}
      <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
        <InputGroup.Text><FaSearch /></InputGroup.Text>
        <FormControl
          placeholder="Buscar por nome ou username..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
      </InputGroup>

      {/* Tabela de usuários */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Username</th>
            <th>Email</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map(u => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.sobrenome}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td className="text-center">
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(u)}>
                  <FaEdit />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de edição/novo usuário */}
      <ModalEdicaoUsuario
        show={showModal}
        onHide={handleCloseModal}
        usuario={usuarioAtual}
        onSave={handleSave}
      />
    </Container>
  );
};

export default Usuarios;