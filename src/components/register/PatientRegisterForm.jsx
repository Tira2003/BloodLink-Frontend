import { useState } from 'react';
import {
  User, Mail, Phone, Lock, Droplets, Building2, Eye, EyeOff, MapPin, Phone as PhoneIcon,
} from 'lucide-react';
import { BLOOD_TYPES } from '../../data/mockData';
import { SL_DISTRICTS } from '../../constants';
import {
  FormGroup, FormLabel, FormInput, FormSelect, FormError, FormHint,
} from '../ui/FormField';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

/** Role selector card */
function RoleCard({ role, selected, onClick }) {
  const isPatient = role === 'RECIPIENT';
  return (
    <button
      type="button"
      onClick={() => onClick(role)}
      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-primary bg-primary-light text-primary-dark shadow-sm'
          : 'border-border bg-bg text-text-secondary hover:border-primary/40 hover:bg-primary-light/30'
      }`}
    >
      <span className="text-2xl">{isPatient ? '🏥' : '🏛️'}</span>
      <span className="font-semibold text-sm">{isPatient ? 'Patient' : 'Hospital'}</span>
      <span className="text-xs text-center leading-relaxed opacity-80">
        {isPatient
          ? 'Request blood for personal use'
          : 'Manage requests for your hospital'}
      </span>
    </button>
  );
}

export default function PatientRegisterForm({ onSubmit, loading, serverError }) {
  const [role, setRole] = useState('RECIPIENT');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', age: '',
    district: '', bloodType: '', password: '',
    confirmPassword: '', emergencyContact: '', agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  const isPatient = role === 'RECIPIENT';

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = isPatient ? 'Full name is required' : 'Hospital name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email address';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (isPatient) {
      const age = parseInt(form.age);
      if (!form.age || age < 1 || age > 120) e.age = 'Enter a valid age';
      if (!form.bloodType) e.bloodType = 'Please select your blood type';
    }
    if (!form.district) e.district = 'Please select a district';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, role });
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-8 shadow-sm">
      {/* Role selector */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-text mb-3">I am a…</p>
        <div className="flex gap-3">
          <RoleCard role="RECIPIENT" selected={role === 'RECIPIENT'} onClick={setRole} />
          <RoleCard role="HOSPITAL"  selected={role === 'HOSPITAL'}  onClick={setRole} />
        </div>
      </div>

      {serverError && (
        <div role="alert" className="bg-red-light border border-red rounded-lg p-3.5 text-red-dark text-sm mb-5">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormGroup className="sm:col-span-2">
            <FormLabel htmlFor="pr-fullname">
              {isPatient ? 'Full Name' : 'Hospital Name'} *
            </FormLabel>
            <FormInput
              id="pr-fullname"
              icon={isPatient ? User : Building2}
              placeholder={isPatient ? 'Saman Kumara' : 'National Hospital Colombo'}
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
            />
            <FormError>{errors.fullName}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="pr-email">Email *</FormLabel>
            <FormInput
              id="pr-email"
              type="email"
              icon={Mail}
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
            <FormError>{errors.email}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="pr-phone">Phone Number *</FormLabel>
            <FormInput
              id="pr-phone"
              type="tel"
              icon={Phone}
              placeholder="+94 77 123 4567"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
            <FormError>{errors.phone}</FormError>
          </FormGroup>

          {isPatient && (
            <>
              <FormGroup>
                <FormLabel htmlFor="pr-age">Age *</FormLabel>
                <FormInput
                  id="pr-age"
                  type="number"
                  placeholder="30"
                  min="1"
                  max="120"
                  value={form.age}
                  onChange={(e) => update('age', e.target.value)}
                />
                <FormError>{errors.age}</FormError>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="pr-bloodtype">Blood Type *</FormLabel>
                <FormSelect
                  id="pr-bloodtype"
                  icon={Droplets}
                  iconClassName="text-red"
                  value={form.bloodType}
                  onChange={(e) => update('bloodType', e.target.value)}
                >
                  <option value="">Select type</option>
                  {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </FormSelect>
                <FormError>{errors.bloodType}</FormError>
              </FormGroup>
            </>
          )}

          <FormGroup className={isPatient ? '' : 'sm:col-span-2'}>
            <FormLabel htmlFor="pr-district">District *</FormLabel>
            <FormSelect
              id="pr-district"
              icon={MapPin}
              value={form.district}
              onChange={(e) => update('district', e.target.value)}
            >
              <option value="">Select district</option>
              {SL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </FormSelect>
            <FormError>{errors.district}</FormError>
          </FormGroup>

          {isPatient && (
            <FormGroup className="sm:col-span-2">
              <FormLabel htmlFor="pr-emergency">Emergency Contact</FormLabel>
              <FormInput
                id="pr-emergency"
                type="tel"
                icon={PhoneIcon}
                placeholder="+94 77 999 8888 (optional)"
                value={form.emergencyContact}
                onChange={(e) => update('emergencyContact', e.target.value)}
              />
              <FormHint>A contact person we can reach in urgent situations</FormHint>
            </FormGroup>
          )}

          <FormGroup>
            <FormLabel htmlFor="pr-password">Password *</FormLabel>
            <div className="relative">
              <FormInput
                id="pr-password"
                type={showPass ? 'text' : 'password'}
                icon={Lock}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <FormError>{errors.password}</FormError>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="pr-confirm-password">Confirm Password *</FormLabel>
            <FormInput
              id="pr-confirm-password"
              type="password"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
            />
            <FormError>{errors.confirmPassword}</FormError>
          </FormGroup>
        </div>

        <div className="flex items-start gap-3 mt-5 mb-5">
          <input
            type="checkbox"
            id="pr-terms"
            checked={form.agreeTerms}
            onChange={(e) => update('agreeTerms', e.target.checked)}
            className="mt-1 accent-primary w-4 h-4 shrink-0 cursor-pointer"
          />
          <label htmlFor="pr-terms" className="text-sm text-text-secondary cursor-pointer leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-primary font-semibold">Terms of Service</a> and{' '}
            <a href="#" className="text-primary font-semibold">Privacy Policy</a>
          </label>
        </div>
        <FormError>{errors.agreeTerms}</FormError>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full justify-center mt-2"
          disabled={loading}
        >
          {loading
            ? <><LoadingSpinner light /> Registering…</>
            : `Create ${isPatient ? 'Patient' : 'Hospital'} Account →`}
        </Button>
      </form>
    </div>
  );
}
