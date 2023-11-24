import { Component } from '@angular/core';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { User } from '../interface/user';
import { showNotification } from '../lib/notification';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent extends EditUserComponent {
  override isAuthorizated = false;

  override ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.onGetRolesParam(this.user?.osoba_id!);
    this.hasAccess();
  }

  override onUpdateUser(user: User, id: number): void {
    this.userService.updateUser(user, id).subscribe({
      next: () => {
        showNotification("Změny byly úspěšně uloženy.", 'success', this.notificationService);
      },
      error: err => {
      }
    })
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
