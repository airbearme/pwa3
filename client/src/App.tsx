import React from 'react';
import { Link, Route, Switch } from 'wouter';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LiveMapPage from './pages/map';
import BodegaPage from './pages/bodega';
import CheckoutPage from './pages/checkout';
import ChallengesPage from './pages/challenges';
import RewardsPage from './pages/rewards';
import PromoPage from './pages/promo';
import { useAirbearSession } from './hooks/use-airbear-session';
import ProtectedView from './components/protected-view';
import PWAInstallButton from './components/pwa-install-button';

function App() {
  const { user, role, loading, signOut } = useAirbearSession();

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white md:px-12">
      <header className="mx-auto mb-10 flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 px-6 py-4 shadow-2xl shadow-cyan-500/20 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-300">AirBear</p>
          <h1 className="text-2xl font-bold">AirBear mobile bodega and solar powered rideshare</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em]">
          <Link className="transition hover:text-cyan-300" href="/">
            Home
          </Link>
          <Link className="transition hover:text-cyan-300" href="/map">
            Map
          </Link>
          <Link className="transition hover:text-cyan-300" href="/bodega">
            Bodega
          </Link>
          <Link className="transition hover:text-cyan-300" href={`/dashboard/${role ?? 'user'}`}>
            Dashboard
          </Link>
          {!user && (
            <Link className="transition hover:text-cyan-300" href="/login">
              Login
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {/* PWA Install Button */}
          <PWAInstallButton />
          
          <div className="text-xs tracking-[0.4em] text-cyan-200">
            <span>{role ? role.toUpperCase() : 'GUEST'}</span>
            {user && (
              <button
                onClick={() => signOut()}
                className="ml-3 rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.4em]"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8">
        {loading && (
          <div className="rounded-3xl border border-white/30 bg-white/5 p-4 text-center text-sm text-cyan-200">
            Syncing session...
          </div>
        )}
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/map" component={LiveMapPage} />
          <Route path="/bodega">
            {() => (
              <ProtectedView>
                <BodegaPage />
              </ProtectedView>
            )}
          </Route>
          <Route path="/checkout">
            {() => (
              <ProtectedView>
                <CheckoutPage />
              </ProtectedView>
            )}
          </Route>
          <Route path="/challenges">
            {() => (
              <ProtectedView>
                <ChallengesPage />
              </ProtectedView>
            )}
          </Route>
          <Route path="/rewards">
            {() => (
              <ProtectedView>
                <RewardsPage />
              </ProtectedView>
            )}
          </Route>
          <Route path="/promo">
            {() => (
              <ProtectedView>
                <PromoPage />
              </ProtectedView>
            )}
          </Route>
          <Route path="/login" component={LoginPage} />
          <Route path="/dashboard/:role">
            {() => (
              <ProtectedView>
                <DashboardPage />
              </ProtectedView>
            )}
          </Route>
          <Route path="*" component={HomePage} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
