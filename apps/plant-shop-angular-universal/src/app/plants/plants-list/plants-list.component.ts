// # Importations
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Plante } from '../../services/api.service';
import { AuthService } from '../../auth/auth.service';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-plants-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plants-list.component.html',
  styleUrls: ['./plants-list.component.css'],
})
export class PlantsListComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private cartService = inject(CartService);
  protected plantes: Plante[] = [];

  /**
   * Charge la liste des plantes (publique), filtre et trie
   */
  ngOnInit(): void {
    this.api.listerPlantes().subscribe((donnees) => {
      this.plantes = donnees
        .filter((plante) => plante.stock > 0)
        .sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  /**
   * Ajouter au panier sans dépendance externe
   * @plante élément sélectionné
   */
  addToCart(plante: Plante): void {
    this.cartService.add(plante.id, plante.name, plante.price, plante.stock);
  }

  get estAdmin(): boolean {
    const isAdminRes = this.auth.isAdmin();
    // console.log('[estAdmin] : ' + isAdminRes);
    return isAdminRes;
  }
}
