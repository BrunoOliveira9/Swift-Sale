// 1. Importações React
import { useState, useEffect, useCallback, useRef } from 'react';

interface BarcodeScannerOptions {
  // Tempo em milissegundos para diferenciar digitação manual de um scan
  keystrokeDelay?: number;
  // Se deve estar ativo ou não
  enabled?: boolean;
}

// 2. Tipagem para a função de callback e para as opções
type ScanCallback = (code: string) => void;


export function useBarcodeScanner(
  onScan: ScanCallback,
  options: BarcodeScannerOptions = {}
) {
  const { keystrokeDelay = 100, enabled = true } = options; // Valor padrão 100ms

  const [scannedCode, setScannedCode] = useState<string>('');
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Usa useRef para manter referência estável do callback
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  // Função para processar o código escaneado
  const processScannedCode = useCallback((code: string) => {
    if (code.length > 2) {
      onScanRef.current(code);
    }
  }, []);

  const handleKeyDown = useCallback(
    // Tipando o evento do teclado
    (e: KeyboardEvent) => {
      // Se não estiver habilitado ou já estiver processando, não processa
      if (!enabled || isProcessing) {
        return;
      }

      // Ignora se o foco está em um input, textarea ou select
      const activeElement = document.activeElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      )) {
        return;
      }

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
        setIsProcessing(true);
        
        // Limpa timeout anterior se existir
        if (processingTimeoutRef.current) {
          clearTimeout(processingTimeoutRef.current);
        }
        
        setScannedCode(currentCode => {
          processScannedCode(currentCode);
          
          // Reset do processamento após 500ms
          processingTimeoutRef.current = setTimeout(() => {
            setIsProcessing(false);
          }, 500);
          
          return ''; // Limpa o código para a próxima leitura
        });
      }
      
     
      setLastKeystrokeTime(currentTime);
    },
    [keystrokeDelay, enabled, isProcessing, lastKeystrokeTime, processScannedCode] // Adiciona processScannedCode às dependências
  );

  useEffect(() => {
    // Adiciona o listener de eventos no nível do documento
    document.addEventListener('keydown', handleKeyDown);

    //remove o listener quando o componente que usa o hook é desmontado
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [handleKeyDown]); // O useEffect só será executado uma vez (na montagem)
}