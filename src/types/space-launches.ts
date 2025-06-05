export interface SpaceXLaunch {
  id: string;
  flight_number: number;
  name: string;
  date_utc: string;
  date_unix: number;
  date_local: string;
  date_precision: 'half' | 'quarter' | 'year' | 'month' | 'day' | 'hour';
  upcoming: boolean;
  cores: Core[];
  auto_update: boolean;
  tbd: boolean;
  launch_library_id?: string;
  rocket: string;
  success?: boolean;
  failures: Failure[];
  details?: string;
  crew: string[];
  ships: string[];
  capsules: string[];
  payloads: string[];
  launchpad: string;
  links: LaunchLinks;
  static_fire_date_utc?: string;
  static_fire_date_unix?: number;
  net: boolean;
  window: number;
}

export interface Core {
  core?: string;
  flight?: number;
  gridfins?: boolean;
  legs?: boolean;
  reused?: boolean;
  landing_attempt?: boolean;
  landing_success?: boolean;
  landing_type?: string;
  landpad?: string;
}

export interface Failure {
  time: number;
  altitude?: number;
  reason: string;
}

export interface LaunchLinks {
  patch: {
    small?: string;
    large?: string;
  };
  reddit: {
    campaign?: string;
    launch?: string;
    media?: string;
    recovery?: string;
  };
  flickr: {
    small: string[];
    original: string[];
  };
  presskit?: string;
  webcast?: string;
  youtube_id?: string;
  article?: string;
  wikipedia?: string;
}

export interface LaunchLibraryResponse {
  count: number;
  next?: string;
  previous?: string;
  results: LaunchLibraryLaunch[];
}

export interface LaunchLibraryLaunch {
  id: string;
  url: string;
  slug: string;
  name: string;
  status: LaunchStatus;
  net: string;
  window_end: string;
  window_start: string;
  inhold: boolean;
  tbdtime: boolean;
  tbddate: boolean;
  probability?: number;
  launch_service_provider: LaunchServiceProvider;
  rocket: Rocket;
  mission: Mission;
  pad: Pad;
  webcast_live: boolean;
  image: string;
  infographic?: string;
  program: Program[];
}

export interface LaunchStatus {
  id: number;
  name: string;
}

export interface LaunchServiceProvider {
  id: number;
  url: string;
  name: string;
  type: string;
}

export interface Rocket {
  id: number;
  configuration: RocketConfiguration;
}

export interface RocketConfiguration {
  id: number;
  launch_library_id?: number;
  url: string;
  name: string;
  family: string;
  full_name: string;
  variant: string;
}

export interface Mission {
  id: number;
  launch_library_id?: number;
  name: string;
  description: string;
  launch_designator?: string;
  type: string;
  orbit: Orbit;
}

export interface Orbit {
  id: number;
  name: string;
  abbrev: string;
}

export interface Pad {
  id: number;
  url: string;
  agency_id?: number;
  name: string;
  info_url?: string;
  wiki_url?: string;
  map_url: string;
  latitude: string;
  longitude: string;
  location: Location;
  map_image: string;
  total_launch_count: number;
}

export interface Location {
  id: number;
  url: string;
  name: string;
  country_code: string;
  map_image: string;
  total_launch_count: number;
  total_landing_count: number;
}

export interface Program {
  id: number;
  url: string;
  name: string;
  description: string;
  agencies: LaunchServiceProvider[];
  image_url: string;
  start_date: string;
  end_date?: string;
  info_url: string;
  wiki_url: string;
} 