import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ActividadService } from '../actividades/services/actividad.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [RouterLink, DatePipe],
    templateUrl: './inicio.html',
})
export class Inicio {
    private actividadService = inject(ActividadService);
    private router = inject(Router);

    totales = signal<number>(0);
    completadas = signal<number>(0);
    pendientes = signal<number>(0);
    atrasadas = signal<number>(0);
    nivelEstres = signal<number>(0);
    actividadesRecientes = signal<any[]>([]);

    ngOnInit(): void {
        this.cargarMetricas();
    }

    cargarMetricas(): void {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const idUsuario = payload.userId;

        this.actividadService.getActividadUsuario(idUsuario).subscribe({
            next: (actividades: any) => {
                this.totales.set(actividades.length);

                const fechaHoy = new Date();
                fechaHoy.setHours(0, 0, 0, 0);

                let countCompletadas = 0;
                let countPendientes = 0;
                let countAtrasados = 0;
                let countNoCompletadas = 0;
                let countEstres = 0;

                actividades.forEach((act: any) => {
                    if (act.completada) {
                        countCompletadas++;
                    } else {
                        const fechaEntrega = new Date(act.fecha_entrega);
                        fechaEntrega.setHours(0, 0, 0, 0);

                        if (fechaEntrega < fechaHoy) {
                            countAtrasados++;
                        } else {
                            countPendientes++;
                        }

                        countNoCompletadas++;
                        countEstres += Number(act.nivel_estres);
                    }
                });

                if (countEstres > 0 && countNoCompletadas > 0) {
                    countEstres /= countNoCompletadas;
                } else {
                    countEstres = 0;
                }

                this.completadas.set(countCompletadas);
                this.pendientes.set(countPendientes);
                this.atrasadas.set(countAtrasados);
                this.nivelEstres.set(Number(countEstres.toFixed(1)));

                const recientes = [...actividades]
                    .sort((a, b) => b.id_actividad - a.id_actividad)
                    .slice(0, 5);

                this.actividadesRecientes.set(recientes);
            },
            error: (err) => {
                console.error(`Error al cargar las metricas: ${err}`);
            },
        });
    }
}
