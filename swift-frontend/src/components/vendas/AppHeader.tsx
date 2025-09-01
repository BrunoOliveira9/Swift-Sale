import React, { useRef, useEffect } from "react";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

interface AppHeaderProps {
  onSearchClick: () => void; // abrir modal
  onBarcodeEnter: (codigoBarras: string) => void; // adicionar produto direto
}

function AppHeader({ onSearchClick, onBarcodeEnter }: AppHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Foca o input quando o header carregar
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current?.value) {
      onBarcodeEnter(inputRef.current.value);
      inputRef.current.value = ""; // limpa o input
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body className="p-2 d-flex justify-content-between align-items-center">
        {/* Input direto para código de barras */}
        <InputGroup style={{ maxWidth: "300px" }}>
          <Form.Control
            ref={inputRef}
            placeholder="Digite o código de barras..."
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="outline-primary"
            onClick={() => {
              if (inputRef.current?.value) {
                onBarcodeEnter(inputRef.current.value);
                inputRef.current.value = "";
              }
            }}
          >
            Adicionar
          </Button>
        </InputGroup>

        {/* Botão para buscar produto por nome */}
        <Button
          variant="outline-primary"
          onClick={onSearchClick}
          className="d-flex align-items-center"
        >
          <BsSearch size={24} className="me-2" />
          <span>Buscar Produto</span>
        </Button>
      </Card.Body>
    </Card>
  );
}

export default AppHeader;