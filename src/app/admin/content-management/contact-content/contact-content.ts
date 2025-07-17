import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../firestore';
import { Content } from '../../../shared/models';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule if needed (assuming you might use *ngIf or *ngFor)


@Component({
  selector: 'app-contact-content',
  imports: [FormsModule, CommonModule], // Ensure CommonModule is also imported
  standalone: true, // Add standalone: true if not already there
  templateUrl: './contact-content.html',
  styleUrl: './contact-content.css'
})
export class ContactContentComponent implements OnInit {

  contentItem: Content | undefined;

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreService.getDocument<Content | undefined>('content', 'contact').subscribe(content => { // Cast to Content | undefined is not necessary here, the type is inferred correctly from the service
    this.contentItem = content;
      if (this.contentItem && !this.contentItem.contactInfo) {
        this.contentItem.contactInfo = {};
      }
    });
  }

  get contactInfo() {
    // Use optional chaining and nullish coalescing to provide a default empty object
    return this.contentItem?.contactInfo ?? {};
  }

  async saveContent(): Promise<void> {
    if (this.contentItem) {
      // Ensure contactInfo is present before saving if you rely on it being there
      this.contentItem.contactInfo = this.contactInfo;
      await this.firestoreService.updateDocument('content', 'contact', this.contentItem);
    }
  }

}
