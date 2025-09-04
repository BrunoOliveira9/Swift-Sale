import { UnidadeMedida } from "../enums/UnidadeMedida"

export type Produto = {
    id?: number,
    codigo_barras: string,
    nome: string,
    descricao?: string,
    categoria: string,
    unidade_medida: UnidadeMedida
    preco_venda: number | string,
    preco_custo: number | string,
    estoque_atual: number,
    estoque_minimo: number
}