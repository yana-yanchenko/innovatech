'use client';

import React from 'react';

interface SproutAnimationProps {
  progress: number;
  color?: string;
}

// Плавный под-прогресс: маппит глобальный progress в локальный 0..1 на отрезке [a, b].
const sub = (p: number, a: number, b: number) =>
  Math.max(0, Math.min(1, (p - a) / (b - a)));

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Монохромная палитра sage-teal (как в референсе).
const SAGE = '#84aa9b';
const SAGE_DARK = '#557f72';
const SAGE_LIGHT = '#bcd5cb';

// Силуэт ланцетного листа (единичный), основание в (0,0), кончик вдоль +x.
const LANCE = 'M0 0 C 11 -5, 28 -6, 42 -2 C 28 2.5, 12 4.5, 0 0 Z';
const LANCE_MIDRIB = 'M2 0 C 16 -2, 30 -3, 40 -2.4';
const LANCE_VEINS = [
  'M9 -1 L 14 -4',
  'M17 -2 L 23 -4.6',
  'M25 -2.4 L 31 -4.4',
  'M32 -2.4 L 37 -3.8',
];
const LANCE_DEW: [number, number, number][] = [
  [19, -3, 0.9],
  [27, -2, 0.8],
  [33, -3.4, 0.7],
];

// Лепесток лотоса (единичный), основание в (0,0), кончик вверх (-y).
const PETAL = 'M0 0 C -4.5 -9, -3 -21, 0 -27 C 3 -21, 4.5 -9, 0 0 Z';

// Бутон-капля (единичный), основание в (0,0), вдоль +x.
const BUD = 'M0 0 C 3 -2.6, 8 -2.2, 10.5 0 C 8 2.2, 3 2.6, 0 0 Z';

// Корневая система — мелкая, тонкая, симметричная, компактным веером; кончики затухают через градиент.
const ROOTS: { d: string; w: number; delay: number; op: number }[] = [
  // центральный стержневой корень
  { d: 'M100 135 C 99 140, 100 146, 100 153', w: 0.8, delay: 0, op: 1 },
  // внутренние почти вертикальные
  { d: 'M100 136 C 98 141, 96 147, 95 153', w: 0.5, delay: 0.03, op: 0.95 },
  { d: 'M100 136 C 102 141, 104 147, 105 153', w: 0.5, delay: 0.03, op: 0.95 },
  // средние боковые
  { d: 'M100 136 C 96 140, 93 145, 91 151', w: 0.45, delay: 0.05, op: 0.9 },
  { d: 'M100 136 C 104 140, 107 145, 109 151', w: 0.45, delay: 0.05, op: 0.9 },
  // внешние боковые (узкий веер)
  { d: 'M100 135 C 95 139, 91 143, 88 149', w: 0.38, delay: 0.08, op: 0.8 },
  { d: 'M100 135 C 105 139, 109 143, 112 149', w: 0.38, delay: 0.08, op: 0.8 },
  // тонкие волоски
  { d: 'M94 145 C 93 147, 92 149, 92 152', w: 0.26, delay: 0.11, op: 0.6 },
  { d: 'M106 145 C 107 147, 108 149, 108 152', w: 0.26, delay: 0.11, op: 0.6 },
];

const STEM_D = 'M100 135 C 99 110, 101 78, 100 44';

type LeafCfg = {
  id: string;
  ax: number;
  ay: number;
  len: number;
  fold: number;
  open: number;
  start: number;
  span: number;
};

// start-тайминги привязаны к высоте крепления: нижние листья раскрываются раньше — рост идёт снизу вверх.
const LEAVES: LeafCfg[] = [
  { id: 'lf-low-l', ax: 100, ay: 124, len: 0.66, fold: -98, open: -148, start: 0.14, span: 0.26 },
  { id: 'lf-low-r', ax: 100, ay: 117, len: 0.6, fold: -82, open: -38, start: 0.2, span: 0.26 },
  { id: 'lf-mid-l', ax: 100, ay: 103, len: 1.15, fold: -98, open: -150, start: 0.3, span: 0.3 },
  { id: 'lf-up-r', ax: 100, ay: 80, len: 1.2, fold: -82, open: -32, start: 0.44, span: 0.3 },
];

