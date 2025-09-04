import { GenericCrudService } from '../crud/generic-crud.ts';

export interface UsuarioLogado {
  id: number;
  nome: string;
  sobrenome?: string;
  username: string;
  email?: string;
  cargo: string;
  nivel_acesso: string;
}

export class AuthService extends GenericCrudService<any> {
  async getUsuarioLogado(): Promise<UsuarioLogado> {
    return this.getAction('/auth/me');
  }

  async checkAuthStatus(): Promise<{ authenticated: boolean }> {
    return this.getAction('/auth/status');
  }
}
