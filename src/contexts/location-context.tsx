'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserLocation, LocationPreferences } from '@/types/location';

interface LocationContextType {
  location: UserLocation | null;
  preferences: LocationPreferences;
  updateLocation: (location: UserLocation) => void;
  getCurrentLocation: () => Promise<UserLocation | null>;
  searchLocations: (query: string) => Promise<UserLocation[]>;
  saveLocation: (location: UserLocation, name?: string) => void;
  removeLocation: (location: UserLocation) => void;
  isLoading: boolean;
  error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'astrotrack-location-preferences';

const DEFAULT_LOCATION: UserLocation = {
  latitude: 28.6139,
  longitude: 77.2090,
  city: 'New Delhi',
  country: 'India',
  name: 'Default'
};

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [preferences, setPreferences] = useState<LocationPreferences>({
    currentLocation: null,
    savedLocations: [],
    useGeolocation: true,
    defaultLocation: DEFAULT_LOCATION
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedPrefs = localStorage.getItem(STORAGE_KEY);
    if (savedPrefs) {
      try {
        const parsed: LocationPreferences = JSON.parse(savedPrefs);
        setPreferences(parsed);
        setLocation(parsed.currentLocation || parsed.defaultLocation || DEFAULT_LOCATION);
      } catch (error) {
        console.error('Error loading location preferences:', error);
        setLocation(DEFAULT_LOCATION);
      }
    } else {
      setLocation(DEFAULT_LOCATION);
    }
  }, []);

  useEffect(() => {
    if (preferences.useGeolocation && !preferences.currentLocation) {
      getCurrentLocation();
    }
  }, [preferences.useGeolocation]);

  const savePreferences = (newPrefs: LocationPreferences) => {
    setPreferences(newPrefs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
  };

  const getCurrentLocation = async (): Promise<UserLocation | null> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return null;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            const locationDetails = await reverseGeocode(latitude, longitude);
            
            const newLocation: UserLocation = {
              latitude,
              longitude,
              ...locationDetails
            };

            setLocation(newLocation);
            
            const updatedPrefs = {
              ...preferences,
              currentLocation: newLocation
            };
            savePreferences(updatedPrefs);
            
            setIsLoading(false);
            resolve(newLocation);
          } catch (error) {
            console.error('Error getting location details:', error);
            const basicLocation: UserLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            setLocation(basicLocation);
            setIsLoading(false);
            resolve(basicLocation);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get your location. Using default location.');
          setLocation(preferences.defaultLocation || DEFAULT_LOCATION);
          setIsLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 
        }
      );
    });
  };

  const updateLocation = (newLocation: UserLocation) => {
    setLocation(newLocation);
    const updatedPrefs = {
      ...preferences,
      currentLocation: newLocation
    };
    savePreferences(updatedPrefs);
  };

  const searchLocations = async (query: string): Promise<UserLocation[]> => {
    if (!query.trim()) return [];

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      
      const data = await response.json();
      
      return data.map((item: any) => ({
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        city: item.address?.city || item.address?.town || item.address?.village,
        country: item.address?.country,
        name: item.display_name
      }));
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  };

  const saveLocation = (location: UserLocation, name?: string) => {
    const locationWithName = { ...location, name: name || location.city || 'Saved Location' };
    const updatedLocations = [...preferences.savedLocations.filter(loc => 
      !(loc.latitude === location.latitude && loc.longitude === location.longitude)
    ), locationWithName];
    
    const updatedPrefs = {
      ...preferences,
      savedLocations: updatedLocations
    };
    savePreferences(updatedPrefs);
  };

  const removeLocation = (locationToRemove: UserLocation) => {
    const updatedLocations = preferences.savedLocations.filter(loc => 
      !(loc.latitude === locationToRemove.latitude && loc.longitude === locationToRemove.longitude)
    );
    
    const updatedPrefs = {
      ...preferences,
      savedLocations: updatedLocations
    };
    savePreferences(updatedPrefs);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      return {
        city: data.address?.city || data.address?.town || data.address?.village,
        country: data.address?.country,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {};
    }
  };

  return (
    <LocationContext.Provider value={{
      location,
      preferences,
      updateLocation,
      getCurrentLocation,
      searchLocations,
      saveLocation,
      removeLocation,
      isLoading,
      error
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
} 