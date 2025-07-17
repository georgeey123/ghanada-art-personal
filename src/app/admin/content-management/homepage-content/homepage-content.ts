import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../firestore';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Import Observable
import { tap, catchError } from 'rxjs/operators'; // Import operators
import { of } from 'rxjs'; // Import 'of' for error handling
import { FormsModule } from '@angular/forms';

interface HomepageConfig {
  heroImages?: string[];
  featuredGalleries?: string[];
  aboutText?: string;
  heroImagesString?: string; // Add this property
  featuredGalleriesString?: string; // Add this property
  // Add other fields as per your Firestore structure
}

@Component({
  selector: 'app-homepage-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './homepage-content.html',
  styleUrl: './homepage-content.css'
})
export class HomepageContentComponent implements OnInit {
  homepageConfig: HomepageConfig | undefined;
  isLoading: boolean = true;
  error: any = null;

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.error = null;

    this.firestoreService.getDocument<HomepageConfig | undefined>('config', 'homepage').pipe(
      tap(config => {
        this.homepageConfig = config;
        if (this.homepageConfig) {
          // Convert arrays to comma-separated strings for form binding
          this.homepageConfig.heroImagesString = this.homepageConfig.heroImages ? this.homepageConfig.heroImages.join(', ') : '';
          this.homepageConfig.featuredGalleriesString = this.homepageConfig.featuredGalleries ? this.homepageConfig.featuredGalleries.join(', ') : '';
        }
        this.isLoading = false;
      }),
      catchError(error => {
        this.error = error;
        this.isLoading = false;
        console.error('Error fetching homepage config:', error);
        return of(undefined); // Return an observable of undefined to continue the stream
      })
    ).subscribe(); // Subscribe to trigger the observable
  }

  // You will add your saveContent method here later
  async saveContent(): Promise<void> {
    if (this.homepageConfig) {
      // Convert comma-separated strings back to arrays (if you used that approach)
      const dataToSave: HomepageConfig = {
        ...this.homepageConfig,
        heroImages: this.homepageConfig.heroImagesString ? this.homepageConfig.heroImagesString.split(',').map(url => url.trim()) : [],
        featuredGalleries: this.homepageConfig.featuredGalleriesString ? this.homepageConfig.featuredGalleriesString.split(',').map(id => id.trim()) : []
      };

      try {
        // Assuming 'homepage' document has a fixed ID in the 'config' collection
        await this.firestoreService.updateDocument('config', 'homepage', dataToSave);
        console.log('Homepage content updated successfully');
        // Optionally, provide user feedback (e.g., a success message)
      } catch (error) {
        console.error('Error saving homepage content:', error);
        // Optionally, provide user feedback (e.g., an error message)
      }
    }
  }
}