type BudCfg = { id: string; ax: number; ay: number; ang: number; len: number; start: number };

const BUDS: BudCfg[] = [
  { id: 'bud-low', ax: 100, ay: 137, ang: -122, len: 0.85, start: 0.12 },
  { id: 'bud-r', ax: 100, ay: 119, ang: -42, len: 0.95, start: 0.22 },
  { id: 'bud-l', ax: 100, ay: 98, ang: -140, len: 0.95, start: 0.36 },
  { id: 'bud-top', ax: 100, ay: 60, ang: -46, len: 0.85, start: 0.52 },
];

const PETAL_ROWS = [
  { angles: [-78, -52, -27, 0, 27, 52, 78], scale: 1.06, opacity: 0.38, fill: 'url(#petalPale)' },
  { angles: [-46, -22, 0, 22, 46], scale: 0.92, opacity: 0.58, fill: 'url(#petalLight)' },
  { angles: [-16, 0, 16], scale: 0.6, opacity: 0.72, fill: 'url(#petalLight)' },
];

const PARTICLES = [
  { left: '40%', top: '54%', size: 3, dur: '8s', delay: '0s' },
  { left: '58%', top: '44%', size: 2.5, dur: '9.5s', delay: '1.4s' },
  { left: '50%', top: '34%', size: 3.5, dur: '8.5s', delay: '0.7s' },
  { left: '46%', top: '64%', size: 2.5, dur: '10s', delay: '2.3s' },
  { left: '62%', top: '58%', size: 3, dur: '9s', delay: '3.1s' },
];

function Leaf({ cfg, p }: { cfg: LeafCfg; p: number }) {
  const s = easeOut(sub(p, cfg.start, cfg.start + cfg.span));
  if (s <= 0.001) return null;
  const angle = lerp(cfg.fold, cfg.open, s);
  const scale = s * cfg.len;
  return (
    <g
      transform={`translate(${cfg.ax} ${cfg.ay}) rotate(${angle}) scale(${scale})`}
      style={{ opacity: Math.min(1, s * 1.6) }}
    >
      <path d={LANCE} fill="url(#leafGrad)" stroke={SAGE_DARK} strokeWidth={0.4} strokeOpacity={0.4} />
      <path d={LANCE_MIDRIB} fill="none" stroke={SAGE_DARK} strokeWidth={0.45} strokeOpacity={0.55} strokeLinecap="round" />
      {LANCE_VEINS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={SAGE_DARK} strokeWidth={0.3} strokeOpacity={0.4} strokeLinecap="round" />
      ))}
      {LANCE_DEW.map(([dx, dy, r], i) => (
        <circle key={i} cx={dx} cy={dy} r={r} fill="#ffffff" opacity={0.7} />
      ))}
    </g>
  );
}

function Bud({ cfg, p }: { cfg: BudCfg; p: number }) {
  const s = easeOut(sub(p, cfg.start, cfg.start + 0.26));
  if (s <= 0.001) return null;
  const stalk = 9 * cfg.len;
  return (
    <g
      transform={`translate(${cfg.ax} ${cfg.ay}) rotate(${cfg.ang}) scale(${s * cfg.len})`}
      style={{ opacity: Math.min(1, s * 1.8) }}
    >
      <path d={`M0 0 L ${stalk} 0`} stroke={SAGE_DARK} strokeWidth={0.7} strokeOpacity={0.55} strokeLinecap="round" />
      <g transform={`translate(${stalk} 0)`}>
        <path d={BUD} fill="url(#budGrad)" stroke={SAGE_DARK} strokeWidth={0.4} strokeOpacity={0.5} />
        <path d="M2 0 L 9 0" stroke={SAGE_DARK} strokeWidth={0.3} strokeOpacity={0.4} strokeLinecap="round" />
      </g>
    </g>
  );
}

