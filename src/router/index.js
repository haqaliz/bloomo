import { createRouter, createWebHistory } from 'vue-router';

const routeConfig = (name, options) => ({
  ...(options.useNameAsPath && {
    path: (
      name
      && name.length
      && name.toLowerCase() !== 'root'
    ) ? `/${name.toLowerCase()}` : '/',
  }),
  ...(name && name.length && {
    name,
  }),
  ...options,
});

const routes = [
  routeConfig('Profile', { useNameAsPath: true, component: () => import('../views/Profile.vue') }),
  routeConfig('Profile Assets', { path: '/profile/assets', component: () => import('../views/Assets.vue') }),
  routeConfig('Root', { useNameAsPath: true, component: () => import('../views/Home.vue') }),
  routeConfig('User', { path: '/user/:username', component: () => import('../views/User.vue') }),
  routeConfig('Artwork', { path: '/artwork/:artwork_id', component: () => import('../views/Artwork.vue') }),
  routeConfig('404', { path: '/:catchAll(.*)', component: () => import('../views/NotFound.vue') }),
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
