import React, { useState, useCallback, useEffect } from 'react';
import { QrOptions, HistoryEntry } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import QrControls from './QrControls';
import QrPreview from './QrPreview';
import HistoryPanel from './HistoryPanel';

// Defines the initial state for the QR code options.
// This constant is used to initialize the state and to reset it.
const INITIAL_QR_OPTIONS: QrOptions = {
  width: 300,
  height: 300,
  // The default data for the QR code.
  data: 'https://www.upb.ro/',
  dotsOptions: {
    color: '#4267b2',
    type: 'rounded',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  cornersSquareOptions: {
      type: 'extra-rounded',
      color: '#4267b2'
  },
  cornersDotOptions: {
      type: 'dot',
      color: '#4267b2'
  },
  // Default values for the advanced options
  qrOptions: {
    errorCorrectionLevel: 'Q' // 'Q' (Quartile) is a good balance
  },
  // Default values for the frame options, including new font settings.
  frameOptions: {
      text: '',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontSize: 20,
  }
};


const QrGenerator: React.FC = () => {
  // State for the QR code options. This is the single source of truth for the QR code configuration.
  const [options, setOptions] = useState<QrOptions>(INITIAL_QR_OPTIONS);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('qr-history', []);
  const MAX_HISTORY_ITEMS = 5;

  // On initial load, check for shared style in URL hash
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#style=')) {
        const encodedOptions = hash.substring(7); // Remove #style=
        const decodedOptions = atob(encodedOptions);
        const parsedOptions = JSON.parse(decodedOptions);
        
        // Merge shared styles with initial options, but keep default data
        setOptions(prev => ({
          ...prev,
          ...parsedOptions,
          data: prev.data, // Don't override data from shared style
        }));
        // Clean the hash from URL
        window.history.replaceState(null, '', ' ');
      }
    } catch (error) {
      console.error("Failed to parse shared style from URL:", error);
    }
  }, []);

  // Callback to reset all options to their initial default values.
  const handleReset = useCallback(() => {
    setOptions(INITIAL_QR_OPTIONS);
  }, []);

  // Callback to save the current configuration to the local history.
  const handleSaveToHistory = useCallback(() => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      name: options.data.substring(0, 30) || 'Cod QR',
      timestamp: Date.now(),
      options: JSON.parse(JSON.stringify(options)) // Deep copy
    };

    setHistory(prevHistory => {
      // Avoid duplicates
      const filteredHistory = prevHistory.filter(item => item.options.data !== newEntry.options.data);
      const newHistory = [newEntry, ...filteredHistory];
      return newHistory.slice(0, MAX_HISTORY_ITEMS); // Limit history size
    });
  }, [options, setHistory]);

  // Callback to load a configuration from history.
  const handleLoadFromHistory = useCallback((id: string) => {
    const entry = history.find(item => item.id === id);
    if (entry) {
      setOptions(entry.options);
    }
  }, [history]);
  
  // Callback to clear the entire history.
  const handleClearHistory = useCallback(() => {
      setHistory([]);
  }, [setHistory]);

  return (
    <div id="generator" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 space-y-8">
        <QrControls options={options} setOptions={setOptions} onReset={handleReset} />
        <HistoryPanel 
          history={history} 
          onLoad={handleLoadFromHistory}
          onClear={handleClearHistory}
        />
      </div>
      <div className="lg:col-span-2 lg:sticky lg:top-24">
        <QrPreview options={options} onSaveToHistory={handleSaveToHistory} />
      </div>
    </div>
  );
};

export default QrGenerator;