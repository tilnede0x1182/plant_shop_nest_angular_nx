// # Importations
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService, Plante } from '../services/api.service';

// # Détail d'une plante
@Component({
  standalone: true,
  selector: 'app-plant-detail',
  imports: [CommonModule, RouterModule],
  template: `
    <a routerLink="/">← Retour</a>
    <div *ngIf="plante">
      <h2>{{ plante.name }}</h2>
      <p><strong>Prix :</strong> {{ plante.price }} €</p>
      <p><strong>Stock :</strong> {{ plante.stock }}</p>
      <p *ngIf="plante.description">
        <em>{{ plante.description }}</em>
      </p>
    </div>
  `,
})
export class PlantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  protected plante: Plante | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.unePlante(id).subscribe((donnees) => (this.plante = donnees));
  }
}
