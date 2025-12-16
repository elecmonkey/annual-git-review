import { overwriteGetLocale, locales, baseLocale } from "$lib/paraglide/runtime";
import { browser } from "$app/environment";

// Define the type for supported languages based on the imported locales
// We assume locales is a constant array like ["en", "zh-CN"]
export type Language = (typeof locales)[number];

// We need to ensure that when currentLang changes, getLocale() returns the new value
// AND Svelte tracking picks it up.

let _lang = $state<Language>(baseLocale as Language);

overwriteGetLocale(() => _lang);

export function initI18n() {
  if (!browser) return;

  const storedLang = localStorage.getItem("lang");
  console.log('[i18n] init, stored:', storedLang);
  if (isValidLanguage(storedLang)) {
    _lang = storedLang;
  } else {
    const browserLang = navigator.language;
    console.log('[i18n] browser:', browserLang);
    if (browserLang.startsWith("zh") && (locales as readonly string[]).includes("zh-CN")) {
      _lang = "zh-CN" as Language;
    } else {
      _lang = "en" as Language;
    }
  }
  console.log('[i18n] initial lang:', _lang);
}

export function switchLanguage(lang: string) {
  console.log('[i18n] switch to:', lang);
  if (!isValidLanguage(lang)) {
    console.error('[i18n] invalid lang:', lang);
    return;
  }
  _lang = lang;
  if (browser) {
    localStorage.setItem("lang", lang);
  }
}

export function getLanguage() {
  return _lang;
}

function isValidLanguage(lang: string | null): lang is Language {
  return lang !== null && (locales as readonly string[]).includes(lang);
}
