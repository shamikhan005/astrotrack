export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  timezone?: string;
  name?: string; 
}

export interface LocationPreferences {
  currentLocation: UserLocation | null;
  savedLocations: UserLocation[];
  useGeolocation: boolean;
  defaultLocation?: UserLocation;
}

export interface GeolocationResponse {
  latitude: number;
  longitude: number;
  accuracy: number;
  city?: string;
  country?: string;
  timezone?: string;
}

export interface LocationSearchResult {
  id: string;
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
} 