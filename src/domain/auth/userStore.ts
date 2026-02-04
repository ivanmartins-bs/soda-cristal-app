import { create } from 'zustand';
import { userService, LoginRequest } from '../../shared/api/services/userService';

interface UserState {
    isLoggedIn: boolean;
    user: any | null; // TODO: Definir tipo correto do User baseada na resposta da API
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    isLoggedIn: false,
    user: null,
    isLoading: false,
    error: null,
    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await userService.login(credentials);
            // Armazena token - idealmente usar um authService separado ou interceptor managing isso,
            // mas por enquanto simples:
            localStorage.setItem('auth_token', response.token);

            set({
                isLoggedIn: true,
                user: response.user || { name: credentials.username }, // Fallback se backend não retornar user object ainda
                isLoading: false
            });
        } catch (error: any) {
            console.error('Login failed', error);
            set({
                error: error.response?.data?.message || 'Falha ao realizar login',
                isLoading: false,
                isLoggedIn: false
            });
            throw error; // Re-throw para componente poder reagir se quiser
        }
    },
    logout: () => {
        localStorage.removeItem('auth_token');
        set({ isLoggedIn: false, user: null });
    },
}));
