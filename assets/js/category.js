// assets/js/category.js
import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { createElement } from './ui-engine.js';
import { router } from './router.js';

export async function CategoryPage(route) {
    const categoryName = route.params.id;
    const container = createElement('div', { className: 'category-page' }, [
        createElement('h2', {}, [categoryName])
    ]);

    const q = query(collection(db, 'stories'), where('category', '==', categoryName));
    const snap = await getDocs(q);
    const stories = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const grid = createElement('div', { className: 'story-grid' }, stories.map(story => renderCategoryCard(story)));
    container.appendChild(grid);
    return container;
}

function renderCategoryCard(story) {
    return createElement('div', {
        className: 'story-item',
        onClick: () => router.push(`/story/${story.id}`)
    }, [
        createElement('img', { src: story.coverUrl || 'assets/img/placeholder.jpg' }),
        createElement('div', { className: 'story-info' }, [
            createElement('h4', {}, [story.title]),
            createElement('span', { className: story.isVip ? 'vip-badge' : '' }, [story.isVip ? 'VIP' : 'مجاني'])
        ])
    ]);
}
