import React from 'react';
import { useAirbearSession } from '../hooks/use-airbear-session';
import { useRoute } from 'wouter';

const roleCTA: Record<string, string> = {
  admin: 'Monitor the fleet, analytics, and revenue streams.',
  driver: 'Control AirBear inventory, pickup routes, and ride requests.',
  user: 'Book rides, browse mobile bodega, and collect eco-badges.',
};

export default function DashboardPage() {
  const { user, role } = useAirbearSession();
  const [, params] = useRoute('/dashboard/:role');
  const urlRole = params?.role;

  const badge = role ? role.toUpperCase() : 'GUEST';
  const message = roleCTA[urlRole ?? role ?? 'user'] ?? roleCTA.user;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gradient-to-r bg-white/5 p-8 shadow-xl shadow-indigo-500/20">
        <p className="text-xs tracking-[0.3em] text-cyan-300">AirBear Dashboard</p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          {badge} View
        </h1>
        <p className="mt-2 text-sm text-slate-200">{message}</p>
        {user && (
          <div className="mt-5 rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm text-cyan-100">
            Logged in as <span className="font-semibold">{user.email}</span>
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Live ETA</p>
          <p className="text-2xl font-bold text-white">4m</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Battery</p>
          <p className="text-2xl font-bold text-white">84%</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Inventory</p>
          <p className="text-2xl font-bold text-white">Ready</p>
        </article>
      </section>

      <section className="rounded-3xl border border-fuchsia-500/40 bg-slate-900 p-6 text-sm text-slate-200">
        <p className="font-semibold uppercase tracking-[0.3em] text-fuchsia-300">Special Effects Feed</p>
        <p className="mt-3 text-xs text-slate-300">
          Visualize spinning AirBear wheels, prism sun rays, plasma glows, and floating leaf swarms synced to the ride pulse.
        </p>
      </section>
    </div>
  );
}
