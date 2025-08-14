import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Container, Row, Col, Table, Button, ButtonGroup, Card, Form, Modal, InputGroup } from 'react-bootstrap';
import { BsGrid3X3Gap, BsArrowReturnLeft, BsX, BsBackspace, BsSearch } from 'react-icons/bs';
import {ProdutosService} from '../../services/produtos/produtos-service.ts'
import { Produto } from '../../models/produto.ts';
import { Hooks } from '../../hooks/barcodeScan.tsx;

const _produtosService = new ProdutosService();

const [produtos, setProdutos] = useState<Produto[]>([]);

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


function AppHeader({ onSearchClick }) {
    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body className="p-2 d-flex justify-content-end align-items-center">
                <Button variant="outline-primary" onClick={onSearchClick} className="d-flex align-items-center">
                    <BsSearch size={24} className="me-2"/>
                    <span>Buscar Produto</span>
                </Button>
            </Card.Body>
        </Card>
    );
}

// =================================================================================
// MODAL DE BUSCA DE PRODUTO (sem alterações)
// =================================================================================
function ProductSearchModal({ show, onHide, products, onProductSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredProducts = useMemo(() => {
        if (!searchTerm) { return []; }
        return Object.values(products).filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, products]);
    const handleProductClick = (productId) => { onProductSelect(productId); onHide(); setSearchTerm(''); };
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton><Modal.Title>Buscar Produto</Modal.Title></Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text><BsSearch /></InputGroup.Text>
                    <Form.Control placeholder="Digite o nome do produto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoFocus />
                </InputGroup>
                <div className="list-group">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (<button key={product.id} type="button" className="list-group-item list-group-item-action" onClick={() => handleProductClick(product.id)}>{product.name} - <strong>R${product.price.toFixed(2)}</strong></button>))
                    ) : (searchTerm && <div className="text-center text-muted">Nenhum produto encontrado.</div>)}
                </div>
            </Modal.Body>
        </Modal>
    );
}

// =================================================================================
// Componentes OrderSummary, CartList, NumericKeypad (sem alterações)
// =================================================================================
function OrderSummary({ total, onVoidTransaction, onToggleKeypad }) { /* ...código idêntico ao anterior... */ return (<Card className="shadow-sm h-100"><Card.Body className="d-flex flex-column justify-content-between"><div><h5 className="text-muted">Valor Total</h5><div className="display-4 text-end fw-bold mb-3">R${total.toFixed(2)}</div><div className="d-grid gap-2 mb-3"><ButtonGroup><Button variant="outline-primary" size="lg">Dinheiro</Button><Button variant="primary" size="lg">Cartão</Button><Button variant="outline-primary" size="lg">PIX</Button></ButtonGroup></div><div className="d-grid"><Button variant="success" size="lg">Finalizar</Button></div></div><div className="d-grid gap-2"><Button variant="danger" onClick={onVoidTransaction}>Cancelar compra</Button><Button variant="outline-secondary" onClick={onToggleKeypad}><BsGrid3X3Gap className="me-2" /> Teclado</Button></div></Card.Body></Card>);}
function CartList({ items, onRemoveItem }) { /* ...código idêntico ao anterior... */ const CartItem = ({ item }) => {const subtotal = item.price * item.quantity; return (<tr><td>{item.name}</td><td className="text-end">${item.price.toFixed(2)}</td><td className="text-center">{item.quantity}</td><td className="text-end fw-bold">${subtotal.toFixed(2)}</td><td className="text-center"><Button variant="danger" size="sm" onClick={() => onRemoveItem(item.id)}>X</Button></td></tr>);}; return (<Card className="shadow-sm h-100"><Card.Body><Table hover responsive><thead><tr><th>Produto</th><th className="text-end">Preço Unit.</th><th className="text-center">Qtd.</th><th className="text-end">Subtotal</th><th className="text-center">Ações</th></tr></thead><tbody>{items.length === 0 ? (<tr><td colSpan="5" className="text-center text-muted py-5">O carrinho está vazio.</td></tr>) : (items.map(item => <CartItem key={item.id} item={item} />))}</tbody></Table></Card.Body></Card>);}
function NumericKeypad({ onEnter, onClose }) { /* ...código idêntico ao anterior... */ const [inputValue, setInputValue] = useState(''); const handleNumberClick = (number) => setInputValue(prev => prev + number); const handleClear = () => setInputValue(''); const handleBackspace = () => setInputValue(prev => prev.slice(0, -1)); const handleEnter = () => { if (inputValue) { onEnter(inputValue); handleClear(); } }; const keypadStyle = { position: 'fixed', bottom: '20px', right: '20px', width: '300px', zIndex: 1050 }; return (<div style={keypadStyle}><Card className="shadow-lg"><Card.Header className="d-flex justify-content-between align-items-center"><span>Teclado Numérico</span><Button variant="light" size="sm" onClick={onClose}><BsX size={20} /></Button></Card.Header><Card.Body><div className="bg-light p-2 rounded text-end mb-3 fs-4">{inputValue || '0'}</div><Row xs={3} className="g-2">{['7', '8', '9', '4', '5', '6', '1', '2', '3'].map(num => (<Col key={num}><Button variant="outline-secondary" className="w-100 p-3" onClick={() => handleNumberClick(num)}>{num}</Button></Col>))}<Col><Button variant="outline-secondary" className="w-100 p-3" onClick={handleBackspace}><BsBackspace /></Button></Col><Col><Button variant="outline-secondary" className="w-100 p-3" onClick={() => handleNumberClick('0')}>0</Button></Col><Col><Button variant="outline-danger" className="w-100 p-3" onClick={handleClear}>C</Button></Col></Row><div className="d-grid mt-2"><Button variant="success" className="p-3" onClick={handleEnter}>Adicionar <BsArrowReturnLeft /></Button></div></Card.Body></Card></div>);}


