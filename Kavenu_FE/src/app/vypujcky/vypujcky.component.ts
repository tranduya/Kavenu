import { Component, Inject } from '@angular/core';
import { CancelEvent, EditEvent, SaveEvent} from '@progress/kendo-angular-grid';
import { Game } from '../interface/game';
import { GameService } from '../service/game.service';
import { StavService } from '../service/stav.service';
import { VypujckaService } from '../service/vypujcka.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Vypujcka } from '../interface/vypujcka';
import { StorageService } from '../service/storage.service';
import { Stav } from '../interface/stav';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { showNotification } from '../lib/notification';
import { FormControl, FormGroup } from '@angular/forms';
import { GameRents } from '../interface/game-rents';

@Component({
  selector: 'app-vypujcky',
  templateUrl: './vypujcky.component.html',
  styleUrls: ['./vypujcky.component.css']
})
export class VypujckyComponent {
  games: Game[] = [];
  vypujcky: Vypujcka[] = [];
  stavy: Stav[] = [];
  dialogOpened = false;
  selectedVypujcka: Vypujcka | undefined;
  currentDate: string | undefined;
  editable: boolean = false;
  public formGroup?: FormGroup;
  gameRents: GameRents[] = [];
  isAuthorizated = false;
  dropdownFilterActive: boolean = false;

  constructor(protected gameService: GameService, protected storageService: StorageService, protected stavService: StavService,
    protected vypujckaService: VypujckaService, protected notificationService: NotificationService,
    protected userService: UserService, private router: Router) {
    }

  ngOnInit(): void {
    this.onGetGames();
    this.hasAccess();
  }

  onGetGames(): void {
    this.gameService.getGames().subscribe(data => {
      this.games = data;
      this.onGetGameRents();
    });
  }
  
  onGetStav(): void {
    this.stavService.getStavy().subscribe(data => {
      this.stavy = data;
      this.onGetVypujcky();
    });
  }
  
  onGetGameRents(): void {
    this.gameService.getGamesRents().subscribe(data => {
      this.gameRents = data;
      this.onGetStav();
    })
  }

  onGetVypujcky(): void {
    let userId = this.storageService.getUser().osoba_id;
    this.vypujckaService.getUserVypujcky(userId).subscribe(data => {
      this.vypujcky = data;
      this.fillTable();
      this.getCurrentDate();
    });
  }

  onUpdateVypujcka(vypujcka: Vypujcka): void {
    this.vypujckaService.updateVypujcka(vypujcka, vypujcka.vypujcka_id).subscribe({
      next: () => {
        showNotification("Požadavek byl úspěšně zpracován.", 'success', this.notificationService);
      },
      error: err => {
        this.router.navigate([`/prehled_pozadavku`]);
      }
    })
  }

  protected fillTable(): void {
    for (let i = 0; i < this.vypujcky.length; i++) {
      this.vypujcky[i].nazevPolozky = this.games.find(game => game.polozka_id === this.vypujcky[i].polozka_id)?.titul_polozky!;
      this.vypujcky[i].stav = this.stavy[this.vypujcky[i].stav_id - 1].nazev_stavu;
      this.vypujcky[i].datZapujceni = this.formatDate(this.vypujcky[i].dat_zapujceni, 'cs');
      this.vypujcky[i].datNavraceni = this.formatDate(this.vypujcky[i].dat_navraceni, 'cs');
      this.vypujcky[i].datZapujceniJS = new Date(this.formatDate(this.vypujcky[i].dat_zapujceni, 'js'));
      this.vypujcky[i].datNavraceniJS = new Date(this.formatDate(this.vypujcky[i].dat_navraceni, 'js'));
    }
  }

  protected formatDate(dateString: string, type: 'cs' | 'js'): string {
    const parts = dateString.split('-')
    if (parts.length !== 3) {
      throw new Error('Invalid date format. Expected "yyyy-mm-dd".')
    }
    const [year, month, day] = parts

    if (type == 'js') {
      return `${month}/${day}/${year}`
    } else {
      return `${day}.${month}.${year}`
    }
  }

  protected updateVypujcka(arrIndex: number): void {
    let vypujcka = {
      vypujcka_id: this.vypujcky[arrIndex].vypujcka_id,
      polozka_id: this.vypujcky[arrIndex].polozka_id,
      objednava_osoba_id: this.vypujcky[arrIndex].objednava_osoba_id,
      resi_osoba_id: this.vypujcky[arrIndex].resi_osoba_id,
      stav_id: this.vypujcky[arrIndex].stav_id,
      dat_zapujceni: this.vypujcky[arrIndex].dat_zapujceni,
      dat_navraceni: this.vypujcky[arrIndex].dat_navraceni,
      dat_vraceno: this.vypujcky[arrIndex].dat_vraceno,
      cena_zalohy: this.vypujcky[arrIndex].cena_zalohy,
      cena_vypujcky: this.vypujcky[arrIndex].cena_vypujcky,
      datZapujceniJS: new Date(),
      datNavraceniJS: new Date(),
    }

    this.onUpdateVypujcka(vypujcka);
  }

