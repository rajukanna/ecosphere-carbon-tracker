import React, { useState } from 'react';
import { Compass, AlertCircle } from 'lucide-react';

export const RoutePlanner: React.FC = () => {
  const [distance, setDistance] = useState<number>(50);
  const [frequency, setFrequency] = useState<string>('one-off'); // one-off, daily, weekly, monthly

  const calculateEmissions = (dist: number, freq: string, factor: number, flatFee = 0) => {
    let multiplier = 1;
    if (freq === 'daily') multiplier = 30.4;
    else if (freq === 'weekly') multiplier = 4.3;
    else if (freq === 'monthly') multiplier = 1;

    return Math.round((dist * factor + flatFee) * multiplier);
  };

  // Emission Factors per km
  const options = [
    { name: 'Petrol Car', factor: 0.20, color: '#f43f5e', desc: 'Gasoline vehicle' },
    { name: 'Hybrid Car', factor: 0.10, color: '#fbbf24', desc: 'Petrol-electric hybrid' },
    { name: 'Electric Car (EV)', factor: 0.04, color: '#60a5fa', desc: 'Charged on grid mix' },
    { name: 'Bus / Train', factor: 0.04, color: '#a78bfa', desc: 'Public transit share' },
    { name: 'Bicycle / Walk', factor: 0.00, color: '#34d399', desc: 'Zero emissions' },
  ];

  // Flights are special: only make sense for longer distances, add takeoff overhead
  if (distance >= 150) {
    options.push({
      name: 'Commercial Flight',
      factor: 0.12,
      color: '#f472b6',
      desc: 'Average economy seating'
    });
  }

  // Calculate lists
  const data = options.map(opt => {
    // flights have flat takeoff emissions (approx 50kg per trip)
    const flatFee = opt.name === 'Commercial Flight' ? 50 : 0;
    const co2 = calculateEmissions(distance, frequency, opt.factor, flatFee);
    return {
      ...opt,
      co2
    };
  });

  const maxCO2 = Math.max(...data.map(d => d.co2), 1);
  const petrolCO2 = data.find(d => d.name === 'Petrol Car')?.co2 || 1;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Compass color="var(--primary)" aria-hidden="true" /> Travel Route Planner & Comparison
        </h2>
        <p style={{ marginTop: '0.4rem' }}>
          Plan an upcoming trip or analyze your daily commute to compare different modes of travel side-by-side.
        </p>
      </div>

      <div style={plannerGridStyle}>
        {/* Controls Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'white', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Trip Parameters
          </h3>

          <div className="form-group">
            <label htmlFor="input-trip-distance" className="form-label">Trip Distance (One-Way km)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                id="input-trip-distance"
                type="number" 
                className="form-input" 
                value={distance || ''} 
                min="1"
                onChange={(e) => setDistance(Math.max(1, Number(e.target.value)))}
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>km</span>
            </div>
            <div className="premium-slider-container" style={{ paddingBottom: 0, marginTop: '0.5rem' }}>
              <input 
                type="range" 
                className="premium-slider" 
                min="5" 
                max="1000" 
                step="5"
                value={distance} 
                onChange={(e) => setDistance(Number(e.target.value))}
                aria-label="Trip distance slider in kilometers"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="input-trip-frequency" className="form-label">Frequency</label>
            <select 
              id="input-trip-frequency"
              className="form-select" 
              value={frequency} 
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="one-off">One-Off Trip (Single journey)</option>
              <option value="daily">Daily Commute (30 days/month)</option>
              <option value="weekly">Weekly Commute (4.3 times/month)</option>
              <option value="monthly">Monthly Trip</option>
            </select>
          </div>

          <div style={suggestionBoxStyle}>
            <AlertCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.1rem' }} aria-hidden="true" />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>Did you know?</strong> Rail travel emits up to 85% less CO₂ than short-haul domestic flights. For trips under 500 km, train routes are cleaner and often faster terminal-to-terminal.
            </div>
          </div>
        </div>

        {/* Comparison Chart Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'white' }}>
            Carbon Comparison ({frequency === 'one-off' ? 'Single Trip' : 'Monthly Emissions'})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {data.map((opt) => {
              const percentage = (opt.co2 / maxCO2) * 100;
              const savings = petrolCO2 - opt.co2;
              const savingsPercent = Math.round((savings / (petrolCO2 || 1)) * 100);

              return (
                <div key={opt.name} style={chartRowStyle}>
                  <div style={labelContainerStyle}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'white' }}>{opt.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opt.desc}</span>
                  </div>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={chartBarBgStyle}>
                      <div style={chartBarFillStyle(percentage, opt.color)} />
                    </div>
                    <div style={co2BadgeStyle(opt.color)}>
                      {opt.co2.toLocaleString()} <span style={{ fontSize: '0.65rem' }}>kg CO₂</span>
                    </div>
                  </div>

                  {savings > 0 && opt.name !== 'Petrol Car' && (
                    <div style={savingsStyle}>
                      -{savingsPercent}% CO₂
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="glass-panel" style={{ borderLeft: '4px solid var(--primary)', padding: '1rem', marginTop: 'auto' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Reduction Potential:</strong> Switching from a Petrol Car to Public Transit / EV for this commute saves up to <strong>{Math.round((petrolCO2 - (data.find(d => d.name === 'Bus / Train')?.co2 || 0)))} kg CO₂</strong> {frequency === 'one-off' ? 'per trip' : 'every month'}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const plannerGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1.6fr',
  gap: '2rem',
};

const chartRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
};

const labelContainerStyle: React.CSSProperties = {
  width: '130px',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
};

const chartBarBgStyle: React.CSSProperties = {
  flex: 1,
  height: '14px',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  borderRadius: '7px',
  overflow: 'hidden',
  minWidth: '100px',
};

const chartBarFillStyle = (percent: number, color: string): React.CSSProperties => ({
  width: `${percent}%`,
  height: '100%',
  backgroundColor: color,
  borderRadius: '7px',
  boxShadow: `0 0 8px ${color}40`,
  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
});

const co2BadgeStyle = (color: string): React.CSSProperties => ({
  width: '85px',
  padding: '0.25rem 0.5rem',
  borderRadius: '6px',
  backgroundColor: `${color}15`,
  color: color,
  fontSize: '0.8rem',
  fontWeight: '700',
  textAlign: 'center',
  border: `1px solid ${color}30`,
  flexShrink: 0,
});

const savingsStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: '700',
  color: 'var(--primary)',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  padding: '0.2rem 0.4rem',
  borderRadius: '4px',
  width: '80px',
  textAlign: 'center',
};

const suggestionBoxStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  background: 'rgba(16, 185, 129, 0.05)',
  border: '1px solid rgba(16, 185, 129, 0.15)',
  borderRadius: '8px',
  padding: '0.8rem',
  marginTop: '1rem',
};

// CSS stylesheet overrides for route planner
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 820px) {
      div[style*="grid-template-columns: 1fr 1.6fr"] {
        grid-template-columns: 1fr !important;
        gap: 1.5rem !important;
      }
    }
  `;
  document.head.appendChild(style);
}
