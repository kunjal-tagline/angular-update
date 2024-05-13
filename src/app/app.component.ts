import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GanttComponent } from './gantt/gantt.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GanttComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'control-flows-ng17';
  isApple: boolean = true;
  fruits: Array<string> = [
    'Apple',
    'Orange',
    'Pineapple',
    'Banana',
    'Strawberry',
  ];
  fruit: string = 'Apple';
  toggleFruit() {
    this.isApple = !this.isApple;
  }
}
