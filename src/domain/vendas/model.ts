export interface Venda {
    id: number;
    cliente_id: number;
    data_venda: string; // "yyyy-MM-dd HH:mm:ss"
    vendedor: number;
    promocao_id?: string;
    venda_item?: VendaItem[];
    contas_receber?: ContasReceber;
    // Adicione outros campos conforme a API
}

export interface VendaItem {
    id: number;
    produto_id: number;
    quantidade: number;
    venda_id: number;
    valor_unitario: number;
    unidade_medida: string;
    desconto: number;
    acrescimo: number;
}

export interface ContasReceber {
    valor: string;
    parcelas: Parcela[];
}

export interface Parcela {
    recebido: boolean;
    valor: string;
    meio_pagamento_id: number;
}
