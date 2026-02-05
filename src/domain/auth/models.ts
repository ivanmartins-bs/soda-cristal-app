/**
 * Modelos de dados do domínio de autenticação
 */

export interface User {
    ativo: number;
    created_at: string;
    distribuidor_id: string;
    email: string;
    email_verified_at: string;
    id: number;
    name: string;
    updated_at: string;
    username: string;
}
