import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./shared/components/layout/layout').then((m) => m.Layout),
        children: [
            {
                path: '',
                redirectTo: 'inicio',
                pathMatch: 'full',
            },

            {
                path: 'inicio',
                loadComponent: () => import('./features/inicio/inicio').then((m) => m.Inicio),
            },

            {
                path: 'crear-actividad',
                loadComponent: () => import('./features/actividades/form/actividad-form').then((m) => m.ActividadForm),
            }
        ],
    },

    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
    },

    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    },

    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
