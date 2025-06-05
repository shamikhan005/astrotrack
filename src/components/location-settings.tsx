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
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">📍</span>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900">
            {location?.name || location?.city || 'Set Location'}
          </div>
          <div className="text-xs text-gray-500">
            {location ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}` : 'No location set'}
          </div>
        </div>
        <span className={`ml-2 transform transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`}>
          ⌄
        </span>
      </button>

      {isSettingsOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Preferences</h3>

            <button
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search for a location:
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Enter city name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {isSearching && (
                <div className="mt-2 text-sm text-gray-500">Searching...</div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(result)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-sm">{result.city}</div>
                      <div className="text-xs text-gray-500">{result.country}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {preferences.savedLocations.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Saved Locations:</h4>
                <div className="space-y-1">
                  {preferences.savedLocations.map((savedLoc, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <button
                        onClick={() => updateLocation(savedLoc)}
                        className="flex-1 text-left text-sm text-gray-600 hover:text-blue-600"
                      >
                        {savedLoc.name || savedLoc.city}
                      </button>
                      <button
                        onClick={() => removeLocation(savedLoc)}
                        className="text-red-500 hover:text-red-700 text-sm"
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
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                💾 Save Current Location
              </button>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="text-sm text-red-600">{error}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 