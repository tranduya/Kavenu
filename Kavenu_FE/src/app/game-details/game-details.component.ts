import { Component } from '@angular/core';
import { Game } from '../interface/game';
import { GameService } from '../service/game.service';
import { GameRents } from '../interface/game-rents';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent {
  games: Game[] = [];
  gamesRents: GameRents[] = [];
  game: Game | undefined;
  rents: GameRents | undefined;

  constructor(private gameService: GameService){}

  ngOnInit(): void {
    this.onGetGames();  
  }

  onGetGames(): void {
    this.gameService.getGames().subscribe(data => {
      this.games = data;
      this.game = data[1];
      this.onGetGameRents();
    })
  }
  
  onGetGameRents(): void {
    this.gameService.getGamesRents().subscribe(data => {
      this.gamesRents = data;
      this.rents = this.gamesRents[this.game?.pujcovne_id! - 1];
    })
  }
}
