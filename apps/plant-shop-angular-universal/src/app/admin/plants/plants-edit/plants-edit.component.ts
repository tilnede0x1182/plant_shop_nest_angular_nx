import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Plante } from '../../../services/api.service';

/**
 * Composant édition plante (admin) : formulaire de modification
 */
@Component({
  selector: 'app-plants-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plants-edit.component.html',
  styleUrls: ['./plants-edit.component.css'],
})
export class PlantsEditComponent implements OnInit {
  plante: Plante = { id: 0, name: '', price: 0, stock: 0, description: '' };
  erreurs: string[] = [];

  /**
   * Injection des dépendances : route, API, router.
   * @param route ActivatedRoute pour récupérer les paramètres
   * @param api ApiService pour les appels HTTP
   * @param router Router pour la navigation
   */
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  /**
   * Initialise le composant et charge les données de la plante.
   */
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.erreurs = ['ID de plante invalide.'];
      return;
    }
    this.api.unePlante(id).subscribe({
      next: (data: Plante) => (this.plante = data),
      error: () => (this.erreurs = ['Erreur de chargement de la plante.']),
    });
  }

  /**
   * Soumet le formulaire de mise à jour de la plante.
   */
  onSubmit() {
    this.api.majPlanteAdmin(this.plante.id, this.plante).subscribe({
      next: () => this.router.navigate(['/admin/plants']),
      error: (res: any) =>
        (this.erreurs = res.error?.errors || ['Erreur de mise à jour.']),
    });
  }
}
