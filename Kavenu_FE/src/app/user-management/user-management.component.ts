import { Component } from '@angular/core';
import { User } from '../interface/user';
import { UserService } from '../service/user.service';
import { RoleService } from '../service/role.service';
import { Role } from '../interface/role';
import { showNotification } from '../lib/notification';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Router } from '@angular/router';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  users: User[] = [];
  roles: Role[] = [];
  dialogOpened = false;
  selectedUser: User | undefined;
  isAuthorizated = false;

  constructor(private userService: UserService, private roleService: RoleService,
    private notificationService: NotificationService, protected router: Router,
    private storageService: StorageService){}

  ngOnInit(){
    this.onGetUsers();
    this.hasAccess();
  }

  onGetUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.onGetRoles();
    })
  }

  onGetRoles(): void {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
      this.assignRoles();
    });
  }

  onDeleteUser(user: User): void {
    this.userService.deleteUser(user.osoba_id).subscribe({
      next: () => {
        showNotification(`Uživatel ${user.jmeno} ${user.prijmeni} byl úspěšně smazán`, 'success', this.notificationService);
        this.users = this.users.filter(u => u.osoba_id !== user.osoba_id);
      },
      error: () => {
      }
    })
  }
  
  private assignRoles(): void {
    for (let i = 0; i < this.users.length; i++) {
      this.users[i].role = this.roles[this.users[i].role_id - 1].popis_role;
    }
  }

  /************* Buttons *************/
  handleClickDeleteUser(dataItem: any): void{
    this.selectedUser = dataItem;
    this.dialogOpened = true;
  }

  handleClickEditUser(dataItem: any): void {
    const kodUzivatele = dataItem.osoba_id;
    window.location.href = `${window.location.pathname}/${kodUzivatele}`;
  }

  /* Dialog*/
  handleClickDialog(status: string): void {
    if (status == 'yes') {
      this.onDeleteUser(this.selectedUser!);
    }

    this.dialogOpened = false;
  }

  /*Authorization*/
  private hasAccess() {
    let user = this.storageService.getUser();
    if (user.role_id == 1) {
      this.isAuthorizated = true;
    } else {
      this.isAuthorizated = false;
    }
  }
}
