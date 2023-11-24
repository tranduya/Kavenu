import { Component } from '@angular/core';
import { NewUserComponent } from '../new-user/new-user.component';
import { User } from '../interface/user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent extends NewUserComponent{
  user: User | undefined;
  

  override ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id != null) {
        this.onGetRolesParam(parseInt(id));
      }
    })
    this.hasAccess();
  }
  
  onGetUser(id: number) {
    this.userService.getUser(id).subscribe(data => {
      this.user = data[0];
      this.fillDataContainers();
    });
  }

  onUpdateUser(user: User, id: number): void {
    this.userService.updateUser(user, id).subscribe({
      next: () => {
        this.router.navigate([`/sprava_uzivatelu`]);
      },
      error: err => {
      }
    })
  }
  
  onGetRolesParam(id: number): void {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
      this.onGetUser(id);
    });
  }

  defaultRole: string = '';
  
  private fillDataContainers() {
    this.form.nickname = this.user?.prezdivka!
    this.form.name = this.user?.jmeno!
    this.form.surname = this.user?.prijmeni
    this.form.pwd = this.user?.heslo
    this.form.confirmPwd = this.user?.heslo
    this.form.email = this.user?.email
    this.form.telephone = this.user?.telefon
    this.form.selectedRole = this.user?.role_id!;
  }

  /************* Buttons *************/
  override handleClickSaveUser() {
    if (!this.checkForCompleteness()) {
      return;
    }
    
    let user = {
      osoba_id: this.user?.osoba_id!,
      jmeno: this.form.name,
      prijmeni: this.form.surname,
      prezdivka: this.form.nickname,
      heslo: this.form.pwd,
      email: this.form.email,
      telefon: this.form.telephone,
      role_id: this.form.selectedRole
    }

    this.onUpdateUser(user, user.osoba_id);
  }

  handleClickRefreshPage() {
    window.location.reload()
  }
}
