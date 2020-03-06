import { Component, OnInit } from '@angular/core';
import {AlimentoService} from '../alimento.service';
import {Alimento} from '../alimento';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  alimento: Alimento = new Alimento();
  errores: string[];

  constructor( public alimentoService: AlimentoService, private  router: Router, private activatedRoute: ActivatedRoute,
               public dialogRef: MatDialogRef<FormComponent>) { }

  ngOnInit(): void {
  }


  public update(): void {
    this.alimento = this.alimentoService.form.value as Alimento;
    console.log(this.alimento);
    this.alimentoService.update(this.alimento)
      .subscribe(response => {
        this.router.navigate(['/alimentos']);
        this.onClose();
        this.alimentoService.notificarCambio.emit();
        Swal.fire('Alimento Actualizado', `Alimento ${response.alimento.nombre} actualizado con éxito!`, 'success');
      }, err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      });

  }

  onClose() {
    this.dialogRef.close();
    this.alimentoService.form.reset();
  }

  onClear() {
    this.alimentoService.form.reset();
    this.alimentoService.initializeFormGroup();
  }
}
