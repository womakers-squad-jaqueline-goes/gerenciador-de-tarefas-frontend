export enum StatusTarefa {
  Pendente = 'Pendente',
  Concluida = 'Concluida'
}

export interface TarefaModel {
  id?: string;
  titulo: string;
  descricao: string;
  dataDeVencimento: string;
  status: StatusTarefa;
}