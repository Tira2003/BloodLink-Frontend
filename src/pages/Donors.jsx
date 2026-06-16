import { useState } from 'react';
import { MapPin, Phone, Calendar, Droplets, Search, Filter, Heart } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { mockDonors, BLOOD_TYPES } from '../data/mockData';

export default function Donors() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterAvail, setFilterAvail] = useState('');

  const filtered = mockDonors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || d.bloodType === filterType;
    const matchCity = !filterCity || d.city.toLowerCase().includes(filterCity.toLowerCase());
    const matchAvail = !filterAvail || (filterAvail === 'available' ? d.available : !d.available);
    return matchSearch && matchType && matchCity && matchAvail;
  });

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--dark-900)', paddingTop: '5rem' }}>
        {/* Page header */}
        <div style={{ background: 'var(--dark-800)', borderBottom: 'var(--border-subtle)', padding: '3rem 0 2rem' }}>
          <div className="container">
            <h1 className="page-title">Find <span className="text-gradient">Blood Donors</span></h1>
            <p className="page-subtitle">Browse verified donors by blood type, city, and availability</p>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap mt-6">
              <div className="search-bar flex-1" style={{ minWidth: '200px' }}>
                <Search size={16} className="search-icon" />
                <input className="form-input w-full" placeholder="Search donors by name..." value={search}
                  onChange={e => setSearch(e.target.value)} id="donor-search" style={{ paddingLeft: '2.75rem' }} />
              </div>
              <select className="form-input" style={{ width: '150px' }} value={filterType}
                onChange={e => setFilterType(e.target.value)} id="filter-blood-type">
                <option value="">All Types</option>
                {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className="form-input" style={{ width: '150px' }} placeholder="City..." value={filterCity}
                onChange={e => setFilterCity(e.target.value)} id="filter-city" />
              <select className="form-input" style={{ width: '150px' }} value={filterAvail}
                onChange={e => setFilterAvail(e.target.value)} id="filter-availability">
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-secondary text-sm">{filtered.length} donor{filtered.length !== 1 ? 's' : ''} found</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {filtered.map(donor => (
              <div key={donor.id} className="glass-card donor-card animate-fadeIn">
                <div className="donor-card-header">
                  <div className="blood-badge blood-badge-lg">{donor.bloodType}</div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-primary">{donor.name}</h3>
                      <span className={`badge ${donor.available ? 'badge-available' : 'badge-unavailable'}`}>
                        {donor.available ? '● Available' : '○ Unavailable'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-secondary text-sm mt-1">
                      <MapPin size={12} /> {donor.city}
                    </div>
                  </div>
                </div>

                <div className="donor-card-stats">
                  <div className="donor-card-stat">
                    <span className="donor-card-stat-value">{donor.totalDonations}</span>
                    <span className="donor-card-stat-label">Donations</span>
                  </div>
                  <div className="donor-card-stat">
                    <span className="donor-card-stat-value">{donor.age}</span>
                    <span className="donor-card-stat-label">Age</span>
                  </div>
                  <div className="donor-card-stat">
                    <span className="donor-card-stat-value text-xs">{new Date(donor.lastDonated).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}</span>
                    <span className="donor-card-stat-label">Last Donated</span>
                  </div>
                </div>

                {donor.available && (
                  <div className="flex gap-2 mt-3">
                    <a href={`tel:${donor.phone}`} className="btn btn-secondary btn-sm flex-1">
                      <Phone size={14} /> Call
                    </a>
                    <button className="btn btn-primary btn-sm flex-1" id={`request-donor-${donor.id}`}>
                      <Heart size={14} /> Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center" style={{ padding: '4rem 0' }}>
              <Droplets size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 className="font-bold text-lg mb-2">No donors found</h3>
              <p className="text-secondary">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
