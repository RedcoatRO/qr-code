export const PREDEFINED_MESSAGES = [
  { label: 'Selectează un mesaj...', value: '' },
  { label: 'Mulțumim că ai participat!', value: 'Mulțumim că ai participat!' },
  { label: 'Scanează pentru meniu.', value: 'Scanează pentru meniu.' },
  { label: 'Accesează rețeaua Wi-Fi.', value: 'Accesează rețeaua Wi-Fi.' },
  { label: 'Vizitează site-ul nostru.', value: 'Vizitează site-ul nostru.' },
];

export const DOT_STYLE_OPTIONS = [
  { label: 'Pătrat', value: 'square' },
  { label: 'Rotunjit', value: 'rounded' },
  { label: 'Puncte', value: 'dots' },
  { label: 'Clasic', value: 'classy' },
  { label: 'Clasic rotunjit', value: 'classy-rounded' },
  { label: 'Extra rotunjit', value: 'extra-rounded' },
];

export const CORNER_STYLE_OPTIONS = [
    { label: 'Pătrat', value: 'square' },
    { label: 'Punct', value: 'dot' },
    { label: 'Extra rotunjit', value: 'extra-rounded' },
];

export const CORNER_DOT_STYLE_OPTIONS = [
    { label: 'Pătrat', value: 'square' },
    { label: 'Punct', value: 'dot' },
];

export const ERROR_CORRECTION_LEVELS: { label: string, value: 'L' | 'M' | 'Q' | 'H' }[] = [
    { label: 'Scăzut (L)', value: 'L' },
    { label: 'Mediu (M)', value: 'M' },
    { label: 'Calitate (Q)', value: 'Q' },
    { label: 'Ridicat (H)', value: 'H' },
];

// List of web-safe fonts for the call-to-action frame.
export const FRAME_FONT_OPTIONS: { label: string, value: string }[] = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
];


export const DOWNLOAD_FORMATS: ('png' | 'svg' | 'jpeg')[] = ['png', 'svg', 'jpeg'];
