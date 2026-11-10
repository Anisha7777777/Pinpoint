import { useEffect, useState } from 'react';

type HealthState = 'checking' | 'online' | 'offline';
export function ApiHealth() {
  const [state, setState] = useState<HealthState>('checking');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState('checking');
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    fetch('/api/health', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Health request failed');
        const body: unknown = await response.json();
        if (typeof body !== 'object' || body === null || !('status' in body) || body.status !== 'ok' || !('service' in body) || body.service !== 'pinpoint-api') throw new Error('Unexpected response');
        if (active) setState('online');
      })
      .catch(() => { if (active) setState('offline'); })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [attempt]);
  return <div className="health"><span role="status"><span className={`dot ${state}`} />{state === 'checking' ? 'Checking API…' : state === 'online' ? 'API connected' : 'API unavailable'}</span><button onClick={() => setAttempt(value => value + 1)} disabled={state === 'checking'} aria-label="Refresh API health">Refresh</button></div>;
}