// =================================================================================
// ✨ COMPONENTE PRINCIPAL ATUALIZADO COM O HOOK ✨
// =================================================================================
function Vendas() {
    const [cart, setCart] = useState([]);
    const [showKeypad, setShowKeypad] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);

    // ✨ `handleAddProduct` otimizada com `useCallback` ✨
    // Envolvemos a função em useCallback para garantir que ela não seja recriada
    // a cada renderização, o que otimiza o nosso hook `useBarcodeScanner`.
    const handleAddProduct = useCallback((productId) => {
        const product = produtos[productId];
        if (!product) {
            alert(`Produto com código "${produtos}" não encontrado.`);
            return;
        }

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    }, []); // A dependência vazia [] significa que a função só é criada uma vez.
    
    // ✨ A mágica do leitor de código de barras acontece aqui ✨
    // Simplesmente chamamos o hook e passamos a função que ele deve executar
    // quando um código for lido com sucesso.
    useBarcodeScanner(handleAddProduct);


    const handleRemoveItem = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const handleVoidTransaction = () => {
        setCart([]);
    };
    
    const handleKeypadEnter = (productId) => {
        handleAddProduct(productId);
    };

    const orderTotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    return (
        <Container fluid className="p-3 bg-light vh-100 d-flex flex-column">
             
             {/* Renderizamos o cabeçalho atualizado */}
             <AppHeader 
                onSearchClick={() => setShowSearchModal(true)}
             />

            <Row className="g-3 flex-grow-1">
                <Col md={8}>
                    <CartList 
                        items={cart} 
                        onRemoveItem={handleRemoveItem} 
                    />
                </Col>
                <Col md={4}>
                    <OrderSummary 
                        total={orderTotal} 
                        onVoidTransaction={handleVoidTransaction}
                        onToggleKeypad={() => setShowKeypad(!showKeypad)}
                    />
                </Col>
            </Row>

            {/* Renderização condicional dos componentes flutuantes/modais */}
            {showKeypad && (
                <NumericKeypad 
                    onEnter={handleKeypadEnter}
                    onClose={() => setShowKeypad(false)}
                />
            )}
            
            <ProductSearchModal 
                show={showSearchModal}
                onHide={() => setShowSearchModal(false)}
                products={produtos}
                onProductSelect={handleAddProduct}
            />
        </Container>
    );
}

export default Vendas;