'use client';

import { useState } from 'react';
import AstronomicalEvents from '@/components/astronomical-events';
import LocationSettings from '@/components/location-settings';
import { AstronomicalEvent } from '@/types/astro-events';

export default function Home() {
  const [events, setEvents] = useState<AstronomicalEvent[]>([]);

  return (
    <main className="min-h-screen relative">
      <header className="glass-strong sticky top-0 z-40 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                AstroTrack
              </h1>
            </div>
            <div className="flex gap-3">
              <LocationSettings />
            </div>
          </div>
        </div>
      </header>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          <AstronomicalEvents onEventsChange={setEvents} />
        </div>
      </section>

      <footer className="glass border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-white/50 text-sm">
            Made with 🌟 for space enthusiasts • Data from NASA, SpaceX & Launch Library
          </p>
        </div>
      </footer>
    </main>
  );
}
