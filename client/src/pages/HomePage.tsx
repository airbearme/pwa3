import React from 'react';
import { useAirbearSession } from '../hooks/use-airbear-session';

export default function HomePage() {
  const { user, role, signOut } = useAirbearSession();

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-700 to-emerald-500 p-10 text-white shadow-2xl shadow-cyan-500/30">
        <p className="uppercase tracking-[0.5em] text-xs text-cyan-200">AirBear Solar PWA</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
          Glide with AirBear, ride without a care.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-cyan-100">
          AirBear blends zero-emission rides, mobile bodegas, and holographic ambiance across Binghamton so every trip feels like a festival on wheels.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {user ? (
            <button
              onClick={() => signOut()}
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition hover:border-white"
            >
              Sign out
            </button>
          ) : (
            <p className="text-sm text-cyan-50">
              Sign in to unlock driver, passenger, or admin dashboards.
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Driver',
            description: 'Manage your solar AirBear, check inventory, and confirm rides with neon-hot precision.',
          },
          {
            title: 'Passenger',
            description: 'Book aesthetic rides, shop the onboard bodega, and track your eco-impact in real time.',
          },
          {
            title: 'Admin',
            description: 'Oversee revenue, analytics, and fleet telemetry while every metric pulses with AirBear glow.',
          },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-slate-900/60 bg-white/5 px-6 py-8 shadow-lg backdrop-blur"
          >
            <h3 className="text-2xl font-bold text-white">{card.title}</h3>
            <p className="mt-4 text-sm text-slate-200">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-cyan-500/40 bg-slate-900/70 p-8 text-white">
        <h2 className="text-2xl font-bold">Live in Binghamton</h2>
        <p className="mt-2 text-sm text-cyan-200">
          Tap a destination to see instant ETA/distance, glowing markers, and spinning AirBear emblems dancing through the town.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">ETA</p>
            <p className="text-3xl font-bold">4m</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Distance</p>
            <p className="text-3xl font-bold">1.2 mi</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Solar Charge</p>
            <p className="text-3xl font-bold">84%</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-300/40 bg-black/60 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.4em] text-amber-200">Promo</p>
        <h2 className="mt-3 text-3xl font-bold">CEO-signed $100 T-Shirt</h2>
        <p className="mt-2 text-sm text-amber-100">
          Get unlimited rides (one per day, non-transferable) plus instant VIP booking when you buy the tee. AirBear flair powers your commute.
        </p>
      </section>
    </div>
  );
}
