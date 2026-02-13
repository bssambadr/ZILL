// assets/js/notifications.js
import { store } from './state.js';

class NotificationService {
    toast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    modal({ title, content, onConfirm }) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content">
                <h3 style="margin-bottom: 16px; color: var(--color-primary);">${title}</h3>
                <div style="margin-bottom: 24px;">${content}</div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="btn btn-outline" id="modalCancel">إلغاء</button>
                    <button class="btn" id="modalConfirm">تأكيد</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('#modalCancel').onclick = () => overlay.remove();
        overlay.querySelector('#modalConfirm').onclick = () => {
            if (onConfirm) onConfirm();
            overlay.remove();
        };
    }

    pushNotification(message) {
        store.notifications.unshift({ id: Date.now(), message, read: false });
        store.notify();
        this.toast(message);
    }
}

export const notifications = new NotificationService();
