'use client';

import { useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import { AstronomicalEvent } from '@/types/astro-events';
import { 
  generateGoogleCalendarUrl, 
  generateOutlookCalendarUrl,
  generateICalFile,
  downloadFile
} from '@/lib/calendar-utils';

interface CalendarExportProps {
  event: AstronomicalEvent;
  className?: string;
}

export default function CalendarExport({ event, className = '' }: CalendarExportProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCalendarExport = async (type: 'google' | 'outlook' | 'ics') => {
    switch (type) {
      case 'google':
        const googleUrl = generateGoogleCalendarUrl(event);
        window.open(googleUrl, '_blank');
        break;
      case 'outlook':
        const outlookUrl = generateOutlookCalendarUrl(event);
        window.open(outlookUrl, '_blank');
        break;
      case 'ics':
        try {
          const icalContent = await generateICalFile([event]);
          const filename = `${event.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
          downloadFile(icalContent, filename);
        } catch (error) {
          console.error('Error generating iCal file:', error);
          alert('Error generating calendar file. Please try again.');
        }
        break;
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-glass px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 glow-hover flex items-center gap-2"
        aria-label="Add to calendar"
      >
        <Calendar className="w-4 h-4" />
        Add to Calendar
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute bottom-full left-0 mb-2 w-48 glass rounded-lg border border-white/20 shadow-xl z-50 backdrop-blur-md">
            <div className="p-1">
              <button
                onClick={() => handleCalendarExport('google')}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-white/20 transition-colors text-sm flex items-center gap-2 text-white/90 hover:text-white"
              >
                <Calendar className="w-4 h-4" />
                Google Calendar
              </button>
              <button
                onClick={() => handleCalendarExport('outlook')}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-white/20 transition-colors text-sm flex items-center gap-2 text-white/90 hover:text-white"
              >
                <Calendar className="w-4 h-4" />
                Outlook
              </button>
              <button
                onClick={() => handleCalendarExport('ics')}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-white/20 transition-colors text-sm flex items-center gap-2 text-white/90 hover:text-white"
              >
                <Download className="w-4 h-4" />
                Download ICS
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 