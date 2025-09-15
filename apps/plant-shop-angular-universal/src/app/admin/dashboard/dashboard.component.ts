// # Importations
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

// # Composant Dashboard (admin)
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);

  protected totalUsers = 0;
  protected totalPlants = 0;
  protected totalOrders = 0;

  ngOnInit() {
    // ⚠️ À implémenter dans ApiService : listerUtilisateurs, listerPlantes, listerCommandes
    this.api
      .listerUtilisateurs()
      .subscribe((users) => (this.totalUsers = users.length));
    this.api
      .listerPlantes()
      .subscribe((plants) => (this.totalPlants = plants.length));
    this.api
      .listerCommandes()
      .subscribe((orders) => (this.totalOrders = orders.length));
  }
}
