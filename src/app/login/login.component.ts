import { Usuarios } from './../models/usuarios.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../guards/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  returnUrl!: string;
  usuariosList: Usuarios[] = [];
  userInfo: Usuarios[] = [];
  hide!: boolean;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private readonly toastr: ToastrService,
    private readonly usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      senha: ['', Validators.required]
    });
    this.returnUrl = '/home';
    this.authService.logout();
    this.usuarioService.getAllUsuario()
    .subscribe((usuarios: Usuarios[]) => {
      this.usuariosList = (!!usuarios) ? usuarios : [];
  });
  }


  get f() { return this.loginForm.controls; }

 public fazerLogin(): void {
  if (this.loginForm.invalid) {
    this.toastr.warning('Favor preencher Login e Senha!', '');
    return;
 } else {
   const user = this.usuariosList.find(x => x.userName === this.f.userName.value
    && x.senha === this.f.senha.value );
   if (user) {
       console.log('Login successful');
       sessionStorage.setItem('isLoggedIn', 'true');
       sessionStorage.setItem('username', this.f.userName.value);
       sessionStorage.setItem('id', user.id!.toString());
      // sessionStorage.setItem('tipo', user.tipo);
       this.userInfo = JSON.parse(sessionStorage.getItem('userInfo')!);
       this.router.navigate([this.returnUrl]);
    } else {
      this.toastr.warning('Login ou Senha invalida!', '');
    }
  }
}

}
