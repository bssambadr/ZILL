// assets/js/app-init.js
import { auth } from './firebase-config.js';
import { store } from './state.js';
import { router } from './router.js';
import { tts } from './ai-tts.js';
import { notifications } from './notifications.js';

// Initialize TTS voices
window.speechSynthesis.onvoiceschanged = () => {
    tts.init();
};

// Global error handler
window.addEventListener('error', (e) => {
    console.error(e.error);
    notifications.toast('حدث خطأ غير متوقع', 4000);
});

// Auth state driven UI
store.subscribe((state) => {
    // Update admin visibility if needed
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        el.style.display = state.isAdmin ? 'block' : 'none';
    });
});

// Start router
if (!window.location.hash) {
    router.push('/');
} else {
    router.handleRoute();
}
