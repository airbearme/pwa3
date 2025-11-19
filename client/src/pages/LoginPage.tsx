import React, { useMemo, useState } from 'react';
import { useAirbearSession } from '../hooks/use-airbear-session';
import { useLocation } from 'wouter';

const roleOptions = [
  { label: 'Passenger', value: 'user' },
  { label: 'Driver', value: 'driver' },
  { label: 'Admin', value: 'admin' },
] as const;

type AuthMode = 'signin' | 'signup';

export default function LoginPage() {
  const { signIn, signUp, loading, error, role: currentRole } = useAirbearSession();
  const [location, setLocation] = useLocation();
  const queryParams = useMemo(() => {
    const [, query = ''] = location.split('?');
    return new URLSearchParams(query);
  }, [location]);
  const redirectTarget = queryParams.get('redirect');
  const initialMode = queryParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<typeof roleOptions[number]['value']>('user');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === 'signin') {
      await signIn(email, password);
    } else {
      await signUp(email, password, role);
    }
    const resolvedRole = mode === 'signup' ? role : currentRole ?? 'user';
    const fallbackPath = `/dashboard/${resolvedRole}`;
    setLocation(redirectTarget ?? fallbackPath);
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-500/40">
      <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">AirBear Auth</p>
      <h1 className="mt-4 text-3xl font-bold text-white">Sign in or join the eco-circuit</h1>
      <div className="mt-4 flex gap-4">
        {(['signin', 'signup'] as AuthMode[]).map((candidate) => (
          <button
            key={candidate}
            onClick={() => setMode(candidate)}
            className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wider ${
              mode === candidate
                ? 'bg-cyan-500 text-white'
                : 'border border-white/20 text-slate-100'
            }`}
          >
            {candidate === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm text-cyan-200">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </label>

        <label className="block text-sm text-cyan-200">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </label>

        {mode === 'signup' && (
          <label className="block text-sm text-cyan-200">
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as typeof roleOptions[number]['value'])}
              className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-3 text-center text-sm font-semibold uppercase tracking-widest text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {mode === 'signin' ? 'Log in' : 'Create account'}
        </button>
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </form>

      <p className="mt-4 text-xs text-cyan-300">
        Signing up registers you for the AirBear end user agreement and unlocks $100 promo access when available.
      </p>
    </div>
  );
}
