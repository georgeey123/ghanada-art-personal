import { Routes } from '@angular/router';
import { AboutContentComponent } from './admin/content-management/about-content/about-content';
import { ContactContentComponent } from './admin/content-management/contact-content/contact-content';
import { FooterContentComponent } from './admin/content-management/footer-content/footer-content';
import { GalleryListComponent } from './admin/gallery-management/gallery-list/gallery-list';
import { HomepageContentComponent } from './admin/content-management/homepage-content/homepage-content';
import { PublicLayoutComponent } from './public-layout/public-layout';
import { GalleryDetailComponent } from './admin/gallery-management/gallery-detail/gallery-detail';

// Import placeholder for AuthGuard (will be created later)
import { authGuard } from './auth-guard';
export const routes: Routes = [
  // Public Routes
  {
    path: '', component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect root to /home
      { path: 'home', loadComponent: () => import('./home-page/home-page').then(m => m.HomePageComponent) },
      { path: 'weddings', loadComponent: () => import('./gallery-page/gallery-page').then(m => m.GalleryPageComponent) },
      { path: 'glamour', loadComponent: () => import('./gallery-page/gallery-page').then(m => m.GalleryPageComponent) },
      { path: 'family', loadComponent: () => import('./gallery-page/gallery-page').then(m => m.GalleryPageComponent) },
      { path: 'portrait', loadComponent: () => import('./gallery-page/gallery-page').then(m => m.GalleryPageComponent) },
      { path: 'headshots', loadComponent: () => import('./gallery-page/gallery-page').then(m => m.GalleryPageComponent) },
      { path: 'lifestyle', loadComponent: () => import('./gallery-page/gallery-page').then(m => m.GalleryPageComponent) },
      { path: 'live-stream', /* component: GalleryPageComponent */ loadComponent: () => import('./gallery-page/gallery-page').then(m => m.GalleryPageComponent) },
      { path: 'about', /* component: AboutPageComponent */ loadComponent: () => import('./about-page/about-page').then(m => m.AboutPageComponent) },
      { path: 'contact', /* component: ContactPageComponent */ loadComponent: () => import('./contact-page/contact-page').then(m => m.ContactPageComponent) }
    ]
  },

  // Admin Routes (protected)
    {
    path: 'admin', canActivate: [authGuard], // Apply AuthGuard here
    children: [
      { path: '', /* component: AdminDashboardComponent */ loadComponent: () => import('./admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent) }, // This route is now protected by the parent canActivate
      { 
        path: 'galleries',
        children: [
          { path: '', component: GalleryListComponent },
          { path: ':galleryId', component: GalleryDetailComponent }] },
      { path: 'content', /* component: ContentManagementComponent */ loadComponent: () => import('./admin/content-management/content-management').then(m => m.ContentManagement),
        children: [
          { path: 'about', component: AboutContentComponent }
 ,
          { path: 'contact', component: ContactContentComponent },
          { path: 'footer', component: FooterContentComponent }] }
 ,
        { path: 'homepage', component: HomepageContentComponent }] }
  ,
  // Admin Login Route (not protected)
  { path: 'admin/login', loadComponent: () => import('./admin/admin-login-page/admin-login-page').then(m => m.AdminLoginPage) },

  // Wildcard route for 404 - redirect to home
 { path: '**', redirectTo: 'home' }
];
