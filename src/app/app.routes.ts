import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout').then(m => m.Layout),
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full',
            },
        ]
    },

    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
    },

    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register),
    },

    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
