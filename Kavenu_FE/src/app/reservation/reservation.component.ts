import { Component } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { GameService } from '../service/game.service';
import { Game } from '../interface/game';
import { GameRents } from '../interface/game-rents';
import { AdaptiveMode } from '@progress/kendo-angular-dateinputs';
import { showNotification } from '../lib/notification';
import { NotificationService } from '@progress/kendo-angular-notification'
import { CategoryService } from '../service/category.service';
import { Category } from '../interface/category';
import { StorageService } from '../service/storage.service';
import { Vypujcka, VypujckaBasicInfo } from '../interface/vypujcka';
import { VypujckaService } from '../service/vypujcka.service';
import { Router } from '@angular/router';
import { event } from 'jquery';
import { DateRange } from '../interface/date-range';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  currentStep: number = 0;
  showButtonPrevious = false;
  showButtonNext = true;
  showButtonComplete = false;
  gridData: GridDataResult = { data: [], total: 0 }
  games: Game[] = [];
  gameRents: GameRents[] = [];
  selectedGames: Game[] = [];
  filtredGames: Game[] = [];
  vypujckyBasicInfo: VypujckaBasicInfo[] = [];
  rentDays: number | undefined;
  today = new Date();
  isReservationCompleted: boolean = false;


  steps = [
    { label: 'Parametry', isValid: true },
    { label: 'Výběr her', isValid: true },
    { label: 'Shrnutí', isValid: true }
  ]

  adaptiveMode: AdaptiveMode = "auto";

  constructor(private gameService: GameService, private notificationService: NotificationService,
    private categoryService: CategoryService, private storageService: StorageService,
    private vypujckaService: VypujckaService, private router: Router) { }

  ngOnInit(): void {
    this.onGetGames();
  }

  onGetGames(): void {
    this.gameService.getGames().subscribe(data => {
      this.games = data;
      this.filtredGames = data;
      this.onGetVypujckyBasicInfo();
      // this.onGetCategories();
    })
  }

  onGetGameRents(): void {
    this.gameService.getGamesRents().subscribe(data => {
      this.gameRents = data;
      this.assignRents();
    })
  }

  onGetVypujckyBasicInfo(): void {
    this.vypujckaService.getVypujckyBasicInfo().subscribe(data => {
      this.vypujckyBasicInfo = data;
    });
  }

  // onGetCategories(): void {
  //   this.categoryService.getCategories().subscribe(data => {
  //     this.categories = data;

  //     for (let i = 0; i < this.categories.length; i++) {
  //       this.categoriesName.push(this.categories[i].popis_kategorie);
  //     }
  //     this.sortAlphabetically(this.categoriesName);
  //   })
  // }

  onCreateVypujcka(vypujcka: Vypujcka): void {
    this.vypujckaService.createVypujcka(vypujcka).subscribe({
      next: () => {
        this.isReservationCompleted = true;
      },
      error: err => {
        showNotification("Požadavek se nepodařil odeslat.", 'error', this.notificationService);
      }
    })
  }

  assignRents(): void {
    for (let i = 0; i < this.games.length; i++) {
      let pujcovneId = this.games[i].pujcovne_id - 1;

      if (this.rentDays! <= 3) {
        this.games[i].pujcovne = this.gameRents[pujcovneId].pujcovne_pidi;
      } else if (this.rentDays == 4) {
        this.games[i].pujcovne = this.gameRents[pujcovneId].pujcovne_medi;
      } else if (this.rentDays! < 7) {
        this.games[i].pujcovne = this.gameRents[pujcovneId].pujcovne_maxi;
      } else if (this.rentDays! >= 7) {
        this.games[i].pujcovne = this.gameRents[pujcovneId].pujcovne_maxi;
        const weeks = Math.floor(this.rentDays! / 7);
        this.games[i].pujcovne = this.games[i].pujcovne * weeks;
      }
    }
  }

  nextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
    }

    if (this.currentStep == 1) {
      this.showButtonPrevious = true;
    }

    if (this.currentStep == 2) {
      this.showButtonNext = false;
      this.showButtonComplete = true;
    }

    this.actions()
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }

    if (this.currentStep == 1) {
      this.showButtonNext = true;
      this.showButtonComplete = false;
    }

    if (this.currentStep == 0) {
      this.showButtonPrevious = false;
    }

    this.actions();
  }

  actions(): void {
    if (this.currentStep == 1) {
      this.firstStepActions();
    }

    if (this.currentStep == 2) {
      this.secondStepActions();
    }
  }

  /* ---------------------1.krok--------------------- */
  startDateString: string | undefined;
  endDateString: string | undefined;
  startDatePrint: string | undefined;
  endDatePrint: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;

  calculateRentDays() {
    this.startDate = new Date(this.startDateString!);
    this.endDate = new Date(this.endDateString!);
    this.rentDays = this.calculateDaysDuration(this.startDate, this.endDate);
  }

  calculateDaysDuration(startDate: Date, endDate: Date): number {
    const timeDifference = endDate.getTime() - startDate.getTime();
    return timeDifference / (1000 * 3600 * 24);
  }

  private firstStepActions() {
    this.startDate = new Date(this.startDateString!);
    this.endDate = new Date(this.endDateString!);

    if (this.startDateString == undefined || this.endDateString == undefined) {
      showNotification('Musí být vyplněny všechna pole.', 'error', this.notificationService);
      this.prevStep();
      return;
    }

    if (this.startDateString == this.endDateString) {
      showNotification('Rezervace nemůže začínat a končit ve stejný den.', "error", this.notificationService);
      this.prevStep();
      return;
    }

    if (this.startDateString != undefined && this.startDateString != undefined) {
      const datesOk = this.checkDates(new Date(this.startDateString), new Date(this.endDateString));
      if (!datesOk) {
        this.prevStep();
        return;
      }
      this.calculateRentDays();
      this.onGetGameRents();

      this.startDatePrint = this.formatDate(this.startDateString);
      this.endDatePrint = this.formatDate(this.endDateString!);

      
      this.checkReservations();
    }
  }

  private checkDates(startDate: Date, endDate: Date): boolean {
    if (endDate < startDate) {
      showNotification('Období nemůže končit v minulosti!', 'error', this.notificationService);
      return false;
    }

    return true;
  }

  /* ---------------------2.krok--------------------- */
  /* Seznam položek selectů */
  categories: Category[] = [];
  categoriesName: string[] = [];
  playersNumberList: string[] = ["1", "2", "3", "4", "5", "6", "7+"];
  ageList: string[] = ["1 - 3", "3 - 5", "4 - 6", "6 - 8", "8 - 10", "10 - 12", "12+"];
  gameDurationList: string[] = ["< 30 min", "30 - 60 min", "> 60 min"];
  loginWindowOpened: boolean = false;
  
  private formatDate(dateString: string): string {
    const parts = dateString.split('-')
    if (parts.length !== 3) {
      throw new Error('Invalid date format. Expected "yyyy-mm-dd".')
    }
    const [year, month, day] = parts
    return `${day}.${month}.${year}`
  }
  
  checkReservations(): void {
    let reservationRange: DateRange = {
      startDate: this.startDate!,
      endDate: this.endDate!
    }

    for (let i = 0; i < this.games.length; i++) {
      this.games[i].pujcenoOd = undefined;
      this.games[i].pujcenoDo = undefined;
    }

    for (let i = 0; i < this.vypujckyBasicInfo.length; i++) {
      let foundGame = this.games.find(game => game.polozka_id === this.vypujckyBasicInfo[i].polozka_id);
      let arrIndex = this.games.indexOf(foundGame!);
      let borrowRange: DateRange = {
        startDate: new Date(this.vypujckyBasicInfo[i].dat_zapujceni),
        endDate: new Date(this.vypujckyBasicInfo[i].dat_navraceni)
      }

      if (this.areDateRangesOverlapping(reservationRange, borrowRange)) {
        this.games[arrIndex].pujcenoOd = this.formatDate(this.vypujckyBasicInfo[i].dat_zapujceni);
        this.games[arrIndex].pujcenoDo = this.formatDate(this.vypujckyBasicInfo[i].dat_navraceni);
      }
    }
  }

  private areDateRangesOverlapping(range1: DateRange, range2: DateRange): boolean {
    return (
      range1.startDate < range2.endDate &&
      range1.endDate >= range2.startDate
    );
}

  isSelected(dataItem: Game): boolean {
    return this.selectedGames.includes(dataItem);
  }

  filterGames($event: any, filterType: string) {
    // this.filterByPlayersNumber($event);
    // this.filterByDuration($event);
  }

  filterByAge($event: any): void {
    console.log($event);
  }

  filterByPlayersNumber($event: string): void {
    if ($event == undefined) {
      this.filtredGames = this.games;
      // console.log(this.filtredGames.length)
      return;
    }
    let newFiltredGames = [];

    for (let i = 0; i < this.filtredGames.length; i++) {
      if (isPlayersMatch($event, this.filtredGames[i].pocet_hracu)) {
        newFiltredGames.push(this.filtredGames[i]);
      }
    }

    this.filtredGames = newFiltredGames;

    // if ($event == '7+') {
    //   for (let i = 0; i < this.filtredGames.length; i++) {
    //     if ((parseInt(this.filtredGames[i].vek_hracu, 10) >= 7)) {
    //       newFiltredGames.push(this.filtredGames[i]);
    //     }
    //   }
    //   this.filtredGames = newFiltredGames;
    //   console.log(this.filtredGames.length)
    //   return;
    // }

    // const playersNumber: number = parseInt($event, 10);
    // for (let i = 0; i < this.filtredGames.length; i++) {
    //     if ((parseInt(this.filtredGames[i].vek_hracu, 10) == playersNumber)) {
    //       newFiltredGames.push(this.filtredGames[i]);
    //     }
    // }
    // this.filtredGames = newFiltredGames;
    console.log(this.filtredGames)
  }

  filterByDuration($event: any): void {
    let newFiltredGames = [];
    for (let i = 0; i < this.filtredGames.length; i++) {
      if (isDurationMatch(this.filtredGames[i].delka_hry, $event)) {
        newFiltredGames.push(this.filtredGames[i]);
      }
    }
    this.filtredGames = newFiltredGames;
    console.log(this.filterGames)
  }

  private isWithinRange(range: string, number: number): boolean {
    const [lowest, highest] = range.split('-').map(Number);
    return number >= lowest && number <= highest;
  }

  /************* Buttons *************/
  handleClickAddToCart(dataItem: Game): void {
    this.selectedGames.push(dataItem);
  }

  handleClickRemoveFromCart(dataItem: Game): void {
    this.selectedGames.splice(this.selectedGames.indexOf(dataItem), 1);
  }

  closeRegistrationWindow(): void {
    this.loginWindowOpened = false;
  }

  /* ---------------------3.krok--------------------- */
  cenaTotal: number = 0;
  zalohaTotal: number = 0;
  
  private secondStepActions() {
    if(!this.storageService.isLoggedIn()) {
      showNotification("Pro pokračování je třeba se přihlásit.",'error', this.notificationService);
      this.loginWindowOpened = true;
      this.prevStep();
      return;
    }

    if (this.selectedGames.length == 0) {
      showNotification("Přidejte si alespoň jednu hru do košíku.", 'error', this.notificationService);
      this.prevStep();
      return;
    }

    this.cenaTotal = 0;
    this.zalohaTotal = 0;

    for (let i = 0; i < this.games.length; i++){
      this.cenaTotal += this.selectedGames[i].pujcovne;
      this.zalohaTotal += this.selectedGames[i].pujcovna_zaloha;
    }
  }

  /************* Buttons *************/
  handleClickSend(): void {
    for (let i = 0; i < this.selectedGames.length; i++) {
      let vypujcka = {
        vypujcka_id: 0,
        polozka_id: this.selectedGames[i].polozka_id,
        objednava_osoba_id: this.storageService.getUser().osoba_id,
        resi_osoba_id: 0,
        stav_id: 1,
        dat_zapujceni: this.startDateString!,
        dat_navraceni: this.endDateString!,
        dat_vraceno: null,
        cena_zalohy: this.selectedGames[i].pujcovna_zaloha,
        cena_vypujcky: this.selectedGames[i].pujcovne,
        datZapujceniJS: new Date(),
        datNavraceniJS: new Date(),
      }
      this.onCreateVypujcka(vypujcka);
    }

  }
}

