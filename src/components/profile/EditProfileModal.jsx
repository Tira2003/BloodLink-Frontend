import { useState } from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { FormGroup, FormLabel, FormInput, FormSelect } from '../ui/FormField';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { SL_DISTRICTS } from '../../constants';

export default function EditProfileModal({ profile, open, onClose, onSave }) {
  const [form, setForm] = useState({ ...profile });
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader title="Edit Profile" onClose={onClose} />
      <ModalBody className="flex flex-col gap-4">
        <FormGroup>
          <FormLabel htmlFor="ep-name">Full Name</FormLabel>
          <FormInput id="ep-name" value={form.fullName || ''}
            onChange={(e) => update('fullName', e.target.value)} />
        </FormGroup>
        <div className="grid grid-cols-2 gap-4">
          <FormGroup>
            <FormLabel htmlFor="ep-phone">Phone</FormLabel>
            <FormInput id="ep-phone" type="tel" value={form.phone || ''}
              onChange={(e) => update('phone', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="ep-age">Age</FormLabel>
            <FormInput id="ep-age" type="number" value={form.age || ''}
              onChange={(e) => update('age', e.target.value)} min="18" max="65" />
          </FormGroup>
        </div>
        <FormGroup>
          <FormLabel htmlFor="ep-district">District</FormLabel>
          <FormSelect id="ep-district" value={form.district || ''}
            onChange={(e) => update('district', e.target.value)}>
            <option value="">Select district</option>
            {SL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </FormSelect>
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="ep-hospital">Nearest Hospital</FormLabel>
          <FormInput id="ep-hospital" value={form.nearestHospital || ''}
            onChange={(e) => update('nearestHospital', e.target.value)} />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <><LoadingSpinner light /> Saving…</> : 'Save Changes'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
