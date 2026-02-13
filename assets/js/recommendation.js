// assets/js/recommendation.js
import { store } from './state.js';
import { db } from './firebase-config.js';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';

export async function fetchRecommendations(userId) {
    // In real app, fetch user interests from Firestore
    const userInterest = 0.8; // placeholder
    const stories = store.stories.length ? store.stories : await loadStories();

    const scored = stories.map(story => {
        const popularity = story.views || 0;
        const rating = story.avgRating || 0;
        const freshness = (Date.now() - (story.publishedAt?.toMillis?.() || 0)) / (1000 * 60 * 60 * 24);
        const freshnessScore = Math.max(0, 1 - (freshness / 30)); // newer = higher

        const finalScore = (userInterest * 0.4) +
                          (popularity * 0.3) +
                          (rating * 0.2) +
                          (freshnessScore * 0.1);
        return { ...story, score: finalScore };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 6);
}

async function loadStories() {
    const q = query(collection(db, 'stories'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
