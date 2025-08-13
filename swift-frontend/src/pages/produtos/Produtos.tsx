import { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, Modal, InputGroup, FormControl, Badge } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import './Produtos.css';
import { ProdutosService } from '../../services/produtos/produtos-service.ts'
import { Produto } from '../../models/produto.ts';
import { UnidadeMedida } from '../../enums/UnidadeMedida.ts';
import AsteriscoObrigatorio from '../../components/asterisco-obrigatorio/AsteriscoObrigatorio.tsx';
import showToast from '../../components/toast/Toast.jsx';

const _produtosService = new ProdutosService();

const Produtos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null);
  const [termoBusca, setTermoBusca] = useState('');

  const fetchProdutos = async () => {
    try {
      const produtosDoServidor = await _produtosService.getAllProducts();
      setProdutos(produtosDoServidor);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
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

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const dadosProdutoPuro = Object.fromEntries(formData.entries());

    const toString = (value: FormDataEntryValue): string => {
      if (typeof value === 'string') return value;
      return '';
    }

    // converter e mapeando os campos
    const dadosProduto: Produto = {
      id: produtoAtual?.id,
      nome: toString(dadosProdutoPuro.nome),
      codigo_barras: toString(dadosProdutoPuro.codBarras),
      descricao: toString(dadosProdutoPuro.descricao),
      categoria: toString(dadosProdutoPuro.categoria),
      unidade_medida: dadosProdutoPuro.unidadeMedida as UnidadeMedida,
      preco_venda: Number(dadosProdutoPuro.precoVenda),
      preco_custo: Number(dadosProdutoPuro.precoCusto),
      estoque_atual: Number(dadosProdutoPuro.estqAtual),
      estoque_minimo: Number(dadosProdutoPuro.estqMinimo),
    };

    // se estiver em modo de edição - atualiza
    if (produtoAtual && produtoAtual.id) {
        const updateProduct = async () => {
          try{
            await _produtosService.updateProduct(Number(dadosProduto.id), dadosProduto)
            showToast('success', `Produto: ${dadosProduto.nome}`, 'Foi atualizado com sucesso.')
            await fetchProdutos()
          } catch (err) {
            showToast('error', `Produto: ${dadosProduto.nome}`, 'Não foi possível concluir a edição do produto. '+err)
          }
        }
        updateProduct();
    } else { // se não tiver nenhum produto e nem id de produto, significa que estamos criando
        const createProduct = async () => {
          try {
            await _produtosService.createProduct(dadosProduto)
            showToast('success', `Produto: ${dadosProduto.nome}`, 'Cadastrado com sucesso.');
            await fetchProdutos()
          } catch (err) {
            showToast('error', `Produto: ${dadosProduto.nome}`, 'Não foi possível realizar o cadastro do produto. '+err);
          }
        }
        createProduct();
    }
    handleCloseModal();
  };

  const handleDelete = async (produtoId, produtoNome) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${produtoNome}"?`)) {
      try {
        await _produtosService.deleteProduct(produtoId);
        showToast('success', `Produto: ${produtoNome}`, 'Removido com sucesso.');
        await fetchProdutos()
      } catch (err) {
        showToast('error', `Produto: ${produtoNome}`, 'Não foi possível remover o produto. ' + err);
      }
    }
  };

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
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(produto.id,produto.nome)}>
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
                  <Form.Label>Nome do Produto <AsteriscoObrigatorio/></Form.Label>
                  <Form.Control name="nome" defaultValue={produtoAtual?.nome} required/>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código de Barras <AsteriscoObrigatorio/></Form.Label>
                  <Form.Control name="codBarras" defaultValue={produtoAtual?.codigo_barras} required/>
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
                  <Form.Label>Categoria <AsteriscoObrigatorio/></Form.Label>
                  <Form.Control name="categoria" defaultValue={produtoAtual?.categoria} required/>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unidade de Medida <AsteriscoObrigatorio/></Form.Label>
                  <Form.Select name="unidadeMedida" defaultValue={produtoAtual?.unidade_medida}>
                    <option value="UNIDADE">Unidade (UN)</option>
                    <option value="KG">Quilograma (Kg)</option>
                    <option value="LITRO">Litro (L)</option>
                    <option value="METRO">Metro (m)</option>
                    <option value="CAIXA">Caixa (CX)</option>
                    <option value="PACOTE">Pacote (PCT)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preço de Custo <AsteriscoObrigatorio/></Form.Label>
                  <Form.Control type="number" step="0.01" name="precoCusto" defaultValue={produtoAtual?.preco_custo} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preço de Venda <AsteriscoObrigatorio/></Form.Label>
                  <Form.Control type="number" step="0.01" name="precoVenda" defaultValue={produtoAtual?.preco_venda} required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estoque Atual <AsteriscoObrigatorio/></Form.Label>
                  <Form.Control type="number" name="estqAtual" defaultValue={produtoAtual?.estoque_atual} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estoque Mínimo <AsteriscoObrigatorio/></Form.Label>
                  <Form.Control type="number" name="estqMinimo" defaultValue={produtoAtual?.estoque_minimo} required/>
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