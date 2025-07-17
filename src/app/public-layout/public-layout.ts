import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FirestoreService } from '../firestore';
import { Content } from '../shared/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  template: `
    <header>
      <nav>
        <!-- Navigation links using RouterLink -->
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer>
      <div *ngIf="isLoadingFooter"><p>Loading footer...</p></div>
      <div *ngIf="errorFooter"><p>Error loading footer: {{ errorFooter.message }}</p></div>
      <p *ngIf="footerContent">{{ footerContent.content }}</p>
    </footer>
  `,
  styleUrls: ['./public-layout.css']
})
export class PublicLayoutComponent implements OnInit { // Renamed class to PublicLayoutComponent
  footerContent: Content | undefined;
  isLoadingFooter: boolean = true;
  errorFooter: any = null;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.isLoadingFooter = true;
    this.errorFooter = null;
    this.firestoreService.getDocument<Content>('content', 'footer').subscribe({
 next: (content: Content | undefined) => {
        this.footerContent = content;
        this.isLoadingFooter = false;
      },
 error: (err: any) => {
        this.errorFooter = err;
        this.isLoadingFooter = false;
      }
    });
  }
}

