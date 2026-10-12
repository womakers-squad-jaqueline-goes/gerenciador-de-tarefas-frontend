import { Routes } from '@angular/router';
import { ListaTarefas } from './components/lista-tarefas/lista-tarefas';

export const routes: Routes = [
  {
    path: 'tarefas',
    component: ListaTarefas,
  },
];