import { Component, OnInit } from '@angular/core';
import { Content } from '../shared/models';
import { FirestoreService } from '../firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for *ngIf
  template: `
    <div *ngIf="isLoading">
      <p>Loading...</p>
    </div>
    <div *ngIf="error">
      <p>Error: {{ error.message }}</p>
    </div>
    <div *ngIf="!isLoading && !error && aboutContent">
      <p>{{ aboutContent.content }}</p>
    </div>
  `,
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {
  aboutContent: Content | undefined;
  isLoading: boolean = true;
  error: any = null;

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.error = null;
    this.firestoreService.getDocument<Content>('content', 'about').subscribe(content => {
      this.aboutContent = content;
      this.isLoading = false;
    }, error => {
      this.error = error;
      this.isLoading = false;
    });
  }
}