import { Component } from '@angular/core';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  faChartColumn = faChartColumn;
  
  title = 'PokeStats';

}
