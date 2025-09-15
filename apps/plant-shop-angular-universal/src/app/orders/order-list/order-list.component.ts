// # Importations
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

// # Composant OrderList (admin)
@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  private api = inject(ApiService);
  protected orders: any[] = [];

  ngOnInit() {
    // ⚠️ Pour l’instant ApiService n’a pas encore de méthode listOrders()
    // à ajouter plus tard dans api.service.ts
    this.api.listerCommandes().subscribe((donnees) => (this.orders = donnees));
  }
}
