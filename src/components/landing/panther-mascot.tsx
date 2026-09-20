"use client";

export function PantherMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Neon cyan glow filter */}
        <filter id="neon-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtle glow for smaller elements */}
        <filter id="neon-glow-sm" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Blade shape gradient */}
        <linearGradient id="blade-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0891b2" stopOpacity="0.5" />
        </linearGradient>

        {/* Shadow glow beneath */}
        <radialGradient id="ground-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0.15" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground glow */}
      <ellipse cx="250" cy="390" rx="150" ry="18" fill="url(#ground-glow)" />

      {/* ============================================ */}
      {/* PANTHER — neon contour line art, profile,     */}
      {/* roaring mouth, matching logo style            */}
      {/* ============================================ */}
      <g filter="url(#neon-glow)" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

        {/* --- HEAD outline --- */}
        {/* Skull top */}
        <path d="M80 130 C80 85 110 55 155 48 C190 42 210 52 220 70" />
        {/* Forehead to brow ridge */}
        <path d="M80 130 L68 122 C62 118 60 112 64 106" />
        {/* Brow ridge */}
        <path d="M64 106 L85 100 L105 108" />

        {/* --- SNOUT / MUZZLE --- */}
        {/* Top of muzzle */}
        <path d="M64 106 C50 108 38 115 32 125 C28 132 30 140 36 145" />
        {/* Nose tip */}
        <path d="M32 125 L24 128 L30 134" strokeWidth="2.5" />
        {/* Upper lip line */}
        <path d="M36 145 L55 148" />

        {/* --- OPEN MOUTH / ROAR --- */}
        {/* Lower jaw */}
        <path d="M36 145 C40 160 50 172 65 178 L95 180" />
        {/* Jaw hinge */}
        <path d="M95 180 C108 178 115 170 118 160" />
        {/* Upper jaw inner */}
        <path d="M55 148 L60 155 L70 150 L80 158 L90 152 L100 160" strokeWidth="1.5" opacity="0.7" />
        {/* Lower jaw inner */}
        <path d="M55 165 L65 160 L75 168 L85 162 L95 170" strokeWidth="1.5" opacity="0.7" />
        {/* Teeth - upper */}
        <path d="M58 149 L60 157" strokeWidth="1.5" opacity="0.6" />
        <path d="M72 150 L74 158" strokeWidth="1.5" opacity="0.6" />
        <path d="M86 152 L88 160" strokeWidth="1.5" opacity="0.6" />
        {/* Teeth - lower */}
        <path d="M60 163 L62 156" strokeWidth="1.5" opacity="0.6" />
        <path d="M74 165 L76 157" strokeWidth="1.5" opacity="0.6" />
        <path d="M88 167 L90 159" strokeWidth="1.5" opacity="0.6" />

        {/* --- EYE --- */}
        <path d="M72 108 C78 100 95 98 102 104 C108 110 105 120 98 124 C90 128 76 126 72 118 C70 114 70 112 72 108 Z" strokeWidth="1.8" />
        {/* Pupil slit */}
        <ellipse cx="88" cy="113" rx="2.5" ry="6" fill="#22d3ee" opacity="0.8" strokeWidth="0" />
        {/* Eye inner glow */}
        <circle cx="92" cy="108" r="2" fill="white" opacity="0.8" strokeWidth="0" />

        {/* --- EAR (pointed, tall) --- */}
        <path d="M148 52 L130 8 L175 42" />
        <path d="M135 18 L148 52" strokeWidth="1" opacity="0.5" />
        <path d="M140 25 L155 48" strokeWidth="1" opacity="0.3" />

        {/* --- NECK line --- */}
        <path d="M220 70 C230 85 235 105 238 130" />
        {/* Throat / chin line */}
        <path d="M118 160 C135 175 155 190 180 200" />

        {/* --- BACK / SPINE --- */}
        <path d="M220 70 C260 60 310 58 350 65 C380 72 400 85 410 105" />

        {/* --- BODY outline --- */}
        {/* Back to hip */}
        <path d="M410 105 C425 130 430 165 428 200" />
        {/* Belly */}
        <path d="M180 200 C220 230 300 240 380 230 C410 222 425 210 428 200" strokeWidth="1.5" opacity="0.6" />
        {/* Chest to belly */}
        <path d="M180 200 C175 220 178 245 185 265" strokeWidth="1.5" opacity="0.5" />

        {/* --- FRONT LEGS --- */}
        {/* Near leg */}
        <path d="M195 250 L190 310 C190 325 195 335 205 338 L218 338 C228 335 230 325 228 310 L225 250" />
        <path d="M190 338 L228 338" strokeWidth="1.5" />
        {/* Paw toes */}
        <path d="M195 338 L195 342" strokeWidth="1.2" opacity="0.5" />
        <path d="M205 338 L205 343" strokeWidth="1.2" opacity="0.5" />
        <path d="M215 338 L215 343" strokeWidth="1.2" opacity="0.5" />
        <path d="M225 338 L225 342" strokeWidth="1.2" opacity="0.5" />

        {/* Far leg */}
        <path d="M170 260 L168 315 C168 328 172 335 180 338 L192 338 C198 336 200 328 198 315 L195 260" strokeWidth="1.2" opacity="0.5" />

        {/* --- HIND LEGS --- */}
        {/* Thigh */}
        <path d="M428 200 C435 220 438 245 435 270" strokeWidth="1.5" opacity="0.5" />
        {/* Near hind leg */}
        <path d="M400 250 L395 310 C395 325 400 335 410 338 L425 338 C435 335 437 325 435 310 L430 250" />
        <path d="M395 338 L435 338" strokeWidth="1.5" />
        <path d="M400 338 L400 343" strokeWidth="1.2" opacity="0.5" />
        <path d="M412 338 L412 343" strokeWidth="1.2" opacity="0.5" />
        <path d="M425 338 L425 343" strokeWidth="1.2" opacity="0.5" />

        {/* Far hind leg */}
        <path d="M370 260 L368 315 C368 328 372 335 380 338 L392 338 C398 336 400 328 398 315 L395 260" strokeWidth="1.2" opacity="0.5" />

        {/* --- TAIL (curled, signature style) --- */}
        <path d="M428 200 C445 190 460 170 465 145 C470 120 462 100 448 95 C435 90 425 100 430 115 C435 128 448 125 455 115" strokeWidth="2.2" />
        {/* Tail tip curl */}
        <path d="M455 115 C460 108 458 98 450 95" strokeWidth="1.8" opacity="0.7" />

      </g>

      {/* ============================================ */}
      {/* BLADE / FIN shape next to the head           */}
      {/* ============================================ */}
      <g filter="url(#neon-glow-sm)">
        <path
          d="M230 40 L248 20 L255 55 L245 85 L235 70 Z"
          fill="url(#blade-grad)"
          fillOpacity="0.15"
          stroke="#22d3ee"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Inner blade detail */}
        <path
          d="M238 48 L248 28 L252 55 L244 75"
          stroke="#22d3ee"
          strokeWidth="0.8"
          fill="none"
          opacity="0.4"
        />
      </g>

      {/* ============================================ */}
      {/* PARTICLE EFFECTS around the panther           */}
      {/* ============================================ */}
      <g filter="url(#neon-glow-sm)">
        {/* Floating dots */}
        <circle cx="20" cy="120" r="2" fill="#22d3ee" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.15;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="480" cy="90" r="2.5" fill="#22d3ee" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="15" cy="280" r="1.5" fill="#a78bfa" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="485" cy="250" r="2" fill="#22d3ee" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="200" r="1.2" fill="white" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="460" cy="180" r="1.5" fill="white" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.55;0.25" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="380" r="1.5" fill="#22d3ee" opacity="0.35">
          <animate attributeName="opacity" values="0.35;0.65;0.35" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="400" cy="380" r="1.8" fill="#22d3ee" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3.8s" repeatCount="indefinite" />
        </circle>

        {/* Sparkle stars */}
        <path d="M10 160 l3-6 3 6 -6-3 6 0z" fill="#22d3ee" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M490 150 l2.5-5 2.5 5 -5-2.5 5 0z" fill="#a78bfa" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.8s" repeatCount="indefinite" />
        </path>
        <path d="M60 350 l2-4 2 4 -4-2 4 0z" fill="#22d3ee" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3.5s" repeatCount="indefinite" />
        </path>
      </g>

    </svg>
  );
}
