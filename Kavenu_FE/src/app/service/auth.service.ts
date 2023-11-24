import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { enviroment } from 'src/environments/environment'
import { User } from '../interface/user'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(prezdivka: string, heslo: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${enviroment.apiUrl}/auth/${prezdivka}/${heslo}`,
      httpOptions
    );
  }
}
