
import React, { useState, useEffect } from 'react';
import Input from './ui/Input';

interface EventFormProps {
  onDataChange: (data: string) => void;
}

// Funcție ajutătoare pentru a formata data și ora în formatul iCal (YYYYMMDDTHHMMSSZ).
const formatDateTime = (date: string, time: string): string => {
  if (!date || !time) return '';
  // Combină data și ora, creează un obiect Date și îl convertește în string ISO (UTC).
  // Apoi, formatează string-ul conform standardului iCal eliminând caracterele nedorite.
  return new Date(`${date}T${time}`).toISOString().replace(/-|:|\.\d{3}/g, '');
};


const EventForm: React.FC<EventFormProps> = ({ onDataChange }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  // Acest efect este apelat de fiecare dată când se modifică o valoare din formular
  // pentru a reconstrui și a trimite datele formatate către componenta părinte.
  useEffect(() => {
    const { title, location, startDate, startTime, endDate, endTime } = formData;
    const dtstart = formatDateTime(startDate, startTime);
    const dtend = formatDateTime(endDate, endTime);

    // Construiește string-ul de date în format iCalendar (VEVENT).
    const iCal = `BEGIN:VEVENT
SUMMARY:${title}
LOCATION:${location}
DTSTART:${dtstart}
DTEND:${dtend}
END:VEVENT`;
    onDataChange(iCal);
  }, [formData, onDataChange]);

  return (
    <div className="space-y-4">
      <Input name="title" placeholder="Titlu eveniment" value={formData.title} onChange={handleChange} aria-label="Titlu eveniment" />
      <Input name="location" placeholder="Locație" value={formData.location} onChange={handleChange} aria-label="Locație" />
      
      <fieldset className="grid grid-cols-2 gap-4">
        <legend className="text-sm font-medium text-slate-600 mb-1 col-span-2">Început</legend>
        <Input name="startDate" type="date" value={formData.startDate} onChange={handleChange} aria-label="Data de început" />
        <Input name="startTime" type="time" value={formData.startTime} onChange={handleChange} aria-label="Ora de început" />
      </fieldset>

      <fieldset className="grid grid-cols-2 gap-4">
        <legend className="text-sm font-medium text-slate-600 mb-1 col-span-2">Sfârșit</legend>
        <Input name="endDate" type="date" value={formData.endDate} onChange={handleChange} aria-label="Data de sfârșit" />
        <Input name="endTime" type="time" value={formData.endTime} onChange={handleChange} aria-label="Ora de sfârșit" />
      </fieldset>
    </div>
  );
};

export default EventForm;
