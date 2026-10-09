import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:5161/api/usuarios';

    cadastrar(usuario: UsuarioModel): Observable<UsuarioModel> {
        return this.http.post<UsuarioModel>(this.apiUrl, usuario);
    }

    obterPorId(id: string): Observable<UsuarioModel> {
        return this.http.get<UsuarioModel>(`${this.apiUrl}/${id}`);
    }

    
}