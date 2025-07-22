// types.ts

// The gradient object for dots, used when a gradient is preferred over a single color.
export interface Gradient {
  type: 'linear' | 'radial';
  rotation?: number;
  colorStops: {
    offset: number;
    color: string;
  }[];
}

// This corresponds to the options from the 'qr-code-styling' library
export interface DotOptions {
  type: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  // Color is optional because a gradient can be used instead.
  color?: string;
  gradient?: Gradient;
}

export interface BackgroundOptions {
  color: string;
}

export interface ImageOptions {
  source: string;
  imageSize: number;
  margin: number;
  hideBackgroundDots: boolean;
}

export interface CornersSquareOptions {
  type: 'square' | 'dot' | 'extra-rounded';
  color: string;
}

export interface CornersDotOptions {
  type: 'square' | 'dot';
  color: string;
}

// Options for the frame with a call-to-action text.
// Note: This is implemented visually in the preview and not part of the direct QR download.
export interface FrameOptions {
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  // Font family for the call-to-action text.
  fontFamily?: string;
  // Font size (in pixels) for the call-to-action text.
  fontSize?: number;
}

export interface QrOptions {
  width: number;
  height: number;
  data: string;
  image?: string;
  // New property to define the overall shape of the QR code.
  shape: 'square' | 'circle';
  dotsOptions: DotOptions;
  backgroundOptions: BackgroundOptions;
  cornersSquareOptions?: CornersSquareOptions;
  cornersDotOptions?: CornersDotOptions;
  // Options for the frame around the QR code.
  frameOptions?: FrameOptions;
  // QR-specific options like error correction level.
  qrOptions?: {
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  };
}

export enum QrContentType {
  URL = 'url',
  TEXT = 'text',
  WIFI = 'wifi',
  VCARD = 'vcard',
  EMAIL = 'email',
  EVENT = 'event',
}

// Defines the structure for a single entry in the local history.
export interface HistoryEntry {
    id: string; // Unique ID, e.g., timestamp
    name: string; // A descriptive name, e.g., from the QR data
    timestamp: number; // The time it was saved
    options: QrOptions; // The full configuration of the QR code
}