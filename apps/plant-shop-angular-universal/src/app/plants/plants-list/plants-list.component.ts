// # Importations
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Plante } from '../../services/api.service';
import { AuthService } from '../../auth/auth.service';

/**
 * Met à jour le panier dans localStorage et émet un event global
 * @plante plante à ajouter
 */
function ajouterAuPanierLocal(plante: Plante): void {
  const contenu = JSON.parse(localStorage.getItem('cart') || '{}');
  contenu[plante.id] ??= { ...plante, quantity: 0 };
  if (contenu[plante.id].quantity < plante.stock) contenu[plante.id].quantity++;
  localStorage.setItem('cart', JSON.stringify(contenu));
  window.dispatchEvent(new Event('cart-updated'));
}

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
    ajouterAuPanierLocal(plante);
  }

  get estAdmin(): boolean {
    const isAdminRes = this.auth.isAdmin();
    console.log('[estAdmin] : ' + isAdminRes);
    return isAdminRes;
  }
}
