import { Component } from '@angular/core';
import { VypujckyComponent } from '../vypujcky/vypujcky.component';
import { User } from '../interface/user';

@Component({
  selector: 'app-pozadavky',
  templateUrl: './pozadavky.component.html',
  styleUrls: ['./pozadavky.component.css']
})
export class PozadavkyComponent extends VypujckyComponent {
  users: User[] = [];
  override editable: boolean = false;
  activeUser: User | undefined;


  override onGetStav(): void {
    this.stavService.getStavy().subscribe(data => {
      this.stavy = data;
      this.onGetUsers();
      this.hasAccess();
    });
  }

  override onGetVypujcky(): void {
    this.vypujckaService.getVypujcky().subscribe(data => {
      this.vypujcky = data;
      this.fillTable();
      this.activeUser = this.storageService.getUser();
    });
  }

  onGetUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.onGetVypujcky();
    })
  }

  override fillTable(): void {
    for (let i = 0; i < this.vypujcky.length; i++) {
      this.vypujcky[i].nazevPolozky = this.games.find(game => game.polozka_id === this.vypujcky[i].polozka_id)?.titul_polozky!;
      this.vypujcky[i].stav = this.stavy[this.vypujcky[i].stav_id - 1].nazev_stavu;
      this.vypujcky[i].datZapujceni = this.formatDate(this.vypujcky[i].dat_zapujceni, 'cs');
      this.vypujcky[i].datNavraceni = this.formatDate(this.vypujcky[i].dat_navraceni, 'cs');
      this.vypujcky[i].osoba = this.findOsobaById(this.vypujcky[i].objednava_osoba_id);
      this.vypujcky[i].resitel = this.findOsobaById(this.vypujcky[i].resi_osoba_id);
      this.vypujcky[i].datZapujceniJS = new Date(this.formatDate(this.vypujcky[i].dat_zapujceni, 'js'));
      this.vypujcky[i].datNavraceniJS = new Date(this.formatDate(this.vypujcky[i].dat_navraceni, 'js'));

      if (this.vypujcky[i].dat_vraceno != null) {
        this.vypujcky[i].datVraceno = this.formatDate(this.vypujcky[i].dat_vraceno!, 'cs');
      }
    }
  }

  private findOsobaById(osoba_id: number): string {
    let osobaName: string = '';

    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].osoba_id === osoba_id) {
        osobaName += this.users[i].jmeno + ' ';
        osobaName += this.users[i].prijmeni;
      }
    }

    return osobaName;
  }

  /************* Buttons *************/
  handleClickChangeState(dataItem: any, state: number): void {
    const arrIndex = this.vypujcky.indexOf(dataItem);
    this.vypujcky[arrIndex].stav_id = state;
    this.vypujcky[arrIndex].stav = this.stavy[state - 1].nazev_stavu;

    if (state == 2) {
      this.vypujcky[arrIndex].resi_osoba_id = this.activeUser?.osoba_id!;
      this.vypujcky[arrIndex].resitel = this.activeUser?.jmeno + " " + this.activeUser?.prijmeni;
    }
    this.updateVypujcka(arrIndex);
  }

  /*Authorization*/
  override hasAccess() {
    let user = this.storageService.getUser();
    if (user.role_id <= 2) {
      this.isAuthorizated = true;
    } else {
      this.isAuthorizated = false;
    }
  }
}