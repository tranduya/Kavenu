import { Component } from '@angular/core';
import { RoleService } from '../service/role.service';
import { Role } from '../interface/role';
import { UserService } from '../service/user.service';
import { User } from '../interface/user';
import { ActivatedRoute, Router } from '@angular/router';
import { showNotification } from '../lib/notification';
import { NotificationService } from '@progress/kendo-angular-notification';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {
  /* Form data containers*/
  form: any = {
    nickname: null,
    name: null,
    surname: null,
    pwd: null,
    confirmPwd: null,
    email: null,
    telephone: null,
    selectedRole: 1
  }
  isAuthorizated = false;

  protected roles: Role[] = [];

  constructor(protected roleService: RoleService, protected userService: UserService, 
    protected notificationService: NotificationService, protected router: Router,
    protected route: ActivatedRoute, protected storageService: StorageService){}

  ngOnInit(){
    this.onGetRoles();
    this.hasAccess();
  }

  onGetRoles(): void {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  onCreateUser(user: User): void {
    this.userService.createUser(user).subscribe({
      next: () => {
        this.router.navigate([`/sprava_uzivatelu`]);
      },
      error: err => {
      }
    })
  }

  protected checkForCompleteness(): boolean {
    if (Number.isNaN(this.form.telephone)) {
      showNotification("Telefonní číslo musí obsahovat pouze číslice!", 'error', this.notificationService);
      return false;
    }

    if (
      this.form.nickname == null ||
      this.form.name == null ||
      this.form.surname == null ||
      this.form.pwd == null ||
      this.form.confirmPwd == null ||
      this.form.email == null ||
      this.form.telephone == null
    ) {
      showNotification('Všechna pole musí být vyplněna!','error', this.notificationService);
      return false;
    }

    if (this.form.pwd != this.form.confirmPwd) {
      showNotification('Hesla nejsou shodná!', 'error', this.notificationService);
      return false;
    }

    return true;
  }

  /************* Buttons *************/
  handleClickSaveUser() {
    if (!this.checkForCompleteness()) {
      return;
    }
    
    let user = {
      osoba_id: 0,
      jmeno: this.form.name,
      prijmeni: this.form.surname,
      prezdivka: this.form.nickname,
      heslo: this.form.pwd,
      email: this.form.email,
      telefon: this.form.telephone,
      role_id: this.form.selectedRole
    }

    this.onCreateUser(user);
  }

  /*Authorization*/
  protected hasAccess() {
    let user = this.storageService.getUser();
    if (user.role_id == 1) {
      this.isAuthorizated = true;
    } else {
      this.isAuthorizated = false;
    }
  }
}
