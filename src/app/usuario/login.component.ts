import { Component, OnInit } from '@angular/core';
import {Usuario} from './usuario';
import Swal from 'sweetalert2';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  usuario: Usuario;
  titulo: string = 'Inicio de Sesión';

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
  }

  login(): void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.contrasena==null){
      Swal.fire('Error','Nombre de usuario o contraseña vacías.','error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response =>{
      console.log(response.access_token.split(".")[1]);
      this.router.navigate(['/alimentos']);
      Swal.fire('Login',`Hola ${response.username}, has iniciado sesión con éxito!`,'success');
    });
  }

}