// Function to check if the duration matches
function isDurationMatch(gameDuration: string, selectedDuration: string): boolean {
  const gameMin = extractDurationMinutes(gameDuration);
  const range = extractDurationRange(selectedDuration);

  if (gameMin === null) {
    return false;
  }

  if (range === null) {
    return compareSingleDuration(gameMin, selectedDuration);
  }

  return compareDurationRange(gameMin, range);
}


// Extract minutes from game duration
function extractDurationMinutes(gameDuration: string): number | null {
  if (gameDuration.includes("<")) {
    return 0;
  } else if (gameDuration.includes(">")) {
    return Infinity;
  } else {
    const minutesMatch = gameDuration.match(/\d+/);
    return minutesMatch ? parseInt(minutesMatch[0], 10) : null;
  }
}

// Extract range from selected duration string
function extractDurationRange(selectedDuration: string): [number, number] | null {
  if (selectedDuration.includes("-")) {
    const [min, max] = selectedDuration.split(" - ").map(Number);
    return [min, max];
  }
  return null;
}

// Compare single duration value with game duration
function compareSingleDuration(gameMin: number | null, selectedDuration: string): boolean {
  if (gameMin === null) {
    return false;
  }

  if (selectedDuration.includes("<")) {
    return gameMin < 30;
  } else if (selectedDuration.includes(">")) {
    return gameMin > 60;
  }
  return false;
}

// Compare duration range with game duration
function compareDurationRange(gameMin: number | null, range: [number, number]): boolean {
  if (gameMin === null) {
    return false;
  }
  return gameMin >= range[0] && gameMin <= range[1];
}

// Function to check if the number of players matches
function isPlayersMatch(gamePlayers: string, selectedPlayers: string): boolean {
  if (selectedPlayers.includes("+")) {
    const minPlayers = parseInt(selectedPlayers.replace("+", ""), 10);
    const gameMin = parseInt(gamePlayers.split("-")[0], 10);
    return gameMin >= minPlayers;
  } else {
    const range = selectedPlayers.split("-").map(Number);
    const [min, max] = range;
    const gameRange = gamePlayers.split("-").map(Number);
    const [gameMin, gameMax] = gameRange;
    return gameMin >= min && gameMax <= max;
  }
}
