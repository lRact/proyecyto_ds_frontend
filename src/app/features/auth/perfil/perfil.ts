import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    id: number = 0;
    nombre: string = '';
    correo: string = '';
    password: string = '';
    confirmPassword: string = '';
    message = signal<{texto: string, tipo: 'success' | 'danger'} | null>(null);

    ngOnInit(): void {
        const token = localStorage.getItem('accessToken');

        if(!token) {
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        this.id = payload.userId;

        this.cargarPerfil();
    }

    cargarPerfil(): void {
        this.authService.getUsuario(this.id).subscribe({
            next: usuario => {
                this.nombre = usuario.nombre;
                this.correo = usuario.correo;
            },
            error: err => {
                console.error(err);
                this.message.set({ texto: `Error al cargar los datos del usuario: ${ err }`, tipo: 'danger' });
            }
        });
    }

    onSubmit(): void {
        if(confirm('¿Seguro que deseas actualizar tus datos? Tendras que volver a iniciar sesión.')) {
            if (!this.nombre || !this.correo) {
                this.message.set({
                    texto: 'El nombre y el correo son obligatorios.',
                    tipo: 'danger',
                });
                return;
            }

            const payload: any = {
                nombre: this.nombre,
                correo: this.correo,
            };

            if (this.password.trim().length > 0 || this.confirmPassword.trim().length > 0) {
                if (this.password.length < 8 || this.confirmPassword.length < 8) {
                    this.message.set({
                        texto: 'La contraseña debe tener al menos 8 caracteres.',
                        tipo: 'danger',
                    });
                    return;
                }

                if (this.password !== this.confirmPassword) {
                    this.message.set({ texto: 'Las contraseñas no coinciden.', tipo: 'danger' });
                    return;
                }

                payload.password = this.password;
            }

            this.authService.updateUsuario(this.id, payload).subscribe({
                next: () => {
                    this.message.set({
                        texto: 'Se actualizaron los datos con exito.',
                        tipo: 'success',
                    });

                    this.password = '';
                    this.confirmPassword = '';

                    this.authService.logout();
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    console.error(err);
                    this.message.set({
                        texto: `Hubo un error al actualizar los datos: ${err.message}`,
                        tipo: 'danger',
                    });
                },
            });
        }
    }
}
