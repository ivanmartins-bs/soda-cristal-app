import api from '../index';
import { ENDPOINTS } from '../endpoints';
import type { User } from '../../../domain/auth/models';

// Tipagem básica para request/response de login
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
    vendedor: {
        id: number;
    };
    distribuidor: {
        id: number;
    };
}

export const userService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>(ENDPOINTS.LOGIN, credentials);

        return response.data;
    },
    getCurrentUser: async (): Promise<User> => {
        // Pega os dados do localStorage
        const vendedorIdStr = localStorage.getItem('vendedorId');
        const userStr = localStorage.getItem('user');



        if (!vendedorIdStr || !userStr) {
            throw new Error('Dados de autenticação não encontrados');
        }

        const vendedorId = Number(vendedorIdStr);
        const user: User = JSON.parse(userStr);

        try {
            // Faz uma chamada leve apenas para validar se o token ainda é válido
            // Usa um endpoint que você sabe que existe (ex: rotas do vendedor)
            const endpoint = ENDPOINTS.rotasVendedor(vendedorId);

            await api.get(endpoint);

            // Se chegou aqui, o token é válido
            // Retorna o user que estava no localStorage
            return user;

        } catch (error: any) {


            // Verifica se é erro 401 (não autorizado = token inválido)
            if (error.response?.status === 401) {
                console.warn('Token inválido ou expirado');
            }
            throw error;
        }
    },
};
