// # Importations
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Plante } from '../services/api.service';

// # Liste des plantes
@Component({
  standalone: true,
  selector: 'app-plants-list',
  imports: [CommonModule, RouterModule],
  template: `
    <h2>🌿 Plantes disponibles</h2>
    <ul>
      <li *ngFor="let plante of plantes">
        <a [routerLink]="['/plants', plante.id]">
          {{ plante.name }} — {{ plante.price }} € (Stock: {{ plante.stock }})
        </a>
      </li>
    </ul>
  `,
})
export class PlantsListComponent implements OnInit {
  private api = inject(ApiService);
  protected plantes: Plante[] = [];

  ngOnInit() {
    this.api.listerPlantes().subscribe((donnees) => (this.plantes = donnees));
  }
}
