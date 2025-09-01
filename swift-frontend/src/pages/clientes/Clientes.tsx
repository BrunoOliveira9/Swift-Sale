import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Button, Table, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Clientes.css';
import { ClienteService } from '../../services/clientes/clientes-service.ts'
import { Cliente } from '../../models/cliente.ts';
import ModalEdicaoCliente from '../../components/modal/ModalEdicaoCliente.tsx';

const _clienteService = new ClienteService();

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [clienteAtual, setClienteAtual] = useState<Cliente | null>(null);
  const [termoBusca, setTermoBusca] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const clientesDoServidor = await _clienteService.getAllUsers();
        setClientes(clientesDoServidor);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  // Define a função handleShowModal para abrir o modal, podendo receber um cliente para edição
  const handleShowModal = (cliente: Cliente | null = null) => {
    setClienteAtual(cliente);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClienteAtual(null);
  };

  const handleSave = async (dadosCliente: Partial<Cliente>) => {
    try {
      if (clienteAtual && clienteAtual.id) {
        const clienteAtualizado = await _clienteService.updateUser(String(clienteAtual.id), dadosCliente);
        setClientes((prev) => prev.map(u => (u.id === clienteAtual.id ? clienteAtualizado : u)));
      } else {
        const novoCliente = await _clienteService.createUser(dadosCliente);
        setClientes((prev) => [...prev, novoCliente]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };


  const clientesFiltrados = useMemo(() =>
    clientes.filter(p =>
      p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.sobrenome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.cpf.toLowerCase().includes(termoBusca.toLowerCase())
    ), [clientes, termoBusca]);

  return (
    <Container fluid className="mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="h3">Gerenciamento de Clientes</h1>
        </Col>
        <Col className="text-end">
          <Button variant="secondary" className="me-2" onClick={() => navigate('/inicio')}>
            <FaArrowLeft className="me-1" /> Voltar
          </Button>
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FaPlus className="me-2" />
            Novo Cliente
          </Button>
        </Col>
      </Row>

      <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
        <InputGroup.Text><FaSearch /></InputGroup.Text>
        <FormControl
          placeholder="Buscar por nome ou cpf..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.sobrenome}</td>
              <td>{cliente.cpf}</td>
              <td>{cliente.telefone}</td>
              <td className="text-center">
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(cliente)}>
                  <FaEdit />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ModalEdicaoCliente
        show={showModal}
        onHide={handleCloseModal}
        cliente={clienteAtual}
        onSave={handleSave}
        clientesExistentes={clientes}
      />
    </Container>
  );
};

export default Clientes;