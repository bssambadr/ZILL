// assets/js/home.js
import { store } from './state.js';
import { db } from './firebase-config.js';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { createElement } from './ui-engine.js';
import { router } from './router.js';
import { fetchRecommendations } from './recommendation.js';

export async function HomePage() {
    const container = createElement('div', { className: 'home' });

    // Hero recommendations
    const recs = await fetchRecommendations(store.user?.uid);
    const recSection = createElement('section', {}, [
        createElement('h2', {}, ['مقترح لك']),
        createElement('div', { className: 'story-grid' }, recs.map(story => renderStoryCard(story)))
    ]);
    container.appendChild(recSection);

    // Categories with latest 2 stories
    const categories = ['رعب', 'تشويق', 'حقيقية', 'ما وراء الطبيعة', 'ألغاز مظلمة', 'تجارب مخيفة'];
    for (const catName of categories) {
        const section = await createCategorySection(catName);
        container.appendChild(section);
    }

    return container;
}

async function createCategorySection(categoryName) {
    const q = query(
        collection(db, 'stories'),
        where('category', '==', categoryName),
        orderBy('publishedAt', 'desc'),
        limit(2)
    );
    const snap = await getDocs(q);
    const stories = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const section = createElement('section', { className: 'category-section' }, [
        createElement('div', { className: 'category-header', style: 'display: flex; justify-content: space-between; align-items: baseline;' }, [
            createElement('h2', {}, [categoryName]),
            createElement('button', {
                className: 'btn-outline',
                style: 'padding: 8px 16px;',
                onClick: () => router.push(`/category/${categoryName}`)
            }, ['عرض الكل'])
        ]),
        createElement('div', { className: 'story-grid' }, stories.map(story => renderStoryCard(story)))
    ]);

    // Lazy loading effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                observer.unobserve(entry.target);
            }
        });
    });
    setTimeout(() => {
        document.querySelectorAll('.lazy-load').forEach(el => observer.observe(el));
    }, 100);

    return section;
}

function renderStoryCard(story) {
    const isVip = story.isVip || false;
    const card = createElement('div', {
        className: `story-item ${isVip ? 'vip-card' : ''}`,
        onClick: () => router.push(`/story/${story.id}`)
    }, [
        createElement('img', {
            src: story.coverUrl || 'assets/img/placeholder.jpg',
            alt: story.title,
            loading: 'lazy',
            className: 'lazy-load'
        }),
        createElement('div', { className: 'story-info' }, [
            createElement('h4', { style: 'font-size: 1rem; margin-bottom: 4px;' }, [
                isVip ? createElement('span', { className: 'vip-badge' }, ['🔮 ']) : null,
                story.title
            ]),
            createElement('p', { style: 'font-size: 0.8rem; color: var(--color-text-secondary);' }, [
                `${story.views || 0} مشاهدة`
            ])
        ])
    ]);
    return card;
}
