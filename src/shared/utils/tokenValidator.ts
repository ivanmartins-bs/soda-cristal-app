/**
 * Utilitário para validação de tokens JWT
 * Verifica se o token é válido e não expirou
 */

interface JWTPayload {
    iss?: string;      // Issuer
    iat?: number;      // Issued At
    exp?: number;      // Expiration Time
    nbf?: number;      // Not Before
    sub?: string;      // Subject
    jti?: string;      // JWT ID
    [key: string]: unknown;
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64Decode(input: string): string {
    const str = input.replace(/=+$/, '');
    let output = '';

    for (let i = 0, len = str.length; i < len; i += 4) {
        const a = BASE64_CHARS.indexOf(str[i]);
        const b = BASE64_CHARS.indexOf(str[i + 1]);
        const c = BASE64_CHARS.indexOf(str[i + 2]);
        const d = BASE64_CHARS.indexOf(str[i + 3]);

        const bits = (a << 18) | (b << 12) | (c << 6) | d;

        output += String.fromCharCode((bits >> 16) & 0xff);
        if (c !== -1 && str[i + 2] !== undefined) output += String.fromCharCode((bits >> 8) & 0xff);
        if (d !== -1 && str[i + 3] !== undefined) output += String.fromCharCode(bits & 0xff);
    }

    return output;
}

function decodeBase64Url(base64Url: string): string {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const padding = base64.length % 4;
    if (padding) {
        base64 += '='.repeat(4 - padding);
    }

    const binaryStr = base64Decode(base64);

    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }

    return new TextDecoder().decode(bytes);
}

export const decodeJWT = (token: string): JWTPayload | null => {
    try {
        const parts = token.split('.');

        if (parts.length !== 3) {
            console.error('Token JWT inválido: formato incorreto');
            return null;
        }

        const decoded = decodeBase64Url(parts[1]);
        const parsed = JSON.parse(decoded);

        return parsed as JWTPayload;
    } catch (error) {
        console.error('Erro ao decodificar JWT:', error);
        return null;
    }
};

/**
 * Valida se um token JWT é válido e não expirou
 * @param token - Token JWT a ser validado
 * @returns true se o token é válido, false caso contrário
 */
export const isTokenValid = (token: string): boolean => {
    if (!token || typeof token !== 'string') {
        console.warn('Token inválido: vazio ou tipo incorreto');
        return false;
    }

    const payload = decodeJWT(token);

    if (!payload) {
        return false;
    }

    const now = Math.floor(Date.now() / 1000); // Timestamp atual em segundos

    // Verifica se o token já expirou (exp - Expiration Time)
    if (payload.exp && payload.exp < now) {
        console.warn('Token expirado', {
            expiradoEm: new Date(payload.exp * 1000).toISOString(),
            agora: new Date(now * 1000).toISOString()
        });
        return false;
    }

    // Verifica se o token ainda não é válido (nbf - Not Before)
    if (payload.nbf && payload.nbf > now) {
        console.warn('Token ainda não é válido', {
            validoAPartirDe: new Date(payload.nbf * 1000).toISOString(),
            agora: new Date(now * 1000).toISOString()
        });
        return false;
    }

    // Token válido
    return true;
};

/**
 * Obtém informações do token JWT
 * @param token - Token JWT
 * @returns Informações do token ou null se inválido
 */
export const getTokenInfo = (token: string): {
    isValid: boolean;
    payload: JWTPayload | null;
    expiresAt: Date | null;
    issuedAt: Date | null;
} => {
    const payload = decodeJWT(token);

    if (!payload) {
        return {
            isValid: false,
            payload: null,
            expiresAt: null,
            issuedAt: null
        };
    }

    return {
        isValid: isTokenValid(token),
        payload,
        expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
        issuedAt: payload.iat ? new Date(payload.iat * 1000) : null
    };
};
