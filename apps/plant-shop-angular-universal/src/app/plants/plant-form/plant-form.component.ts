// # Importations
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// # Composant PlantForm (admin)
@Component({
  selector: 'app-plant-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plant-form.component.html',
  styleUrls: ['./plant-form.component.css'],
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
    console.log('[FORM] Soumission du formulaire avec :', this.model);
    this.submitPlant.emit(this.model);
    this.model = { name: '', price: 0, stock: 0, description: '' };
    console.log('[FORM] Reset du modèle, prêt pour nouvelle saisie');
  }
}
