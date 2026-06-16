import { Filter, ChevronDown, X } from 'lucide-react';
import Button from '../ui/Button';
import { FormGroup, FormLabel, FormInput, FormSelect } from '../ui/FormField';
import DropdownMenu from '../ui/DropdownMenu';
import { BLOOD_GROUPS } from '../../constants';

export default function RequestFilters({
  filters,
  filtersOpen,
  isDonor,
  isLoading,
  count,
  onToggle,
  onApply,
}) {
  const activeChips = [
    filters.bloodType && { key: 'bloodType', label: `Blood: ${filters.bloodType}` },
    filters.urgency && { key: 'urgency', label: `Urgency: ${filters.urgency}` },
    filters.district && { key: 'district', label: `District: ${filters.district}` },
  ].filter(Boolean);

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <Filter size={15} /> Filters
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`}
            />
          </Button>

          {filtersOpen && (
            <DropdownMenu className="left-0 right-auto w-[min(92vw,680px)] p-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {!isDonor && (
                  <FormGroup>
                    <FormLabel htmlFor="filter-type">Blood Type</FormLabel>
                    <FormSelect
                      id="filter-type"
                      value={filters.bloodType}
                      onChange={(e) => onApply('bloodType', e.target.value)}
                    >
                      <option value="">All types</option>
                      {BLOOD_GROUPS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </FormSelect>
                  </FormGroup>
                )}
                <FormGroup>
                  <FormLabel htmlFor="filter-urgency">Urgency</FormLabel>
                  <FormSelect
                    id="filter-urgency"
                    value={filters.urgency}
                    onChange={(e) => onApply('urgency', e.target.value)}
                  >
                    <option value="">All levels</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="filter-district">District</FormLabel>
                  <FormInput
                    id="filter-district"
                    placeholder="e.g. Colombo"
                    value={filters.district}
                    onChange={(e) => onApply('district', e.target.value)}
                  />
                </FormGroup>
              </div>
            </DropdownMenu>
          )}
        </div>

        {activeChips.map(({ key, label }) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 bg-primary-light text-primary-dark px-2.5 py-1 rounded-full text-xs font-semibold"
          >
            {label}
            <button onClick={() => onApply(key, '')} aria-label={`Remove ${label} filter`}>
              <X size={11} />
            </button>
          </span>
        ))}

        <span className="text-xs text-text-muted ml-auto">
          {isLoading ? 'Loading…' : `${count} request${count !== 1 ? 's' : ''}`}
        </span>
      </div>

    </div>
  );
}
