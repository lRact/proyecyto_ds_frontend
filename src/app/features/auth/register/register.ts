import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    imports: [FormsModule],
    templateUrl: './register.html',
})
export class Register {
    nombre: string = '';
    correo: string = '';
    password: string = '';
    confirmPassword: string = '';
    id_rol: any = 0;
    message = signal<string>('');

    private authService = inject(AuthService);
    private router = inject(Router);

    onSubmit(): void {
        if(!this.nombre || !this.correo || !this.password || !this.confirmPassword || !this.id_rol) {
            this.message.set('Completa todos los campos.');
            return;
        }

        if(this.password.length < 8 || this.confirmPassword.length < 8) {
            this.message.set('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if(this.password !== this.confirmPassword) {
            this.message.set('Las contraseñas no coinciden.');
            return;
        }

        const rolNum = Number(this.id_rol);

        this.authService.register(this.nombre, this.correo, this.password, rolNum).subscribe({
            next: () => {
                console.log('Register success');
                this.router.navigate(['/login']);
            },
            error: err => {
                const error = err.error?.message ? err.error.message.toString() : err.message;
                this.message.set(`Hubo un problema durante el registro: ${error}`);
            }
        });
    }
}
