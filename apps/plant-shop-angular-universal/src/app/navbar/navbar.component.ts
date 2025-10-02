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

  /**
   * Init : abonne le compteur et lit l'utilisateur depuis storage (si dispo)
   */
  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(
      (count) => (this.nombreArticles = count)
    );

    // abonnement direct à l'état utilisateur
    this.auth.user$.subscribe((u) => {
      this.userName = this.capitalizeName(String(u?.name || ''));
      this.userId = u?.id ?? null;
    });

    // garder pour hydrater si refresh navigateur
    this.hydraterUtilisateurDepuisStorage();
  }

  /**
   * Renvoie l'état d'auth tel que fourni par AuthService
   */
  get estConnecte(): boolean {
    return this.auth.isAuthenticated();
  }

  /**
   * Getteur de isAdmin
   */
  get estAdmin(): boolean {
    return this.auth.isAdmin();
  }

  /**
   * Déconnexion standard
   * - supprime token + utilisateur côté AuthService (déjà)
   * - vide l'état local immédiatement pour mise à jour UI instantanée
   */
  logout(): void {
    this.auth.logout();
    // vider l'état local pour ne plus afficher le nom après logout
    this.userName = '';
    this.userId = null;
    this.router.navigate(['/']);
  }

  /**
   * Lecture user locale (sans toucher au backend)
   * Tente 'user' puis 'currentUser' en local/sessionStorage
   */
  private hydraterUtilisateurDepuisStorage(): void {
    if (typeof window === 'undefined') return;
    // clé canonicalisée utilisée par AuthService
    const brut =
      localStorage.getItem('current_user') ||
      sessionStorage.getItem('current_user');
    if (!brut) return;
    try {
      const u = JSON.parse(brut);
      this.userName = this.capitalizeName(String(u?.name || ''));
      this.userId = typeof u?.id !== 'undefined' ? Number(u.id) : null;
    } catch {
      /* ignore parse error */
    }
  }

  /**
   * Capitalise "prenom nom" -> "Prenom Nom"
   * @name nom brut
   */
  private capitalizeName(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .map((morceau) => morceau.charAt(0).toUpperCase() + morceau.slice(1))
      .join(' ');
  }
}
