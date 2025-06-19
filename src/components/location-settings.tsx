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
        className="btn-modern flex items-center gap-3 px-6 py-3 text-base"
      >
        <span className="text-xl">📍</span>
        <div className="text-left">
          <div className="font-semibold" style={{ color: 'var(--text-dark)' }}>
            {location?.name || location?.city || 'Set Location'}
          </div>
          <div className="text-sm opacity-60">
            {location ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}` : 'No location set'}
          </div>
        </div>
        <span className={`ml-2 transform transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`}>
          ⌄
        </span>
      </button>

      {isSettingsOpen && (
        <div className="absolute top-full right-0 mt-4 w-96 max-w-[calc(100vw-2rem)] card-colorful card-blue z-50">
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-8">
              Location Preferences
            </h3>

            <button
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              className="w-full btn-colorful flex items-center justify-center gap-3 px-6 py-4 font-bold text-base mb-8 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="loading-modern w-5 h-5"></div>
                  <span>Getting location...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span>🎯</span>
                  <span>Use Current Location</span>
                </div>
              )}
            </button>

            <div className="mb-8">
              <label className="block text-lg font-semibold mb-4">
                Search for a location:
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Enter city name..."
                className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-25 backdrop-blur-sm border-none text-white placeholder-white placeholder-opacity-75 text-base"
              />
              
              {isSearching && (
                <div className="mt-3 text-base opacity-80">Searching...</div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-4 max-h-40 overflow-y-auto bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(result)}
                      className="w-full text-left px-4 py-3 hover:bg-white hover:bg-opacity-20 border-b border-white border-opacity-20 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="font-semibold text-base">{result.city}</div>
                      <div className="text-sm opacity-75">{result.country}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {preferences.savedLocations.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">Saved Locations:</h4>
                <div className="space-y-3">
                  {preferences.savedLocations.map((savedLoc, index) => (
                    <div key={index} className="flex items-center justify-between bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                      <button
                        onClick={() => updateLocation(savedLoc)}
                        className="flex-1 text-left text-base font-medium hover:opacity-80 transition-opacity"
                      >
                        {savedLoc.name || savedLoc.city}
                      </button>
                      <button
                        onClick={() => removeLocation(savedLoc)}
                        className="text-white hover:text-red-200 text-base ml-3 bg-white bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center"
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
                className="w-full btn-modern px-6 py-4 font-semibold text-base"
              >
                💾 Save Current Location
              </button>
            )}

            {error && (
              <div className="mt-6 card-colorful card-red p-4">
                <div className="text-base font-medium">{error}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 