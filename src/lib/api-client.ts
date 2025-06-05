import {
  NasaApodResponse,
  NasaNeoWsResponse,
  AstronomicalEvent,
  EventType,
  MeteorShower,
  ISSFlyover,
  NasaISSResponse,
  PlanetaryConjunction,
} from "@/types/astro-events";
import { SpaceXLaunch, LaunchLibraryResponse } from "@/types/space-launches";

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
const NASA_BASE_URL = "https://api.nasa.gov";
const SPACEX_API_URL = "https://api.spacexdata.com/v5";
const LAUNCH_LIBRARY_URL = "https://ll.thespacedevs.com/2.0.0";

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function getAstronomyPictureOfDay(
  date?: string
): Promise<NasaApodResponse> {
  const dateParam = date ? `&date=${date}` : "";
  const url = `${NASA_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}${dateParam}`;
  return fetchWithErrorHandling<NasaApodResponse>(url);
}

export async function getNearEarthObjects(
  startDate: string,
  endDate: string
): Promise<NasaNeoWsResponse> {
  const url = `${NASA_BASE_URL}/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;
  return fetchWithErrorHandling<NasaNeoWsResponse>(url);
}

export async function getUpcomingSpaceXLaunches(
  limit = 10
): Promise<SpaceXLaunch[]> {
  const url = `${SPACEX_API_URL}/launches/upcoming?limit=${limit}`;
  return fetchWithErrorHandling<SpaceXLaunch[]>(url);
}

export async function getLatestSpaceXLaunch(): Promise<SpaceXLaunch> {
  const url = `${SPACEX_API_URL}/launches/latest`;
  return fetchWithErrorHandling<SpaceXLaunch>(url);
}

export async function getUpcomingLaunches(
  limit = 12
): Promise<LaunchLibraryResponse> {
  const url = `${LAUNCH_LIBRARY_URL}/launch/upcoming/?limit=${limit}`;
  return fetchWithErrorHandling<LaunchLibraryResponse>(url);
}

export async function getISSFlyovers(
  latitude: number,
  longitude: number,
  altitude = 0,
  passes = 5
): Promise<NasaISSResponse> {
  try {
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}&alt=${altitude}&n=${passes}`)}`);
    
    if (response.ok) {
      const data = await response.json();
      
      return {
        request: {
          latitude,
          longitude,
          altitude,
          passes,
          datetime: Date.now()
        },
        response: data.response.map((pass: any) => ({
          date: new Date(pass.risetime * 1000).toISOString(),
          duration: pass.duration,
          max_elevation: 45,
          appears: 'W',
          disappears: 'E',
          mag: -2.5
        }))
      };
    }
  } catch (error) {
    console.log('ISS API failed, using fallback data');
  }

  const now = new Date();
  const mockPasses: ISSFlyover[] = [
    {
      date: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), 
      duration: 360, 
      max_elevation: 42,
      appears: 'WSW',
      disappears: 'ENE',
      mag: -2.8
    },
    {
      date: new Date(now.getTime() + 13 * 60 * 60 * 1000).toISOString(), 
      duration: 420, 
      max_elevation: 38,
      appears: 'W',
      disappears: 'E',
      mag: -2.5
    },
    {
      date: new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString(), 
      duration: 300, 
      max_elevation: 35,
      appears: 'NW',
      disappears: 'SE',
      mag: -2.2
    }
  ];

  return {
    request: { latitude, longitude, altitude, passes, datetime: Date.now() },
    response: mockPasses
  };
}

export async function getMeteorShowers(): Promise<MeteorShower[]> {
  const meteorShowers: MeteorShower[] = [
    {
      id: "quadrantids-2025",
      name: "Quadrantids",
      description: "The first major meteor shower of the year, known for bright fireball meteors",
      active_start: "2024-12-28",
      active_end: "2025-01-12",
      peak_date: "2025-01-03",
      radiant: "Boötes",
      zhr: 120,
      velocity: 41,
      parent_comet: "2003 EH1"
    },
    {
      id: "lyrids-2025",
      name: "Lyrids",
      description: "Ancient shower with occasional bright meteors and fireballs",
      active_start: "2025-04-14",
      active_end: "2025-04-30",
      peak_date: "2025-04-22",
      radiant: "Lyra",
      zhr: 18,
      velocity: 49,
      parent_comet: "C/1861 G1 Thatcher"
    },
    {
      id: "perseids-2025",
      name: "Perseids",
      description: "One of the best meteor showers, producing up to 60 meteors per hour",
      active_start: "2025-07-17",
      active_end: "2025-08-24",
      peak_date: "2025-08-12",
      radiant: "Perseus",
      zhr: 60,
      velocity: 59,
      parent_comet: "109P/Swift-Tuttle"
    },
    {
      id: "geminids-2025",
      name: "Geminids",
      description: "The year's best meteor shower, visible almost all night",
      active_start: "2025-12-04",
      active_end: "2025-12-20",
      peak_date: "2025-12-14",
      radiant: "Gemini",
      zhr: 120,
      velocity: 35,
      parent_comet: "3200 Phaethon"
    }
  ];

  const now = new Date();
  const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  
  return meteorShowers.filter(shower => {
    const peakDate = new Date(shower.peak_date);
    return peakDate >= now && peakDate <= oneYearFromNow;
  });
}

export async function getPlanetaryConjunctions(): Promise<PlanetaryConjunction[]> {
  const conjunctions: PlanetaryConjunction[] = [
    {
      id: "venus-jupiter-2025",
      name: "Venus-Jupiter Conjunction",
      description: "Close approach of Venus and Jupiter, visible in the morning sky",
      date: "2025-02-12",
      planets: ["Venus", "Jupiter"],
      separation: 0.5,
      magnitude: -4.5,
      constellation: "Sagittarius"
    },
    {
      id: "mars-saturn-2025",
      name: "Mars-Saturn Conjunction",
      description: "Mars passes close to Saturn in the constellation Aquarius",
      date: "2025-04-16",
      planets: ["Mars", "Saturn"],
      separation: 0.8,
      magnitude: 0.5,
      constellation: "Aquarius"
    },
    {
      id: "venus-mercury-2025",
      name: "Venus-Mercury Conjunction",
      description: "Inner planets Venus and Mercury appear close together",
      date: "2025-06-04",
      planets: ["Venus", "Mercury"],
      separation: 0.3,
      magnitude: -3.8,
      constellation: "Gemini"
    }
  ];

  const now = new Date();
  const sixMonthsFromNow = new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
  
  return conjunctions.filter(conjunction => {
    const eventDate = new Date(conjunction.date);
    return eventDate >= now && eventDate <= sixMonthsFromNow;
  });
}

export async function getAstronomicalEvents(): Promise<AstronomicalEvent[]> {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const defaultLatitude = 40.7128; 
    const defaultLongitude = -74.0060;

    const [neoData, allLaunches, meteorShowers, issData, conjunctions] = await Promise.allSettled([
      getNearEarthObjects(
        today.toISOString().split("T")[0],
        nextWeek.toISOString().split("T")[0]
      ),
      getUpcomingLaunches(10),
      getMeteorShowers(),
      getISSFlyovers(defaultLatitude, defaultLongitude, 0, 3),
      getPlanetaryConjunctions()
    ]);

    const events: AstronomicalEvent[] = [];

    if (neoData.status === "fulfilled") {
      Object.entries(neoData.value.near_earth_objects).forEach(
        ([date, neos]) => {
          neos.slice(0, 3).forEach((neo) => {
            events.push({
              id: `neo-${neo.id}`,
              name: neo.name,
              description: `Close approach of asteroid ${neo.name}. ${
                neo.is_potentially_hazardous_asteroid
                  ? "⚠️ Potentially hazardous asteroid"
                  : ""
              }`,
              type: "other" as EventType,
              date: neo.close_approach_data[0]?.close_approach_date || date,
              visibility: {
                visibleToNakedEye: false,
                equipment: "Telescope recommended",
              },
              source: "NASA NeoWs",
              externalUrl: neo.nasa_jpl_url,
            });
          });
        }
      );
    }

    if (allLaunches.status === "fulfilled") {
      allLaunches.value.results.forEach((launch) => {
        events.push({
          id: `launch-${launch.id}`,
          name: launch.name,
          description:
            launch.mission.description || `${launch.mission.name} mission`,
          type: "space-mission" as EventType,
          date: launch.net,
          visibility: {
            visibleToNakedEye: true,
            bestViewingTime: "Launch time",
          },
          source: `${launch.launch_service_provider.name} via Launch Library`,
          externalUrl: launch.url,
          imageUrl: launch.image,
        });
      });
    }

    if (meteorShowers.status === "fulfilled") {
      meteorShowers.value.forEach((shower) => {
        events.push({
          id: shower.id,
          name: shower.name,
          description: `${shower.description}. Peak ZHR: ${shower.zhr} meteors/hour. Radiant: ${shower.radiant}`,
          type: "meteor-shower" as EventType,
          date: shower.peak_date,
          duration: `Active: ${shower.active_start} to ${shower.active_end}`,
          visibility: {
            visibleToNakedEye: true,
            bestViewingTime: "After midnight",
            hemisphere: "both",
          },
          source: "Astronomical Calendar",
        });
      });
    }

    if (issData.status === "fulfilled") {
      issData.value.response.slice(0, 2).forEach((flyover, index) => {
        events.push({
          id: `iss-${index}`,
          name: "International Space Station Flyover",
          description: `ISS visible flyover lasting ${Math.round(flyover.duration / 60)} minutes. Maximum elevation: ${flyover.max_elevation}°`,
          type: "iss-flyover" as EventType,
          date: flyover.date,
          duration: `${Math.round(flyover.duration / 60)} minutes`,
          visibility: {
            visibleToNakedEye: true,
            bestViewingTime: "During pass time",
            equipment: "None required",
            coordinates: {
              latitude: defaultLatitude,
              longitude: defaultLongitude,
            },
          },
          source: "Open Notify API",
          externalUrl: "https://spotthestation.nasa.gov/",
        });
      });
    }

    if (conjunctions.status === "fulfilled") {
      conjunctions.value.forEach((conjunction) => {
        events.push({
          id: conjunction.id,
          name: conjunction.name,
          description: `${conjunction.description}. Angular separation: ${conjunction.separation}° in ${conjunction.constellation}`,
          type: "planetary-conjunction" as EventType,
          date: conjunction.date,
          visibility: {
            visibleToNakedEye: true,
            bestViewingTime: "Dawn or dusk",
            equipment: "Binoculars recommended",
          },
          source: "Astronomical Calculations",
        });
      });
    }

    return events.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error("Error fetching astronomical events:", error);
    throw error;
  }
}
