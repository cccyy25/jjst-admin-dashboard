'use server';

import { cookies } from 'next/headers';

const SESSION_DURATION = 5000 * 24 * 60 * 60 * 1000;

// Staff accounts configuration
const STAFF_ACCOUNTS = [
    { prefix: 'STAFF_BI', branch: 'bukit-indah' },
    { prefix: 'STAFF_SP', branch: 'sri-petaling' },
    { prefix: 'STAFF_CH', branch: 'cheras' },
    { prefix: 'STAFF_SB', branch: 'subang' },
    { prefix: 'STAFF_KD', branch: 'kota-damansara' },
    { prefix: 'STAFF_PC', branch: 'puchong' },
];

// Timing-safe string comparison to prevent timing attacks
function secureCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

export async function login(username, password) {
    const superadminUsername = process.env.SUPERADMIN_USERNAME;
    const superadminPassword = process.env.SUPERADMIN_PASSWORD;

    let role = null;
    let branch = null;

    // Check superadmin first
    if (username === superadminUsername && secureCompare(password, superadminPassword)) {
        role = 'superadmin';
    }

    // If not superadmin, check staff accounts
    if (!role) {
        for (const account of STAFF_ACCOUNTS) {
            const staffUsername = process.env[`${account.prefix}_USERNAME`];
            const staffPassword = process.env[`${account.prefix}_PASSWORD`];

            if (username === staffUsername && secureCompare(password, staffPassword)) {
                role = 'staff';
                branch = process.env[`${account.prefix}_BRANCH`] || account.branch;
                break;
            }
        }
    }

    if (!role) {
        return { success: false, error: 'Invalid username or password' };
    }

    // Create session data
    const sessionData = {
        role,
        username,
        branch, // null for superadmin, branch slug for staff
        expiresAt: Date.now() + SESSION_DURATION,
    };

    // Encode session data as base64
    const sessionValue = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION / 1000, // in seconds
        path: '/',
    });

    return { success: true, role, branch };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    return { success: true };
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        return null;
    }

    try {
        const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());

        // Check if session has expired
        if (Date.now() > sessionData.expiresAt) {
            // Session expired, delete cookie
            cookieStore.delete('session');
            return null;
        }

        return sessionData;
    } catch {
        return null;
    }
}