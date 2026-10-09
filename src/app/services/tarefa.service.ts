import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TarefaModel } from '../models/tarefa.model';

@Injectable({
    providedIn: 'root'
})
export class TarefaService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:5161/api/usuarios';

    listar(usuarioId: string): Observable<TarefaModel[]> {
        return this.http.get<TarefaModel[]>(
            `${this.apiUrl}/${usuarioId}/tarefas`
        );
    }

    obterPorId(usuarioId: string, id: string): Observable<TarefaModel> {
        return this.http.get<TarefaModel>(
            `${this.apiUrl}/${usuarioId}/tarefas/${id}`
        );
    }

    criar(usuarioId: string, tarefa: TarefaModel): Observable<TarefaModel> {
        return this.http.post<TarefaModel>(
            `${this.apiUrl}/${usuarioId}/tarefas`,
            tarefa
        );
    }

    atualizar(
        usuarioId: string,
        id: string,
        tarefa: TarefaModel
    ): Observable<TarefaModel> {
        return this.http.put<TarefaModel>(
            `${this.apiUrl}/${usuarioId}/tarefas/${id}`,
            tarefa
        );
    }

    concluir(usuarioId: string, id: string): Observable<void> {
        return this.http.patch<void>(
            `${this.apiUrl}/${usuarioId}/tarefas/${id}`,
            {}
        );
    }

    excluir(usuarioId: string, id: string): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${usuarioId}/tarefas/${id}`
        );
    }
}