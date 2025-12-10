'use server';

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Valida o token salvo no cookie do usuário.
 * Usado para verificar se a sessão ainda está ativa.
 */
async function openSessionToken(token: string) {
    // A chave secreta usada para assinar/verificar o JWT está no arquivo .env
    // Exemplo de criação no terminal Node:
    //    require('crypto').randomBytes(64).toString('hex')
    const encodedKey = new TextEncoder().encode(process.env.TOKEN);

    try {
        const { payload } = await jwtVerify(token, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (e) {
        console.log('Erro ao verificar session token', e);
    }
}

/**
 * Cria o token JWT com os dados essenciais do usuário.
 * Esse token será salvo como cookie "session".
 */
export async function createSessionToken(userId: string, userEmail: string) {
    const encodedKey = new TextEncoder().encode(process.env.TOKEN); 
    const expiresAt = Date.now() + 3600; // 1 hora

    // Assina o JWT com os dados do usuário
    const session = await new SignJWT({ userId, userEmail })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(encodedKey);

    const cookieStore = await cookies();

    cookieStore.set('session', session, {
        expires: expiresAt * 1000,
        path: '/',
        httpOnly: true
    });
}

/**
 * Verifica se o cookie "session" contém um JWT válido.
 * Retorna o payload do usuário ou false.
 */
export async function isSessionValid() {
    const sessionCookie = (await cookies()).get('session');

    if (sessionCookie) {
        const { value } = sessionCookie;
        const session = await openSessionToken(value);
        return session;
    }

    return false;
}

/**
 * Deleta o cookie de sessão (logout).
 */
export async function deleteSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
