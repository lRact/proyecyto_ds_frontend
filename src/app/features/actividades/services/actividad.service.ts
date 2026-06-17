import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ActividadService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/actividad';

    createActividad(actividad: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, actividad);
    }

    getActividadUsuario(idUsuario: number): Observable<any> {
        return this.http.get<any[]>(this.apiUrl + '/usuario/' + idUsuario);
    }
}
