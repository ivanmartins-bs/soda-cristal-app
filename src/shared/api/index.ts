import axios from 'axios';
import { API_CONFIG } from './config';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': API_CONFIG.HEADERS.CONTENT_TYPE,
    },
});

api.interceptors.request.use(
    (config) => {
        // Adiciona o header de versão do app (obrigatório)
        config.headers['versaoApp'] = API_CONFIG.APP_VERSION;

        // Recupera o token do localStorage (se existir)
        const token = localStorage.getItem('auth_token'); // TODO: Ajustar chave do token conforme padrão do projeto
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Tratamento global de erros pode ser adicionado aqui
        return Promise.reject(error);
    }
);

export default api;
