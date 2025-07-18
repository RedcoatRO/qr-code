// components/modals/BulkGenerateModal.tsx
import React, { useState, useCallback } from 'react';
import type QRCodeStyling from 'qr-code-styling';
import JSZip from 'jszip';
import { QrOptions } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { UploadCloudIcon, FileZipIcon } from '../icons';

interface BulkGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  styleOptions: QrOptions;
}

const BulkGenerateModal: React.FC<BulkGenerateModalProps> = ({ isOpen, onClose, styleOptions }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].type === 'text/csv') {
        setFile(e.target.files[0]);
      } else {
        setError('Te rog încarcă un fișier valid de tip CSV.');
      }
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!file || !window.QRCodeStyling) return;

    setIsLoading(true);
    setProgress(0);
    setError('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        
        if (lines.length === 0) {
            setError('Fișierul CSV este gol.');
            setIsLoading(false);
            return;
        }

        const zip = new JSZip();
        const { data, ...restOfOptions } = styleOptions;

        for (let i = 0; i < lines.length; i++) {
          const lineData = lines[i].trim();
          const qrCodeInstance = new window.QRCodeStyling({
            ...restOfOptions,
            data: lineData,
          });

          const blob = await qrCodeInstance.getRawData('png');
          if (blob) {
            zip.file(`qr_code_${i + 1}.png`, blob);
          }
          setProgress(((i + 1) / lines.length) * 100);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'coduri_qr.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onClose();

      } catch (err) {
        setError('A apărut o eroare la procesarea fișierului.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  }, [file, styleOptions, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generează în Masă din CSV">
      <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Încarcă un fișier .csv cu o singură coloană. Fiecare rând va fi transformat într-un cod QR separat, folosind stilul curent.
        </p>
        
        <div>
          <label htmlFor="csv-upload" className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <UploadCloudIcon className="w-10 h-10 text-slate-400" />
            <span className="mt-2 text-sm font-semibold">{file ? file.name : 'Alege un fișier CSV'}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Click pentru a încărca</span>
          </label>
          <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        
        {isLoading && (
          <div className="w-full">
            <p className="text-sm text-center mb-1">Se generează... ({Math.round(progress)}%)</p>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <Button onClick={handleGenerate} disabled={!file || isLoading} className="w-full">
          <FileZipIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Se procesează...' : 'Generează și Descarcă ZIP'}
        </Button>
      </div>
    </Modal>
  );
};

export default BulkGenerateModal;