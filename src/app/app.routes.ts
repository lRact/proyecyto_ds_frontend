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
                path: 'actividades',
                loadComponent: () => import('./features/actividades/list/actividad-list').then((m) => m.ActividadList),
            },

            {
                path: 'crear-actividad',
                loadComponent: () => import('./features/actividades/crear/actividad-crear').then((m) => m.ActividadCrear),
            },

            {
                path: 'editar-actividad/:id',
                loadComponent: () => import('./features/actividades/editar/actividad-editar').then((m) => m.ActividadEditar),
            },

            {
                path: 'perfil',
                loadComponent: () => import('./features/auth/perfil/perfil').then((m) => m.Perfil),
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
