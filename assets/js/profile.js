// assets/js/profile.js
import { store } from './state.js';
import { auth } from './firebase-config.js';
import { logout } from './auth.js';
import { createElement } from './ui-engine.js';
import { getLevelProgress, LEVEL_THRESHOLDS } from './points-system.js';

export function ProfilePage() {
    const user = store.user;
    const points = store.userPoints;
    const level = store.userLevel;
    const progress = getLevelProgress(points);
    const nextThreshold = LEVEL_THRESHOLDS[level] || '---';

    const container = createElement('div', { className: 'profile' });

    // User info card
    const userCard = createElement('div', { className: 'card glass' }, [
        createElement('div', { style: 'display: flex; align-items: center; gap: 16px;' }, [
            createElement('div', { style: 'width: 64px; height: 64px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-size: 32px;' }, ['👤']),
            createElement('div', {}, [
                createElement('h3', {}, [user?.displayName || 'مستخدم']),
                createElement('p', { style: 'color: var(--color-text-secondary);' }, [user?.email])
            ])
        ])
    ]);
    container.appendChild(userCard);

    // VIP status if applicable
    if (store.userPoints >= 20000) {
        container.appendChild(createElement('div', { className: 'card vip-card' }, [
            createElement('div', { style: 'display: flex; justify-content: space-between;' }, [
                createElement('span', { style: 'font-weight: 700;' }, ['✨ عضو VIP']),
                createElement('span', {}, ['مميزات حصرية'])
            ])
        ]));
    }

    // Level card
    const levelCard = createElement('div', { className: 'card' }, [
        createElement('h4', {}, [`المستوى ${level} · ${points} نقطة`]),
        createElement('div', { className: 'progress-container', style: 'margin: 8px 0;' }, [
            createElement('div', { className: 'progress-fill', style: `width: ${progress}%;` })
        ]),
        createElement('p', { style: 'font-size: 0.9rem; color: var(--color-text-secondary);' }, [
            level === 5 ? 'المستوى الأقصى' : `${nextThreshold - points} نقطة للمستوى التالي`
        ])
    ]);
    container.appendChild(levelCard);

    // Logout
    const logoutBtn = createElement('button', { className: 'btn', style: 'margin-top: 24px; width: 100%; background: #b71c1c;', onClick: logout }, ['تسجيل خروج']);
    container.appendChild(logoutBtn);

    return container;
}
