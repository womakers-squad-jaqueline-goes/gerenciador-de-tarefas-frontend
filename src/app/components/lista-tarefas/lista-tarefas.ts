
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TarefaModel, StatusTarefa } from '../../models/tarefa.model';
import { TarefaService } from '../../services/tarefa.service';
import { AutenticacaoService } from '../../services/autenticacao.service';

@Component({
  selector: 'app-lista-tarefas',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './lista-tarefas.html',
  styleUrl: './lista-tarefas.css',
})
export class ListaTarefas implements OnInit {
  private readonly tarefaService = inject(TarefaService);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly router = inject(Router);

  readonly tarefas = signal<TarefaModel[]>([]);
  readonly mensagem = signal('');
  readonly tipoMensagem = signal<'sucesso' | 'erro' | ''>('');
  readonly carregando = signal(false);

  readonly tarefasPendentes = computed(() =>
    this.tarefas().filter(
      tarefa => tarefa.status === StatusTarefa.Pendente
    )
  );

  readonly tarefasConcluidas = computed(() =>
    this.tarefas().filter(
      tarefa => tarefa.status === StatusTarefa.Concluida
    )
  );

  readonly StatusTarefa = StatusTarefa;

  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    const usuarioId = this.autenticacao.usuarioAtual()?.id;

    if (!usuarioId) {
      this.tarefas.set([]);
      this.mensagem.set(
        'É necessário entrar na sua conta para visualizar as tarefas.'
      );
      this.tipoMensagem.set('erro');
      this.carregando.set(false);
      return;
    }

    this.carregando.set(true);
    this.mensagem.set('');
    this.tipoMensagem.set('');

    this.tarefaService.listar(usuarioId).subscribe({
      next: tarefas => {
        this.tarefas.set(tarefas);
        this.carregando.set(false);
      },
      error: () => {
        this.mensagem.set('Não foi possível carregar as tarefas.');
        this.tipoMensagem.set('erro');
        this.carregando.set(false);
      },
    });
  }

  editarTarefa(tarefa: TarefaModel): void {
    if (!tarefa.id) {
      this.mensagem.set('Não foi possível identificar esta tarefa.');
      this.tipoMensagem.set('erro');
      return;
    }

    this.router.navigate(['/tarefas/editar', tarefa.id]);
  }

  concluirTarefa(tarefa: TarefaModel): void {
    const usuarioId = this.autenticacao.usuarioAtual()?.id;

    if (!usuarioId) {
      this.mensagem.set('Entre na sua conta para concluir tarefas.');
      this.tipoMensagem.set('erro');
      return;
    }

    if (!tarefa.id) {
      this.mensagem.set('Não foi possível identificar esta tarefa.');
      this.tipoMensagem.set('erro');
      return;
    }

    this.tarefaService.concluir(usuarioId, tarefa.id).subscribe({
      next: () => {
        this.tarefas.update(tarefas =>
          tarefas.map(item =>
            item.id === tarefa.id
              ? { ...item, status: StatusTarefa.Concluida }
              : item
          )
        );

        this.mensagem.set('Tarefa concluída com sucesso!');
        this.tipoMensagem.set('sucesso');
      },
      error: () => {
        this.mensagem.set('Não foi possível concluir a tarefa.');
        this.tipoMensagem.set('erro');
      },
    });
  }

  excluirTarefa(tarefa: TarefaModel): void {
    const usuarioId = this.autenticacao.usuarioAtual()?.id;

    if (!usuarioId) {
      this.mensagem.set('Entre na sua conta para excluir tarefas.');
      this.tipoMensagem.set('erro');
      return;
    }

    if (!tarefa.id) {
      this.mensagem.set('Não foi possível identificar esta tarefa.');
      this.tipoMensagem.set('erro');
      return;
    }

    this.tarefaService.excluir(usuarioId, tarefa.id).subscribe({
      next: () => {
        this.tarefas.update(tarefas =>
          tarefas.filter(item => item.id !== tarefa.id)
        );

        this.mensagem.set('Tarefa excluída com sucesso!');
        this.tipoMensagem.set('sucesso');
      },
      error: () => {
        this.mensagem.set('Não foi possível excluir a tarefa.');
        this.tipoMensagem.set('erro');
      },
    });
  }
}
