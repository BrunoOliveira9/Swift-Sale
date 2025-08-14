// 1. Importações React
import { useState, useEffect, useCallback } from 'react';

interface BarcodeScannerOptions {
  // Tempo em milissegundos para diferenciar digitação manual de um scan
  keystrokeDelay?: number;
}

// 2. Tipagem para a função de callback e para as opções
type ScanCallback = (code: string) => void;


export function useBarcodeScanner(
  onScan: ScanCallback,
  options: BarcodeScannerOptions = {}
) {
  const { keystrokeDelay = 100 } = options; // Valor padrão 100ms

  const [scannedCode, setScannedCode] = useState<string>('');
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState<number>(0);

  // O useCallback agora tem as dependências corretas
  
  const handleKeyDown = useCallback(
    // Tipando o evento do teclado
    (e: KeyboardEvent) => {
      // Ignora teclas de controle (como Shift, Ctrl), mas permite o Enter
      if (e.key.length > 1 && e.key !== 'Enter') {
        return;
      }

      const currentTime = Date.now();
      
     
      if (currentTime - lastKeystrokeTime > keystrokeDelay) {
        // Se for muito lento, provavelmente é digitação manual.
        // Inicia um novo código, começando com a tecla atual (se não for Enter).
        setScannedCode(e.key === 'Enter' ? '' : e.key);
      } else {
        // Se for rápido, é um scan. Concatena a tecla.
        if (e.key !== 'Enter') {
          setScannedCode(prevCode => prevCode + e.key);
        }
      }
      
      // Se a tecla pressionada for 'Enter', o scan terminou
      if (e.key === 'Enter') {
        
        setScannedCode(currentCode => {
          if (currentCode.length > 2) { 
            onScan(currentCode);
          }
          return ''; // Limpa o código para a próxima leitura
        });
      }
      
     
      setLastKeystrokeTime(currentTime);
    },
    [keystrokeDelay, onScan] 
  );

  useEffect(() => {
    // Adiciona o listener de eventos no nível do documento
    document.addEventListener('keydown', handleKeyDown);

    //remove o listener quando o componente que usa o hook é desmontado
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]); // O useEffect só será executado uma vez (na montagem)
}