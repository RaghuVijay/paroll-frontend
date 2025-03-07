import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated);
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Expose as observable

  constructor(private router: Router) {}

  // Simulate login
  login() {
    this.isAuthenticated = true;
    this.isLoggedInSubject.next(true); // Emit login status
    this.router.navigate(['/dashboard']); // Redirect to a protected route after login
  }

  // Simulate logout
  logout() {
    this.isAuthenticated = false;
    this.isLoggedInSubject.next(false); // Emit login status
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}