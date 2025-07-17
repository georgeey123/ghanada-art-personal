import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../firestore';
import { Content } from '../../../shared/models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-content',
  imports: [FormsModule, CommonModule],
  templateUrl: './about-content.html',
  styleUrl: './about-content.css',
  standalone: true, // Assuming standalone components
})
export class AboutContentComponent implements OnInit {

  contentItem: Content | undefined;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.firestoreService.getDocument<Content>('content', 'about').subscribe(content => {
      this.contentItem = content;
    });
  }

  async saveContent() {
    if (this.contentItem) {
      try {
        await this.firestoreService.updateDocument('content', 'about', this.contentItem);
        console.log('About content saved successfully!');
      } catch (error) {
        console.error('Error saving about content:', error);
      }
    } else {
      console.error('No content data to save.');
    }
  }
}
