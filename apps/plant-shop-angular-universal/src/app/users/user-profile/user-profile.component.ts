// # Importations
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Utilisateur } from '../../services/api.service';
import { RouterModule } from '@angular/router';

// # Composant Profil utilisateur
@Component({
  standalone: true,
  selector: 'app-user-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  protected user: Utilisateur | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.unUtilisateur(id).subscribe((data) => (this.user = data));
  }

  modifier() {
    // TODO : naviguer vers /users/:id/edit
    alert('Redirection édition profil à implémenter');
  }
}
