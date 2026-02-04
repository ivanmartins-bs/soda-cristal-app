import api from '../index';
import { ENDPOINTS } from '../endpoints';

// Tipagem básica para request/response de login
// Ajuste conforme models.ts do domínio se necessário
export interface LoginRequest {
    username: string;
    password: string; // MD5 string se for o caso, mas seguindo a doc parece ser plain? A doc mostra "senha".
}

export interface LoginResponse {
    token: string;
    // Adicione outros campos retornados pelo login
    user?: {
        id: string;
        name: string;
        // ...
    };
}

export const userService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>(ENDPOINTS.LOGIN, credentials);
        console.log(response.data);
        return response.data;
    },
};
