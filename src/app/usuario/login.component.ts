import { Component, OnInit } from '@angular/core';
import {Usuario} from './usuario';
import Swal from 'sweetalert2';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  usuario: Usuario;
  titulo: string = 'Inicio de Sesión';

  constructor(private authService: AuthService, private router: Router,private spinner: NgxSpinnerService) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      Swal.fire('Login', `Hola ${this.authService.usuario.username} ya estás autenticado!`, 'info');
      this.router.navigate(['/alimentos']);
    }
  }

  login(): void{
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      console.log(this.usuario);
      if(this.usuario.username == null || this.usuario.contrasena==null){
        Swal.fire('Error','Nombre de usuario o contraseña vacías.','error');
        this.spinner.hide();
        return;
      }
      this.authService.login(this.usuario).subscribe(response =>{
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        let usuario = this.authService.usuario;
        console.log(response.access_token.split(".")[1]);
        this.router.navigate(['/alimentos']);
        Swal.fire('Login',`Hola ${usuario.username}, has iniciado sesión con éxito!`,'success');
      }, err => {
          if (err.status == 400) {
            Swal.fire('Error Login', 'Usuario o clave incorrectas!', 'error');
          }
        }
      );
      this.spinner.hide();
    }, 2000);

  }

}
