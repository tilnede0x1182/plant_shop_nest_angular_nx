// # Importations
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

// # Composant UsersList (admin)
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  private api = inject(ApiService);
  protected users: any[] = [];

  ngOnInit() {
    // ⚠️ À ajouter dans ApiService: méthode listerUtilisateurs()
    this.api
      .listerUtilisateurs()
      .subscribe((donnees) => (this.users = donnees));
  }

  supprimer(id: number) {
    this.api.supprimerUtilisateur(id).subscribe(() => {
      this.users = this.users.filter((u) => u.id !== id);
    });
  }
}
