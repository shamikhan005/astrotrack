'use client';

import { useState, useEffect } from 'react';
import { AstronomicalEvent } from '@/types/astro-events';
import { getAstronomicalEvents } from '@/lib/api-client';
import { useLocation } from '@/contexts/location-context';
import CalendarExport from '@/components/calendar-export';

const eventTypeColors = {
  'meteor-shower': 'bg-white/20 text-white border-white/30',
  'eclipse': 'bg-gray-300/20 text-gray-200 border-gray-300/30',
  'planetary-alignment': 'bg-gray-400/20 text-gray-300 border-gray-400/30',
  'space-mission': 'bg-white/25 text-white border-white/40',
  'planet-observation': 'bg-gray-200/20 text-gray-100 border-gray-200/30',
  'comet': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'iss-flyover': 'bg-white/15 text-gray-100 border-white/25',
  'planetary-conjunction': 'bg-gray-300/25 text-gray-200 border-gray-300/35',
  'other': 'bg-gray-400/15 text-gray-300 border-gray-400/25'
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
    <div className="glass rounded-2xl p-6 card-hover glow-hover group relative overflow-visible">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2 rounded-xl glass">
            {eventTypeIcons[event.type]}
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${eventTypeColors[event.type]}`}>
              {event.type.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        <span className="text-sm text-white/50 glass px-3 py-1 rounded-full">
          {event.source}
        </span>
      </div>
      
      <h3 className="font-bold text-xl text-white mb-3 group-hover:text-gray-200 transition-colors">
        {event.name}
      </h3>
      
      <p className="text-white/70 text-sm mb-4 line-clamp-3 leading-relaxed">
        {event.description}
      </p>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center text-white/80 glass-strong rounded-lg p-3">
          <span className="text-lg mr-3">📅</span>
          <div>
            <div className="font-medium">Date & Time</div>
            <div className="text-white/60 text-xs">{formatDate(event.date)}</div>
          </div>
        </div>
        
        {event.visibility && (
          <div className="flex items-center text-white/80 glass-strong rounded-lg p-3">
            <span className="text-lg mr-3">👁️</span>
            <div>
              <div className="font-medium">Visibility</div>
              <div className="text-white/60 text-xs">
                {event.visibility.visibleToNakedEye ? 'Visible to naked eye' : 'Equipment needed'}
              </div>
            </div>
          </div>
        )}
        
        {event.duration && (
          <div className="flex items-center text-white/80 glass-strong rounded-lg p-3">
            <span className="text-lg mr-3">⏱️</span>
            <div>
              <div className="font-medium">Duration</div>
              <div className="text-white/60 text-xs">{event.duration}</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex gap-3 items-center relative z-10">
        <CalendarExport event={event} />
        {event.externalUrl && (
          <a
            href={event.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-white/70 hover:text-white text-sm font-medium transition-colors btn-glass px-4 py-2 rounded-lg"
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
        <div className="glass-strong rounded-2xl p-8 text-center">
          <div className="loading-dots mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-white/70">Loading cosmic events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-strong border border-red-400/30 rounded-2xl p-8 text-center glow-hover">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-red-300 mb-3">Error Loading Events</h3>
        <p className="text-white/70 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary-glass px-6 py-3 rounded-xl font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <div className="text-center glass-strong rounded-2xl p-8">
        <h2 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Upcoming Astronomical Events
          </span>
        </h2>
        <p className="text-white/60">Discover the wonders of space happening near you</p>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-16 glass-strong rounded-2xl">
          <span className="text-8xl mb-6 block">🌌</span>
          <h3 className="text-2xl font-bold text-white mb-3">No events found</h3>
          <p className="text-white/60">Check back later for upcoming astronomical events</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
} 