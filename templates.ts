import { QrOptions } from './types';

// Defines the structure of a design template.
// It includes a name and a set of QrOptions, omitting user-specific data like content.
export type Template = {
  name: string;
  options: Partial<Omit<QrOptions, 'data' | 'width' | 'height' | 'image'>>;
};

export const DESIGN_TEMPLATES: Template[] = [
  {
    name: 'Profesional',
    options: {
      dotsOptions: { type: 'square', color: '#1f2937' },
      cornersSquareOptions: { type: 'square', color: '#1f2937' },
      cornersDotOptions: { type: 'square', color: '#1f2937' },
      backgroundOptions: { color: '#ffffff' },
      qrOptions: { errorCorrectionLevel: 'H' },
    },
  },
  {
    name: 'Elegant',
    options: {
      dotsOptions: { type: 'dots', color: '#4a044e' },
      backgroundOptions: { color: '#f3e8ff' },
      cornersSquareOptions: { type: 'dot', color: '#86198f' },
      cornersDotOptions: { type: 'dot', color: '#86198f' },
      qrOptions: { errorCorrectionLevel: 'Q' },
    },
  },
  {
    name: 'Jucăuș',
    options: {
      dotsOptions: {
        type: 'rounded',
        gradient: {
          type: 'linear',
          rotation: 0.785, // 45 degrees
          colorStops: [
            { offset: 0, color: '#f97316' },
            { offset: 1, color: '#ec4899' },
          ],
        },
      },
      cornersSquareOptions: { type: 'extra-rounded', color: '#f97316' },
      cornersDotOptions: { type: 'dot', color: '#ec4899' },
      backgroundOptions: { color: '#ffffff' },
      qrOptions: { errorCorrectionLevel: 'M' },
    },
  },
  {
    name: 'Minimalist',
    options: {
      dotsOptions: { type: 'classy', color: '#4b5563' },
      backgroundOptions: { color: 'transparent' },
      cornersSquareOptions: { type: 'square', color: '#4b5563' },
      cornersDotOptions: { type: 'square', color: '#4b5563' },
      qrOptions: { errorCorrectionLevel: 'Q' },
    },
  },
];
