import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/auth';

    register(nombre: string, correo: string, password: string, id_rol: number): Observable<any> {
        return this.http.post<any>(`${ this.apiUrl }/register`, { nombre, correo, password, id_rol });
    }

    login(email: string, password: string): Observable<{ accessToken: string }> {
        return this.http.post<{ accessToken: string }>(`${ this.apiUrl }/login`, { email, password }).pipe(
            tap(response => {
                localStorage.setItem('accessToken', response.accessToken);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
    }
}
