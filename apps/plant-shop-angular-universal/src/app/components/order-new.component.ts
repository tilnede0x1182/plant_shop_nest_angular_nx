// # Importations
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

// # Nouvelle commande
@Component({
  standalone: true,
  selector: 'app-order-new',
  imports: [CommonModule],
  template: `
    <h2>📝 Nouvelle commande</h2>
    <form (ngSubmit)="soumettre()">
      <p>
        Exemple : valider une commande pour l’utilisateur #1 avec une plante
        fictive.
      </p>
      <button type="submit">Passer commande</button>
    </form>
    <p *ngIf="message" class="alert alert-info">{{ message }}</p>
  `,
})
export class OrderNewComponent {
  private api = inject(ApiService);
  protected message = '';

  soumettre() {
    const payload = { userId: 1, items: [{ plantId: 1, quantity: 1 }] };
    this.api.creerCommande(payload).subscribe({
      next: (res) => (this.message = `Commande #${res.id} créée ✅`),
      error: () => (this.message = 'Erreur lors de la commande ❌'),
    });
  }
}
