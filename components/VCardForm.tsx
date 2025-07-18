
import React, { useState, useEffect } from 'react';
import Input from './ui/Input';

interface VCardFormProps {
  onDataChange: (data: string) => void;
}

const VCardForm: React.FC<VCardFormProps> = ({ onDataChange }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    company: '',
    website: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  // Acest efect este apelat de fiecare dată când se modifică o valoare din formular
  // pentru a reconstrui și a trimite datele formatate către componenta părinte.
  useEffect(() => {
    // Construiește string-ul de date în format vCard.
    const { firstName, lastName, phone, email, company, website } = formData;
    const vCard = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${firstName} ${lastName}
ORG:${company}
TEL;TYPE=WORK,VOICE:${phone}
EMAIL:${email}
URL:${website}
END:VCARD`;
    onDataChange(vCard);
  }, [formData, onDataChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input name="firstName" placeholder="Prenume" value={formData.firstName} onChange={handleChange} aria-label="Prenume" />
        <Input name="lastName" placeholder="Nume" value={formData.lastName} onChange={handleChange} aria-label="Nume" />
      </div>
      <Input name="phone" type="tel" placeholder="Telefon" value={formData.phone} onChange={handleChange} aria-label="Telefon" />
      <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} aria-label="Email" />
      <Input name="company" placeholder="Companie" value={formData.company} onChange={handleChange} aria-label="Companie" />
      <Input name="website" type="url" placeholder="Website (https://...)" value={formData.website} onChange={handleChange} aria-label="Website" />
    </div>
  );
};

export default VCardForm;
