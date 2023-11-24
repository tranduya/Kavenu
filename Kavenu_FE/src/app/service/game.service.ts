import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../interface/game';
import { enviroment } from 'src/environments/environment.prod';
import { GameRents } from '../interface/game-rents';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) { }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/games`);
  }

  getGamesRents(): Observable<GameRents[]> {
    return this.http.get<GameRents[]>(`${this.apiUrl}/gameRents`);
  }
}
