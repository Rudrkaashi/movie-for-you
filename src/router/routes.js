 /**
 * Route Definitions
 */

import { HomePage } from '../pages/home/index.js';
import { FavoritesPage } from '../pages/favorites/index.js';

export default [
    {
        path: '/',
        name: 'home',
        component: HomePage
    },
    {
        path: '/favorites',
        name: 'favorites',
        component: FavoritesPage
    },
    {
        path: '*',
        name: 'not-found',
        component: HomePage // Fallback to home
    }
];
