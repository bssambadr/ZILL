// assets/js/points-system.js
import { store } from './state.js';
import { db } from './firebase-config.js';
import { doc, updateDoc, increment } from 'firebase/firestore';

export const LEVEL_THRESHOLDS = [0, 20000, 50000, 90000, 150000, Infinity];

export function getLevelFromPoints(points) {
    if (points >= 150000) return 5;
    if (points >= 90000) return 4;
    if (points >= 50000) return 3;
    if (points >= 20000) return 2;
    return 1;
}

export async function awardPoints(userId, points) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        points: increment(points)
    });
    store.userPoints += points;
    store.userLevel = getLevelFromPoints(store.userPoints);
    store.notify();
}

export function getLevelProgress(points) {
    const level = getLevelFromPoints(points);
    const currentThreshold = LEVEL_THRESHOLDS[level - 1];
    const nextThreshold = LEVEL_THRESHOLDS[level];
    if (nextThreshold === Infinity) return 100;
    const progress = ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(progress, 100);
}
