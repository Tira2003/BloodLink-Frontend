import { useState } from 'react';
import {
  User, Mail, Phone, Lock, Droplets, Building2, Eye, EyeOff, MapPin,
} from 'lucide-react';
import { BLOOD_TYPES } from '../../data/mockData';
import { SL_DISTRICTS } from '../../constants';
import {
  FormGroup, FormLabel, FormInput, FormSelect, FormError, FormHint,
} from '../ui/FormField';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function DonorRegisterForm({ onSubmit, loading, serverError }) {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', age: '',
    district: '', nearestHospital: '', bloodType: '',
    password: '', confirmPassword: '', agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email address';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    const age = parseInt(form.age);
    if (!form.age || age < 18 || age > 65) e.age = 'Age must be between 18 and 65';
    if (!form.district) e.district = 'Please select your district';
    if (!form.nearestHospital.trim()) e.nearestHospital = 'Nearest hospital is required';
    if (!form.bloodType) e.bloodType = 'Please select your blood type';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms';
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
        <div className="grid sm:grid-cols-2 gap-4">
          <FormGroup className="sm:col-span-2">
            <FormLabel htmlFor="reg-fullname">Full Name *</FormLabel>
            <FormInput id="reg-fullname" icon={User} placeholder="Kamal Gunarathna"
              value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
            <FormError>{errors.fullName}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="reg-email">Email *</FormLabel>
            <FormInput id="reg-email" type="email" icon={Mail} placeholder="you@email.com"
              value={form.email} onChange={(e) => update('email', e.target.value)} />
            <FormError>{errors.email}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="reg-phone">Phone Number *</FormLabel>
            <FormInput id="reg-phone" type="tel" icon={Phone} placeholder="+94 77 123 4567"
              value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            <FormError>{errors.phone}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="reg-age">Age *</FormLabel>
            <FormInput id="reg-age" type="number" placeholder="25" min="18" max="65"
              value={form.age} onChange={(e) => update('age', e.target.value)} />
            <FormError>{errors.age}</FormError>
            {!errors.age && <FormHint>Must be 18 – 65 years</FormHint>}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="reg-district">District *</FormLabel>
            <FormSelect id="reg-district" icon={MapPin} value={form.district}
              onChange={(e) => update('district', e.target.value)}>
              <option value="">Select district</option>
              {SL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </FormSelect>
            <FormError>{errors.district}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="reg-bloodtype">Blood Type *</FormLabel>
            <FormSelect id="reg-bloodtype" icon={Droplets} iconClassName="text-red"
              value={form.bloodType} onChange={(e) => update('bloodType', e.target.value)}>
              <option value="">Select type</option>
              {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </FormSelect>
            <FormError>{errors.bloodType}</FormError>
          </FormGroup>

          <FormGroup className="sm:col-span-2">
            <FormLabel htmlFor="reg-hospital">Nearest Hospital *</FormLabel>
            <FormInput id="reg-hospital" icon={Building2} placeholder="e.g. National Hospital Colombo"
              value={form.nearestHospital} onChange={(e) => update('nearestHospital', e.target.value)} />
            <FormError>{errors.nearestHospital}</FormError>
            {!errors.nearestHospital && (
              <FormHint>This helps us match you to nearby requests faster</FormHint>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="reg-password">Password *</FormLabel>
            <div className="relative">
              <FormInput id="reg-password" type={showPass ? 'text' : 'password'} icon={Lock}
                placeholder="Min. 8 characters" value={form.password}
                onChange={(e) => update('password', e.target.value)} className="pr-10" />
              <button type="button" onClick={() => setShowPass((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                aria-label={showPass ? 'Hide password' : 'Show password'}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <FormError>{errors.password}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="reg-confirm-password">Confirm Password *</FormLabel>
            <FormInput id="reg-confirm-password" type="password" placeholder="Repeat password"
              value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
            <FormError>{errors.confirmPassword}</FormError>
          </FormGroup>
        </div>

        <div className="flex items-start gap-3 mt-5 mb-5">
          <input type="checkbox" id="reg-terms" checked={form.agreeTerms}
            onChange={(e) => update('agreeTerms', e.target.checked)}
            className="mt-1 accent-primary w-4 h-4 shrink-0 cursor-pointer" />
          <label htmlFor="reg-terms" className="text-sm text-text-secondary cursor-pointer leading-relaxed">
            I agree to the <a href="#" className="text-primary font-semibold">Terms of Service</a> and{' '}
            <a href="#" className="text-primary font-semibold">Privacy Policy</a>
          </label>
        </div>
        <FormError>{errors.agreeTerms}</FormError>

        <Button type="submit" variant="primary" size="lg" className="w-full justify-center mt-2" disabled={loading}>
          {loading ? <><LoadingSpinner light /> Registering…</> : 'Create Donor Account →'}
        </Button>
      </form>
    </div>
  );
}
