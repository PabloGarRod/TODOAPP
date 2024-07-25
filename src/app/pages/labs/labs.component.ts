import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css',
})
export class LabsComponent {
  welcome = 'Bienvenido a mi primera aplicación con Angular';
  tasks = ['Instalar Angular CLI', 'Crear proyecto', 'Crear componentes'];
  name = 'Pablo';
  age = 35;
  disabled = true;
  image = 'https://www.w3schools.com/howto/img_avatar.png';
  person = {
    name: 'Pablo',
    age: 35,
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  };

  clickHandler() {
    alert('Hola');
  }

  changeHandler(event: Event) {
    console.log(event);
  }
}
