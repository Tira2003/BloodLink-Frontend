import { useState } from 'react';
import { Tent } from 'lucide-react';
import { BLOOD_TYPES } from '../../data/mockData';
import { SL_DISTRICTS } from '../../constants';
import { campService } from '../../services/campService';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import {
  FormGroup, FormLabel, FormInput, FormSelect, FormTextarea, FormError,
} from '../ui/FormField';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function CreateCampModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '', location: '', district: '', date: '', startTime: '', endTime: '',
    bloodTypesNeeded: [], contactPhone: '', contactEmail: '', notes: '', targetUnits: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const toggleBloodType = (t) => {
    setForm((f) => ({
      ...f,
      bloodTypesNeeded: f.bloodTypesNeeded.includes(t)
        ? f.bloodTypesNeeded.filter((b) => b !== t)
        : [...f.bloodTypesNeeded, t],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Camp name is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.district) e.district = 'District is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.startTime) e.startTime = 'Start time is required';
    if (!form.contactPhone.trim()) e.contactPhone = 'Contact phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const created = await campService.create({
        ...form,
        targetUnits: parseInt(form.targetUnits) || 0,
      });
      onCreated(created);
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to create camp. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl">
      <ModalHeader
        title="Organize a Donation Camp"
        subtitle="Fill in the details and publish your camp"
        onClose={onClose}
      />
      <ModalBody>
        {serverError && (
          <div role="alert" className="bg-red-light border border-red rounded-lg p-3.5 text-red-dark text-sm mb-4">
            {serverError}
          </div>
        )}
        <form id="create-camp-form" onSubmit={handleSubmit} noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormGroup className="sm:col-span-2">
              <FormLabel htmlFor="camp-name">Camp Name *</FormLabel>
              <FormInput id="camp-name" placeholder="e.g. Community Blood Drive 2026"
                value={form.name} onChange={(e) => update('name', e.target.value)} />
              <FormError>{errors.name}</FormError>
            </FormGroup>

            <FormGroup className="sm:col-span-2">
              <FormLabel htmlFor="camp-location">Venue / Address *</FormLabel>
              <FormInput id="camp-location" placeholder="National Hospital, Ward Place, Colombo"
                value={form.location} onChange={(e) => update('location', e.target.value)} />
              <FormError>{errors.location}</FormError>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="camp-district">District *</FormLabel>
              <FormSelect id="camp-district" value={form.district}
                onChange={(e) => update('district', e.target.value)}>
                <option value="">Select district</option>
                {SL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </FormSelect>
              <FormError>{errors.district}</FormError>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="camp-target">Target Units (optional)</FormLabel>
              <FormInput id="camp-target" type="number" placeholder="e.g. 100" min="1"
                value={form.targetUnits} onChange={(e) => update('targetUnits', e.target.value)} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="camp-date">Date *</FormLabel>
              <FormInput id="camp-date" type="date" value={form.date}
                onChange={(e) => update('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]} />
              <FormError>{errors.date}</FormError>
            </FormGroup>

            <div className="flex gap-3">
              <FormGroup className="flex-1">
                <FormLabel htmlFor="camp-start">Start Time *</FormLabel>
                <FormInput id="camp-start" type="time" value={form.startTime}
                  onChange={(e) => update('startTime', e.target.value)} />
                <FormError>{errors.startTime}</FormError>
              </FormGroup>
              <FormGroup className="flex-1">
                <FormLabel htmlFor="camp-end">End Time</FormLabel>
                <FormInput id="camp-end" type="time" value={form.endTime}
                  onChange={(e) => update('endTime', e.target.value)} />
              </FormGroup>
            </div>

            <FormGroup className="sm:col-span-2">
              <FormLabel>Blood Types Needed</FormLabel>
              <div className="flex flex-wrap gap-2 mt-1">
                {BLOOD_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleBloodType(t)}
                    className={`px-3 py-1 rounded-full text-sm font-bold border-2 transition-all cursor-pointer ${
                      form.bloodTypesNeeded.includes(t)
                        ? 'border-red bg-red-light text-red-dark'
                        : 'border-border bg-bg text-text-secondary hover:border-primary/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="camp-phone">Contact Phone *</FormLabel>
              <FormInput id="camp-phone" type="tel" placeholder="+94 11 123 4567"
                value={form.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} />
              <FormError>{errors.contactPhone}</FormError>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="camp-email">Contact Email (optional)</FormLabel>
              <FormInput id="camp-email" type="email" placeholder="blood@hospital.lk"
                value={form.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} />
            </FormGroup>

            <FormGroup className="sm:col-span-2">
              <FormLabel htmlFor="camp-notes">Additional Notes (optional)</FormLabel>
              <FormTextarea id="camp-notes" rows="3" placeholder="Walk-in donors welcome. Please bring NIC."
                value={form.notes} onChange={(e) => update('notes', e.target.value)} />
            </FormGroup>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" form="create-camp-form" type="submit" disabled={loading}>
          {loading ? <><LoadingSpinner light /> Publishing…</> : <><Tent size={15} /> Publish Camp</>}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
