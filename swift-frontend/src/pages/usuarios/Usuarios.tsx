import { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Button, Table, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit } from 'react-icons/fa';
import './Usuarios.css';
import { UsuarioService } from '../../services/usuarios/usuarios-service.ts'
import { Usuario } from '../../models/usuario.ts';
import ModalEdicaoUsuario from '../../components/modal/ModalEdicaoUsuario.tsx'

const _usuarioService = new UsuarioService();

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [telefone, setTelefone] = useState(usuarioAtual?.telefone || '');

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

  // Define a função handleShowModal para abrir o modal, podendo receber um usuário para edição
  const handleShowModal = (usuario: Usuario | null = null) => {
    setUsuarioAtual(usuario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioAtual(null);
  };

  const formatarTelefone = (valor: string) => {
    // Remove tudo que não for dígito
    valor = valor.replace(/\D/g, '');

    // Formata: (99) 99999-9999 ou (99) 9999-9999
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (valor.length > 0) {
      valor = valor.replace(/^(\d*)/, '($1');
    }

    return valor;
  };

  useEffect(() => {
    setTelefone(usuarioAtual?.telefone || '');
  }, [usuarioAtual]);

  const handleSave = async (dadosUsuario: Partial<Usuario>) => {
    try {
      if (usuarioAtual && usuarioAtual.id) {
        const usuarioAtualizado = await _usuarioService.updateUser(String(usuarioAtual.id), dadosUsuario);
        setUsuarios((prev) => prev.map(u => (u.id === usuarioAtual.id ? usuarioAtualizado : u)));
      } else {
        const novoUsuario = await _usuarioService.createUser(dadosUsuario);
        setUsuarios((prev) => [...prev, novoUsuario]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  
  const usuariosFiltrados = useMemo(() =>
    usuarios.filter(p =>
      p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.sobrenome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.username.toLowerCase().includes(termoBusca.toLowerCase())
    ), [usuarios, termoBusca]);

  return (
    <Container fluid className="mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="h3">Gerenciamento de Usuários</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FaPlus className="me-2" />
            Novo Usuário
          </Button>
        </Col>
      </Row>

      <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
        <InputGroup.Text><FaSearch /></InputGroup.Text>
        <FormControl
          placeholder="Buscar por nome ou username..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
      </InputGroup>

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
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nome}</td>
              <td>{usuario.sobrenome}</td>
              <td>{usuario.username}</td>
              <td>{usuario.email}</td>
              <td className="text-center">
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(usuario)}>
                  <FaEdit />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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