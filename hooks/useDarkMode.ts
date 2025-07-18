// hooks/useDarkMode.ts
import { useState, useEffect } from 'react';

// Acest hook gestionează starea modului întunecat și o aplică documentului.
export function useDarkMode(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Starea inițială este setată de un script în index.html pentru a preveni FOUC.
    // Acest hook trebuie doar să se sincronizeze cu clasa de pe elementul root.
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return [isDarkMode, setIsDarkMode];
}