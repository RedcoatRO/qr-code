
import React, { useState, useEffect } from 'react';
import Input from './ui/Input';

interface VCardFormProps {
  onDataChange: (data: string) => void;
}

const VCardForm: React.FC<VCardFormProps> = ({ onDataChange }) => {
  // State pentru a stoca toate datele din formularul vCard.
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',      // Funcția/Poziția
    phone: '',      // Telefon mobil
    workPhone: '',  // Telefon fix
    email: '',
    company: '',
    website: '',
    address: '',    // Adresa de corespondență
  });

  // Handler generic pentru actualizarea stării la modificarea unui câmp din formular.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  // Acest efect este apelat de fiecare dată când se modifică o valoare din formular
  // pentru a reconstrui și a trimite datele formatate către componenta părinte.
  useEffect(() => {
    // Funcție ajutătoare pentru a "scăpa" caracterele speciale conform specificației vCard (RFC 6350).
    // Caracterele precum ',', ';', '\' și newline-urile trebuie tratate special.
    const escape = (str: string) => str.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');

    const { firstName, lastName, title, phone, workPhone, email, company, website, address } = formData;
    
    // Construiește string-ul de date în format vCard, linie cu linie, pentru lizibilitate.
    const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
    
    // Numele (N) și Numele Formatat (FN) sunt câmpuri fundamentale.
    lines.push(`N:${escape(lastName)};${escape(firstName)};;;`);
    lines.push(`FN:${escape(firstName)} ${escape(lastName)}`);

    // Adaugă câmpurile opționale doar dacă au o valoare introdusă,
    // pentru a menține codul QR cât mai simplu și compact posibil.
    if (title) lines.push(`TITLE:${escape(title)}`);
    if (company) lines.push(`ORG:${escape(company)}`);
    if (phone) lines.push(`TEL;TYPE=CELL:${escape(phone)}`); // Telefon mobil
    if (workPhone) lines.push(`TEL;TYPE=WORK,VOICE:${escape(workPhone)}`); // Telefon fix
    if (email) lines.push(`EMAIL:${escape(email)}`);
    if (website) lines.push(`URL:${escape(website)}`);
    if (address) {
        // Formatul câmpului ADR este: cutie-poștală;adresă-extinsă;adresă-stradă;localitate;regiune;cod-poștal;țară
        // Pentru simplitate, stocăm întreaga adresă în componenta "adresă-stradă".
        lines.push(`ADR;TYPE=WORK:;;${escape(address)};;;;`);
    }

    lines.push('END:VCARD');
    
    const vCard = lines.join('\n');
    onDataChange(vCard);
  }, [formData, onDataChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input name="firstName" placeholder="Prenume" value={formData.firstName} onChange={handleChange} aria-label="Prenume" />
        <Input name="lastName" placeholder="Nume" value={formData.lastName} onChange={handleChange} aria-label="Nume" />
      </div>
      <Input name="title" placeholder="Funcție" value={formData.title} onChange={handleChange} aria-label="Funcție" />
      <Input name="company" placeholder="Companie" value={formData.company} onChange={handleChange} aria-label="Companie" />
      <Input name="phone" type="tel" placeholder="Telefon Mobil" value={formData.phone} onChange={handleChange} aria-label="Telefon Mobil" />
      <Input name="workPhone" type="tel" placeholder="Telefon Fix" value={formData.workPhone} onChange={handleChange} aria-label="Telefon Fix" />
      <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} aria-label="Email" />
      <Input name="website" type="url" placeholder="Website (https://...)" value={formData.website} onChange={handleChange} aria-label="Website" />
      <textarea
        name="address"
        placeholder="Adresă corespondență"
        value={formData.address}
        onChange={handleChange}
        rows={3}
        className="w-full px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:placeholder-slate-400"
        aria-label="Adresă corespondență"
      />
    </div>
  );
};

export default VCardForm;
