// assets/js/story.js
import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc, increment, collection, addDoc } from 'firebase/firestore';
import { createElement } from './ui-engine.js';
import { router } from './router.js';
import { readingTime, shareVia } from './utils.js';
import { tts } from './ai-tts.js';
import { notifications } from './notifications.js';
import { store } from './state.js';
import { awardPoints } from './points-system.js';

export async function StoryPage(route) {
    const storyId = route.params.id;
    const storyDoc = await getDoc(doc(db, 'stories', storyId));
    if (!storyDoc.exists()) return createElement('div', {}, ['القصة غير موجودة']);
    const story = { id: storyDoc.id, ...storyDoc.data() };

    // Increment views
    await updateDoc(doc(db, 'stories', storyId), { views: increment(1) });

    const readTime = readingTime(story.content || '');

    const container = createElement('div', { className: 'story-page' });

    // Header
    container.appendChild(createElement('h1', { style: 'font-size: 1.8rem; margin-bottom: 8px;' }, [story.title]));

    // Meta + reading time
    container.appendChild(createElement('div', { style: 'display: flex; gap: 16px; color: var(--color-text-secondary); margin-bottom: 20px;' }, [
        createElement('span', {}, [`⏱ ${readTime} دقائق`]),
        createElement('span', {}, [`👁 ${story.views || 0}`])
    ]));

    // Progress bar for reading
    const progressBar = createElement('div', { className: 'progress-container' }, [
        createElement('div', { className: 'progress-fill', id: 'reading-progress' })
    ]);
    container.appendChild(progressBar);

    // Story content
    const contentDiv = createElement('div', { className: 'story-content', style: 'line-height: 1.8; font-size: 1.1rem;' }, [story.content || '']);
    container.appendChild(contentDiv);

    // AI Listen button
    const listenBtn = createElement('button', { className: 'btn', style: 'margin: 20px 0; width: 100%;', onClick: () => {
        if (!tts.arabicVoice) tts.init();
        tts.toggle(story.content);
    }}, ['🔊 استمع باللهجة المصرية']);
    container.appendChild(listenBtn);

    // Rating stars
    const ratingContainer = createElement('div', { style: 'display: flex; align-items: center; gap: 12px; margin: 16px 0;' }, [
        createElement('span', {}, ['تقييمك: ']),
        ...createStarRating(story.id, story.avgRating || 0)
    ]);
    container.appendChild(ratingContainer);

    // Share buttons
    const shareDiv = createElement('div', { style: 'display: flex; gap: 16px; margin: 20px 0;' }, [
        createElement('button', { className: 'btn-outline', onClick: () => shareVia('facebook', window.location.href, story.title) }, ['فيسبوك']),
        createElement('button', { className: 'btn-outline', onClick: () => shareVia('whatsapp', window.location.href, story.title) }, ['واتساب']),
        createElement('button', { className: 'btn-outline', onClick: () => shareVia('telegram', window.location.href, story.title) }, ['تيليجرام'])
    ]);
    container.appendChild(shareDiv);

    // Comment popup trigger
    const commentBtn = createElement('button', { className: 'btn-outline', style: 'width: 100%;', onClick: () => showCommentPopup(storyId) }, ['💬 أضف تعليقاً']);
    container.appendChild(commentBtn);

    // Award points for reading
    if (store.user) awardPoints(store.user.uid, 5);

    // Scroll progress
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressFill = document.getElementById('reading-progress');
        if (progressFill) progressFill.style.width = scrolled + '%';
    });

    return container;
}

function createStarRating(storyId, currentRating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const star = createElement('span', {
            style: `font-size: 28px; cursor: pointer; color: ${i <= currentRating ? 'var(--color-primary)' : '#555'};`,
            onClick: async () => {
                await updateDoc(doc(db, 'stories', storyId), { avgRating: i });
                notifications.toast('تم تسجيل تقييمك');
            }
        }, ['★']);
        stars.push(star);
    }
    return stars;
}

function showCommentPopup(storyId) {
    notifications.modal({
        title: 'أضف تعليقاً',
        content: '<textarea id="commentText" placeholder="اكتب تعليقك..." style="width:100%; padding:12px; background:#2a2a2a; border:1px solid #444; border-radius:12px; color:white;"></textarea>',
        onConfirm: async () => {
            const text = document.getElementById('commentText').value;
            if (!text.trim()) return;
            await addDoc(collection(db, 'comments'), {
                storyId,
                userId: store.user.uid,
                userName: store.user.displayName || 'مستخدم',
                text,
                createdAt: new Date()
            });
            notifications.toast('تمت إضافة التعليق');
        }
    });
}
