import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore';
import { Image, Gallery } from '../shared/models';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Subscription, EMPTY } from 'rxjs';
import { where } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>{{ galleryType | titlecase }}</h2>

    <div class="image-grid">
      <div *ngFor="let image of images" class="image-item" (click)="openModal(image)">
        <img [src]="image.url" [alt]="image.caption">
      </div>
    </div>

    <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <img [src]="selectedImage?.url" [alt]="selectedImage?.caption">
        <p *ngIf="selectedImage?.caption">{{ selectedImage?.caption }}</p>
        <button (click)="closeModal()">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 10px;
    }
    .image-item img {
      width: 100%;
      height: auto;
      cursor: pointer;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background-color: white;
      padding: 20px;
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
      position: relative;
    }
    .modal-content img {
      max-width: 100%;
      height: auto;
    }
    .modal-content button {
      margin-top: 10px;
    }
  `]
})
export class GalleryPageComponent implements OnInit, OnDestroy {

  isLoadingGallery: boolean = true;
  errorGallery: any = null;
  isLoadingImages: boolean = true;
  errorImages: any = null;
  galleryType: string | null = null;
  images: Image[] = [];
  imagesSubscription: Subscription | undefined;
  selectedImage: Image | null = null;
  showModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit(): void {
    this.isLoadingGallery = true;
    this.errorGallery = null;
    this.isLoadingImages = true;
    this.errorImages = null;

    this.imagesSubscription = this.route.url.pipe(
      map(segments => segments[0].path), // Get the first segment of the URL as the gallery type
      switchMap(galleryType => {
        this.galleryType = galleryType;
        // Fetch the gallery document by name to get its ID
        return this.firestoreService.getCollection<Gallery>('galleries', [{ field: 'name', operator: '==', value: this.galleryType }]).pipe(
          map(galleries => {
            this.isLoadingGallery = false;
            return galleries;
          }),
          catchError((error) => {
            this.errorGallery = error;
            this.isLoadingGallery = false;
            console.error('Error fetching gallery:', error);
            return EMPTY;
          })
        );
      }),
      switchMap((galleries: Gallery[]) => {
        // Reset image loading state before fetching images for the new gallery
        this.isLoadingImages = true;
        if (galleries.length > 0) {
          const galleryId = galleries[0].id!; // Assuming gallery name is unique and gets one result
          // Fetch images for the found gallery ID, ordered by 'order'
          return this.firestoreService.getCollection<Image>('images', [{ field: 'galleryId', operator: '==', value: galleryId }], 'order');
        } else {
          // If no gallery found for the type, return an empty observable and set image loading to false
          this.isLoadingImages = false;
          return EMPTY;
        }
      }),
      catchError((error) => {
        console.error('Error fetching images:', error);
        this.errorImages = error;
        this.isLoadingImages = false;
        return EMPTY; // Stop the stream on image fetch error
      })
    ).subscribe(images => {
      this.images = images;
      this.isLoadingImages = false;
    });
  }
  
  ngOnDestroy(): void {
    this.imagesSubscription?.unsubscribe();
  }

  openModal(image: Image): void {
    this.selectedImage = image;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedImage = null;
  }
}