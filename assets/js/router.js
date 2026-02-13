// assets/js/router.js
import { store } from './state.js';
import { render, routerView } from './ui-engine.js';
import { authGuard, adminGuard, guestGuard } from './guards.js';
import { login } from './auth.js';

class Router {
    constructor() {
        this.routes = {};
        window.addEventListener('popstate', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    addRoute(path, component, guard = null) {
        this.routes[path] = { component, guard };
    }

    async navigateTo(path) {
        history.pushState({}, '', `#${path}`);
        await this.handleRoute();
    }

    push(path) {
        this.navigateTo(path);
    }

    async handleRoute() {
        let path = window.location.hash.slice(1) || '/';
        if (path === '') path = '/';
        const route = this.routes[path];
        if (!route) return this.navigateTo('/404');

        // Run guard if exists
        if (route.guard) {
            const allowed = await route.guard(path);
            if (!allowed) return;
        }

        const component = typeof route.component === 'function' ? await route.component() : route.component;
        render(routerView, component);
    }
}

export const router = new Router();

// Define routes
import { HomePage } from './home.js';
import { CategoryPage } from './category.js';
import { StoryPage } from './story.js';
import { ProfilePage } from './profile.js';
import { VipPage } from './vip.js';
import { AdminPage } from './admin.js';
import { createLoginPage } from './auth.js'; // assume login component

router.addRoute('/', HomePage, authGuard);
router.addRoute('/category/:id', CategoryPage, authGuard);
router.addRoute('/story/:id', StoryPage, authGuard);
router.addRoute('/profile', ProfilePage, authGuard);
router.addRoute('/vip', VipPage, authGuard);
router.addRoute('/admin', AdminPage, adminGuard);
router.addRoute('/login', createLoginPage, guestGuard);
