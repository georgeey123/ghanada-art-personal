import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore';
import { Content } from '../shared/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Contact Us</h2>
    <div *ngIf="contactInfo">
      <p *ngIf="isLoading">Loading...</p>
      <p *ngIf="error">Error: {{ error.message }}</p>
 <p *ngIf="contactInfo?.contactInfo?.email">Email: {{ contactInfo.contactInfo?.email }}</p>
 <p *ngIf="contactInfo?.contactInfo?.phone">Phone: {{ contactInfo.contactInfo?.phone }}</p>
 <p *ngIf="contactInfo?.contactInfo?.address">Address: {{ contactInfo.contactInfo?.address }}</p>
    </div>

    <h3>Send us a message</h3>
    <form>
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name">
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email">
      </div>
      <div>
        <label for="subject">Subject:</label>
        <input type="text" id="subject" name="subject">
      </div>
      <div>
        <label for="message">Message:</label>
        <textarea id="message" name="message"></textarea>
      </div>
      <button type="submit">Send Message</button>
    </form>
  `,
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {
  contactInfo: Content | undefined;
  isLoading: boolean = true;
  error: any = null;

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.error = null;
    this.firestoreService.getDocument<Content | undefined>('content', 'contact').subscribe(
      (data: Content | undefined) => {
        this.contactInfo = data;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching contact info:', error);
        this.error = error;
        this.isLoading = false;
      }
    );
  }
}