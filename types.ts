export enum CommunicationChannel {
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP'
}

export interface Template {
  id: string;
  title: string;
  category: string;
  channel: CommunicationChannel;
  subject?: string; // Only for emails
  content: string;
  description?: string;
  // New fields for dual-copy templates (e.g. Email + Internal Protocol)
  secondaryContent?: string;
  secondaryLabel?: string; 
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name string reference
}