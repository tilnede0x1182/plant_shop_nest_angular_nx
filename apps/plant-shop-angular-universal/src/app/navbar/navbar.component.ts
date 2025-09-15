// # Importations
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart/cart.service';

// # Composant Navbar
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);

  nombreArticles = 0;

  constructor() {
    this.cartService.cartCount$.subscribe((count) => {
      this.nombreArticles = count;
    });
  }

  get estConnecte(): boolean {
    return this.auth.isAuthenticated();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
