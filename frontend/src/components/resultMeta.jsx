/**
 * Shared presentation data for a scan result.
 *
 * A model label (e.g. "glass", "fresh") maps to how we show it: the matching
 * real-world bin colour (`tone`), a friendly headline (`title`), the small item
 * chip (`item` + `Icon`) and which glyph to draw (`kind`). Both the scan result
 * card and the history list read from here so the two stay in sync.
 */
import {
  Battery, Leaf, Package, Shirt, Wine, Recycle, Newspaper, CupSoda, Footprints, Trash2, Apple,
} from 'lucide-react'

// Tone -> whole Tailwind class strings (kept intact so the JIT compiler keeps them).
export const TONES = {
  red:     { badge: 'bg-red-50 text-red-500 ring-red-50/60',         title: 'text-red-600',     chip: 'bg-red-50' },
  amber:   { badge: 'bg-amber-50 text-amber-500 ring-amber-50/60',   title: 'text-amber-600',   chip: 'bg-amber-50' },
  yellow:  { badge: 'bg-yellow-50 text-yellow-600 ring-yellow-50/60',title: 'text-yellow-700',  chip: 'bg-yellow-50' },
  pink:    { badge: 'bg-pink-50 text-pink-500 ring-pink-50/60',      title: 'text-pink-600',    chip: 'bg-pink-50' },
  purple:  { badge: 'bg-purple-50 text-purple-500 ring-purple-50/60',title: 'text-purple-600',  chip: 'bg-purple-50' },
  orange:  { badge: 'bg-orange-50 text-orange-500 ring-orange-50/60',title: 'text-orange-600',  chip: 'bg-orange-50' },
  blue:    { badge: 'bg-blue-50 text-blue-500 ring-blue-50/60',      title: 'text-blue-600',    chip: 'bg-blue-50' },
  slate:   { badge: 'bg-slate-100 text-slate-500 ring-slate-100/60', title: 'text-slate-600',   chip: 'bg-slate-100' },
  emerald: { badge: 'bg-emerald-50 text-emerald-500 ring-emerald-50/60', title: 'text-emerald-600', chip: 'bg-emerald-50' },
  rose:    { badge: 'bg-rose-50 text-rose-500 ring-rose-50/60',      title: 'text-rose-600',    chip: 'bg-rose-50' },
}

// label -> how to present it. `kind` selects the glyph; `tone` matches the real-world bin colour.
export const RESULT_META = {
  // --- waste bins ---
  battery:    { kind: 'bin', eyebrow: 'Drop it off at', title: 'E-Waste Spot',     tone: 'red',    item: 'Battery',    Icon: Battery },
  biological: { kind: 'bin', eyebrow: 'Toss this in',   title: 'Brown Bin',       tone: 'amber',  item: 'Biological', Icon: Leaf },
  cardboard:  { kind: 'bin', eyebrow: 'Toss this in',   title: 'Cardboard Cage',  tone: 'yellow', item: 'Cardboard',  Icon: Package },
  clothes:    { kind: 'bin', eyebrow: 'Donate at',       title: 'Textile Bin',     tone: 'pink',   item: 'Clothes',    Icon: Shirt },
  glass:      { kind: 'bin', eyebrow: 'Toss this in',   title: 'Purple Bin',      tone: 'purple', item: 'Glass',      Icon: Wine },
  metal:      { kind: 'bin', eyebrow: 'Toss this in',   title: 'Orange Bin',      tone: 'orange', item: 'Metal',      Icon: Recycle },
  paper:      { kind: 'bin', eyebrow: 'Toss this in',   title: 'Blue Bin',        tone: 'blue',   item: 'Paper',      Icon: Newspaper },
  plastic:    { kind: 'bin', eyebrow: 'Toss this in',   title: 'Orange Bin',      tone: 'orange', item: 'Plastic',    Icon: CupSoda },
  shoes:      { kind: 'bin', eyebrow: 'Donate at',       title: 'Textile Bin',     tone: 'pink',   item: 'Shoes',      Icon: Footprints },
  trash:      { kind: 'bin', eyebrow: 'Toss this in',   title: 'General Waste',   tone: 'slate',  item: 'Trash',      Icon: Trash2 },
  // --- freshness ---
  fresh:      { kind: 'fresh',  title: 'Fresh',   tone: 'emerald', item: 'Fresh produce',   Icon: Apple },
  rotten:     { kind: 'rotten', title: 'Rotten',  tone: 'rose',    item: 'Rotten produce',  Icon: Apple },
}

export function getResultMeta(label) {
  return (
    RESULT_META[label] ||
    { kind: 'bin', eyebrow: 'Toss in', title: label, tone: 'slate', item: label, Icon: Recycle }
  )
}

// A colour-coded waste bin (lid + body, drawn in currentColor).
export function BinGlyph({ className = 'h-12 w-12' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <rect x="19" y="9" width="10" height="3.5" rx="1.75" fill="currentColor" />
      <rect x="10" y="13" width="28" height="5" rx="2.5" fill="currentColor" />
      <path d="M13 19h22l-1.7 19.4A3 3 0 0 1 30.3 41H17.7a3 3 0 0 1-3-2.6L13 19Z" fill="currentColor" fillOpacity="0.3" />
      <path d="M20 23.5v13M24 23.5v13M28 23.5v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// A plump apple with a leaf + sparkle.
export function FreshGlyph({ className = 'h-12 w-12' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <path d="M24 19c-3-3-8-3-10.5 0-2.5 3-2 9 .5 13.5C15.6 35.4 18 38 20.4 38c1.6 0 2.2-.8 3.6-.8s2 .8 3.6.8c2.4 0 4.8-2.6 6.4-5.5 2.5-4.5 3-10.5.5-13.5-2.5-3-7.5-3-10.5 0Z" fill="currentColor" fillOpacity="0.3" />
      <path d="M24.5 17.5C25 14 28 11.5 31.5 11.8 31.2 15.3 28.4 17.6 24.5 17.5Z" fill="currentColor" />
      <path d="M24 17.5V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 12l.9 2.1 2.1.9-2.1.9L15 18l-.9-2.1-2.1-.9 2.1-.9L15 12Z" fill="currentColor" />
    </svg>
  )
}

// The same apple gone bad: brown spots, a drooping leaf and a whiff of odour.
export function RottenGlyph({ className = 'h-12 w-12' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <path d="M24 19c-3-3-8-3-10.5 0-2.5 3-2 9 .5 13.5C15.6 35.4 18 38 20.4 38c1.6 0 2.2-.8 3.6-.8s2 .8 3.6.8c2.4 0 4.8-2.6 6.4-5.5 2.5-4.5 3-10.5.5-13.5-2.5-3-7.5-3-10.5 0Z" fill="currentColor" fillOpacity="0.3" />
      <path d="M24 17.5C23 14.5 20 13 17 13.6 18 16.4 20.8 17.8 24 17.5Z" fill="currentColor" />
      <path d="M24 17.5V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="19.5" cy="28" r="2" fill="currentColor" />
      <circle cx="27" cy="25" r="1.4" fill="currentColor" />
      <circle cx="25" cy="31.5" r="1.6" fill="currentColor" />
      <path d="M30 14c1.6-1 1.6-2.8 0-3.8M33 15c2.2-1.4 2.2-4 0-5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function ResultGlyph({ kind, className }) {
  if (kind === 'fresh') return <FreshGlyph className={className} />
  if (kind === 'rotten') return <RottenGlyph className={className} />
  return <BinGlyph className={className} />
}
