import { lazy } from "solid-js";
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
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
    path: '/signin',
    component: lazy(() => import('./pages/signin')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404'))
  },
];
