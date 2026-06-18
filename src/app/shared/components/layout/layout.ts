import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, RouterLink],
    templateUrl: './layout.html',
    styleUrl: './layout.css',
})
export class Layout {
    randomMessage = signal<string>('');
    userName = signal<string>('');

    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private mensajes: string[] = [
        'Kein Stress, alles wird gut. (Sin estrés, todo estará bien)',
        '一歩一歩 (いっぽいっぽ) -> Paso a paso.',
        'Schritt für Schritt (Paso a paso) se llega muy lejos.',
        '無理しないで (むりしないで) -> No te sobreesfuerces.',
        'El éxito es la suma de pequeños esfuerzos diarios.',
        'お疲れ様です (おつかれさまです) -> Gracias por tu gran esfuerzo hoy.',
        'Respira profundo. Una línea de código a la vez.',
    ];

    ngOnInit() {
        this.generateRandomMessage();

        const token = localStorage.getItem('accessToken');

        if(!token) {
            this.userName.set('Usuario');
        }
        else {
            const payload = JSON.parse(atob(token.split('.')[1]));
            this.userName.set(payload.nombre);
        }

        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => {
                this.generateRandomMessage();
            });
    }

    generateRandomMessage(): void {
        const randomIndex = Math.floor(Math.random() * this.mensajes.length);
        this.randomMessage.set(this.mensajes[randomIndex]);
    }

    logout(): void {
        localStorage.removeItem('accessToken');
    }
}
