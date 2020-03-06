import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {AuthService} from '../usuario/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  mensaje(): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Cancelado',
      showConfirmButton: false,
      timer: 1000
    });
  }

}
