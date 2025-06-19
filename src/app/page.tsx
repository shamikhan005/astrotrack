'use client';

import { useState } from 'react';
import AstronomicalEvents from '@/components/astronomical-events';
import LocationSettings from '@/components/location-settings';
import { AstronomicalEvent } from '@/types/astro-events';

export default function Home() {
  const [events, setEvents] = useState<AstronomicalEvent[]>([]);

  return (
    <main className="min-h-screen relative">
      <header className="header-modern sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-shadow" style={{ color: '#000000' }}>
                🌟 AstroTrack
              </h1>
            </div>
            <div className="flex gap-3">
              <LocationSettings />
            </div>
          </div>
        </div>
      </header>

      <section className="section-yellow py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="hero-title text-shadow">
            Discover the Universe
          </h1>
          <p className="hero-subtitle">
            Track astronomical events, space launches, and cosmic wonders happening around you
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="card-colorful card-teal">
              <div className="icon-container">
                ⭐
              </div>
              <h3 className="text-2xl font-bold mb-4">Meteor Showers</h3>
              <p className="text-lg opacity-90 mb-6">
                Watch shooting stars light up the night sky with perfect timing and location data.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tag-modern">Perseids</span>
                <span className="tag-modern">Geminids</span>
                <span className="tag-modern">Leonids</span>
              </div>
            </div>

            <div className="card-colorful card-red">
              <div className="icon-container">
                🚀
              </div>
              <h3 className="text-2xl font-bold mb-4">Space Missions</h3>
              <p className="text-lg opacity-90 mb-6">
                Follow rocket launches, satellite deployments, and historic space exploration missions.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tag-modern">SpaceX</span>
                <span className="tag-modern">NASA</span>
                <span className="tag-modern">Live</span>
              </div>
            </div>

            <div className="card-colorful card-blue">
              <div className="icon-container">
                🌒
              </div>
              <h3 className="text-2xl font-bold mb-4">Eclipses & Events</h3>
              <p className="text-lg opacity-90 mb-6">
                Never miss solar eclipses, lunar eclipses, and rare astronomical phenomena.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tag-modern">Solar</span>
                <span className="tag-modern">Lunar</span>
                <span className="tag-modern">Rare</span>
              </div>
            </div>

            <div className="card-colorful card-purple">
              <div className="icon-container">
                🪐
              </div>
              <h3 className="text-2xl font-bold mb-4">Planet Watching</h3>
              <p className="text-lg opacity-90 mb-6">
                Track planetary alignments, conjunctions, and optimal viewing times.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tag-modern">Jupiter</span>
                <span className="tag-modern">Saturn</span>
                <span className="tag-modern">Mars</span>
              </div>
            </div>

            <div className="card-colorful card-orange">
              <div className="icon-container">
                🛰️
              </div>
              <h3 className="text-2xl font-bold mb-4">ISS Tracking</h3>
              <p className="text-lg opacity-90 mb-6">
                Spot the International Space Station flying overhead with precise timing.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tag-modern">Flyovers</span>
                <span className="tag-modern">Visible</span>
                <span className="tag-modern">Real-time</span>
              </div>
            </div>

            <div className="card-colorful card-purple">
              <div className="icon-container">
                ☄️
              </div>
              <h3 className="text-2xl font-bold mb-4">Comets & Asteroids</h3>
              <p className="text-lg opacity-90 mb-6">
                Discover visiting comets and near-Earth objects on their cosmic journeys.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tag-modern">Halley</span>
                <span className="tag-modern">Near-Earth</span>
                <span className="tag-modern">Bright</span>
              </div>
            </div>
          </div>

          <button className="btn-colorful">
            🌌 Explore All Events
          </button>
        </div>
      </section>

      <section className="section-teal py-16 px-4">
        <div className="container mx-auto">
          <AstronomicalEvents onEventsChange={setEvents} />
        </div>
      </section>

      <footer className="section-purple py-12 px-4">
        <div className="container mx-auto text-center">
          <p className="text-lg font-medium" style={{ color: '#000000' }}>
            Made with 🌟 for space enthusiasts • Data from NASA, SpaceX & Launch Library
          </p>
        </div>
      </footer>
    </main>
  );
}
