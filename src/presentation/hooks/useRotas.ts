import { useEffect } from 'react';
import { useRotasStore } from '../../domain/rotas/rotasStore';

/**
 * Hook para gerenciar rotas do vendedor
 */
export function useRotas() {
    const { rotas, isLoading, error, loadRotas, clearError } = useRotasStore();

    // Busca vendedorId do localStorage
    const vendedorIdStr = localStorage.getItem('vendedorId');
    const vendedorId = vendedorIdStr ? Number(vendedorIdStr) : null;

    useEffect(() => {
        if (vendedorId) {
            loadRotas(vendedorId);
        }
    }, [vendedorId, loadRotas]);

    return {
        rotas,
        isLoading,
        error,
        reload: () => vendedorId && loadRotas(vendedorId),
        clearError,
    };
}

/**
 * Hook para gerenciar a rota atual e seus clientes
 */
export function useRotaAtual(rotaId: number | null) {
    const { rotaAtual, clientesRota, isLoading, selectRota, loadClientesRota } = useRotasStore();

    useEffect(() => {
        if (rotaId) {
            selectRota(rotaId);
            loadClientesRota(rotaId);
        }
    }, [rotaId, selectRota, loadClientesRota]);

    return {
        rota: rotaAtual,
        clientes: clientesRota,
        isLoading,
    };
}
