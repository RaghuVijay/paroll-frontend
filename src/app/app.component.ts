import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidenavComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'payslips';
  isCollapsed = false;
  isLoggedIn = false;

   constructor(private authService: AuthService) {
    // Subscribe to login status changes
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  // Handle toggle event from sidenav
  onToggleCollapse(isCollapsed: any) {
    this.isCollapsed = isCollapsed;
  }
}
