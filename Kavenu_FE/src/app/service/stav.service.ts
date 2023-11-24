import { Injectable } from '@angular/core';
import { Stav } from '../interface/stav';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StavService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) { }

  getStavy(): Observable<Stav[]> {
    return this.http.get<Stav[]>(`${this.apiUrl}/states/`);
  }
}
