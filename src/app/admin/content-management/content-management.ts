import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './content-management.html',
  styleUrl: './content-management.css'
})
export class ContentManagement {

}
