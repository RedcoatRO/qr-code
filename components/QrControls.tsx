import React, { useState, useCallback, useEffect } from 'react';
import { QrOptions, QrContentType, DotOptions, CornersSquareOptions, CornersDotOptions, Gradient } from '../types';
import { PREDEFINED_MESSAGES, DOT_STYLE_OPTIONS, CORNER_STYLE_OPTIONS, CORNER_DOT_STYLE_OPTIONS, ERROR_CORRECTION_LEVELS, FRAME_FONT_OPTIONS } from '../constants';
import { DESIGN_TEMPLATES, Template } from '../templates';
import Card, { CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { Tabs } from './ui/Tabs';
import { 
    LinkIcon, TextIcon, PaletteIcon, ImageIcon, ShapesIcon, TrashIcon, WifiIcon, 
    UserIcon, MailIcon, CalendarIcon, LayoutGridIcon, FrameIcon, ShieldCheckIcon, RefreshCwIcon,
    ToolIcon, Share2Icon, CopyIcon, CheckIcon, FileZipIcon
} from './icons';
import WifiForm from './WifiForm';
import VCardForm from './VCardForm';
import EmailForm from './EmailForm';
import EventForm from './EventForm';
import BulkGenerateModal from './modals/BulkGenerateModal';

interface QrControlsProps {
  options: QrOptions;
  setOptions: React.Dispatch<React.SetStateAction<QrOptions>>;
  // New prop for the reset function from the parent.
  onReset: () => void;
}

const QrControls: React.FC<QrControlsProps> = ({ options, setOptions, onReset }) => {
  const [contentType, setContentType] = useState<QrContentType>(QrContentType.URL);
  const [logoPreview, setLogoPreview] = useState<string | null>(options.image || null);
  const [useGradient, setUseGradient] = useState(!!options.dotsOptions.gradient);
  const [isCopied, setIsCopied] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
  const initialGradient = options.dotsOptions.gradient || {
      type: 'linear',
      rotation: 0,
      colorStops: [{ offset: 0, color: '#ff8900' }, { offset: 1, color: '#b821ff' }]
  };
  const [gradient, setGradient] = useState(initialGradient);

  // Sync local state when parent options change (e.g., on history load)
  useEffect(() => {
    setLogoPreview(options.image || null);
    const hasGradient = !!options.dotsOptions.gradient;
    setUseGradient(hasGradient);
    if(hasGradient) {
        setGradient(options.dotsOptions.gradient!);
    }
  }, [options]);

  const handleFullReset = useCallback(() => {
    onReset();
  }, [onReset]);

  useEffect(() => {
    if (useGradient) {
      setOptions(prev => ({
        ...prev,
        dotsOptions: { ...prev.dotsOptions, color: undefined, gradient: gradient }
      }));
    } else {
       setOptions(prev => ({
        ...prev,
        dotsOptions: { ...prev.dotsOptions, gradient: undefined, color: prev.dotsOptions.color || '#4267b2' }
      }));
    }
  }, [useGradient, gradient, setOptions]);

  const updateQrData = useCallback((data: string) => {
    setOptions(prev => ({ ...prev, data }));
  }, [setOptions]);
  
  const handleTabChange = useCallback((tabId: QrContentType) => {
    setContentType(tabId);
    let defaultData = '';
    switch(tabId) {
        case QrContentType.URL: defaultData = 'https://www.upb.ro/'; break;
        case QrContentType.WIFI: defaultData = 'WIFI:T:WPA;S:;P:;;'; break;
        case QrContentType.VCARD: defaultData = 'BEGIN:VCARD\nVERSION:3.0\nN:;;;;\nFN:\nORG:\nTEL;TYPE=WORK,VOICE:\nEMAIL:\nURL:\nEND:VCARD'; break;
        case QrContentType.EMAIL: defaultData = 'mailto:?subject=&body='; break;
        case QrContentType.EVENT: defaultData = 'BEGIN:VEVENT\nSUMMARY:\nLOCATION:\nDTSTART:\nDTEND:\nEND:VEVENT'; break;
        case QrContentType.TEXT: default: defaultData = ''; break;
    }
    updateQrData(defaultData);
  }, [updateQrData]);

  const handleOptionChange = useCallback((path: string, value: any) => {
    setOptions(prev => {
        const keys = path.split('.');
        const newOptions = JSON.parse(JSON.stringify(prev));
        let current = newOptions;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newOptions;
    });
  }, [setOptions]);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setOptions(prev => ({ ...prev, image: result }));
        setLogoPreview(result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }, [setOptions]);

  const removeLogo = useCallback(() => {
    setOptions(prev => {
      const { image, ...rest } = prev;
      return { ...rest, image: undefined };
    });
    setLogoPreview(null);
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }, [setOptions]);

  const applyTemplate = useCallback((templateOptions: Template['options']) => {
      setOptions(prev => {
          const newOptions = { ...prev, ...templateOptions, data: prev.data, image: prev.image };
          const hasGradient = !!newOptions.dotsOptions.gradient;
          setUseGradient(hasGradient);
          if (hasGradient) {
              setGradient(newOptions.dotsOptions.gradient!);
          }
          return newOptions;
      });
  }, [setOptions]);
  
  const handleShareStyle = useCallback(() => {
      const { data, width, height, image, ...styleOptions } = options;
      const jsonString = JSON.stringify(styleOptions);
      const encodedString = btoa(jsonString); // Base64 encode
      const url = `${window.location.origin}${window.location.pathname}#style=${encodedString}`;
      navigator.clipboard.writeText(url).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
      });
  }, [options]);

  const contentTabs = [
    { id: QrContentType.URL, label: 'URL', icon: <LinkIcon className="h-4 w-4" /> },
    { id: QrContentType.TEXT, label: 'Text', icon: <TextIcon className="h-4 w-4" /> },
    { id: QrContentType.WIFI, label: 'Wi-Fi', icon: <WifiIcon className="h-4 w-4" /> },
    { id: QrContentType.VCARD, label: 'Contact', icon: <UserIcon className="h-4 w-4" /> },
    { id: QrContentType.EMAIL, label: 'Email', icon: <MailIcon className="h-4 w-4" /> },
    { id: QrContentType.EVENT, label: 'Eveniment', icon: <CalendarIcon className="h-4 w-4" /> },
  ];

  const renderContentForm = () => {
    const commonProps = { onDataChange: updateQrData };
    const formComponents = {
      [QrContentType.URL]: <Input type="url" placeholder="https://exemplu.com" value={options.data} onChange={(e) => updateQrData(e.target.value)} />,
      [QrContentType.TEXT]: <textarea placeholder="Introduceți textul aici..." value={options.data} onChange={(e) => updateQrData(e.target.value)} rows={4} className="w-full px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"/>,
      [QrContentType.WIFI]: <WifiForm {...commonProps} />,
      [QrContentType.VCARD]: <VCardForm {...commonProps} />,
      [QrContentType.EMAIL]: <EmailForm {...commonProps} />,
      [QrContentType.EVENT]: <EventForm {...commonProps} />,
    };
    return formComponents[contentType] || null;
  };

  return (
    <div className="space-y-6">
       <Card>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Panou de Control</CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Personalizează codul tău QR.</p>
            </div>
            <Button variant="outline" size="md" onClick={handleFullReset} aria-label="Resetează setările">
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Reset
            </Button>
        </div>
      </Card>
      
      <Card>
          <CardHeader>
              <LayoutGridIcon className="w-6 h-6 text-indigo-600"/>
              <CardTitle>Șabloane de Design</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DESIGN_TEMPLATES.map(template => (
                  <Button key={template.name} variant="outline" size="sm" onClick={() => applyTemplate(template.options)}>
                      {template.name}
                  </Button>
              ))}
          </div>
      </Card>

      <Card>
        <Tabs tabs={contentTabs} activeTab={contentType} onTabChange={handleTabChange} />
        <div>{renderContentForm()}</div>
      </Card>

      <Card>
          <CardHeader>
              <FrameIcon className="w-6 h-6 text-indigo-600"/>
              <CardTitle>Cadru (Call-to-Action)</CardTitle>
          </CardHeader>
          <div className="space-y-4">
              <Input placeholder="Text cadru, ex: Scanează-mă!" value={options.frameOptions?.text || ''} onChange={e => handleOptionChange('frameOptions.text', e.target.value)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StyleSelect 
                      label="Font" 
                      value={options.frameOptions?.fontFamily || 'Arial, sans-serif'} 
                      onChange={v => handleOptionChange('frameOptions.fontFamily', v)} 
                      options={FRAME_FONT_OPTIONS}
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Dimensiune (px)</label>
                    <Input 
                        type="number" 
                        min="8" 
                        max="48"
                        value={options.frameOptions?.fontSize || 20} 
                        onChange={e => handleOptionChange('frameOptions.fontSize', parseInt(e.target.value, 10) || 20)} 
                    />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <ColorInput label="Culoare Text" value={options.frameOptions?.textColor || '#000000'} onChange={v => handleOptionChange('frameOptions.textColor', v)} />
                  <ColorInput label="Culoare Fundal Cadru" value={options.frameOptions?.backgroundColor || '#ffffff'} onChange={v => handleOptionChange('frameOptions.backgroundColor', v)} />
              </div>
          </div>
      </Card>
      
      <Card>
        <CardHeader>
          <PaletteIcon className="w-6 h-6 text-indigo-600"/>
          <CardTitle>Culori</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-between mb-4">
            <label htmlFor="gradient-toggle" className="text-sm font-medium text-slate-600 dark:text-slate-300">Folosește Gradient</label>
            <button role="switch" aria-checked={useGradient} onClick={() => setUseGradient(!useGradient)} id="gradient-toggle" className={`${useGradient ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                <span className={`${useGradient ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
            </button>
        </div>
        {useGradient ? (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <ColorInput label="Culoare 1" value={gradient.colorStops[0].color} onChange={v => setGradient(g => ({...g, colorStops: [{...g.colorStops[0], color: v}, g.colorStops[1]]}))} />
                    <ColorInput label="Culoare 2" value={gradient.colorStops[1].color} onChange={v => setGradient(g => ({...g, colorStops: [g.colorStops[0], {...g.colorStops[1], color: v}]}))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Tip Gradient</label>
                  <Select value={gradient.type} onChange={e => setGradient(g => ({...g, type: e.target.value as 'linear' | 'radial'}))}>
                      <option value="linear">Liniar</option>
                      <option value="radial">Radial</option>
                  </Select>
                </div>
            </div>
        ) : (
             <ColorInput label="Culoare Puncte" value={options.dotsOptions.color || '#000000'} onChange={v => handleOptionChange('dotsOptions.color', v)} />
        )}
        <hr className="my-4 border-slate-200 dark:border-slate-700" />
        <div className="grid grid-cols-2 gap-4">
            <ColorInput label="Culoare Fundal QR" value={options.backgroundOptions.color} onChange={v => handleOptionChange('backgroundOptions.color', v)} />
            <ColorInput label="Colțuri (exterior)" value={options.cornersSquareOptions?.color || '#000000'} onChange={v => handleOptionChange('cornersSquareOptions.color', v)} />
            <ColorInput label="Colțuri (interior)" value={options.cornersDotOptions?.color || '#000000'} onChange={v => handleOptionChange('cornersDotOptions.color', v)} />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <ShapesIcon className="w-6 h-6 text-indigo-600"/>
          <CardTitle>Forme</CardTitle>
        </CardHeader>
        <div className="space-y-4">
            <StyleSelect label="Stil Puncte" value={options.dotsOptions.type} onChange={v => handleOptionChange('dotsOptions.type', v)} options={DOT_STYLE_OPTIONS} />
            <StyleSelect label="Stil Colțuri (exterior)" value={options.cornersSquareOptions?.type || 'square'} onChange={v => handleOptionChange('cornersSquareOptions.type', v)} options={CORNER_STYLE_OPTIONS} />
            <StyleSelect label="Stil Colțuri (interior)" value={options.cornersDotOptions?.type || 'square'} onChange={v => handleOptionChange('cornersDotOptions.type', v)} options={CORNER_DOT_STYLE_OPTIONS} />
            <hr className="my-4 border-slate-200 dark:border-slate-700" />
            <div className="flex items-center justify-between">
                <label htmlFor="shape-toggle" className="text-sm font-medium text-slate-600 dark:text-slate-300">Formă Circulară</label>
                <button 
                    role="switch" 
                    aria-checked={options.shape === 'circle'} 
                    onClick={() => handleOptionChange('shape', options.shape === 'circle' ? 'square' : 'circle')} 
                    id="shape-toggle" 
                    className={`${options.shape === 'circle' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                    <span className={`${options.shape === 'circle' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                </button>
            </div>
        </div>
      </Card>
      
       <Card>
        <CardHeader>
          <ImageIcon className="w-6 h-6 text-indigo-600"/>
          <CardTitle>Logo</CardTitle>
        </CardHeader>
        {logoPreview && (
          <div className="mb-4 relative w-24 h-24 mx-auto p-2 border border-dashed rounded-lg border-slate-300 dark:border-slate-600">
            <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
            <Button variant="ghost" size="sm" className="absolute -top-2 -right-2 bg-white dark:bg-slate-700 rounded-full p-1 h-7 w-7" onClick={removeLogo} aria-label="Elimină logo">
              <TrashIcon className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
        <Button as="label" htmlFor="logo-upload" className="w-full cursor-pointer" variant="outline">
          {logoPreview ? 'Schimbă Logo' : 'Încarcă Logo (.png, .jpg)'}
        </Button>
        <Input id="logo-upload" type="file" accept="image/png, image/jpeg, image/svg+xml" className="hidden" onChange={handleLogoUpload} />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">Pentru rezultate optime, folosiți imagini pătrate.</p>
      </Card>

      <Card>
          <CardHeader>
              <ShieldCheckIcon className="w-6 h-6 text-indigo-600"/>
              <CardTitle>Setări Avansate</CardTitle>
          </CardHeader>
          <StyleSelect label="Corecția Erorilor" value={options.qrOptions?.errorCorrectionLevel || 'Q'} onChange={v => handleOptionChange('qrOptions.errorCorrectionLevel', v)} options={ERROR_CORRECTION_LEVELS} />
           <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Un nivel mai ridicat permite scanarea codului chiar dacă este parțial acoperit (de ex. de logo).</p>
      </Card>
      
      <Card>
          <CardHeader>
              <ToolIcon className="w-6 h-6 text-indigo-600"/>
              <CardTitle>Unelte</CardTitle>
          </CardHeader>
          <div className="space-y-3">
             <Button variant="outline" onClick={handleShareStyle} className="w-full">
                {isCopied ? <CheckIcon className="h-4 w-4 mr-2 text-green-500"/> : <Share2Icon className="h-4 w-4 mr-2"/>}
                {isCopied ? 'Copiat!' : 'Partajează Stilul'}
             </Button>
             <Button variant="outline" onClick={() => setIsBulkModalOpen(true)} className="w-full">
                <FileZipIcon className="h-4 w-4 mr-2"/>
                Generează în Masă (CSV)
             </Button>
          </div>
      </Card>
      
      <BulkGenerateModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)}
        styleOptions={options}
      />
    </div>
  );
};

const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
        <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-600 rounded-md p-1 bg-white dark:bg-slate-700">
            <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent appearance-none"/>
            <Input type="text" value={value} onChange={e => onChange(e.target.value)} className="border-none shadow-none focus:ring-0" />
        </div>
    </div>
);

const StyleSelect: React.FC<{label: string, value: string, onChange: (v: any) => void, options: {label: string, value: string}[]}> = ({label, value, onChange, options}) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
        <Select value={value} onChange={e => onChange(e.target.value)}>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </Select>
    </div>
);


export default QrControls;