// # Importations
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { ApiService } from '../../services/api.service';

// # Composant OrderNew
@Component({
  selector: 'app-order-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.css'],
})
export class OrderNewComponent {
  private cart = inject(CartService);
  private api = inject(ApiService);
  private router = inject(Router);

  protected message = '';
  protected total = 0;

  ngOnInit() {
    const items = this.cart.getAll();
    this.total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  passerCommande() {
    const items = this.cart.toOrderPayload();

    if (items.length === 0) {
      this.message = '❌ Panier vide';
      return;
    }

    this.api.creerCommande({ userId: 0, items }).subscribe({
      next: (res) => {
        this.message = `✅ Commande #${res.id} créée`;
        this.cart.clear();
        setTimeout(() => this.router.navigate(['/orders', res.id]), 1000);
      },
      error: () => (this.message = '❌ Erreur lors de la commande'),
    });
  }
}
