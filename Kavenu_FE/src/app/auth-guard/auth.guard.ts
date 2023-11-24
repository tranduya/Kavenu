import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {//TODO nahradit deprecated reseni
  constructor(private router: Router,
    private storageService: StorageService) {}

  canActivate(): boolean {
    // Check if the user is logged in (you can implement your own login check logic here)
    const isLoggedIn = this.storageService.isLoggedIn();

    if (!isLoggedIn) {
      // If the user is not logged in, redirect to the homepage or any other route
      this.router.navigate(['Prihlasit']);
      return false;
    }

    // If the user is logged in, allow access to the route
    return true;
  }

}
