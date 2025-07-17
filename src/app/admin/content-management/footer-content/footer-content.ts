import { Component, OnInit } from '@angular/core';
import { Content } from '../../../shared/models';
import { FirestoreService } from '../../../firestore';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule if needed (assuming you might use *ngIf or *ngFor)
import { Observable } from 'rxjs';

@Component({
  selector: 'app-footer-content',
  standalone: true,
  imports: [FormsModule, CommonModule], // Add FormsModule and CommonModule
  templateUrl: './footer-content.html',
  styleUrl: './footer-content.css',
})
export class FooterContentComponent implements OnInit {
  contentItem: Content | undefined;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    (this.firestoreService.getDocument('content', 'footer') as Observable<Content | undefined>).subscribe({
      next: (content: Content | undefined) => {
        this.contentItem = content;
        // Assuming you have isLoadingFooter and errorFooter properties, as seen in public-layout.ts
        // this.isLoadingFooter = false;
      },
      error: (err: any) => {
        console.error('Error fetching footer content:', err);
        // Assuming you have isLoadingFooter and errorFooter properties
        // this.errorFooter = err;
        // this.isLoadingFooter = false;
      },
    });
  }
  async saveContent() {
    if (this.contentItem) {
      try {
        await this.firestoreService.updateDocument('content', 'footer', this.contentItem);
        console.log('Footer content updated successfully!');
      } catch (error) {
        console.error('Error updating footer content:', error);
      }
    }
  }
}
