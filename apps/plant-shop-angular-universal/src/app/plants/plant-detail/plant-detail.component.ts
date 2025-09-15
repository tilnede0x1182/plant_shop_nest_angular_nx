// # Importations
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService, Plante } from '../../services/api.service';

// # Composant PlantDetail
@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plant-detail.component.html',
  styleUrls: ['./plant-detail.component.css'],
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
