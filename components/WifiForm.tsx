
import React, { useState, useEffect } from 'react';
import Input from './ui/Input';
import Select from './ui/Select';

interface WifiFormProps {
  onDataChange: (data: string) => void;
}

const WifiForm: React.FC<WifiFormProps> = ({ onDataChange }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');

  // Acest efect este apelat de fiecare dată când se modifică o valoare din formular
  // pentru a reconstrui și a trimite datele formatate către componenta părinte.
  useEffect(() => {
    // Caracterele speciale din SSID și parolă trebuie "scăpate" conform specificațiilor.
    const escapedSsid = ssid.replace(/([\\;,"'])/g, '\\$1');
    const escapedPassword = password.replace(/([\\;,"'])/g, '\\$1');
    
    // Construiește string-ul de date pentru codul QR Wi-Fi.
    const wifiData = `WIFI:T:${encryption};S:${escapedSsid};P:${escapedPassword};;`;
    onDataChange(wifiData);
  }, [ssid, password, encryption, onDataChange]);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="ssid" className="block text-sm font-medium text-slate-600 mb-1">Nume Rețea (SSID)</label>
        <Input id="ssid" type="text" value={ssid} onChange={e => setSsid(e.target.value)} placeholder="Numele rețelei Wi-Fi" />
      </div>
      <div>
        <label htmlFor="wifi-password" className="block text-sm font-medium text-slate-600 mb-1">Parolă</label>
        <Input id="wifi-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Parola rețelei" />
      </div>
      <div>
        <label htmlFor="wifi-encryption" className="block text-sm font-medium text-slate-600 mb-1">Tip Securitate</label>
        <Select id="wifi-encryption" value={encryption} onChange={e => setEncryption(e.target.value)}>
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">Fără</option>
        </Select>
      </div>
    </div>
  );
};

export default WifiForm;
