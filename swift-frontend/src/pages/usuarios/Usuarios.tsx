import { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Usuarios.css';
import { UsuarioService } from '../../services/usuarios/usuarios-service.ts'
import { Usuario } from '../../models/usuario.ts';

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

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dadosUsuario = Object.fromEntries(formData.entries()) as unknown as Partial<Usuario>;

    // A checkbox "ativo" vem como string "on" ou undefined, precisa tratar para boolean
    dadosUsuario.ativo = formData.get('ativo') === 'on';

    // Se a senha estiver vazia, removemos para não sobrescrever
    if (!dadosUsuario.password || dadosUsuario.password === '') {
      delete dadosUsuario.password;
    }

    try {
      if (usuarioAtual && usuarioAtual.id) {
        // Atualizar usuário
        const usuarioAtualizado = await _usuarioService.updateUser(String(usuarioAtual.id), dadosUsuario);
        // Atualiza a lista local substituindo o usuário editado
        setUsuarios((prev) =>
          prev.map(u => (u.id === usuarioAtual.id ? usuarioAtualizado : u))
        );
      } else {
        // Criar novo usuário
        const novoUsuario = await _usuarioService.createUser(dadosUsuario);
        // Adiciona na lista local
        setUsuarios((prev) => [...prev, novoUsuario]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      // Opcional: mostrar uma mensagem de erro para o usuário
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
      
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{usuarioAtual ? 'Editar Usuário' : 'Novo Usuário'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Usuário</Form.Label>
                  <Form.Control name="nome" defaultValue={usuarioAtual?.nome} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sobrenome</Form.Label>
                  <Form.Control name="sobrenome" defaultValue={usuarioAtual?.sobrenome} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check type="checkbox" label="Ativo" name="ativo" defaultChecked={usuarioAtual?.ativo ?? false} />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Login</Form.Label>
              <Form.Control name="username" defaultValue={usuarioAtual?.username} />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="password"
                      type={mostrarSenha ? 'text' : 'password'}
                      defaultValue="" // sempre vazio para não mostrar senha encriptada
                      placeholder={usuarioAtual ? "Digite nova senha para alterar" : "Digite a senha"}
                      autoComplete="new-password"
                      required={!usuarioAtual}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      tabIndex={-1}
                    >
                      {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" defaultValue={usuarioAtual?.email} placeholder="exemplo@dominio.com"/>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cargo</Form.Label>
                  <Form.Control name="cargo" defaultValue={usuarioAtual?.cargo} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" name="telefone" value={telefone} onChange={e => setTelefone(formatarTelefone(e.target.value))} placeholder="(99) 99999-9999" pattern="^\(\d{2}\) \d{4,5}-\d{4}$" title="Formato: (99) 99999-9999"/>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nível de acesso</Form.Label>
                  <Form.Select name="nivel_acesso" defaultValue={usuarioAtual?.nivel_acesso}>
                    <option value="ADMIN">ADMINISTRADOR</option>
                    <option value="GERENTE">GERENTE</option>
                    <option value="OPERADOR">OPERADOR</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Usuarios;