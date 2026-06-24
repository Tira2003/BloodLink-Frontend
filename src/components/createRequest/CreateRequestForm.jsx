import { useState } from 'react';
import { User, Phone, MapPin, Building2, Droplets } from 'lucide-react';
import { BLOOD_TYPES } from '../../data/mockData';
import { SL_DISTRICTS } from '../../constants';
import UrgencySelector from './UrgencySelector';
import {
  FormGroup, FormLabel, FormInput, FormSelect, FormTextarea, FormError, FormHint,
} from '../ui/FormField';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function CreateRequestForm({ initialData = {}, onSubmit, loading, serverError }) {

  console.log("initialData: ", initialData);
  
  const [form, setForm] = useState({
    patientName: initialData.fullName || '',
    contactPhone: initialData.phone || '',
    district: initialData.district || initialData.city || '',
    bloodType:initialData.bloodType || '',
    units: 1,
    urgency: '',
    hospital: initialData.nearestHospital || '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = 'Patient / requester name is required';
    if (!form.contactPhone.trim()) e.contactPhone = 'Contact phone is required';
    if (!form.district) e.district = 'Please select your district';
    if (!form.bloodType) e.bloodType = 'Blood type is required';
    if (!form.units || form.units < 1 || form.units > 20) e.units = 'Enter a valid unit count (1–20)';
    if (!form.urgency) e.urgency = 'Please select urgency level';
    if (!form.hospital.trim()) e.hospital = 'Hospital name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-8 shadow-sm">
      {serverError && (
        <div role="alert" className="bg-red-light border border-red rounded-lg p-3.5 text-red-dark text-sm mb-5">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <UrgencySelector
          value={form.urgency}
          onChange={(v) => update('urgency', v)}
          error={errors.urgency}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <FormGroup>
            <FormLabel htmlFor="req-bloodtype">Blood Type Needed *</FormLabel>
            <FormSelect id="req-bloodtype" icon={Droplets} iconClassName="text-red"
              value={form.bloodType} onChange={(e) => update('bloodType', e.target.value)}>
              <option value="">Select type</option>
              {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </FormSelect>
            <FormError>{errors.bloodType}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="req-units">Units Needed *</FormLabel>
            <FormInput id="req-units" type="number" placeholder="1" min="1" max="20"
              value={form.units} onChange={(e) => update('units', parseInt(e.target.value) || 1)} />
            <FormError>{errors.units}</FormError>
            {!errors.units && <FormHint>1 unit = ~450 ml</FormHint>}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="req-patient">Patient / Requester Name *</FormLabel>
            <FormInput id="req-patient" icon={User} placeholder="Patient or your name"
              value={form.patientName} onChange={(e) => update('patientName', e.target.value)} />
            <FormError>{errors.patientName}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="req-phone">Contact Phone *</FormLabel>
            <FormInput id="req-phone" type="tel" icon={Phone} placeholder="+94 77 123 4567"
              value={form.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} />
            <FormError>{errors.contactPhone}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="req-district">District *</FormLabel>
            <FormSelect id="req-district" icon={MapPin} value={form.district}
              onChange={(e) => update('district', e.target.value)}>
              <option value="">Select district</option>
              {SL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </FormSelect>
            <FormError>{errors.district}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="req-hospital">Hospital *</FormLabel>
            <FormInput id="req-hospital" icon={Building2} placeholder="Hospital name"
              value={form.hospital} onChange={(e) => update('hospital', e.target.value)} />
            <FormError>{errors.hospital}</FormError>
          </FormGroup>

          <FormGroup className="sm:col-span-2">
            <FormLabel htmlFor="req-notes">Additional Notes (optional)</FormLabel>
            <FormTextarea id="req-notes" rows="3"
              placeholder="Any additional information for donors…"
              value={form.notes} onChange={(e) => update('notes', e.target.value)} />
          </FormGroup>
        </div>

        <Button type="submit" variant="cta" size="lg" className="w-full justify-center mt-5" disabled={loading}>
          {loading ? <><LoadingSpinner light /> Submitting…</> : <><Droplets size={17} /> Submit Blood Request</>}
        </Button>
      </form>
    </div>
  );
}
