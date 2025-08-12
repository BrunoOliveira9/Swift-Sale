import { NivelAcesso } from "../enums/NivelAcesso"

export type Usuario = {
  id: number;  
  nome: string;
  sobrenome?: string;
  username: string;
  password: string;
  email?: string;
  telefone?: string;
  cargo: string;
  nivel_acesso: NivelAcesso;
  ativo: boolean;
  atualizado_em?: string;
}
