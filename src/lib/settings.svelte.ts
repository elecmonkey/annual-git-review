import { browser } from '$app/environment';

const STORAGE_KEY = 'git-review-settings';

const defaults = {
  languageCount: 3,
  repoCount: 4,
  ossCount: 3,
  showGreenWall: false,
  showFooter: true,
  showSnow: true
};

let initialState = defaults;

if (browser) {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      initialState = { ...defaults, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Failed to parse settings from localStorage', e);
    }
  }
}

export const settings = $state(initialState);
