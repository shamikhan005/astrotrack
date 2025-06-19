'use client';

import { useState, useEffect } from 'react';
import { AstronomicalEvent } from '@/types/astro-events';
import { getAstronomicalEvents } from '@/lib/api-client';
import { useLocation } from '@/contexts/location-context';
import CalendarExport from '@/components/calendar-export';

const eventTypeColors = {
  'meteor-shower': 'card-colorful card-purple',
  'eclipse': 'card-colorful card-red',
  'planetary-alignment': 'card-colorful card-purple',
  'space-mission': 'card-colorful card-red',
  'planet-observation': 'card-colorful card-orange',
  'comet': 'card-colorful card-red',
  'iss-flyover': 'card-colorful card-blue',
  'planetary-conjunction': 'card-colorful card-blue',
  'other': 'card-colorful card-yellow'
};

const eventTypeIcons = {
  'meteor-shower': '⭐',
  'eclipse': '🌒',
  'planetary-alignment': '🪐',
  'space-mission': '🚀',
  'planet-observation': '🔭',
  'comet': '☄️',
  'iss-flyover': '🛰️',
  'planetary-conjunction': '🌟',
  'other': '🌌'
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return `Invalid date: ${dateString}`;
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}

function EventCard({ event }: { event: AstronomicalEvent }) {
  return (
    <div className={eventTypeColors[event.type]}>
      <div className="mb-6">
        <div className="flex justify-end mb-3">
          <span className="tag-modern opacity-75 text-sm">
            {event.source}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="icon-container text-4xl">
            {eventTypeIcons[event.type]}
          </div>
          <div>
            <span className="tag-modern">
              {event.type.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      <h3 className="font-bold text-2xl mb-4 leading-tight">
        {event.name}
      </h3>
      
      <p className="text-lg opacity-90 mb-6 leading-relaxed">
        {event.description}
      </p>
      
      <div className="space-y-4 text-base">
        <div className="flex items-center bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
          <span className="text-2xl mr-4">📅</span>
          <div>
            <div className="font-semibold text-lg">Date & Time</div>
            <div className="opacity-80 text-base">{formatDate(event.date)}</div>
          </div>
        </div>
        
        {event.visibility && (
          <div className="flex items-center bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
            <span className="text-2xl mr-4">👁️</span>
            <div>
              <div className="font-semibold text-lg">Visibility</div>
              <div className="opacity-80 text-base">
                {event.visibility.visibleToNakedEye ? 'Visible to naked eye' : 'Equipment needed'}
              </div>
            </div>
          </div>
        )}
        
        {event.duration && (
          <div className="flex items-center bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
            <span className="text-2xl mr-4">⏱️</span>
            <div>
              <div className="font-semibold text-lg">Duration</div>
              <div className="opacity-80 text-base">{event.duration}</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex gap-4 items-center">
        <CalendarExport event={event} />
        {event.externalUrl && (
          <a
            href={event.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-modern inline-flex items-center font-semibold text-base transition-all"
          >
            Learn more →
          </a>
        )}
      </div>
    </div>
  );
}

interface AstronomicalEventsProps {
  onEventsChange?: (events: AstronomicalEvent[]) => void;
}

export default function AstronomicalEvents({ onEventsChange }: AstronomicalEventsProps) {
  const { location } = useLocation();
  const [events, setEvents] = useState<AstronomicalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);
        const eventsData = await getAstronomicalEvents(location ? {
          latitude: location.latitude,
          longitude: location.longitude
        } : undefined);
        setEvents(eventsData);
        onEventsChange?.(eventsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="card-colorful card-blue text-center">
          <div className="loading-modern mb-6"></div>
          <p className="text-xl font-semibold">Loading cosmic events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-colorful card-red text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h3 className="text-2xl font-bold mb-4">Error Loading Events</h3>
        <p className="text-lg opacity-90 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-modern font-semibold text-lg px-8 py-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 relative">
      <div className="card-colorful card-purple text-center">
        <h2 className="text-4xl font-bold mb-4">
          Upcoming Astronomical Events
        </h2>
        <p className="text-xl opacity-90">Discover the wonders of space happening near you</p>
      </div>

      {events.length === 0 ? (
        <div className="card-colorful card-yellow text-center">
          <div className="text-6xl mb-6">🌌</div>
          <h3 className="text-2xl font-bold mb-4">No Events Found</h3>
          <p className="text-lg opacity-90">
            No astronomical events found for your location. Try adjusting your location settings or check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      )}
    </div>
  );
} 