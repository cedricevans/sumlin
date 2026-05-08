import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Shuffle, AlertTriangle, CheckCircle, Plus, Trash2, Loader2, RotateCcw, Ticket } from 'lucide-react';
import { markTicketWinner, resetAllTicketWinners, getAdminSession } from '@/lib/sumlinData';
import { sumlinDb } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const BASKET_CONFIGS = [
  {
    key: "Men's BBQ Basket",
    label: "Men's BBQ Basket",
    emoji: '🔥',
    bg: 'bg-gradient-to-br from-orange-950 via-red-950 to-zinc-950',
    border: 'border-orange-500/40',
    accent: 'text-orange-400',
    badgeBg: 'bg-orange-500/20 text-orange-300',
    btnClass: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500',
    drumColor: 'text-orange-300',
    glowClass: 'shadow-orange-900/80',
  },
  {
    key: "Women's Spa Basket",
    label: "Women's Spa Basket",
    emoji: '💆‍♀️',
    bg: 'bg-gradient-to-br from-pink-950 via-purple-950 to-zinc-950',
    border: 'border-pink-500/40',
    accent: 'text-pink-400',
    badgeBg: 'bg-pink-500/20 text-pink-300',
    btnClass: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500',
    drumColor: 'text-pink-300',
    glowClass: 'shadow-pink-900/80',
  },
  {
    key: "Children's Fun Basket",
    label: "Children's Fun Basket",
    emoji: '🎉',
    bg: 'bg-gradient-to-br from-blue-950 via-indigo-950 to-zinc-950',
    border: 'border-blue-500/40',
    accent: 'text-blue-400',
    badgeBg: 'bg-blue-500/20 text-blue-300',
    btnClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
    drumColor: 'text-blue-300',
    glowClass: 'shadow-blue-900/80',
  },
];

function launchConfetti(canvasRef) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#f97316', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff', '#fbbf24'];
  const particles = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 100,
    vx: (Math.random() - 0.5) * 8,
    vy: Math.random() * 3 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    w: Math.random() * 10 + 4,
    h: Math.random() * 6 + 3,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 12,
    opacity: 1,
  }));

  let frame = 0;
  let rafId;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.rotation += p.rotSpeed;
      if (frame > 80) p.opacity -= 0.012;
      if (p.opacity <= 0) return;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 160) {
      rafId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
  return () => cancelAnimationFrame(rafId);
}

