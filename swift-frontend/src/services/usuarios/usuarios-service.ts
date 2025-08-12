import { GenericCrudService } from '../crud/generic-crud.ts'
import { Usuario } from '../../models/usuario'

export class UsuarioService extends GenericCrudService<Usuario> {

    async getAllUsers(): Promise<Usuario[]> {
        return this.list('/usuarios')
    }

    // Método para atualizar usuário - recebe o id e os dados parciais a atualizar
    async updateUser(id: string, data: Partial<Usuario>): Promise<Usuario> {
        return this.update('/usuarios', id, data);
    }

    // Se precisar criar usuário também, pode ter o método createUser
    async createUser(data: Partial<Usuario>): Promise<Usuario> {
        return this.create('/usuarios', data);
    }

}