/**
 * Represents an announcement entity
 */
export class Announcement {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  isActive: boolean;

  constructor(props: {
    id: string;
    title: string;
    short_description: string;
    long_description: string;
    priority: 'high' | 'medium' | 'low';
    created_at: string;
    is_active: boolean;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.shortDescription = props.short_description;
    this.longDescription = props.long_description;
    this.priority = props.priority;
    this.createdAt = new Date(props.created_at);
    this.isActive = props.is_active;
  }
} 