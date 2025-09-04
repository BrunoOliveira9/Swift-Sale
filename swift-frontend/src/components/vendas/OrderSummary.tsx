import React, { useState } from "react";
import { Card, Button, ButtonGroup, Modal, Form } from "react-bootstrap";

interface OrderSummaryProps {
  total: number;
  onVoidTransaction: () => void;
  onFinalizeSale: (paymentMethod: string) => void;
  isProcessing?: boolean;
}

function OrderSummary({
  total,
  onVoidTransaction,
  onFinalizeSale,
  isProcessing = false,
}: OrderSummaryProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("dinheiro");

  const handleFinalizeClick = () => {
    if (total > 0) {
      setShowPaymentModal(true);
    }
  };

  const handleConfirmPayment = () => {
    onFinalizeSale(selectedPaymentMethod);
    setShowPaymentModal(false);
  };

  return (
    <>
      <Card className="shadow-sm h-100">
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <h5 className="text-muted">Valor Total</h5>
            <div className="display-4 text-end fw-bold mb-3">
              R${total.toFixed(2)}
            </div>


            <div className="d-grid">
              <Button 
                variant="success" 
                size="lg" 
                onClick={handleFinalizeClick}
                disabled={total === 0 || isProcessing}
              >
                {isProcessing ? "Processando..." : "Finalizar"}
              </Button>
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <Button 
              variant="danger" 
              onClick={onVoidTransaction}
              disabled={isProcessing}
            >
              Cancelar compra
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de confirmação de pagamento */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Pagamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Forma de Pagamento</Form.Label>
              <Form.Select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão</option>
                <option value="pix">PIX</option>
              </Form.Select>
            </Form.Group>
            <div className="text-center">
              <h4>Total: R${total.toFixed(2)}</h4>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleConfirmPayment}>
            Confirmar Venda
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrderSummary;