import { Component, OnInit } from '@angular/core';
import { Gallery } from '../../../shared/models';
import { FirestoreService } from '../../../firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor and *ngIf
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-gallery-list',
  standalone: true, // Add standalone if not already there
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule
  templateUrl: './gallery-list.html',
  styleUrl: './gallery-list.component.css',
})
export class GalleryListComponent implements OnInit {
  galleries: Gallery[] = [];
  newGalleryName: string = '';
  editingGallery: Gallery | null = null;
  showGalleryForm: boolean = false;

  constructor(private firestoreService: FirestoreService, private router: Router) { }

  ngOnInit(): void {
    this.firestoreService.getCollection<Gallery>('galleries', [], 'order').subscribe(galleries => {
      this.galleries = galleries;
    });
  }

  addGallery(): void {
    this.editingGallery = null;
    this.newGalleryName = '';
    this.showGalleryForm = true;
  }

  editGallery(gallery: Gallery): void {
    this.editingGallery = gallery;
    this.newGalleryName = gallery.name;
    this.showGalleryForm = true;
  }

  async deleteGallery(galleryId: string | undefined): Promise<void> {
    if (!galleryId) {
      console.error('Gallery ID is missing for deletion.');
 return;
    }
    if (confirm('Are you sure you want to delete this gallery?')) {
      try {
 await this.firestoreService.deleteDocument('galleries', galleryId);
        console.log('Gallery deleted successfully');
      } catch (error) {
        console.error('Error deleting gallery:', error);
      }
    }
  }

  async saveGallery(): Promise<void> {
    if (!this.newGalleryName) {
      alert('Gallery name cannot be empty.');
      return;
    }

    try {
      if (this.editingGallery) {
        // Editing existing gallery
        const updatedGallery: Gallery = { ...this.editingGallery, name: this.newGalleryName };
        await this.firestoreService.updateDocument('galleries', updatedGallery.id!, updatedGallery);
        console.log('Gallery updated successfully');
      } else {
        // Adding new gallery
        const newGallery: Omit<Gallery, 'id'> = {
          name: this.newGalleryName,
          order: this.galleries.length // Simple default order
        };
        await this.firestoreService.addDocument('galleries', newGallery);
        console.log('Gallery added successfully');
      }
      this.cancelEdit(); // Reset form state
    } catch (error) {
      console.error('Error saving gallery:', error);
    }
  }

  cancelEdit(): void {
    this.showGalleryForm = false;
    this.newGalleryName = '';
    this.editingGallery = null;
  }

  viewGallery(gallery: Gallery): void {
    this.router.navigate(['admin', 'galleries', gallery.id]);
  }

}
