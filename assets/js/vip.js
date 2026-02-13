// assets/js/vip.js
import { store } from './state.js';
import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { createElement } from './ui-engine.js';
import { router } from './router.js';

export async function VipPage() {
    if (store.userPoints < 20000) {
        return createElement('div', { style: 'text-align: center; padding: 40px;' }, [
            createElement('h2', {}, ['محتوى VIP']),
            createElement('p', { style: 'margin: 20px 0;' }, ['تحتاج 20000 نقطة على الأقل للدخول']),
            createElement('div', { className: 'progress-container', style: 'width: 80%; margin: 0 auto;' }, [
                createElement('div', { className: 'progress-fill', style: `width: ${(store.userPoints / 20000) * 100}%;` })
            ])
        ]);
    }

    const q = query(collection(db, 'stories'), where('isVip', '==', true));
    const snap = await getDocs(q);
    const vipStories = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const container = createElement('div', {}, [
        createElement('h2', {}, ['مكتبة VIP']),
        createElement('div', { className: 'story-grid' }, vipStories.map(story => 
            createElement('div', { className: 'story-item vip-card', onClick: () => router.push(`/story/${story.id}`) }, [
                createElement('img', { src: story.coverUrl }),
                createElement('h4', {}, [story.title])
            ])
        ))
    ]);
    return container;
}
