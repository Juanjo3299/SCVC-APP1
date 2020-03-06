import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Usuario} from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _usuario: Usuario;
  private _token: string;
  private urlEndpoint ='http://localhost:8080/oauth/token';
  private credenciales:string = btoa('angularapp'+':' +'12345');
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic '+this.credenciales});
  constructor(private http: HttpClient) { }

  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  login(usuario: Usuario):Observable<any>{
    // const httpHeaders: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
    //   Authorization: 'Basic'+this.credenciales});
    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username', usuario.username);
    params.set('password', usuario.contrasena);
    console.log(params.toString());
    return this.http.post<any>(this.urlEndpoint, params.toString(),{headers: this.httpHeaders});
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this._token);
    return payload != null && payload.user_name && payload.user_name.length > 0;

  }
}
