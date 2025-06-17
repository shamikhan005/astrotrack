export interface CalendarEvent {
  title: string;
  description: string;
  start: Date;
  end?: Date;
  location?: string;
  url?: string;
  uid: string;
  categories: string[];
  status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
  organizer?: {
    name: string;
    email: string;
  };
}

export interface EventReminder {
  eventId: string;
  reminderTime: Date;
  notificationId: string;
  reminderType: 'browser' | 'email';
  message: string;
  isActive: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  defaultTiming: ReminderTiming[];
  allowBrowserNotifications: boolean;
  allowEmailNotifications: boolean;
}

export type ReminderTiming = 
  | '15min'
  | '1hour' 
  | '1day'
  | '1week'
  | 'custom';

export interface CalendarExportOptions {
  eventTypes: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  includeReminders: boolean;
  format: 'ics' | 'google' | 'outlook';
}

export interface NotificationPermission {
  granted: boolean;
  requested: boolean;
  denied: boolean;
} 