import {EventEmitter, Injectable} from '@angular/core';
// @ts-ignore
import {Alimento} from './alimento';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AlimentoService {

  alimentos: Alimento[];
  private urlEndPoint = 'http://localhost:8080/api/alimentos';
  notificarCambio = new EventEmitter<any>();

  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.minLength(4), Validators.required, ]),
    precio: new FormControl('', [Validators.required]),
    id: new FormControl('')
  });

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient, private  router: Router, private activatedRoute: ActivatedRoute) { }

  private isNotAutorized(e): boolean{
    if(e.status==401 || e.status==403){
      this.router.navigate(['/login']);
      return true;
    }
    return false;
  }

  getAlimentos(): Observable<Alimento []> {
    /*return of(Alimentos);*/
    return this.http.get(this.urlEndPoint).pipe(
      map(response => {
          const alimentos = response as Alimento[];
          return alimentos.map(alimento => {
            alimento.nombre = alimento.nombre.toUpperCase();
            return alimento;
          });
        }),
      catchError(e => {
        this.isNotAutorized(e);
        return throwError(e);
      })
    ); }

  getAlimento(id: number): Observable<Alimento> {
    return this.http.get<Alimento>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(this.isNotAutorized(e)){
          console.log("entreeeeeee");
          return throwError(e);
        }
        this.router.navigate(['/alimentos']);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

    update(alimento: Alimento): Observable<any> {
    return this.http.put<Alimento>(`${this.urlEndPoint}/${alimento.id}`, alimento, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(this.isNotAutorized(e)){
          return throwError(e);
        }
        console.log(e.status);
        Swal.fire('Error al actualizar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  setAlimento(alimento: Alimento) {
    if (alimento.id > 0) {
      this.form.setValue({
        id: alimento.id,
        nombre: alimento.nombre,
        precio: alimento.precio
      });
    } else {
    }
  }

  initializeFormGroup() {
    this.form.setValue({
      id: '',
      nombre: '',
      precio: ''
    });
  }

}
