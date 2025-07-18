import React, { useState, useEffect } from 'react';
import Input from './ui/Input';

interface EmailFormProps {
  onDataChange: (data: string) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onDataChange }) => {
  const [formData, setFormData] = useState({ to: '', subject: '', body: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Acest efect este apelat de fiecare dată când se modifică o valoare din formular
  // pentru a reconstrui și a trimite datele formatate către componenta părinte.
  useEffect(() => {
    // Construiește manual link-ul mailto:.
    // Folosim encodeURIComponent pentru a asigura compatibilitate maximă cu diversele
    // cititoare de coduri QR. Unele cititoare interpretează greșit caracterele speciale
    // (cum ar fi spațiul codificat ca '+') generate de URLSearchParams.
    const { to, subject, body } = formData;
    const params = [];
    if (subject) {
      params.push(`subject=${encodeURIComponent(subject)}`);
    }
    if (body) {
      params.push(`body=${encodeURIComponent(body)}`);
    }
    
    let queryString = '';
    if (params.length > 0) {
      queryString = `?${params.join('&')}`;
    }

    const mailto = `mailto:${to}${queryString}`;
    onDataChange(mailto);
  }, [formData, onDataChange]);

  return (
    <div className="space-y-4">
      <Input name="to" type="email" placeholder="Email destinatar" value={formData.to} onChange={handleChange} aria-label="Email destinatar" />
      <Input name="subject" type="text" placeholder="Subiect" value={formData.subject} onChange={handleChange} aria-label="Subiect" />
      <textarea
        name="body"
        placeholder="Mesaj..."
        value={formData.body}
        onChange={handleChange}
        rows={4}
        className="w-full px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        aria-label="Corpul mesajului"
      />
    </div>
  );
};

export default EmailForm;