export default function SproutAnimation({ progress }: SproutAnimationProps) {
  const p = Math.max(0, Math.min(1, progress));

  // Стебель тянется вверх на протяжении почти всего роста, корни — вниз параллельно, цветок раскрывается последним.
  const stemGrow = easeInOut(sub(p, 0.05, 0.62));
  const rootBase = sub(p, 0, 0.55);
  const bloomT = easeOut(sub(p, 0.64, 1));
  const particlesOpacity = sub(p, 0.55, 0.9);

  return (
    <div className="w-full h-full relative flex items-center justify-center rounded-[2rem] overflow-hidden">
      <style>{`
        @keyframes sproutSway { 0%,100% { transform: rotate(-0.9deg); } 50% { transform: rotate(0.9deg); } }
        @keyframes sproutDrift {
          0% { transform: translateY(6px); opacity: 0; }
          30% { opacity: 0.8; }
          70% { opacity: 0.5; }
          100% { transform: translateY(-40px); opacity: 0; }
        }
        .sprout-sway { animation: sproutSway 7s ease-in-out infinite; transform-box: view-box; transform-origin: 100px 135px; }
        .sprout-particle { animation-name: sproutDrift; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sprout-sway { animation: none; }
          .sprout-particle { animation: none; opacity: 0.4; }
        }
      `}</style>

      <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="glassGrad" cx="42%" cy="34%" r="68%">
            <stop offset="0%" stopColor="#f2f7f5" stopOpacity="0.55" />
            <stop offset="60%" stopColor={SAGE_LIGHT} stopOpacity="0.18" />
            <stop offset="100%" stopColor={SAGE} stopOpacity="0.1" />
          </radialGradient>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={SAGE} stopOpacity="0.7" />
            <stop offset="100%" stopColor={SAGE_LIGHT} stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="budGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={SAGE} stopOpacity="0.75" />
            <stop offset="100%" stopColor={SAGE_LIGHT} stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="stemGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={SAGE_DARK} />
            <stop offset="100%" stopColor={SAGE} />
          </linearGradient>
          <radialGradient id="petalLight" cx="50%" cy="90%" r="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor={SAGE} stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="petalPale" cx="50%" cy="90%" r="80%">
            <stop offset="0%" stopColor={SAGE_LIGHT} stopOpacity="0.7" />
            <stop offset="100%" stopColor={SAGE} stopOpacity="0.45" />
          </radialGradient>
          <radialGradient id="soilGrad" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor={SAGE_LIGHT} stopOpacity="0.55" />
            <stop offset="100%" stopColor={SAGE} stopOpacity="0.4" />
          </radialGradient>
          <linearGradient id="rootFade" gradientUnits="userSpaceOnUse" x1="0" y1="133" x2="0" y2="154">
            <stop offset="0%" stopColor={SAGE} stopOpacity="0.6" />
            <stop offset="55%" stopColor={SAGE} stopOpacity="0.4" />
            <stop offset="100%" stopColor={SAGE} stopOpacity="0" />
          </linearGradient>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Стеклянная сфера (статичная — растёт только растение) */}
        <g>
          <ellipse cx="100" cy="100" rx="78" ry="94" fill="url(#glassGrad)" />
          <ellipse cx="100" cy="120" rx="74" ry="86" fill={SAGE_DARK} opacity="0.05" filter="url(#soft)" />
          <ellipse cx="100" cy="100" rx="78" ry="94" fill="none" stroke={SAGE_LIGHT} strokeWidth="0.8" strokeOpacity="0.45" />
        </g>

        {/* Корни (растут вниз) */}
        <g>
          {ROOTS.map((r, i) => {
            const g = easeInOut(sub(p, r.delay, 0.5 + r.delay));
            if (g <= 0.001) return null;
            return (
              <path
                key={i}
                d={r.d}
                fill="none"
                stroke="url(#rootFade)"
                strokeWidth={r.w}
                strokeOpacity={r.op}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - g}
              />
            );
          })}
        </g>

        {/* Контактная тень + диск-земля */}
        <ellipse cx="100" cy="139" rx={40 + rootBase * 18} ry="5" fill={SAGE_DARK} opacity="0.1" filter="url(#soft)" />
        <g>
          <ellipse cx="100" cy="135" rx="58" ry="11" fill="url(#soilGrad)" />
          <ellipse cx="100" cy="132.5" rx="58" ry="11" fill="none" stroke={SAGE_LIGHT} strokeWidth="0.7" strokeOpacity="0.6" />
          <ellipse cx="84" cy="134" rx="3.2" ry="1.5" fill={SAGE_DARK} opacity="0.28" />
          <ellipse cx="96" cy="136.5" rx="2.4" ry="1.2" fill={SAGE_DARK} opacity="0.24" />
          <ellipse cx="112" cy="134.5" rx="3" ry="1.4" fill={SAGE_DARK} opacity="0.26" />
          <ellipse cx="124" cy="136" rx="2.2" ry="1.1" fill={SAGE_DARK} opacity="0.22" />
        </g>

        {/* Растение — качается у основания */}
        <g className="sprout-sway">
          {/* Стебель */}
          {stemGrow > 0.001 && (
            <>
              <path d={STEM_D} fill="none" stroke={SAGE_DARK} strokeWidth="2.4" strokeOpacity="0.85" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - stemGrow} />
              <path d={STEM_D} fill="none" stroke="url(#stemGrad)" strokeWidth="1.1" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - stemGrow} />
            </>
          )}

          {/* Листья */}
          {LEAVES.map((cfg) => (
            <Leaf key={cfg.id} cfg={cfg} p={p} />
          ))}

          {/* Бутоны */}
          {BUDS.map((cfg) => (
            <Bud key={cfg.id} cfg={cfg} p={p} />
          ))}

          {/* Лотос (распускается сверху) */}
          {bloomT > 0.001 && (
            <g transform={`translate(100 42) scale(${bloomT})`} style={{ opacity: Math.min(1, bloomT * 1.5) }}>
              {PETAL_ROWS.map((row, ri) =>
                row.angles.map((a, i) => {
                  const ang = a * (0.16 + 0.84 * bloomT);
                  return (
                    <g key={`${ri}-${i}`} transform={`rotate(${ang}) scale(${row.scale})`}>
                      <path d={PETAL} fill={row.fill} fillOpacity={row.opacity} stroke={SAGE_DARK} strokeWidth={0.3} strokeOpacity={0.35} />
                      <path d="M0 -2 L 0 -22" stroke={SAGE_DARK} strokeWidth={0.25} strokeOpacity={0.3} />
                    </g>
                  );
                })
              )}
              {/* Центр цветка */}
              <circle cx="0" cy="0" r="3" fill={SAGE_LIGHT} opacity="0.8" />
              <circle cx="0" cy="0" r="3" fill="none" stroke={SAGE_DARK} strokeWidth="0.4" strokeOpacity="0.4" />
              {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <line key={deg} x1="0" y1="0" x2={Math.cos(rad) * 2.4} y2={Math.sin(rad) * 2.4} stroke={SAGE_DARK} strokeWidth="0.3" strokeOpacity="0.4" />
                );
              })}
            </g>
          )}
        </g>

        {/* Блики стекла поверх растения */}
        <g>
          <ellipse cx="68" cy="52" rx="16" ry="26" fill="#ffffff" opacity="0.4" filter="url(#soft)" transform="rotate(-24 68 52)" />
          <ellipse cx="132" cy="150" rx="7" ry="16" fill="#ffffff" opacity="0.22" filter="url(#soft)" transform="rotate(20 132 150)" />
        </g>
      </svg>

      {/* Частицы (капли/споры) — лёгкий дрейф */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: particlesOpacity }} aria-hidden>
        {PARTICLES.map((pt, i) => (
          <span
            key={i}
            className="sprout-particle absolute rounded-full"
            style={{
              left: pt.left,
              top: pt.top,
              width: pt.size,
              height: pt.size,
              backgroundColor: '#ffffff',
              boxShadow: `0 0 5px ${SAGE_LIGHT}`,
              animationDuration: pt.dur,
              animationDelay: pt.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
