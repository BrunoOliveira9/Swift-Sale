import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Cliente } from '../../models/cliente.ts';
import showToast from "../../components/toast/Toast.jsx";
import JogoDaVelha from '../jogoDaVelha.tsx';

interface ModalEdicaoClienteProps {
  show: boolean;
  onHide: () => void;
  cliente?: Cliente | null;
  onSave: (dadosCliente: Partial<Cliente>) => Promise<void>;
  clientesExistentes: Cliente[];
}

const ModalEdicaoCliente = ({ show, onHide, cliente, onSave, clientesExistentes }: ModalEdicaoClienteProps) => {
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [showJogo, setShowJogo] = useState(false);

  useEffect(() => {
    if (show) {
      setTelefone(cliente?.telefone || '');
      setCpf(cliente?.cpf || '');
    }
  }, [show, cliente]);

  const validarCPF = (valor: string): boolean => {
    let cpf = valor.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const formatarCPF = (valor: string) => {
    valor = valor.replace(/\D/g, '');
    if (valor.length > 9) valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4');
    else if (valor.length > 6) valor = valor.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    else if (valor.length > 3) valor = valor.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
    return valor;
  };

  const formatarTelefone = (valor: string) => {
    valor = valor.replace(/\D/g, '');
    if (valor.length > 10) valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    else if (valor.length > 5) valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    else if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    else if (valor.length > 0) valor = valor.replace(/^(\d*)/, '($1');
    return valor;
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const dadosCliente = Object.fromEntries(formData.entries()) as unknown as Partial<Cliente>;
    const clientes = clientesExistentes || [];
    dadosCliente.telefone = telefone;
    dadosCliente.cpf = cpf;
    dadosCliente.nome = dadosCliente.nome?.trim() || '';

    // Easter egg do jogo
    if (dadosCliente.nome.toLowerCase() === 'jogo') {
      setShowJogo(true);
      return;
    }

    if (!validarCPF(cpf)) {
      showToast('error', 'CPF inválido', 'Por favor, insira um CPF válido');
      return;
    }

    if (clientes.some(c => c.cpf === cpf && c.id !== cliente?.id)) {
      showToast('error', 'CPF duplicado', 'Já existe um cliente com este CPF.');
      return;
    }
    if (clientes.some(c => c.telefone === telefone && c.id !== cliente?.id)) {
      showToast('error', 'Telefone duplicado', 'Já existe um cliente com este telefone.');
      return;
    }

    try {
      await onSave(dadosCliente);
      showToast('success', 'Cliente salvo com sucesso', 'O cliente foi salvo com sucesso');
      onHide();
    } catch {
      showToast('error', 'Erro ao salvar cliente', 'Por favor, tente novamente');
    }
  };

  const cpfObrigatorio = true;

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{cliente ? 'Editar Cliente' : 'Novo Cliente'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control name="nome" defaultValue={cliente?.nome} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sobrenome</Form.Label>
                  <Form.Control name="sobrenome" defaultValue={cliente?.sobrenome} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control
                    type="text"
                    name="cpf"
                    value={cpf}
                    onChange={e => setCpf(formatarCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required={cpfObrigatorio}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefone"
                    value={telefone}
                    onChange={e => setTelefone(formatarTelefone(e.target.value))}
                    placeholder="(99) 99999-9999"
                    pattern="^\(\d{2}\) \d{4,5}-\d{4}$"
                    title="Formato: (99) 99999-9999"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <JogoDaVelha show={showJogo} onHide={() => setShowJogo(false)} />
    </>
  );
};

export default ModalEdicaoCliente;