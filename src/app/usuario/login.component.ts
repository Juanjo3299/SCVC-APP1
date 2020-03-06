import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  titulo: string = 'Inicio de Sesión';

  constructor() { }

  ngOnInit(): void {
  }

}
