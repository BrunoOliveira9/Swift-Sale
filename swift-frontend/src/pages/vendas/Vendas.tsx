import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { ProdutosService } from "../../services/produtos/produtos-service.ts";
import { Produto } from "../../models/produto.ts";
import AppHeader from "../../components/vendas/AppHeader.tsx";
import ProductSearchModal from "../../components/vendas/ProductSearchModal.tsx";
import CartList from "../../components/vendas/CartList.tsx";
import OrderSummary from "../../components/vendas/OrderSummary.tsx";
import { useBarcodeScanner } from "../../hooks/barcodeScan.tsx";

const _produtosService = new ProdutosService();

function Vendas() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [cart, setCart] = useState<(Produto & { quantity: number })[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const navigate = useNavigate();

  // Busca produtos no servidor
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

  // Adiciona produto no carrinho pelo codigo_barras
  const handleAddProduct = useCallback(
    (codigoBarras: string) => {
      const product = produtos.find((p) => p.codigo_barras === codigoBarras);

      if (!product) {
        alert(`Produto com código "${codigoBarras}" não encontrado.`);
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.codigo_barras === product.codigo_barras
        );
        if (existingItem) {
          return prevCart.map((item) =>
            item.codigo_barras === product.codigo_barras
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });
    },
    [produtos]
  );

  // Integra com leitor de código de barras
  useBarcodeScanner(handleAddProduct);

  // Remove item do carrinho
  const handleRemoveItem = (codigoBarras: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.codigo_barras !== codigoBarras)
    );
  };

  // Cancela compra
  const handleVoidTransaction = () => {
    setCart([]);
  };

  // Calcula total
  const orderTotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.preco_venda * item.quantity,
      0
    );
  }, [cart]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "w") {
        navigate("/inicio");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <Container fluid className="p-3 bg-light vh-100 d-flex flex-column">
      {/* Cabeçalho */}
      <AppHeader
        onSearchClick={() => setShowSearchModal(true)}
        onBarcodeEnter={handleAddProduct}
      />

      <Row className="g-3 flex-grow-1">
        <Col md={8}>
          <CartList items={cart} onRemoveItem={handleRemoveItem} />
        </Col>
        <Col md={4}>
          <OrderSummary
            total={orderTotal}
            onVoidTransaction={handleVoidTransaction}
          />
        </Col>
      </Row>

      {/* Modal de busca de produtos */}
      <ProductSearchModal
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
        products={produtos}
        onProductSelect={handleAddProduct} // retorna codigo_barras
      />
    </Container>
  );
}

export default Vendas;