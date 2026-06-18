import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActividadService } from '../services/actividad.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-actividad-editar',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './actividad-editar.html',
})
export class ActividadEditar implements OnInit {
    id_actividad = 0;
    nombre_actividad = '';
    fecha_entrega = '';
    nivel_estres = 1;
    completada = false;

    message = signal<string>('');

    private actividadService = inject(ActividadService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    ngOnInit(): void {
        this.id_actividad = Number(this.route.snapshot.paramMap.get('id'));
        this.cargarDatos();
    }

    cargarDatos(): void {
        this.actividadService.getActividadId(this.id_actividad).subscribe({
            next: (act) => {
                this.nombre_actividad = act.nombre_actividad;
                this.nivel_estres = act.nivel_estres;
                this.completada = act.completada;

                const fecha = new Date(act.fecha_entrega);

                this.fecha_entrega = fecha.toISOString().split('T')[0];
            },
            error: (err) => {
                console.error(err);
                this.message.set('No se pudo obtener la informacion de la actividad.');
            }
        });
    }

    onSubmit(): void {
        if(!this.nombre_actividad || !this.fecha_entrega) {
            return;
        }

        const payload = {
            nombre_actividad: this.nombre_actividad,
            fecha_entrega: this.fecha_entrega,
            nivel_estres: Number(this.nivel_estres),
            completada: this.completada,
        };

        this.actividadService.updateActividad(this.id_actividad, payload).subscribe({
            next: () => {
                this.router.navigate(['/actividades']);
            },
            error: (err) => {
                this.message.set(`No se pudo obtener la actividad: ${ err }`);
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/actividades']);
    }
}
