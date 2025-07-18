// components/HistoryPanel.tsx
import React, { useEffect, useRef } from 'react';
import type QRCodeStyling from 'qr-code-styling';
import { HistoryEntry } from '../types';
import Card, { CardHeader, CardTitle } from './ui/Card';
import { HistoryIcon, TrashIcon } from './icons';
import Button from './ui/Button';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onLoad: (id: string) => void;
  onClear: () => void;
}

const HistoryItem: React.FC<{ entry: HistoryEntry; onLoad: (id: string) => void; }> = ({ entry, onLoad }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || !window.QRCodeStyling) return;
        
        const qrCodeInstance = new window.QRCodeStyling({
            ...entry.options,
            width: 64,
            height: 64,
            margin: 0
        });

        ref.current.innerHTML = '';
        qrCodeInstance.append(ref.current);

    }, [entry.options]);

    return (
        <div 
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
            onClick={() => onLoad(entry.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onLoad(entry.id)}
        >
            <div ref={ref} className="w-16 h-16 rounded-md overflow-hidden bg-white flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
                <p className="font-semibold truncate text-sm">{entry.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(entry.timestamp).toLocaleString('ro-RO')}
                </p>
            </div>
        </div>
    );
}


const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onClear }) => {
  if (history.length === 0) {
    return null; // Don't render the panel if history is empty
  }

  return (
    <Card>
      <div className="flex justify-between items-center">
        <CardHeader className="mb-0 pb-0 border-none">
          <HistoryIcon className="w-6 h-6 text-indigo-600" />
          <CardTitle>Istoric Local</CardTitle>
        </CardHeader>
        <Button variant="ghost" size="sm" onClick={onClear} aria-label="Golește istoricul">
            <TrashIcon className="w-4 h-4 text-slate-500 dark:text-slate-400"/>
        </Button>
      </div>
      <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-2">
        {history.map(entry => (
          <HistoryItem key={entry.id} entry={entry} onLoad={onLoad} />
        ))}
      </div>
    </Card>
  );
};

export default HistoryPanel;