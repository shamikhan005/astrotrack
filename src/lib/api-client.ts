import {
  NasaApodResponse,
  NasaNeoWsResponse,
  AstronomicalEvent,
  EventType,
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

export async function getAstronomicalEvents(): Promise<AstronomicalEvent[]> {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [neoData, allLaunches] = await Promise.allSettled([
      getNearEarthObjects(
        today.toISOString().split("T")[0],
        nextWeek.toISOString().split("T")[0]
      ),
      getUpcomingLaunches(10),
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

    return events.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error("Error fetching astronomical events:", error);
    throw error;
  }
}
