'use client';

import { useState } from 'react';
import { AstronomicalEvent } from '@/types/astro-events';
import { CalendarExportOptions, ReminderTiming } from '@/types/calendar';
import { useNotifications } from '@/contexts/notification-context';
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  generateICalFile,
  downloadFile,
  exportEvents
} from '@/lib/calendar-utils';

interface CalendarExportProps {
  event: AstronomicalEvent;
  className?: string;
}

interface BulkExportProps {
  events: AstronomicalEvent[];
  className?: string;
}

export function EventCalendarExport({ event, className = '' }: CalendarExportProps) {
  const { addReminder, reminderSettings, notificationPermission } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [selectedReminderTiming, setSelectedReminderTiming] = useState<ReminderTiming>('1hour');

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank');
    setIsDropdownOpen(false);
  };

  const handleOutlookCalendar = () => {
    const url = generateOutlookCalendarUrl(event);
    window.open(url, '_blank');
    setIsDropdownOpen(false);
  };

  const handleDownloadICS = async () => {
    try {
      const icalContent = await generateICalFile([event]);
      const filename = `${event.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
      downloadFile(icalContent, filename);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error generating iCal file:', error);
      alert('Error generating calendar file. Please try again.');
    }
  };

  const handleSetReminder = async () => {
    try {
      await addReminder(event.id, event, selectedReminderTiming);
      alert(`Reminder set for ${selectedReminderTiming} before ${event.name}`);
      setIsReminderOpen(false);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error setting reminder:', error);
      alert(`Error setting reminder: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
      >
        <span>📅</span>
        <span>Add to Calendar</span>
        <span className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
          ⌄
        </span>
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <button
              onClick={handleGoogleCalendar}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <span>📱</span>
              <span>Google Calendar</span>
            </button>
            
            <button
              onClick={handleOutlookCalendar}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <span>📧</span>
              <span>Outlook Calendar</span>
            </button>
            
            <button
              onClick={handleDownloadICS}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <span>📁</span>
              <span>Download .ics file</span>
            </button>
            
            <hr className="my-1" />
            
            <button
              onClick={() => setIsReminderOpen(!isReminderOpen)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <span>🔔</span>
              <span>Set Reminder</span>
              <span className={`ml-auto transform transition-transform ${isReminderOpen ? 'rotate-180' : ''}`}>
                ⌄
              </span>
            </button>
            
            {isReminderOpen && (
              <div className="px-4 py-2 bg-gray-50 border-t">
                <div className="space-y-2">
                  <div className="text-xs text-gray-600 mb-2">Remind me:</div>
                  
                  <div className="space-y-1">
                    {['15min', '1hour', '1day', '1week'].map((timing) => (
                      <label key={timing} className="flex items-center gap-2 text-xs">
                        <input
                          type="radio"
                          name="reminderTiming"
                          value={timing}
                          checked={selectedReminderTiming === timing}
                          onChange={(e) => setSelectedReminderTiming(e.target.value as ReminderTiming)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>
                          {timing === '15min' && '15 minutes before'}
                          {timing === '1hour' && '1 hour before'}
                          {timing === '1day' && '1 day before'}
                          {timing === '1week' && '1 week before'}
                        </span>
                      </label>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleSetReminder}
                    disabled={!reminderSettings.enabled}
                    className="w-full mt-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {notificationPermission.granted ? 'Set Reminder' : 'Enable Notifications & Set'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function BulkCalendarExport({ events, className = '' }: BulkExportProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<CalendarExportOptions>({
    eventTypes: [],
    dateRange: {
      start: new Date(),
      end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) 
    },
    includeReminders: false,
    format: 'ics'
  });

  const eventTypes = Array.from(new Set(events.map(event => event.type)));

  const handleExport = async () => {
    try {
      await exportEvents(events, exportOptions);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error exporting events:', error);
      alert('Error exporting events. Please try again.');
    }
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setExportOptions(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: new Date(value)
      }
    }));
  };

  const handleEventTypeToggle = (eventType: string) => {
    setExportOptions(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(eventType)
        ? prev.eventTypes.filter(type => type !== eventType)
        : [...prev.eventTypes, eventType]
    }));
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <span>📅</span>
        <span>Export Calendar</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Export Calendar Events</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        type="date"
                        value={exportOptions.dateRange.start.toISOString().split('T')[0]}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="date"
                        value={exportOptions.dateRange.end.toISOString().split('T')[0]}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Types (leave empty for all)
                  </label>
                  <div className="space-y-1">
                    {eventTypes.map(type => (
                      <label key={type} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={exportOptions.eventTypes.includes(type)}
                          onChange={() => handleEventTypeToggle(type)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="capitalize">{type.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="format"
                        value="ics"
                        checked={exportOptions.format === 'ics'}
                        onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>iCal (.ics) - Universal format</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="format"
                        value="google"
                        checked={exportOptions.format === 'google'}
                        onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Google Calendar (single event only)</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="format"
                        value="outlook"
                        checked={exportOptions.format === 'outlook'}
                        onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Outlook Calendar (single event only)</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Export Events
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 