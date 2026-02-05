import api from '../index';
import { ENDPOINTS } from '../endpoints';
import type { Rota, RotaEntregaCompleta } from '../../../domain/rotas/models';

export const rotasApiService = {
    /**
     * GET /rotas/{vendedor_id}
     * Retorna lista simplificada de rotas do vendedor
     */
    fetchRotasVendedor: async (vendedorId: number): Promise<Rota[]> => {
        const response = await api.get<Rota[]>(ENDPOINTS.rotasVendedor(vendedorId));
        return response.data;
    },

    /**
     * GET /rotas-entregas
     * Retorna todos os clientes de todas as rotas (sincronização completa)
     */
    fetchRotasEntregas: async (): Promise<RotaEntregaCompleta[]> => {
        const response = await api.get<RotaEntregaCompleta[]>(ENDPOINTS.rotasEntregas);
        return response.data;
    },

    /**
     * GET /rotas-entregas/rota/{rota_id}
     * Retorna clientes de uma rota específica
     */
    fetchRotasEntregasPorRota: async (rotaId: number): Promise<RotaEntregaCompleta[]> => {
        const response = await api.get<RotaEntregaCompleta[]>(
            ENDPOINTS.rotasEntregasRota(rotaId)
        );
        return response.data;
    },
};
