import { Component, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActividadService } from '../services/actividad.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-actividad-form',
    standalone: true,
    imports: [FormsModule],
    templateUrl: 'actividad-form.html'
})
export class ActividadForm {
    nombre_actividad = '';
    fecha_entrega = '';
    nivel_estres = 1;
    completada = false;

    message = signal<string>('');

    private actividadService = inject(ActividadService);
    private router = inject(Router);

    onSubmit(): void {
        if(!this.nombre_actividad || !this.fecha_entrega) {
            this.message.set('Completa los datos de la actividad.');
            return;
        }

        const token = localStorage.getItem('accessToken');

        if(!token) {
            this.message.set('Hubo un error en la autenticación de usuario.');
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const idUsuario = payload.userId;

        const actividad = {
            nombre_actividad: this.nombre_actividad,
            fecha_entrega: this.fecha_entrega,
            nivel_estres: Number(this.nivel_estres),
            completada: Boolean(this.completada),
            id_usuario: idUsuario,
        };

        this.actividadService.createActividad(actividad).subscribe({
            next: () => {
                console.log('Actividad creada.');
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                console.error(err);
                this.message.set('Hubo un error al crear la actividad.');
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/dashboard']);
    }
}
