// # Importations
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// # Composant racine (shell)
@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
