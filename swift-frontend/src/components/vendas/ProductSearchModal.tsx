import React, { useState, useMemo, useEffect, useRef } from "react";
import { Modal, InputGroup, Form } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { Produto } from "../../models/produto";

interface ProductSearchModalProps {
  show: boolean;
  onHide: () => void;
  products: Produto[];
  onProductSelect: (codigoBarras: string) => void;
}

function ProductSearchModal({
  show,
  onHide,
  products,
  onProductSelect,
}: ProductSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Foca o input sempre que o modal abrir
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.nome.toLowerCase().includes(term) ||
        p.codigo_barras.toLowerCase().includes(term)
    );
  }, [searchTerm, products]);

  const handleProductClick = (codigoBarras: string) => {
    onProductSelect(codigoBarras);
    onHide();
    setSearchTerm("");
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Buscar Produto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <BsSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Digite o código ou nome do produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={inputRef}
          />
        </InputGroup>

        <div className="list-group">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <button
                key={product.codigo_barras}
                type="button"
                className="list-group-item list-group-item-action"
                onClick={() => handleProductClick(product.codigo_barras)}
              >
                {product.nome} - <strong>R${Number(product.preco_venda).toFixed(2)}</strong>
                <br />
                <small>Código: {product.codigo_barras}</small>
              </button>
            ))
          ) : (
            searchTerm && (
              <div className="text-center text-muted">
                Nenhum produto encontrado.
              </div>
            )
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ProductSearchModal;