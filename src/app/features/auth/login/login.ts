import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    email = '';
    password = '';
    message = signal<string>('');

    private authService = inject(AuthService);
    private router = inject(Router);

    onSubmit(): void {
        if (!this.email || !this.password) {
            this.message.set('Completa todos los campos.');
            return;
        }

        if(this.password.length < 8) {
            this.message.set('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        this.authService.login(this.email, this.password).subscribe({
            next: () => {
                console.log('Login success');
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                console.error(err);
                this.message.set('Correo o contraseña inválidos.');
            },
        });
    }
}
