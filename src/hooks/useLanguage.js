import { useCallback, useEffect, useState } from "react";

function browserLanguage() {
  const preferences = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];
  return preferences.some((locale) => /^en(?:-|$)/i.test(locale)) ? "en" : "es";
}

export function useLanguage() {
  const [language, setLanguage] = useState("es");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let saved = null;
      try { saved = window.localStorage.getItem("mar-language"); } catch {}
      setLanguage(saved === "es" || saved === "en" ? saved : browserLanguage());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const chooseLanguage = useCallback((nextLanguage) => {
    if (nextLanguage !== "es" && nextLanguage !== "en") return;
    setLanguage(nextLanguage);
    try { window.localStorage.setItem("mar-language", nextLanguage); } catch {}
  }, []);

  return [language, chooseLanguage];
}
