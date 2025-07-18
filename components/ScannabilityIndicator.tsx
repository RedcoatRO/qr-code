// components/ScannabilityIndicator.tsx
import React, { useMemo } from 'react';
import { QrOptions } from '../types';
import { getContrastRatio } from '../utils/color';

interface ScannabilityIndicatorProps {
  options: QrOptions;
}

type ScannabilityLevel = {
  level: 'good' | 'medium' | 'poor';
  message: string;
  color: string;
};

const ScannabilityIndicator: React.FC<ScannabilityIndicatorProps> = ({ options }) => {
  const scannability = useMemo<ScannabilityLevel>(() => {
    let score = 100;
    const messages = [];

    // 1. Check contrast ratio
    const dotColor = options.dotsOptions.gradient ? '#000000' : options.dotsOptions.color || '#000000';
    const bgColor = options.backgroundOptions.color;
    const contrast = getContrastRatio(dotColor, bgColor);

    if (contrast < 3) {
      score -= 50;
      messages.push('Contrastul este foarte scăzut.');
    } else if (contrast < 4.5) {
      score -= 25;
      messages.push('Contrastul ar putea fi mai bun.');
    }

    // 2. Check data length and error correction
    const dataLength = options.data.length;
    const errorLevel = options.qrOptions?.errorCorrectionLevel || 'Q';
    
    if (dataLength > 250 && errorLevel === 'L') {
        score -= 40;
        messages.push('Date multe cu corecție scăzută.');
    } else if (dataLength > 150) {
        score -= 15;
    }
    
    // 3. Check for logo
    if (options.image) {
        if (errorLevel === 'L') {
            score -= 30;
            messages.push('Logo-ul necesită corecție de erori M, Q sau H.');
        } else if (errorLevel === 'M') {
            score -= 15;
        }
    }
    
    // Determine final level
    if (score >= 75) {
      return { level: 'good', message: 'Scanare excelentă', color: 'bg-green-500' };
    }
    if (score >= 40) {
      return { level: 'medium', message: messages[0] || 'Scanare acceptabilă', color: 'bg-yellow-500' };
    }
    return { level: 'poor', message: messages[0] || 'Scanare dificilă', color: 'bg-red-500' };

  }, [options]);

  return (
    <div className="mt-4 flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 w-full max-w-xs">
      <span className={`h-3 w-3 rounded-full ${scannability.color}`}></span>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Lizibilitate: <span className="font-bold">{scannability.message}</span>
      </p>
    </div>
  );
};

export default ScannabilityIndicator;