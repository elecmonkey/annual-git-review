export type Theme = {
  id: string;
  name: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentText: string;
  accentGradient: string;
  decorBlob1: string;
  decorBlob2: string;
  cardBg: string;
  border: string;
  buttonHover: string;
  chartColors: {
    text: string;
    border: string;
  };
};

export const themes: Theme[] = [
  {
    id: 'deep-space',
    name: 'Deep Space (Default)',
    background: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950',
    textPrimary: 'text-white',
    textSecondary: 'text-white/80',
    textMuted: 'text-white/60',
    accentText: 'text-green-400',
    accentGradient: 'bg-gradient-to-r from-emerald-300 to-sky-400',
    decorBlob1: 'bg-emerald-500',
    decorBlob2: 'bg-sky-600',
    cardBg: 'bg-white/10',
    border: 'border-white/10',
    buttonHover: 'hover:text-white',
    chartColors: {
      text: '#fff',
      border: '#1e293b'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    background: 'bg-gradient-to-br from-purple-900 via-fuchsia-900 to-black',
    textPrimary: 'text-yellow-300',
    textSecondary: 'text-pink-200',
    textMuted: 'text-pink-200/60',
    accentText: 'text-cyan-400',
    accentGradient: 'bg-gradient-to-r from-yellow-400 to-pink-500',
    decorBlob1: 'bg-yellow-500',
    decorBlob2: 'bg-pink-600',
    cardBg: 'bg-black/40',
    border: 'border-pink-500/30',
    buttonHover: 'hover:text-yellow-200',
    chartColors: {
      text: '#fde047',
      border: '#4a044e'
    }
  },
  {
    id: 'forest',
    name: 'Enchanted Forest',
    background: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-950',
    textPrimary: 'text-orange-50',
    textSecondary: 'text-orange-100/80',
    textMuted: 'text-orange-100/60',
    accentText: 'text-lime-300',
    accentGradient: 'bg-gradient-to-r from-lime-400 to-yellow-300',
    decorBlob1: 'bg-lime-500',
    decorBlob2: 'bg-amber-600',
    cardBg: 'bg-black/20',
    border: 'border-lime-500/20',
    buttonHover: 'hover:text-lime-200',
    chartColors: {
      text: '#fef3c7',
      border: '#064e3b'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Blvd',
    background: 'bg-gradient-to-br from-rose-900 via-orange-900 to-purple-950',
    textPrimary: 'text-white',
    textSecondary: 'text-orange-100/90',
    textMuted: 'text-orange-100/60',
    accentText: 'text-yellow-300',
    accentGradient: 'bg-gradient-to-r from-yellow-400 to-rose-500',
    decorBlob1: 'bg-orange-500',
    decorBlob2: 'bg-purple-600',
    cardBg: 'bg-white/10',
    border: 'border-white/20',
    buttonHover: 'hover:text-yellow-200',
    chartColors: {
      text: '#fff',
      border: '#881337'
    }
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    background: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-100/80',
    textMuted: 'text-cyan-100/60',
    accentText: 'text-cyan-300',
    accentGradient: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    decorBlob1: 'bg-blue-500',
    decorBlob2: 'bg-cyan-600',
    cardBg: 'bg-white/5',
    border: 'border-cyan-500/20',
    buttonHover: 'hover:text-cyan-200',
    chartColors: {
      text: '#ecfeff',
      border: '#1e3a8a'
    }
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    background: 'bg-gradient-to-br from-gray-900 via-neutral-900 to-stone-950',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-500',
    accentText: 'text-white',
    accentGradient: 'bg-gradient-to-r from-white to-gray-400',
    decorBlob1: 'bg-white',
    decorBlob2: 'bg-gray-500',
    cardBg: 'bg-white/5',
    border: 'border-white/20',
    buttonHover: 'hover:text-gray-300',
    chartColors: {
      text: '#fff',
      border: '#404040'
    }
  }
];

import { browser } from '$app/environment';

const STORAGE_KEY = 'git-review-theme';

let _currentThemeId = $state('deep-space');

if (browser) {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    _currentThemeId = stored;
  }
}

export const theme = {
  get current() {
    return themes.find((t) => t.id === _currentThemeId) || themes[0];
  },
  set(id: string) {
    _currentThemeId = id;
    if (browser) {
      localStorage.setItem(STORAGE_KEY, id);
    }
  }
};
