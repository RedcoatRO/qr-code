import React from 'react';
import QrGenerator from './components/QrGenerator';
import { QrCodeIcon, SunIcon, MoonIcon } from './components/icons';
import { useDarkMode } from './hooks/useDarkMode';
import Button from './components/ui/Button';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useDarkMode();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md sticky top-0 z-20">
        <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <QrCodeIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Generator Cod QR
            </h1>
          </div>
          <div className="flex items-center gap-4">
              {/* Butonul "Creează Acum" a fost eliminat la cererea utilizatorului. */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2"
                aria-label={isDarkMode ? "Activează modul luminos" : "Activează modul întunecat"}
              >
                {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </Button>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <QrGenerator />
      </main>

      <footer className="bg-white dark:bg-slate-800 mt-12 py-6">
        <div className="container mx-auto px-6 text-center text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} Generator Cod QR. Toate drepturile rezervate.</p>
          <p className="text-sm mt-1">Creat cu React, Tailwind CSS și multă pasiune.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;