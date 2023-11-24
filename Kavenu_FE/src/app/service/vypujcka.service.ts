import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'src/environments/environment';
import { Vypujcka, VypujckaBasicInfo } from '../interface/vypujcka';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VypujckaService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserVypujcky(id: number): Observable<Vypujcka[]> {
    return this.http.get<Vypujcka[]>(`${this.apiUrl}/borrows/${id}`);
  }

  getVypujckyBasicInfo(): Observable<VypujckaBasicInfo[]> {
    return this.http.get<VypujckaBasicInfo[]>(`${this.apiUrl}/borrowsBasicInfo`);
  }

  getVypujcky(): Observable<Vypujcka[]> {
    return this.http.get<Vypujcka[]>(`${this.apiUrl}/allBorrows`);
  }

  createVypujcka(vypujcka: Vypujcka): Observable<Vypujcka> {
    return this.http.post<Vypujcka>(`${this.apiUrl}/borrows/`, vypujcka);
  }

  updateVypujcka(vypujcka: Vypujcka, vypujcka_id: number): Observable<Vypujcka> {
    return this.http.put<Vypujcka>(`${this.apiUrl}/borrows/${vypujcka_id}`, vypujcka);
  }
}
