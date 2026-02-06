import api from '../../shared/api';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { Venda } from './model';

export const vendasService = {
    getVendasVendedor: async (vendedorId: number): Promise<Venda[]> => {
        const response = await api.get<Venda[]>(ENDPOINTS.vendasVendedor(vendedorId));
        return response.data;
    },

    getVendasPendentes: async (vendedorId: number): Promise<Venda[]> => {
        const response = await api.get<Venda[]>(ENDPOINTS.vendasPendentes(vendedorId));
        return response.data;
    }
};
