'use client';

import { useState, useEffect } from 'react';
import { AstronomicalEvent } from '@/types/astro-events';
import { getAstronomicalEvents } from '@/lib/api-client';
import { useLocation } from '@/contexts/location-context';

const eventTypeColors = {
  'meteor-shower': 'bg-purple-100 text-purple-800',
  'eclipse': 'bg-yellow-100 text-yellow-800',
  'planetary-alignment': 'bg-blue-100 text-blue-800',
  'space-mission': 'bg-green-100 text-green-800',
  'planet-observation': 'bg-indigo-100 text-indigo-800',
  'comet': 'bg-orange-100 text-orange-800',
  'iss-flyover': 'bg-cyan-100 text-cyan-800',
  'planetary-conjunction': 'bg-pink-100 text-pink-800',
  'other': 'bg-gray-100 text-gray-800'
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
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function EventCard({ event }: { event: AstronomicalEvent }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{eventTypeIcons[event.type]}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventTypeColors[event.type]}`}>
            {event.type.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        <span className="text-sm text-gray-500">{event.source}</span>
      </div>
      
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{event.name}</h3>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{event.description}</p>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-700">
          <span className="font-medium">📅 Date:</span>
          <span className="ml-2">{formatDate(event.date)}</span>
        </div>
        
        {event.visibility && (
          <div className="flex items-center text-gray-700">
            <span className="font-medium">👁️ Visibility:</span>
            <span className="ml-2">
              {event.visibility.visibleToNakedEye ? 'Naked eye' : 'Equipment needed'}
            </span>
          </div>
        )}
        
        {event.duration && (
          <div className="flex items-center text-gray-700">
            <span className="font-medium">⏱️ Duration:</span>
            <span className="ml-2">{event.duration}</span>
          </div>
        )}
      </div>
      
      {event.externalUrl && (
        <div className="mt-4">
          <a
            href={event.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Learn more →
          </a>
        </div>
      )}
    </div>
  );
}

export default function AstronomicalEvents() {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Events</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Astronomical Events</h2>
        <p className="text-gray-600">Discover the wonders of space happening near you</p>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🌌</span>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Check back later for upcoming astronomical events</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
} 