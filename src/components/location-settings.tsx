'use client';

import { useState } from 'react';
import { useLocation } from '@/contexts/location-context';
import { UserLocation } from '@/types/location';

export default function LocationSettings() {
  const {
    location,
    preferences,
    updateLocation,
    getCurrentLocation,
    searchLocations,
    saveLocation,
    removeLocation,
    isLoading,
    error
  } = useLocation();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchLocations(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (selectedLocation: UserLocation) => {
    updateLocation(selectedLocation);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleGetCurrentLocation = async () => {
    await getCurrentLocation();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="btn-glass flex items-center gap-3 px-4 py-3 rounded-xl glow-hover"
      >
        <span className="text-xl">📍</span>
        <div className="text-left">
          <div className="text-sm font-medium text-white">
            {location?.name || location?.city || 'Set Location'}
          </div>
          <div className="text-xs text-white/60">
            {location ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}` : 'No location set'}
          </div>
        </div>
        <span className={`ml-2 transform transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`}>
          ⌄
        </span>
      </button>

      {isSettingsOpen && (
        <div className="absolute top-full left-0 mt-3 w-96 glass-strong rounded-2xl border border-white/20 z-50">
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Location Preferences
            </h3>

            <button
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              className="w-full btn-primary-glass flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Getting location...
                </>
              ) : (
                <>
                  <span>🎯</span>
                  Use Current Location
                </>
              )}
            </button>

            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-3">
                Search for a location:
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Enter city name..."
                className="input-glass w-full px-4 py-3 rounded-xl"
              />
              
              {isSearching && (
                <div className="mt-3 text-sm text-white/60">Searching...</div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-3 max-h-40 overflow-y-auto glass rounded-xl border border-white/10">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(result)}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/10 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="font-medium text-sm text-white">{result.city}</div>
                      <div className="text-xs text-white/60">{result.country}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {preferences.savedLocations.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white/80 mb-3">Saved Locations:</h4>
                <div className="space-y-2">
                  {preferences.savedLocations.map((savedLoc, index) => (
                    <div key={index} className="flex items-center justify-between glass rounded-xl p-3">
                      <button
                        onClick={() => updateLocation(savedLoc)}
                        className="flex-1 text-left text-sm text-white/80 hover:text-white transition-colors"
                      >
                        {savedLoc.name || savedLoc.city}
                      </button>
                      <button
                        onClick={() => removeLocation(savedLoc)}
                        className="text-red-400 hover:text-red-300 text-sm ml-3 btn-glass w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {location && (
              <button
                onClick={() => saveLocation(location)}
                className="w-full btn-glass px-4 py-3 rounded-xl font-medium text-sm"
              >
                💾 Save Current Location
              </button>
            )}

            {error && (
              <div className="mt-4 glass border border-red-400/30 rounded-xl p-4">
                <div className="text-sm text-red-300">{error}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 