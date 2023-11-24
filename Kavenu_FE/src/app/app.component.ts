import { Component } from '@angular/core';
import { SidebarItem } from './interface/sidebar';
import { DrawerSelectEvent } from '@progress/kendo-angular-layout';
import { Router } from '@angular/router';
import { StorageService } from './service/storage.service';
import { AuthService } from './service/auth.service';
import { NotificationService } from '@progress/kendo-angular-notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Rezervační systém Kavenu';
  username?: string;

  // Sidebar
  public sidebarExpanded = window.innerWidth > 1024 ? true : false
  public sidebarAutoCollapse = window.innerWidth > 1024 ? false : true
  public sidebarItems: SidebarItem[] = []
  isLoggedIn: boolean = false;
  loginWindowOpened: boolean = false;

  constructor(
    protected storageService: StorageService,
    private authService: AuthService,
    protected notificationService: NotificationService,
    protected router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    const user = this.storageService.getUser();
    this.username = user.prezdivka;
    this.sidebarItems.push({ text: 'Rezervace her', path: 'rezervace', selected: false });
    if (this.isLoggedIn) {
      this.sidebarItems.push(
        { text: 'Přehled vypůjček', path: 'vypujcky', selected: false },
      );

      if (user.role_id <= 2) {
        this.sidebarItems.push({ text: 'Přehled požadavků', path: 'prehled_pozadavku', selected: false });
      }

      if (user.role_id == 1) {
        this.sidebarItems.push({ text: 'Správa uživatelů', path: 'sprava_uzivatelu', selected: false });
      }

      this.sidebarItems.push(
        { separator: true },
        { text: 'Správa profilu', path: 'sprava_profilu', selected: false }
      );
    }
  }

  onSidebarSelect(ev: DrawerSelectEvent): void {
    this.sidebarItems = this.sidebarItems.map(item => {
      if (item.path === ev.item.path) {
        return { ...item, selected: true }
      } else {
        return { ...item, selected: false }
      }
    })
    if (ev.item.path) {
      this.router.navigate([ev.item.path])
    }
    ev.preventDefault()
  }

  /***********Login *************/
  logout(): void {
    this.storageService.clean()
    this.router.navigateByUrl('/rezervace').then(function () {
      window.location.reload();
    });
}

/***********Login Buttons *************/
handleClickLogIn(){
  this.loginWindowOpened = true;
}

handleClickLogout(){
  this.logout();
}

closeRegistrationWindow(): void {
  this.loginWindowOpened = false;
}
}
