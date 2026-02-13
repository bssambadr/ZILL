// assets/js/auth.js
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { notifications } from './notifications.js';
import { router } from './router.js';

export async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        notifications.toast(`مرحباً بعودتك!`, 2000);
        router.push('/');
    } catch (error) {
        notifications.toast('خطأ في البريد أو كلمة المرور', 3000);
        throw error;
    }
}

export async function logout() {
    await signOut(auth);
    notifications.toast('تم تسجيل الخروج', 2000);
    router.push('/login');
}

export function requireAuth() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(!!user);
        });
    });
}
