import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Utilisateur } from '../../services/api.service';
import { AuthService } from '../../auth/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-user-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  protected user: Utilisateur | null = null;

  ngOnInit() {
    const currentUser = this.auth.getUser();
    if (!currentUser) return;

    this.api
      .unUtilisateur(currentUser.id)
      .subscribe((data) => (this.user = data));
  }
}
