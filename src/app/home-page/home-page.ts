import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore';
import { CommonModule } from '@angular/common';
import { Gallery, Image, Content } from '../shared/models'; // Import necessary models
import { switchMap, map, catchError } from 'rxjs/operators';
import { forkJoin, Observable, of, EMPTY } from 'rxjs'; // Import necessary RxJS operators and creation functions
import { where } from '@angular/fire/firestore'; // Import where
import { RouterModule } from '@angular/router';

interface HomepageConfig {
  heroImages?: string[];
  featuredGalleries?: string[]; // Array of Gallery IDs
  aboutText?: string;
  // Add other fields as per your Firestore structure
}

interface FeaturedGalleryData extends Gallery {
  images: Image[]; // Images for this featured gallery
}


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.html', // Use templateUrl
  styleUrls: ['./home-page.component.css'] // Use styleUrls
})
export class HomePageComponent implements OnInit {
  homepageConfig: HomepageConfig | undefined;
  featuredGalleriesData: FeaturedGalleryData[] = [];
  isLoading: boolean = true;
  error: any = null;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.error = null;

    this.firestoreService.getDocument<HomepageConfig>('config', 'homepage').pipe(
      switchMap(homepageConfig => {
        this.homepageConfig = homepageConfig;
        if (homepageConfig && homepageConfig.featuredGalleries && homepageConfig.featuredGalleries.length > 0) {
          // Fetch featured galleries and their images
          const galleryObservables = homepageConfig.featuredGalleries.map(galleryId =>
            this.firestoreService.getDocument<Gallery>('galleries', galleryId).pipe(
              switchMap(gallery => {
                if (gallery && gallery.id) {
                  // Fetch images for the featured gallery
                  return this.firestoreService.getCollection<Image>('images', [where('galleryId', '==', gallery.id)], 'order').pipe(
                    map(images => ({ ...gallery, images: images }) as FeaturedGalleryData) // Combine gallery and images
                  );
                } else {
                  return of(undefined); // Gallery not found
                }
              }),
              catchError(error => {
                console.error(`Error fetching featured gallery ${galleryId}:`, error);
                return of(undefined); // Handle error for individual gallery fetch
              })
            )
          );
          return forkJoin(galleryObservables).pipe(
            map(featuredGalleriesData => featuredGalleriesData.filter(gallery => gallery !== undefined) as FeaturedGalleryData[]) // Filter out undefined galleries
          );
        } else {
          return of([]); // No featured galleries defined or config not found
        }
      }),
      catchError(error => {
        this.error = error;
        console.error('Error fetching homepage configuration or featured galleries:', error);
        return EMPTY; // Stop the stream on error
      })
    ).subscribe(featuredGalleriesData => {
      this.featuredGalleriesData = featuredGalleriesData;
      this.isLoading = false;
    });
  }
}
