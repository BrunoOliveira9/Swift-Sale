import axios from 'axios'
import { GenericCrudService } from '../crud/generic-crud.ts'
import { Produto } from '../../models/produto'

const endpoint = '/produtos'
export class ProdutosService extends GenericCrudService<Produto> {

    async getAllProducts(): Promise<Produto[]> {
        return this.list(endpoint)
    }

    async createProduct(data: Produto): Promise<Produto> {
        return this.create(endpoint, data)
    }

    async updateProduct(id:number, data: Produto): Promise<Produto> {
        return this.update(endpoint, id, data)
    }

    async deleteProduct(id: number): Promise<void> {
        return this.delete(endpoint, id)
    }

}