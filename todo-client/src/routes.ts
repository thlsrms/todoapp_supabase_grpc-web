import { lazy } from "solid-js";
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';
import AboutData from './pages/about.data';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    data: AboutData,
  },
  {
    path: '/tasks',
    component: lazy(() => import('./pages/tasks')),
  },
  {
    path: '/signup',
    component: lazy(() => import('./pages/signup')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404'))
  },
];
