import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class CadastroUsuario {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  mensagem = signal('');
  erro = signal(false);
  carregando = signal(false);

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
  });

  cadastrar() {
    if (this.form.invalid || this.carregando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.mensagem.set('');

    this.usuarioService.cadastrar(this.form.getRawValue()).subscribe({
      next: () => {
        this.erro.set(false);
        this.mensagem.set('Usuário cadastrado com sucesso!');
        this.form.reset();
        this.carregando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.erro.set(true);
        this.mensagem.set(
          e.status === 409 ? 'Já existe um usuário com esse e-mail.' :
          e.status === 400 ? 'Dados inválidos. Confira os campos.' :
          e.status === 0   ? 'Não foi possível conectar ao servidor.' :
          'Erro ao cadastrar usuário.'
        );
        this.carregando.set(false);
      },
    });
  }
}