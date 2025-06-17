'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EventReminder, ReminderSettings, ReminderTiming, NotificationPermission } from '@/types/calendar';
import { AstronomicalEvent } from '@/types/astro-events';
import { checkNotificationPermission, scheduleNotification, reminderTimingToMs } from '@/lib/calendar-utils';

interface NotificationContextType {
  reminders: EventReminder[];
  reminderSettings: ReminderSettings;
  notificationPermission: NotificationPermission;
  addReminder: (eventId: string, event: AstronomicalEvent, timing: ReminderTiming, customMs?: number) => Promise<void>;
  removeReminder: (reminderId: string) => void;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
  requestNotificationPermission: () => Promise<boolean>;
  clearExpiredReminders: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'astrotrack-reminders';
const SETTINGS_KEY = 'astrotrack-reminder-settings';

const DEFAULT_SETTINGS: ReminderSettings = {
  enabled: true,
  defaultTiming: ['1hour'],
  allowBrowserNotifications: true,
  allowEmailNotifications: false
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<EventReminder[]>([]);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(DEFAULT_SETTINGS);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>({
    granted: false,
    requested: false,
    denied: false
  });

  useEffect(() => {
    loadReminders();
    loadSettings();
    checkInitialPermission();
  }, []);

  const checkInitialPermission = () => {
    if ('Notification' in window) {
      const permission = Notification.permission;
      setNotificationPermission({
        granted: permission === 'granted',
        requested: permission !== 'default',
        denied: permission === 'denied'
      });
    }
  };

  const loadReminders = () => {
    try {
      const savedReminders = localStorage.getItem(STORAGE_KEY);
      if (savedReminders) {
        const parsed = JSON.parse(savedReminders);
        const activeReminders = parsed.filter((reminder: EventReminder) => 
          new Date(reminder.reminderTime) > new Date()
        );
        setReminders(activeReminders);
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setReminderSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Error loading reminder settings:', error);
    }
  };

  const saveReminders = (newReminders: EventReminder[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const saveSettings = (newSettings: ReminderSettings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving reminder settings:', error);
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    const granted = await checkNotificationPermission();
    
    setNotificationPermission({
      granted,
      requested: true,
      denied: !granted && Notification.permission === 'denied'
    });
    
    return granted;
  };

  const addReminder = async (
    eventId: string, 
    event: AstronomicalEvent, 
    timing: ReminderTiming, 
    customMs?: number
  ): Promise<void> => {
    const eventDate = new Date(event.date);
    const reminderMs = reminderTimingToMs(timing, customMs);
    const reminderTime = new Date(eventDate.getTime() - reminderMs);
    
    if (reminderTime <= new Date()) {
      throw new Error('Cannot set reminder for past events');
    }

    if (reminderSettings.allowBrowserNotifications && !notificationPermission.granted) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        throw new Error('Notification permission denied');
      }
    }

    const reminder: EventReminder = {
      eventId,
      reminderTime,
      notificationId: '',
      reminderType: 'browser',
      message: `${event.name} is starting soon!`,
      isActive: true
    };

    if (reminderSettings.allowBrowserNotifications && notificationPermission.granted) {
      const notificationId = scheduleNotification(event, reminderTime);
      reminder.notificationId = notificationId;
    }

    const newReminders = [...reminders, reminder];
    setReminders(newReminders);
    saveReminders(newReminders);
  };

  const removeReminder = (reminderId: string) => {
    const newReminders = reminders.filter(reminder => reminder.notificationId !== reminderId);
    setReminders(newReminders);
    saveReminders(newReminders);
  };

  const updateReminderSettings = (settings: Partial<ReminderSettings>) => {
    const newSettings = { ...reminderSettings, ...settings };
    setReminderSettings(newSettings);
    saveSettings(newSettings);
  };

  const clearExpiredReminders = () => {
    const now = new Date();
    const activeReminders = reminders.filter(reminder => 
      new Date(reminder.reminderTime) > now
    );
    
    if (activeReminders.length !== reminders.length) {
      setReminders(activeReminders);
      saveReminders(activeReminders);
    }
  };

  useEffect(() => {
    const interval = setInterval(clearExpiredReminders, 60000); 
    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <NotificationContext.Provider value={{
      reminders,
      reminderSettings,
      notificationPermission,
      addReminder,
      removeReminder,
      updateReminderSettings,
      requestNotificationPermission,
      clearExpiredReminders
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 