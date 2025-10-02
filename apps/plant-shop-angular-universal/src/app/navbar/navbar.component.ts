// # Importations
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart/cart.service';

/**
 * Navbar – calquée sur Next (libellés/ordre identiques)
 * Sans modifier le backend ni autres services.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);

  nombreArticles = 0;
  userName = '';
  userId: number | null = null;
  estAdmin = false;

  /**
   * Init : abonne le compteur et lit l'utilisateur depuis l'API sécurisée
   */
  ngOnInit(): void {
    // compteur panier (inchangé)
    this.cartService.cartCount$.subscribe(
      (count) => (this.nombreArticles = count)
    );

    // récupération utilisateur courant depuis le backend
    this.auth.getCurrentUser().subscribe({
      next: (u) => {
        this.userName = this.capitalizeName(String(u?.name || ''));
        this.userId = u?.id ?? null;
        this.estAdmin = u?.admin === true;
      },
      error: () => {
        this.userName = '';
        this.userId = null;
        this.estAdmin = false;
      },
    });
  }

  /**
   * Déconnexion standard
   */
  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.userName = '';
        this.userId = null;
        this.estAdmin = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.userName = '';
        this.userId = null;
        this.estAdmin = false;
        this.router.navigate(['/']);
      },
    });
  }

  /**
   * Capitalise "prenom nom" -> "Prenom Nom"
   */
  private capitalizeName(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .map((m) => m.charAt(0).toUpperCase() + m.slice(1))
      .join(' ');
  }

  get estConnecte(): boolean {
    return this.userId !== null;
  }
}
