export interface AstronomicalEvent {
  id: string;
  name: string;
  description: string;
  type: EventType;
  date: string;
  duration?: string;
  visibility?: VisibilityInfo;
  source: string;
  externalUrl?: string;
  imageUrl?: string;
}

export type EventType = 
  | 'meteor-shower' 
  | 'eclipse' 
  | 'planetary-alignment' 
  | 'space-mission' 
  | 'planet-observation' 
  | 'comet'
  | 'iss-flyover'
  | 'planetary-conjunction'
  | 'other';

export interface VisibilityInfo {
  hemisphere?: 'northern' | 'southern' | 'both';
  bestViewingTime?: string;
  visibleToNakedEye: boolean;
  equipment?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface NasaApodResponse {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
}

export interface NasaNeoWsResponse {
  links: {
    next?: string;
    prev?: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: NearEarthObject[];
  };
}

export interface NearEarthObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: DiameterRange;
    meters: DiameterRange;
    miles: DiameterRange;
    feet: DiameterRange;
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  orbital_data: OrbitalData;
}

export interface DiameterRange {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

export interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface OrbitalData {
  orbit_id: string;
  orbit_determination_date: string;
  first_observation_date: string;
  last_observation_date: string;
  data_arc_in_days: number;
  observations_used: number;
  orbit_uncertainty: string;
  minimum_orbit_intersection: string;
  jupiter_tisserand_invariant: string;
  epoch_osculation: string;
  eccentricity: string;
  semi_major_axis: string;
  inclination: string;
  ascending_node_longitude: string;
  orbital_period: string;
  perihelion_distance: string;
  perihelion_argument: string;
  aphelion_distance: string;
  perihelion_time: string;
  mean_anomaly: string;
  mean_motion: string;
  equinox: string;
}

export interface MeteorShower {
  id: string;
  name: string;
  description: string;
  active_start: string;
  active_end: string;
  peak_date: string;
  radiant: string;
  zhr: number; 
  velocity: number; 
  parent_comet?: string;
}

export interface ISSFlyover {
  date: string;
  duration: number;
  max_elevation: number; 
  appears: string; 
  disappears: string; 
  mag: number; 
}

export interface PlanetaryConjunction {
  id: string;
  name: string;
  description: string;
  date: string;
  planets: string[];
  separation: number;
  magnitude?: number;
  constellation?: string;
}

export interface NasaISSResponse {
  request: {
    latitude: number;
    longitude: number;
    altitude: number;
    passes: number;
    datetime: number;
  };
  response: ISSFlyover[];
}
