import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { StorageService } from '../service/storage.service';
import { Router } from '@angular/router';
import { NotificationService } from '@progress/kendo-angular-notification';
import { showNotification } from '../lib/notification';
import { UserService } from '../service/user.service';
import { User } from '../interface/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isRegistred: boolean = true;

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router, 
    private notificationService: NotificationService, private userService: UserService) {
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  toggleForm(): void {
    this.isRegistred = !this.isRegistred;
  }

  /***********Login section*************/
  form: any = {
    nickname: null,
    name: null,
    surname: null,
    password: null,
    confirmPwd: null,
    email: null,
    telephone: null
  };

  isLoggedIn = false;

  logIn(): void {
    const { nickname, password } = this.form;

    this.authService.login(nickname, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoggedIn = true;
        
        this.router.navigateByUrl('/rezervace').then(function() {
          window.location.reload();
        });
      },
      error: err => {
        showNotification("Uživatelské jméno nebo heslo není správné.", "error", this.notificationService);
      }
    });
  }

  /***********Registration section*************/
  onCreateUser(user: User): void {
    this.userService.createUser(user).subscribe({
      next: () => {
        this.router.navigateByUrl('/rezervace').then(function() {
          window.location.reload();
        });
      },
      error: err => {
      }
    })
  }
  
  register(): void {
    if (!this.checkForCompleteness()) {
      return;
    }

    let user = {
      osoba_id: 0,
      jmeno: this.form.name,
      prijmeni: this.form.surname,
      prezdivka: this.form.nickname,
      heslo: this.form.password,
      email: this.form.email,
      telefon: this.form.telephone,
      role_id: 3
    }

    this.onCreateUser(user);
  }

  private checkForCompleteness(): boolean {
    if (Number.isNaN(this.form.telephone)) {
      showNotification("Telefonní číslo musí obsahovat pouze číslice!", 'error', this.notificationService);
      return false;
    }

    if (
      this.form.nickname == null ||
      this.form.name == null ||
      this.form.surname == null ||
      this.form.password == null ||
      this.form.confirmPwd == null ||
      this.form.email == null ||
      this.form.telephone == null
    ) {
      showNotification('Všechna pole musí být vyplněna!','error', this.notificationService);
      return false;
    }

    if (this.form.password != this.form.confirmPwd) {
      showNotification('Hesla nejsou shodná!', 'error', this.notificationService);
      return false;
    }

    return true;
  }
}
