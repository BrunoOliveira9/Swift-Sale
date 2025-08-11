import axios from 'axios'
import { GenericCrudService } from '../crud/generic-crud.ts'
import { Produto } from '../../models/produto'

export class ProdutosService extends GenericCrudService<Produto> {

    async getAllProducts(): Promise<Produto[]> {
        return this.list('/produtos')
    }

}