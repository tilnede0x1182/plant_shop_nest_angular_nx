// # Importations
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

// # Composant Register
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  message = '';

  onSubmit() {
    this.auth.register(this.email, this.password, this.name).subscribe({
      next: () => {
        this.message = 'Compte créé ✅';
        this.router.navigate(['/login']);
      },
      error: () => (this.message = '❌ Erreur lors de la création du compte'),
    });
  }
}
