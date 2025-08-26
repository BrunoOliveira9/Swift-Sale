import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaGamepad } from "react-icons/fa";

interface JogoDaVelhaProps {
  show: boolean;
  onHide: () => void;
}

const JogoDaVelha = ({ show, onHide }: JogoDaVelhaProps) => {
  const [tabuleiro, setTabuleiro] = useState(Array(9).fill(null));
  const [jogador, setJogador] = useState<"X" | "O">("X");

  const handleClick = (index: number) => {
    if (tabuleiro[index] || verificarVencedor(tabuleiro)) return;

    const novoTabuleiro = [...tabuleiro];
    novoTabuleiro[index] = jogador;
    setTabuleiro(novoTabuleiro);
    setJogador(jogador === "X" ? "O" : "X");
  };

  const verificarVencedor = (quadros: (string | null)[]) => {
    const combinacoes = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
      [0, 4, 8], [2, 4, 6]             // diagonais
    ];

    for (let [a, b, c] of combinacoes) {
      if (quadros[a] && quadros[a] === quadros[b] && quadros[a] === quadros[c]) {
        return quadros[a];
      }
    }
    return null;
  };

  const vencedor = verificarVencedor(tabuleiro);

  const reiniciar = () => {
    setTabuleiro(Array(9).fill(null));
    setJogador("X");
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaGamepad className="me-2" /> Jogo da Velha
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 80px)",
            gap: "8px",
            justifyContent: "center"
          }}
        >
          {tabuleiro.map((valor, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              style={{
                width: "80px",
                height: "80px",
                fontSize: "24px",
                fontWeight: "bold",
                cursor: "pointer",
                border: "2px solid #444",
                borderRadius: "8px",
                background: valor ? "#f8f9fa" : "#fff"
              }}
            >
              {valor}
            </button>
          ))}
        </div>
        {vencedor && (
          <p className="mt-3 fw-bold text-success">
            🎉 Jogador {vencedor} venceu!
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={reiniciar}>Reiniciar</Button>
        <Button variant="danger" onClick={onHide}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JogoDaVelha;