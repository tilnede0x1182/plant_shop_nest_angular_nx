import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Utilisateur } from '../../../services/api.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-user-profile-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.css'],
})
export class UserProfileEditComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  protected user: Utilisateur = { id: 0, email: '', name: '', admin: false };
  protected password = '';

  ngOnInit() {
    const current = this.auth.getUser();
    if (!current) return;

    this.api.unUtilisateur(current.id).subscribe((data) => (this.user = data));
  }

  enregistrer() {
    const payload: Partial<Utilisateur & { password?: string }> = {
      name: this.user.name,
      email: this.user.email,
      ...(this.password ? { password: this.password } : {}),
    };

    this.api.majUtilisateur(this.user.id, payload).subscribe(() => {
      this.router.navigate(['/profile']);
    });
  }
}
