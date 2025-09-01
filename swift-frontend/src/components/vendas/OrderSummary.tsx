import React from "react";
import { Card, Button, ButtonGroup } from "react-bootstrap";
import { BsGrid3X3Gap } from "react-icons/bs";

interface OrderSummaryProps {
  total: number;
  onVoidTransaction: () => void;
}

function OrderSummary({
  total,
  onVoidTransaction,
}: OrderSummaryProps) {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <h5 className="text-muted">Valor Total</h5>
          <div className="display-4 text-end fw-bold mb-3">
            R${total.toFixed(2)}
          </div>

          <div className="d-grid gap-2 mb-3">
            <ButtonGroup>
              <Button variant="outline-primary" size="lg">
                Dinheiro
              </Button>
              <Button variant="primary" size="lg">
                Cartão
              </Button>
              <Button variant="outline-primary" size="lg">
                PIX
              </Button>
            </ButtonGroup>
          </div>

          <div className="d-grid">
            <Button variant="success" size="lg">
              Finalizar
            </Button>
          </div>
        </div>

        <div className="d-grid gap-2 mt-3">
          <Button variant="danger" onClick={onVoidTransaction}>
            Cancelar compra
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default OrderSummary;