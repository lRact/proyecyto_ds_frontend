import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ActividadService {
    private http = inject(HttpClient);
    private apiUrl = `${ environment.apiUrl }/actividad`;

    getActividadUsuario(idUsuario: number): Observable<any> {
        return this.http.get<any[]>(this.apiUrl + '/usuario/' + idUsuario);
    }

    getActividadId(idActividad: number): Observable<any> {
        return this.http.get<any[]>(this.apiUrl + '/' + idActividad);
    }

    createActividad(actividad: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, actividad);
    }

    updateActividad(idActividad: number, update: any): Observable<any> {
        return this.http.patch<any>(`${ this.apiUrl }/${ idActividad }`, update);
    }

    deleteActividad(idActividad: number): Observable<any> {
        return this.http.delete<any>(`${ this.apiUrl }/${ idActividad }`);
    }
}
