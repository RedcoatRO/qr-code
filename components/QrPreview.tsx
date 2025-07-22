import React, { useEffect, useRef, useState, useCallback } from 'react';
import type QRCodeStyling from 'qr-code-styling';
import { QrOptions } from '../types';
import { DOWNLOAD_FORMATS } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { DownloadIcon, HistoryIcon } from './icons';
import ScannabilityIndicator from './ScannabilityIndicator';

// Augment the window object to include the library loaded from CDN
declare global {
  interface Window {
    QRCodeStyling: typeof QRCodeStyling;
  }
}

interface QrPreviewProps {
  options: QrOptions;
  onSaveToHistory: () => void;
}

const QrPreview: React.FC<QrPreviewProps> = ({ options, onSaveToHistory }) => {
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [exportSize, setExportSize] = useState(1024);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    if (!window.QRCodeStyling) {
        console.error("Librăria QRCodeStyling nu este încărcată.");
        return;
    }

    if(!qrCode) {
      const qrCodeInstance = new window.QRCodeStyling({
          ...options,
          imageOptions: {
              hideBackgroundDots: true,
              imageSize: 0.4,
              margin: 5
          }
      });
      setQrCode(qrCodeInstance);
      ref.current.innerHTML = '';
      qrCodeInstance.append(ref.current);
    }

  }, []);

  useEffect(() => {
    if (!qrCode) return;
    // We pass all options except frameOptions, as it's handled separately for visual preview.
    const { frameOptions, ...restOptions } = options;
    qrCode.update(restOptions);
  }, [options, qrCode]);
  
  const handleDownload = useCallback((format: typeof DOWNLOAD_FORMATS[number]) => {
    if (!qrCode) return;
    
    const downloadOptions: { name: string; extension: typeof format; width?: number; height?: number } = {
        name: 'cod-qr',
        extension: format,
    };
    
    // Apply custom dimensions only for raster formats
    if (format === 'png' || format === 'jpeg') {
        downloadOptions.width = exportSize;
        downloadOptions.height = exportSize;
    }

    qrCode.download(downloadOptions);
  }, [qrCode, exportSize]);

  const { frameOptions, shape } = options;
  const hasFrame = frameOptions && frameOptions.text && frameOptions.text.trim() !== '';
  const isCircular = shape === 'circle';

  return (
    <Card className="flex flex-col items-center">
      <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Previzualizare</h3>
      
      {/* Visual frame container */}
      <div
        id="qr-code-frame-container"
        className="inline-block p-4 rounded-lg transition-all"
        style={{ 
          background: hasFrame ? frameOptions.backgroundColor : 'transparent',
          borderRadius: isCircular && !hasFrame ? '9999px' : '0.5rem' // Make frame circular if QR is circular and there's no text frame
        }}
      >
        {hasFrame && (
          <p
            className="text-center font-bold text-lg mb-2 break-words"
            style={{ 
                color: frameOptions.textColor,
                // Apply font family and size from options
                fontFamily: frameOptions.fontFamily,
                fontSize: frameOptions.fontSize ? `${frameOptions.fontSize}px` : undefined,
            }}
          >
            {frameOptions.text}
          </p>
        )}
        <div
          ref={ref}
          className={`border border-dashed border-slate-300 dark:border-slate-600 shadow-inner flex items-center justify-center bg-white transition-all duration-300 ${isCircular ? 'rounded-full overflow-hidden' : 'rounded-lg'}`}
          style={{ width: options.width, height: options.height }}
        />
      </div>

      <ScannabilityIndicator options={options} />

      <div className="w-full max-w-sm mt-6 space-y-4">
          <div className="flex items-end gap-3">
             <div className="flex-grow">
                 <label htmlFor="export-size" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Dimensiune Export (px)</label>
                 <Input 
                    id="export-size"
                    type="number"
                    value={exportSize}
                    onChange={e => setExportSize(Math.max(50, parseInt(e.target.value, 10)) || 50)}
                    min="50"
                    step="10"
                 />
             </div>
             <Button onClick={onSaveToHistory} variant="secondary" className="h-10">
                <HistoryIcon className="h-4 w-4" />
             </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DOWNLOAD_FORMATS.map(format => (
                <Button key={format} onClick={() => handleDownload(format)} variant="primary">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    .{format.toUpperCase()}
                </Button>
            ))}
          </div>
      </div>
      
      {(hasFrame || isCircular) && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center max-w-sm">
          Notă: Cadrul și forma circulară sunt efecte vizuale. Fișierul descărcat va fi un cod QR pătrat. Realizați o captură de ecran pentru a salva imaginea exact cum o vedeți.
        </p>
      )}
    </Card>
  );
};

export default QrPreview;