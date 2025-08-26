import { GenericCrudService } from '../crud/generic-crud.ts'
import { Cliente } from '../../models/cliente.ts'

export class ClienteService extends GenericCrudService<Cliente> {

    async getAllUsers(): Promise<Cliente[]> {
        return this.list('/clientes')
    }

    // Método para atualizar usuário - recebe o id e os dados parciais a atualizar
    async updateUser(id: string, data: Partial<Cliente>): Promise<Cliente> {
        return this.update('/clientes', id, data);
    }

    // Se precisar criar usuário também, pode ter o método createUser
    async createUser(data: Partial<Cliente>): Promise<Cliente> {
        return this.create('/clientes', data);
    }

}