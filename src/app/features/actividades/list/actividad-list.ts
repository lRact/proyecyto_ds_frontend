import { Component, inject, signal } from '@angular/core';
import { ActividadService } from '../services/actividad.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-actividad-list',
    standalone: true,
    templateUrl: './actividad-list.html',
    imports: [DatePipe, RouterLink],
})
export class ActividadList {
    private actividadService = inject(ActividadService);

    actividades = signal<any[]>([]);

    ngOnInit(): void {
        this.cargarActividades();
    }

    cargarActividades(): void {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const idUsuario = payload.userId;

        this.actividadService.getActividadUsuario(idUsuario).subscribe({
            next: (list: any[]) => {
                this.actividades.set(list);
            },
            error: (err) => {
                console.error(`Error al cargar las metricas: ${err}`);
            },
        });
    }

    eliminarActividad(id: number): void {
        if(confirm('¿Estas seguro de eliminar esta actividad?')) {
            this.actividadService.deleteActividad(id).subscribe({
                next: () => {
                    this.actividades.update(acts => acts.filter(a => a.id_actividad !== id));
                },
                error: (err) => {
                    console.error(`Error al eliminar la actividad: ${err}`);
                }
            });
        }
    }
}
