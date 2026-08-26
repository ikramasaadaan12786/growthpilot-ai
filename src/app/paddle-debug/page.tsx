'use client';

import React, { useState, useEffect } from 'react';

export default function PaddleDebugPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [paddleReady, setPaddleReady] = useState(false);
  const [txnInfo, setTxnInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [clientTokenValue, setClientTokenValue] = useState('');
  const [isMasked, setIsMasked] = useState(false);
  const [paddleEnv, setPaddleEnv] = useState('');

  const addEvent = (name: string, data?: any) => {
    const entry = {
      timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
      name,
      data: data ? JSON.stringify(data) : null
    };
    console.log(`[PADDLE DEBUG] [${entry.timestamp}] ${name}`, data || '');
    setEvents((prev) => [entry, ...prev]);
  };

  useEffect(() => {
    const env = process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox';
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';
    setPaddleEnv(env);
    setClientTokenValue(token);
    const masked = token.startsWith('*') || token.includes('****');
    setIsMasked(masked);

    console.log('[PADDLE_DIAGNOSTICS]', {
      environment: env,
      tokenLength: token.length,
      tokenIsMasked: masked,
      tokenPrefix: token ? token.substring(0, 5) + '...' : 'NONE',
      hostname: window.location.hostname
    });

    const checkPaddle = setInterval(() => {
      if ((window as any).Paddle) {
        clearInterval(checkPaddle);
        setPaddleReady(true);
        addEvent('SDK loaded (window.Paddle available)');

        try {
          const paddle = (window as any).Paddle;
          if (env === 'sandbox') {
            paddle.Environment.set('sandbox');
            addEvent('Environment set to sandbox');
          }

          if (masked) {
            addEvent('CRITICAL ERROR: Token is masked with asterisks (e.g. "****4e38f"). Paddle cannot authenticate.');
          } else if (token) {
            paddle.Initialize({
              token,
              eventCallback: (event: any) => {
                addEvent(`EVENT: ${event?.name}`, event?.data || event);
              }
            });
            addEvent('Paddle.Initialize called successfully with token: ' + token.substring(0, 8) + '...');
          } else {
            addEvent('WARNING: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is empty');
          }
        } catch (e: any) {
          addEvent('ERROR initializing Paddle', { message: e.message });
        }
      }
    }, 200);

    return () => clearInterval(checkPaddle);
  }, []);

  // Approach A: Client-side checkout via items (Official Paddle Billing v2 client checkout)
  const handleClientSideCheckout = () => {
    try {
      addEvent('Testing Approach A: Client-side checkout with items');
      const paddle = (window as any).Paddle;
      if (!paddle) {
        addEvent('ERROR: window.Paddle not found');
        return;
      }

      paddle.Checkout.open({
        items: [
          {
            priceId: 'pri_01m0xf06rqdrgr6n3tz992zamx',
            quantity: 1
          }
        ],
        settings: {
          displayMode: 'overlay',
          theme: 'dark',
          locale: 'en'
        }
      });
      addEvent('Paddle.Checkout.open(items) dispatched');
    } catch (e: any) {
      addEvent('ERROR in handleClientSideCheckout', { message: e.message });
    }
  };

  // Approach B: Server-created transaction checkout
  const handleServerTransactionCheckout = async () => {
    setLoading(true);
    try {
      addEvent('Testing Approach B: Requesting server transaction');
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'PRO' })
      });

      const data = await res.json();
      addEvent(`Server response (status ${res.status})`, data);
      setTxnInfo(data);

      if (data.transactionId) {
        const paddle = (window as any).Paddle;
        if (paddle) {
          addEvent('Opening overlay with transactionId: ' + data.transactionId);
          paddle.Checkout.open({
            transactionId: data.transactionId,
            settings: {
              displayMode: 'overlay',
              theme: 'dark',
              locale: 'en'
            }
          });
          addEvent('Paddle.Checkout.open(transactionId) dispatched');
        } else {
          addEvent('ERROR: window.Paddle not available to open transaction');
        }
      }
    } catch (e: any) {
      addEvent('ERROR in handleServerTransactionCheckout', { message: e.message });
    } finally {
      setLoading(false);
    }
  };

  // Approach C: Direct Hosted Checkout URL
  const handleDirectUrlCheckout = async () => {
    setLoading(true);
    try {
      addEvent('Testing Approach C: Direct Hosted URL');
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'PRO' })
      });
      const data = await res.json();
      if (data.url) {
        addEvent('Navigating to direct URL: ' + data.url);
        window.location.href = data.url;
      }
    } catch (e: any) {
      addEvent('ERROR in handleDirectUrlCheckout', { message: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Paddle Sandbox Real-Time Debugger</h1>
        <p className="text-sm text-slate-400">
          Direct testbed for isolating Paddle.js client initialization, overlay rendering, and transaction flows.
        </p>
      </div>

      {isMasked && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm space-y-1">
          <div className="font-bold flex items-center gap-2 text-rose-200">
            <span>⚠</span> ROOT CAUSE DETECTED: Masked Client-Side Token in Vercel
          </div>
          <p>
            Your <code className="bg-rose-950 px-1 py-0.5 rounded text-xs text-rose-200">NEXT_PUBLIC_PADDLE_CLIENT_TOKEN</code> is set to the masked value{' '}
            <code className="bg-rose-950 px-1 py-0.5 rounded text-xs text-rose-200 font-mono">"{clientTokenValue}"</code> instead of the real unmasked token.
          </p>
          <p className="text-xs text-rose-300/80">
            Go to <strong>Paddle Sandbox Dashboard → Developer Tools → Authentication → Client-side tokens</strong>, copy the full unmasked <code className="text-rose-200">test_...</code> token, and update it in Vercel Environment Variables.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Paddle.js SDK</span>
          <div className="text-lg font-bold text-white">
            {paddleReady ? <span className="text-emerald-400">● Loaded</span> : <span className="text-amber-400">○ Loading...</span>}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Environment</span>
          <div className="text-lg font-bold text-sky-400 uppercase">{paddleEnv || 'sandbox'}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Client Token Status</span>
          <div className="text-lg font-mono font-bold">
            {isMasked ? (
              <span className="text-rose-400">MASKED ({clientTokenValue})</span>
            ) : clientTokenValue ? (
              <span className="text-emerald-400">{clientTokenValue.substring(0, 8)}...</span>
            ) : (
              <span className="text-amber-400">MISSING</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Test Triggers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleClientSideCheckout}
            disabled={!paddleReady}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg shadow-sm transition text-left"
          >
            <div className="font-bold text-sm">Approach A: Client Items</div>
            <div className="text-xs text-indigo-200 mt-1">Direct items: [pri_PRO]</div>
          </button>

          <button
            onClick={handleServerTransactionCheckout}
            disabled={loading || !paddleReady}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-lg shadow-sm transition text-left"
          >
            <div className="font-bold text-sm">Approach B: Server Txn</div>
            <div className="text-xs text-emerald-200 mt-1">Overlay with txn_id</div>
          </button>

          <button
            onClick={handleDirectUrlCheckout}
            disabled={loading}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium rounded-lg shadow-sm transition text-left"
          >
            <div className="font-bold text-sm">Approach C: Direct URL</div>
            <div className="text-xs text-purple-200 mt-1">Navigate to checkout.url</div>
          </button>
        </div>

        {txnInfo && (
          <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
            <div><strong>Transaction ID:</strong> {txnInfo.transactionId || 'None'}</div>
            <div><strong>Checkout URL:</strong> {txnInfo.url || 'None'}</div>
            <div><strong>Price ID:</strong> {txnInfo.priceId || 'None'}</div>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Paddle Event Stream</h2>
          <button
            onClick={() => setEvents([])}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Clear Log
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 h-64 overflow-y-auto space-y-2 font-mono text-xs">
          {events.length === 0 ? (
            <div className="text-slate-500 italic">No events captured yet. Click a test trigger above.</div>
          ) : (
            events.map((ev, i) => (
              <div key={i} className="border-b border-slate-900 pb-1">
                <span className="text-slate-500">[{ev.timestamp}]</span>{' '}
                <span className={ev.name.includes('ERROR') ? 'text-rose-400 font-bold' : ev.name.includes('EVENT') ? 'text-amber-300' : 'text-emerald-400'}>
                  {ev.name}
                </span>
                {ev.data && <pre className="text-slate-400 text-[11px] mt-0.5 whitespace-pre-wrap">{ev.data}</pre>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
