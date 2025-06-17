'use client';

import { useState } from 'react';
import AstronomicalEvents from '@/components/astronomical-events';
import LocationSettings from '@/components/location-settings';
import { BulkCalendarExport } from '@/components/calendar-export';
import { AstronomicalEvent } from '@/types/astro-events';

export default function Home() {
  const [events, setEvents] = useState<AstronomicalEvent[]>([]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                🌟 AstroTrack
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your personal guide to the cosmos. Track upcoming astronomical events, 
                space missions, and celestial wonders.
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              {events.length > 0 && <BulkCalendarExport events={events} />}
              <LocationSettings />
            </div>
          </div>
        </div>
        
        <AstronomicalEvents onEventsChange={setEvents} />
      </div>
    </main>
  );
}