  private getCurrentDate(): void {
    const today = new Date()
    const year = today.getFullYear().toString()
    let month = (today.getMonth() + 1).toString()
    let day = today.getDate().toString()

    if (month.length === 1) {
      month = '0' + month
    }
    if (day.length === 1) {
      day = '0' + day
    }

    this.currentDate = `${year}/${month}/${day}`
  }

  /************* Buttons *************/
  handleClickStorno(vypujckaItem: any): void {
    this.selectedVypujcka = vypujckaItem;
    this.dialogOpened = true;
  }
  
  test(dataItem: any) {
  }

  /* Dialog*/
  handleClickDialog(status: string): void {
    if (status == 'yes') {
      const stornoState = 5;
      const arrIndex = this.vypujcky.indexOf(this.selectedVypujcka!);
      this.vypujcky[arrIndex].stav_id = stornoState;
      this.vypujcky[arrIndex].stav = this.stavy[stornoState - 1].nazev_stavu;
      this.updateVypujcka(arrIndex);
    }

    this.dialogOpened = false;
  }

  /*Authorization*/
  protected hasAccess() {
    let user = this.storageService.getUser();
    if (user.role_id <= 3) {
      this.isAuthorizated = true;
    } else {
      this.isAuthorizated = false;
    }
  }

  /* Edit */
  protected editHandler(args: EditEvent): void {
    if (args.dataItem.stav_id == 7) {
      this.formGroup = new FormGroup({
        'datNavraceni': new FormControl(args.dataItem.datNavraceniJS)
    });
    } else {
      this.formGroup = new FormGroup({
          'datZapujceni': new FormControl(args.dataItem.datZapujceniJS),
          'datNavraceni': new FormControl(args.dataItem.datNavraceniJS)
      });
    }

    this.editable = true;
    args.sender.editRow(args.rowIndex, this.formGroup);
  }
  
  protected cancelHandler(args: CancelEvent): void {
    this.editable = false;
    args.sender.closeRow(args.rowIndex)
  }
  
  protected saveHandler(args: SaveEvent): void {
    let selectedDate = args.formGroup.value;
    let arrIndex = this.vypujcky.indexOf (args.dataItem);

    let datZapujceni: string = selectedDate.datZapujceni.getFullYear() + 
      "-" + (selectedDate.datZapujceni.getMonth() + 1) + "-" + selectedDate.datZapujceni.getDate();
    let datNavraceni = selectedDate.datNavraceni.getFullYear() + 
    "-" + (selectedDate.datNavraceni.getMonth() + 1) + "-" + selectedDate.datNavraceni.getDate();
    
    this.vypujcky[arrIndex].dat_zapujceni = datZapujceni;
    this.vypujcky[arrIndex].dat_navraceni = datNavraceni;

    this.vypujcky[arrIndex].datZapujceni = this.formatDate(datZapujceni, 'cs');
    this.vypujcky[arrIndex].datNavraceni = this.formatDate(datNavraceni, 'cs');
    this.vypujcky[arrIndex].datZapujceniJS = new Date(this.formatDate(datZapujceni, 'js'));
    this.vypujcky[arrIndex].datNavraceniJS = new Date(this.formatDate(datNavraceni, 'js'));

    this.recalculateRent(arrIndex);

    this.updateVypujcka(arrIndex);

    this.editable = false;
    args.sender.closeRow(args.rowIndex);
  }

  private recalculateRent(arrIndex: number): void {
    let startDate = new Date(this.vypujcky[arrIndex].dat_zapujceni);
    let endDate = new Date(this.vypujcky[arrIndex].dat_navraceni);
    let rentDays = this.calculateDaysDuration(startDate, endDate);
    let pujcovneId = this.games.find(game => game.polozka_id === this.vypujcky[arrIndex].polozka_id)?.pujcovne_id;

    if (rentDays! <= 3) {
      this.vypujcky[arrIndex].cena_vypujcky = this.gameRents[pujcovneId!].pujcovne_pidi;
    } else if (rentDays == 4) {
      this.vypujcky[arrIndex].cena_vypujcky = this.gameRents[pujcovneId!].pujcovne_medi;
    } else if (rentDays! < 7) {
      this.vypujcky[arrIndex].cena_vypujcky = this.gameRents[pujcovneId!].pujcovne_maxi;
    } else if (rentDays! >= 7) {
      this.vypujcky[arrIndex].cena_vypujcky = this.gameRents[pujcovneId!].pujcovne_maxi;
      const weeks = Math.floor(rentDays! / 7);
      this.vypujcky[arrIndex].cena_vypujcky = this.vypujcky[arrIndex].cena_vypujcky * weeks;
    }
  }

  private calculateDaysDuration(startDate: Date, endDate: Date): number {
    const timeDifference = endDate.getTime() - startDate.getTime();
    return timeDifference / (1000 * 3600 * 24);
  }
}
