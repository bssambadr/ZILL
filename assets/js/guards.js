// assets/js/guards.js
import { auth } from './firebase-config.js';
import { store } from './state.js';
import { router } from './router.js';

export async function authGuard(to, from) {
    const user = auth.currentUser;
    if (!user) {
        router.push('/login');
        return false;
    }
    return true;
}

export async function adminGuard(to, from) {
    const user = auth.currentUser;
    if (!user) {
        router.push('/login');
        return false;
    }
    if (user.email !== 'info.bassambadr@gmail.com') {
        router.push('/');
        return false;
    }
    return true;
}

export function guestGuard(to, from) {
    if (auth.currentUser) {
        router.push('/');
        return false;
    }
    return true;
}
