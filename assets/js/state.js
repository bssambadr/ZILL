// assets/js/state.js
import { auth } from './firebase-config.js';

class Store {
    constructor() {
        this.user = null;
        this.userPoints = 0;
        this.userLevel = 1;
        this.isAdmin = false;
        this.stories = [];
        this.categories = [];
        this.listeners = [];
        this.notifications = [];
    }

    setState(newState) {
        Object.assign(this, newState);
        this.notify();
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    notify() {
        this.listeners.forEach(fn => fn(this));
    }

    async loadUserData() {
        if (!this.user) return;
        // Simulated fetch from Firestore – will be replaced
        this.userPoints = this.user.points || 12500;
        this.userLevel = this.calculateLevel(this.userPoints);
        this.isAdmin = this.user?.email === 'info.bassambadr@gmail.com';
        this.notify();
    }

    calculateLevel(points) {
        if (points >= 150000) return 5;
        if (points >= 90000) return 4;
        if (points >= 50000) return 3;
        if (points >= 20000) return 2;
        return 1;
    }
}

export const store = new Store();

// Auth state listener
auth.onAuthStateChanged((user) => {
    store.setState({ user });
    if (user) store.loadUserData();
});
