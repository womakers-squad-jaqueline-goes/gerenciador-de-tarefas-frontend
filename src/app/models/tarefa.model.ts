export enum StatusTarefa {
  Pendente,
  Concluida
}

export interface TarefaModel {
  id?: string;
  titulo: string;
  descricao: string;
  dataDeVencimento: string;
  status: StatusTarefa;
}