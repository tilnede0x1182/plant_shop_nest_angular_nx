// # Importations
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// # Composant PlantForm (admin)
@Component({
  selector: 'app-plant-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plant-new.component.html',
  styleUrls: ['./plant-new.component.css'],
})
export class PlantFormComponent {
  @Output() submitPlant = new EventEmitter<{
    name: string;
    price: number;
    stock: number;
    description: string;
  }>();

  model = { name: '', price: 0, stock: 0, description: '' };

  onSubmit() {
    console.log('[FORM] Bouton Créer cliqué');
    console.log('[FORM] Modèle courant =', this.model);

    this.submitPlant.emit(this.model);
    console.log('[FORM] EventEmitter déclenché avec =', this.model);

    this.model = { name: '', price: 0, stock: 0, description: '' };
    console.log('[FORM] Modèle réinitialisé');
  }
}