function DrumDisplay({ displayNum, isSpinning, config }) {
  const [tickKey, setTickKey] = useState(0);
  const prevNum = useRef(displayNum);

  useEffect(() => {
    if (displayNum !== prevNum.current) {
      setTickKey((k) => k + 1);
      prevNum.current = displayNum;
    }
  }, [displayNum]);

  return (
    <div className="relative h-28 overflow-hidden flex items-center justify-center bg-black/50 rounded-2xl border border-white/10 select-none">
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />

      {isSpinning && (
        <div className="absolute inset-0 flex flex-col items-center justify-between py-1 overflow-hidden opacity-30 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`text-lg font-mono font-bold ${config.drumColor}`}
              animate={{ y: [-20, 0, 20] }}
              transition={{ repeat: Infinity, duration: 0.15, ease: 'linear', delay: i * 0.03 }}
            >
              {Math.floor(Math.random() * 999) + 1}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence mode="popLayout">
        <motion.div
          key={tickKey}
          initial={{ y: isSpinning ? 30 : 0, opacity: isSpinning ? 0 : 1, scale: isSpinning ? 0.8 : 1 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: isSpinning ? -30 : 0, opacity: isSpinning ? 0 : 1, scale: isSpinning ? 0.8 : 1 }}
          transition={{ duration: isSpinning ? 0.07 : 0.4, type: isSpinning ? 'tween' : 'spring', bounce: 0.4 }}
          className={`text-6xl font-mono font-black z-20 ${config.drumColor}`}
        >
          {displayNum ?? <span className="text-white/20 text-5xl">- - -</span>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function BasketCard({ config, tickets, externalTickets, allDbTicketNumbers, drawing, winner, displayNum, onDraw, onReset }) {
  const pool = [...tickets, ...externalTickets];
  const isDrawing = drawing === config.key;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-3xl border ${config.border} ${config.bg} p-6 flex flex-col gap-4 shadow-2xl ${config.glowClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{config.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">{config.label}</h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badgeBg}`}>
              {pool.length} ticket{pool.length !== 1 ? 's' : ''} in pool
            </span>
          </div>
        </div>
        {winner && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-2 py-1 rounded-full"
          >
            <Trophy className="w-3 h-3" />
            Winner!
          </motion.div>
        )}
      </div>

      <DrumDisplay
        displayNum={winner ? winner.ticket_number : displayNum ?? null}
        isSpinning={isDrawing}
        config={config}
      />

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center"
          >
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-widest mb-1">Winner</p>
            <p className="text-white font-black text-2xl">#{winner.ticket_number}</p>
            <p className={`font-semibold text-lg mt-1 ${config.accent}`}>{winner.purchaser_name}</p>
            {winner.isExternal && (
              <span className="text-xs text-white/40 mt-1 block">External entry</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {pool.length === 0 ? (
        <div className="text-white/30 text-sm text-center py-2 italic">No tickets in pool for this basket</div>
      ) : winner ? (
        <button
          type="button"
          onClick={() => onReset(config.key)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Reset & Re-draw
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onDraw(config.key, pool)}
          disabled={isDrawing || pool.length === 0}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${config.btnClass} shadow-lg active:scale-95`}
        >
          {isDrawing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Drawing…
            </>
          ) : (
            <>
              <Shuffle className="w-5 h-5" />
              Draw Winner
            </>
          )}
        </button>
      )}

      <div className="border-t border-white/10 pt-3">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
          DB Tickets ({tickets.length})
        </p>
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
          {tickets.length === 0 && <span className="text-white/30 text-xs italic">None loaded</span>}
          {tickets.map((t) => (
            <span key={t.ticket_number} className={`text-xs px-1.5 py-0.5 rounded font-mono bg-white/10 ${config.accent}`}>
              #{t.ticket_number}
            </span>
          ))}
          {externalTickets.map((t) => (
            <span key={`ext-${t.ticket_number}`} className="text-xs px-1.5 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300">
              #{t.ticket_number} ✦
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function getAudioCtx(ref) {
  if (!ref.current) {
    ref.current = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ref.current.state === 'suspended') ref.current.resume();
  return ref.current;
}

function playTick(audioRef, volume = 0.25) {
  try {
    const ctx = getAudioCtx(audioRef);
    const bufSize = Math.floor(ctx.sampleRate * 0.04);
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch (_) {}
}

function playWinnerFanfare(audioRef) {
  try {
    const ctx = getAudioCtx(audioRef);
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    });

    // Drum hit on the final beat
    const bufSize = Math.floor(ctx.sampleRate * 0.3);
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06));
    }
    const drumSrc = ctx.createBufferSource();
    drumSrc.buffer = buffer;
    const drumGain = ctx.createGain();
    drumGain.gain.value = 0.5;
    drumSrc.connect(drumGain);
    drumGain.connect(ctx.destination);
    drumSrc.start(ctx.currentTime + notes.length * 0.13);
  } catch (_) {}
}

const EMPTY_EXT = { number: '', name: '', basket: BASKET_CONFIGS[0].key };

export default function RaffleDrawPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [ticketsByBasket, setTicketsByBasket] = useState({});
  const [allDbNums, setAllDbNums] = useState(new Set());

  const [testMode, setTestMode] = useState(false);
  const [allTicketsByBasket, setAllTicketsByBasket] = useState({});

  const [drawing, setDrawing] = useState(null);
  const [displayNums, setDisplayNums] = useState({});
  const [winners, setWinners] = useState({});

  const [resetting, setResetting] = useState(false);

  const [externalByBasket, setExternalByBasket] = useState({});
  const [extForm, setExtForm] = useState(EMPTY_EXT);
  const [extError, setExtError] = useState(null);
  const [extSuccess, setExtSuccess] = useState(null);

  useEffect(() => {
    getAdminSession().then((session) => {
      if (!session) {
        navigate('/admin');
      } else {
        setAuthed(true);
      }
      setAuthChecked(true);
    });
  }, [navigate]);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    const { data, error } = await sumlinDb.rpc('get_raffle_tickets', { target_slug: 'sumlin' });

    if (error || !data?.ok) {
      setLoadError(error?.message || data?.message || 'Failed to load tickets.');
      setLoading(false);
      return;
    }

    const rawTickets = data.tickets || [];
    const grouped = {};
    const allGrouped = {};
    const numSet = new Set();

    BASKET_CONFIGS.forEach((b) => { grouped[b.key] = []; allGrouped[b.key] = []; });

    const normalize = (s) => (s || '').replace(/[\u2018\u2019\u201A\u201B]/g, "'").trim();
    const winnersByBasket = {};

    rawTickets.forEach((t) => {
      numSet.add(Number(t.ticket_number));
      const basket = BASKET_CONFIGS.find((b) => normalize(b.key) === normalize(t.raffle_name));
      if (!basket) return;

      const entry = {
        ticket_number: Number(t.ticket_number),
        purchaser_name: t.purchaser_name || 'Unknown',
        isExternal: false,
      };

      allGrouped[basket.key].push(entry);

      if (t.status === 'winner') {
        winnersByBasket[basket.key] = entry;
      } else {
        grouped[basket.key].push(entry);
      }
    });

    setTicketsByBasket(grouped);
    setAllTicketsByBasket(allGrouped);
    setAllDbNums(numSet);
    setWinners(winnersByBasket);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadTickets();
  }, [authed, loadTickets]);

  const runDraw = useCallback((basketKey, pool) => {
    if (drawing || pool.length === 0) return;

    // In test mode draw from every ticket so no numbers are excluded
    const basePool = testMode ? (allTicketsByBasket[basketKey] || pool) : pool;

    // Exclude anyone who already won a different basket (1 win per person rule)
    const priorWinnerNames = new Set(
      Object.entries(winners)
        .filter(([key]) => key !== basketKey)
        .map(([, w]) => w?.purchaser_name)
        .filter(Boolean)
    );
    const activePool = basePool.filter((t) => !priorWinnerNames.has(t.purchaser_name));

    if (activePool.length === 0) {
      alert('All remaining tickets belong to people who already won a different basket.');
      return;
    }

    const winner = activePool[Math.floor(Math.random() * activePool.length)];
    setDrawing(basketKey);

    let tick = 0;

    const phases = [
      { count: 40, delay: 50 },
      { count: 12, delay: 120 },
      { count: 6, delay: 260 },
      { count: 3, delay: 480 },
    ];

    let phaseIdx = 0;
    let phaseCount = 0;

    function step() {
      const current = phases[phaseIdx];
      if (!current) {
        setDisplayNums((prev) => ({ ...prev, [basketKey]: winner.ticket_number }));
        setDrawing(null);

        const updated = { ...winner, isWinner: true };
        setWinners((prev) => ({ ...prev, [basketKey]: updated }));

        if (!winner.isExternal && !testMode) {
          markTicketWinner(winner.ticket_number);
        }

        launchConfetti(canvasRef);
        playWinnerFanfare(audioRef);
        return;
      }

      const rand = pool[Math.floor(Math.random() * pool.length)];
      setDisplayNums((prev) => ({ ...prev, [basketKey]: rand.ticket_number }));

      // Tick volume fades as animation slows
      const volumes = [0.15, 0.2, 0.28, 0.35];
      playTick(audioRef, volumes[phaseIdx] ?? 0.2);

      tick++;
      phaseCount++;

      if (phaseCount >= current.count) {
        phaseIdx++;
        phaseCount = 0;
      }

      setTimeout(step, current.delay);
    }

    step();
  }, [drawing, testMode, allTicketsByBasket]);

  const resetBasket = useCallback((basketKey) => {
    const prev = winners[basketKey];
    setWinners((p) => { const n = { ...p }; delete n[basketKey]; return n; });
    setDisplayNums((p) => ({ ...p, [basketKey]: null }));
    // Put the previous winner back in the active pool so every draw is fresh
    if (prev) {
      setTicketsByBasket((p) => ({
        ...p,
        [basketKey]: [...(p[basketKey] || []), { ...prev, isWinner: false }],
      }));
    }
  }, [winners]);

  const addExternalTicket = useCallback(() => {
    const num = parseInt(extForm.number, 10);
    if (!extForm.number || isNaN(num) || num < 1) {
      setExtError('Enter a valid ticket number.');
      return;
    }
    if (!extForm.name.trim()) {
      setExtError('Enter the ticket holder\'s name.');
      return;
    }

    if (allDbNums.has(num)) {
      setExtError(`Ticket #${num} already exists in the system. Please use a different number.`);
      return;
    }

    const existingExt = Object.values(externalByBasket).flat();
    if (existingExt.some((t) => t.ticket_number === num)) {
      setExtError(`Ticket #${num} has already been added as an external entry.`);
      return;
    }

    setExternalByBasket((prev) => ({
      ...prev,
      [extForm.basket]: [
        ...(prev[extForm.basket] || []),
        { ticket_number: num, purchaser_name: extForm.name.trim(), isExternal: true, isWinner: false },
      ],
    }));

    setExtError(null);
    setExtSuccess(`Ticket #${num} (${extForm.name.trim()}) added to ${extForm.basket}.`);
    setExtForm((prev) => ({ ...prev, number: '', name: '' }));
    setTimeout(() => setExtSuccess(null), 3500);
  }, [extForm, allDbNums, externalByBasket]);

  const removeExternalTicket = useCallback((basketKey, ticketNumber) => {
    setExternalByBasket((prev) => ({
      ...prev,
      [basketKey]: (prev[basketKey] || []).filter((t) => t.ticket_number !== ticketNumber),
    }));
  }, []);

  if (!authChecked) return null;

  return (
    <>
      <Helmet>
        <title>Raffle Draw | Sumlin Family Admin</title>
      </Helmet>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ width: '100vw', height: '100vh' }}
      />

      <div className="min-h-screen bg-zinc-950 pt-20 pb-16">
        <div className="container-custom max-w-6xl">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <Ticket className="w-4 h-4" />
              Admin — Live Raffle Draw
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-3">
              Raffle{' '}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Draw
              </span>
            </h1>
            <p className="text-white/50 text-lg">Sumlin Family Reunion 2026 · Select a winner for each basket</p>

            <button
              type="button"
              onClick={() => { setTestMode((v) => !v); setWinners({}); setDisplayNums({}); }}
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${
                testMode
                  ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                  : 'bg-white/5 border-white/20 text-white/40 hover:text-white/60'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${testMode ? 'bg-amber-400 animate-pulse' : 'bg-white/20'}`} />
              {testMode ? 'Test Mode ON — results not saved' : 'Test Mode OFF — results save to database'}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={loadTickets}
                disabled={loading}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                {loading ? 'Loading…' : 'Refresh Tickets'}
              </button>
              <button
                type="button"
                disabled={resetting}
                onClick={async () => {
                  setResetting(true);
                  await resetAllTicketWinners();
                  await loadTickets();
                  setWinners({});
                  setDisplayNums({});
                  setResetting(false);
                }}
                className="flex items-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors duration-200 disabled:opacity-50"
              >
                {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                {resetting ? 'Resetting…' : 'Reset All Winners'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="text-white/40 hover:text-white/70 text-sm transition-colors duration-200"
              >
                ← Back to Admin
              </button>
            </div>
          </motion.div>

          {loadError && (
            <div className="flex items-center gap-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-2xl p-4 mb-8">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>{loadError}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-white/40">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg">Loading ticket pool…</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {BASKET_CONFIGS.map((config) => (
                  <BasketCard
                    key={config.key}
                    config={config}
                    tickets={ticketsByBasket[config.key] || []}
                    externalTickets={externalByBasket[config.key] || []}
                    allDbTicketNumbers={allDbNums}
                    drawing={drawing}
                    winner={winners[config.key] || null}
                    displayNum={displayNums[config.key] ?? null}
                    onDraw={runDraw}
                    onReset={resetBasket}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900 border border-white/10 rounded-3xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-400" />
                  Add External Ticket
                </h2>
                <p className="text-white/40 text-sm mb-5">
                  Add a ticket sold outside the system. If the number already exists in the database, you will be alerted.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                  <input
                    type="number"
                    min="1"
                    placeholder="Ticket #"
                    value={extForm.number}
                    onChange={(e) => { setExtForm((p) => ({ ...p, number: e.target.value })); setExtError(null); }}
                    className="bg-zinc-800 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <input
                    type="text"
                    placeholder="Ticket holder's name"
                    value={extForm.name}
                    onChange={(e) => { setExtForm((p) => ({ ...p, name: e.target.value })); setExtError(null); }}
                    className="bg-zinc-800 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 sm:col-span-1"
                  />
                  <select
                    value={extForm.basket}
                    onChange={(e) => setExtForm((p) => ({ ...p, basket: e.target.value }))}
                    className="bg-zinc-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50"
                  >
                    {BASKET_CONFIGS.map((b) => (
                      <option key={b.key} value={b.key}>{b.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addExternalTicket}
                    className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors duration-200 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Pool
                  </button>
                </div>

                <AnimatePresence>
                  {extError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-xl px-4 py-3 text-sm mb-3"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {extError}
                    </motion.div>
                  )}
                  {extSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl px-4 py-3 text-sm mb-3"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      {extSuccess}
                    </motion.div>
                  )}
                </AnimatePresence>

                {Object.entries(externalByBasket).some(([, arr]) => arr.length > 0) && (
                  <div className="mt-2">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">External entries added ✦</p>
                    <div className="flex flex-col gap-2">
                      {BASKET_CONFIGS.map((b) =>
                        (externalByBasket[b.key] || []).map((t) => (
                          <div
                            key={`${b.key}-${t.ticket_number}`}
                            className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-amber-400 font-mono font-bold text-sm">#{t.ticket_number}</span>
                              <span className="text-white/70 text-sm">{t.purchaser_name}</span>
                              <span className="text-white/30 text-xs">{b.label}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExternalTicket(b.key, t.ticket_number)}
                              className="text-white/30 hover:text-rose-400 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
