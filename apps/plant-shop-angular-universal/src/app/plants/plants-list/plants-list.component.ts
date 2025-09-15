import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Plante } from '../../services/api.service';

@Component({
  selector: 'app-plants-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plants-list.component.html',
  styleUrls: ['./plants-list.component.css'],
})
export class PlantsListComponent implements OnInit {
  private api = inject(ApiService);
  protected plantes: Plante[] = [];

  ngOnInit() {
    this.api.listerPlantes().subscribe((donnees) => (this.plantes = donnees));
  }
}
