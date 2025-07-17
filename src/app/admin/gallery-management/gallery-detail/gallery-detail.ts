import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../../firestore';
import { FirebaseStorage } from '../../../firebase-storage';
import { Gallery, Image } from '../../../shared/models';
import { switchMap, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { where } from '@angular/fire/firestore';

@Component({
  selector: 'app-gallery-detail',
  standalone: true, // Assuming standalone component
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery-detail.html',
  styleUrl: './gallery-detail.component.css',
})
export class GalleryDetailComponent implements OnInit, OnDestroy {
  galleryId: string | null = null;
  gallery: Gallery | undefined;
  images: Image[] = [];
  selectedFile: File | null = null;
  newImageCaption: string = '';
  editingImage: Image | null = null;
  imageSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
    private FirebaseStorage: FirebaseStorage
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('galleryId')),
      switchMap(galleryId => {
        this.galleryId = galleryId;
        if (this.galleryId) {
          // Fetch gallery details
          this.firestoreService.getDocument<Gallery>('galleries', this.galleryId).subscribe(gallery => {
            this.gallery = gallery;
          });
          // Fetch images for the gallery
          const imagesCollection = this.firestoreService.getCollection<Image>('images', [where('galleryId', '==', this.galleryId)], 'order');
          this.imageSubscription = imagesCollection.subscribe(images => {
            this.images = images;
          });
        }
        return []; // Return an empty observable or handle case where galleryId is null
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.imageSubscription?.unsubscribe();
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  async uploadImage(): Promise<void> {
    if (!this.selectedFile || !this.galleryId) {
      console.error('No file selected or gallery ID is missing.');
      return;
    }

    const filePath = `images/${this.galleryId}/${Date.now()}_${this.selectedFile.name}`;

    try {
      const downloadURL = await this.FirebaseStorage.uploadFile(filePath, this.selectedFile);
      console.log('File uploaded successfully:', downloadURL);

      const newImage: Partial<Image> = {
        galleryId: this.galleryId,
        url: downloadURL,
        caption: this.newImageCaption,
        order: this.images.length // Simple ordering based on current count
      };

      await this.firestoreService.addDocument('images', newImage);
      console.log('Image metadata saved to Firestore');

      this.selectedFile = null;
      this.newImageCaption = '';

    } catch (error) {
      console.error('Error uploading image or saving metadata:', error);
    }
  }

  editImage(image: Image): void {
    this.editingImage = { ...image }; // Create a copy to avoid modifying the original directly
  }

  async deleteImage(imageId: string | undefined, imageUrl: string | undefined): Promise<void> {
    if (!imageId || !imageUrl) {
      console.error('Image ID or URL is missing for deletion.');
      return;
    }

    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await this.FirebaseStorage.deleteFile(imageUrl);
        console.log('File deleted from Storage');

        await this.firestoreService.deleteDocument('images', imageId);
        console.log('Image metadata deleted from Firestore');
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  }

  async saveImageEdit(): Promise<void> {
    if (!this.editingImage || !this.editingImage.id) {
      console.error('No image selected for editing or image ID is missing.');
      return;
    }

    try {
      await this.firestoreService.updateDocument('images', this.editingImage.id, this.editingImage);
      console.log('Image metadata updated in Firestore');
      this.editingImage = null;
    } catch (error) {
      console.error('Error saving image edit:', error);
    }
  }

  cancelImageEdit(): void {
    this.editingImage = null;
  }
}
