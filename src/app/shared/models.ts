export interface Gallery {
  id?: string;
  name: string;
  description?: string;
  order: number;
}

export interface Image {
  id?: string;
  galleryId: string;
  url: string;
  caption?: string;
  order: number;
}

export interface Content {
  id: string; // 'about', 'contact', 'footer', etc.
  title?: string;
  content: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}