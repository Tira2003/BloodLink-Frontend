import { Filter, ChevronDown, X, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import { FormGroup, FormLabel, FormSelect } from '../ui/FormField';
import DropdownMenu from '../ui/DropdownMenu';
import { SL_DISTRICTS } from '../../constants';

export default function CampFilters({
  district,
  upcoming,
  filtersOpen,
  isLoading,
  count,
  onDistrictChange,
  onUpcomingToggle,
  onToggleFilters,
}) {
  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Button variant="ghost" size="sm" onClick={onToggleFilters}>
            <Filter size={15} /> Filter
            <ChevronDown size={13} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </Button>

          {filtersOpen && (
            <DropdownMenu className="left-0 right-auto w-[min(92vw,320px)] p-4">
              <FormGroup>
                <FormLabel htmlFor="filter-district-camp">Filter by District</FormLabel>
                <FormSelect id="filter-district-camp" value={district}
                  onChange={(e) => onDistrictChange(e.target.value)}>
                  <option value="">All districts</option>
                  {SL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </FormSelect>
              </FormGroup>
            </DropdownMenu>
          )}
        </div>

        <Button
          variant={upcoming ? 'primary' : 'secondary'}
          size="sm"
          onClick={onUpcomingToggle}
        >
          <Calendar size={14} /> {upcoming ? 'Upcoming only' : 'All camps'}
        </Button>

        {district && (
          <span className="inline-flex items-center gap-1.5 bg-primary-light text-primary-dark px-2.5 py-1 rounded-full text-xs font-semibold">
            {district}
            <button onClick={() => onDistrictChange('')} aria-label="Remove district filter">
              <X size={11} />
            </button>
          </span>
        )}

        <span className="text-xs text-text-muted ml-auto">
          {isLoading ? 'Loading…' : `${count} camp${count !== 1 ? 's' : ''}`}
        </span>
      </div>

    </div>
  );
}
