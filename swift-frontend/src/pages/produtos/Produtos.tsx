import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, Modal, InputGroup, FormControl, Badge } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import './Produtos.css';
import { ProdutosService } from '../../services/produtos/produtos-service.ts'
import { Produto } from '../../models/produto.ts';

const _produtosService = new ProdutosService();

const Produtos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null);
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const produtosDoServidor = await _produtosService.getAllProducts();
        setProdutos(produtosDoServidor);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    
    fetchProdutos();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setProdutoAtual(null);
  };

  const handleShowModal = (produto: Produto | null = null) => {
      setProdutoAtual(produto);
      setShowModal(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const dadosProduto = Object.fromEntries(formData.entries());

    if (produtoAtual && produtoAtual.id) {
      console.log("Atualizando produto:", { ...dadosProduto, id: produtoAtual.id });
    } else {
      console.log("Criando novo produto:", dadosProduto);
    }
    handleCloseModal();
  };

  const handleDelete = (produtoId) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      console.log("Excluindo produto ID:", produtoId);
    }
  }

  const produtosFiltrados = useMemo(() =>
    produtos.filter(p =>
      p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.codigo_barras.includes(termoBusca)
    ), [produtos, termoBusca]);

  return (
    <Container fluid className="mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="h3">Gerenciamento de Produtos</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FaPlus className="me-2" />
            Novo Produto
          </Button>
        </Col>
      </Row>

      <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
        <InputGroup.Text><FaSearch /></InputGroup.Text>
        <FormControl
          placeholder="Buscar por nome ou código de barras..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço Venda</th>
            <th className="text-center">Estoque</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.categoria}</td>
              <td>R$ {Number(produto.preco_venda).toFixed(2)}</td>
              <td className="text-center">
                {produto.estoque_atual <= produto.estoque_minimo ? (
                  <Badge bg="danger">Baixo ({produto.estoque_atual})</Badge>
                ) : (
                  <Badge bg="success">{produto.estoque_atual}</Badge>
                )}
              </td>
              <td className="text-center">
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(produto)}>
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(produto.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{produtoAtual ? 'Editar Produto' : 'Novo Produto'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Produto</Form.Label>
                  <Form.Control name="nome" defaultValue={produtoAtual?.nome} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código de Barras</Form.Label>
                  <Form.Control name="codBarras" defaultValue={produtoAtual?.codigo_barras} />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control as="textarea" rows={2} name="descricao" defaultValue={produtoAtual?.descricao} />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control name="categoria" defaultValue={produtoAtual?.categoria} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unidade de Medida</Form.Label>
                  <Form.Select name="unidadeMedida" defaultValue={produtoAtual?.unidade_medida}>
                    <option value="unidade">Unidade (UN)</option>
                    <option value="kg">Quilograma (Kg)</option>
                    <option value="litro">Litro (L)</option>
                    <option value="metro">Metro (m)</option>
                    <option value="caixa">Caixa (CX)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preço de Custo</Form.Label>
                  <Form.Control type="number" step="0.01" name="precoCusto" defaultValue={produtoAtual?.preco_custo} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preço de Venda</Form.Label>
                  <Form.Control type="number" step="0.01" name="precoVenda" defaultValue={produtoAtual?.preco_venda} required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estoque Atual</Form.Label>
                  <Form.Control type="number" name="estqAtual" defaultValue={produtoAtual?.estoque_atual} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estoque Mínimo</Form.Label>
                  <Form.Control type="number" name="estqMinimo" defaultValue={produtoAtual?.estoque_minimo} />
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

export default Produtos;