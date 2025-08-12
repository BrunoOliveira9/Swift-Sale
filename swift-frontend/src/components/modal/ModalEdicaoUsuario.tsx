import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Usuario } from '../../models/usuario.ts';

interface ModalEdicaoUsuarioProps {
  show: boolean;
  onHide: () => void;
  usuario?: Usuario | null;
  onSave: (dadosUsuario: Partial<Usuario>) => Promise<void>;
}

const ModalEdicaoUsuario = ({ show, onHide, usuario, onSave }: ModalEdicaoUsuarioProps) => {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [telefone, setTelefone] = useState(usuario?.telefone || '');

  useEffect(() => {
    setTelefone(usuario?.telefone || '');
  }, [usuario]);

  const formatarTelefone = (valor: string) => {
    valor = valor.replace(/\D/g, '');
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

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dadosUsuario = Object.fromEntries(formData.entries()) as unknown as Partial<Usuario>;

    dadosUsuario.ativo = formData.get('ativo') === 'on';

    if (!dadosUsuario.password) {
      delete dadosUsuario.password;
    }

    dadosUsuario.telefone = telefone;

    try {
      await onSave(dadosUsuario);
      onHide();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{usuario ? 'Editar Usuário' : 'Novo Usuário'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSave}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nome do Usuário</Form.Label>
                <Form.Control name="nome" defaultValue={usuario?.nome} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sobrenome</Form.Label>
                <Form.Control name="sobrenome" defaultValue={usuario?.sobrenome} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="Ativo" name="ativo" defaultChecked={usuario?.ativo ?? false} />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Login</Form.Label>
            <Form.Control name="username" defaultValue={usuario?.username} />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="password"
                    type={mostrarSenha ? 'text' : 'password'}
                    defaultValue=""
                    placeholder={usuario ? "Digite nova senha para alterar" : "Digite a senha"}
                    autoComplete="new-password"
                    required={!usuario}
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
                <Form.Control type="email" name="email" defaultValue={usuario?.email} placeholder="exemplo@dominio.com" />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cargo</Form.Label>
                <Form.Control name="cargo" defaultValue={usuario?.cargo} />
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

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nível de acesso</Form.Label>
                <Form.Select name="nivel_acesso" defaultValue={usuario?.nivel_acesso}>
                  <option value="ADMIN">ADMINISTRADOR</option>
                  <option value="GERENTE">GERENTE</option>
                  <option value="OPERADOR">OPERADOR</option>
                </Form.Select>
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
  );
};

export default ModalEdicaoUsuario;
