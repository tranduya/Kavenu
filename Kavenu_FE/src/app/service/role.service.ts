import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/environments/environment.prod';
import { Role } from '../interface/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }
}
