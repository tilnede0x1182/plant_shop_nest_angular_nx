import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

/**
 * Composant création plante (admin) : formulaire de création nouvelle plante
 */
@Component({
  selector: 'app-plant-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plant-new.component.html',
  styleUrls: ['./plant-new.component.css'],
})
export class PlantNewComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  model = { name: '', price: 0, stock: 0, description: '' };
  messageErreur: string | null = null;

  /**
   * Soumission du formulaire de création.
   * @param event Événement de soumission du formulaire
   */
  onSubmit(event: Event) {
    event.preventDefault();
    this.messageErreur = null;
    this.api.creerPlanteAdmin(this.model).subscribe({
      next: () => {
        this.router.navigate(['/plants']);
      },
      error: (err: any) => {
        this.messageErreur =
          err?.error?.message || 'Erreur inattendue lors de la création';
      },
    });
  }
}
