import React, { useState } from 'react';
import type { CarbonData } from '../utils/carbonCalculator';
import { 
  Car, 
  Zap, 
  Flame,
  Utensils, 
  Trash2, 
  Check, 
  Plane,
  TrendingDown
} from 'lucide-react';

interface CarbonCalculatorProps {
  data: CarbonData;
  onChange: (newData: CarbonData) => void;
}

export const CarbonCalculator: React.FC<CarbonCalculatorProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'transport' | 'energy' | 'diet' | 'waste'>('transport');

  const updateTransport = (field: keyof CarbonData['transport'], value: any) => {
    onChange({
      ...data,
      transport: {
        ...data.transport,
        [field]: value,
      },
    });
  };

  const updateEnergy = (field: keyof CarbonData['energy'], value: any) => {
    onChange({
      ...data,
      energy: {
        ...data.energy,
        [field]: value,
      },
    });
  };

  const updateDiet = (field: keyof CarbonData['diet'], value: any) => {
    onChange({
      ...data,
      diet: {
        ...data.diet,
        [field]: value,
      },
    });
  };

  const updateWaste = (field: keyof CarbonData['waste'], value: any) => {
    onChange({
      ...data,
      waste: {
        ...data.waste,
        [field]: value,
      },
    });
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <TrendingDown color="var(--primary)" /> Activity Footprint Tracker
        </h2>
        <p style={{ marginTop: '0.4rem' }}>
          Input your lifestyle habits below. Calculations update dynamically to show your footprints.
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button 
          onClick={() => setActiveTab('transport')} 
          className={`tab-btn ${activeTab === 'transport' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Car size={16} /> Transportation
        </button>
        <button 
          onClick={() => setActiveTab('energy')} 
          className={`tab-btn ${activeTab === 'energy' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Zap size={16} /> Energy & Utilities
        </button>
        <button 
          onClick={() => setActiveTab('diet')} 
          className={`tab-btn ${activeTab === 'diet' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Utensils size={16} /> Diet & Food
        </button>
        <button 
          onClick={() => setActiveTab('waste')} 
          className={`tab-btn ${activeTab === 'waste' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Trash2 size={16} /> Waste & Consumption
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ marginTop: '1rem' }}>
        {/* TRANSPORT TAB */}
        {activeTab === 'transport' && (
          <div className="animate-fade-in grid-2">
            <div>
              <div className="form-group">
                <label className="form-label">Primary Vehicle Type</label>
                <select 
                  className="form-select"
                  value={data.transport.carType}
                  onChange={(e) => updateTransport('carType', e.target.value)}
                >
                  <option value="petrol">Petrol (Standard Gasoline)</option>
                  <option value="diesel">Diesel Car</option>
                  <option value="hybrid">Hybrid / Plug-in Hybrid</option>
                  <option value="electric">Electric Vehicle (EV)</option>
                  <option value="none">No Private Car (Transit Only)</option>
                </select>
              </div>

              {data.transport.carType !== 'none' && (
                <div className="form-group">
                  <label className="form-label">Car Mileage (km / month)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={data.transport.carDistance || ''}
                    placeholder="e.g. 500"
                    onChange={(e) => updateTransport('carDistance', Number(e.target.value))}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Typical commuter drives 600 - 1200 km per month.
                  </span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Motorbike Mileage (km / month)</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={data.transport.motorbike || ''}
                  placeholder="e.g. 0"
                  onChange={(e) => updateTransport('motorbike', Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <div className="form-group">
                <label className="form-label">Public Transit (km / month)</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={data.transport.publicTransit || ''}
                  placeholder="e.g. 200"
                  onChange={(e) => updateTransport('publicTransit', Number(e.target.value))}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Includes subways, trains, trams, and public buses.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Plane size={14} /> Annual Flight Hours
                </label>
                <input 
                  type="number" 
                  className="form-input"
                  value={data.transport.flights || ''}
                  placeholder="e.g. 10"
                  onChange={(e) => updateTransport('flights', Number(e.target.value))}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Estimate total flying time this year (1 round-trip transcontinental flight is ~12-15 hours).
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ENERGY TAB */}
        {activeTab === 'energy' && (
          <div className="animate-fade-in grid-2">
            <div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Zap size={14} color="#f59e0b" /> Electricity Consumption (kWh / month)
                </label>
                <input 
                  type="number" 
                  className="form-input"
                  value={data.energy.electricity || ''}
                  placeholder="e.g. 250"
                  onChange={(e) => updateEnergy('electricity', Number(e.target.value))}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Average apartment uses ~200 kWh; house uses ~400+ kWh.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Flame size={14} color="var(--accent)" /> Natural Gas (kWh or equivalent / month)
                </label>
                <input 
                  type="number" 
                  className="form-input"
                  value={data.energy.gas || ''}
                  placeholder="e.g. 150"
                  onChange={(e) => updateEnergy('gas', Number(e.target.value))}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Used for space heating, cooking, or water boilers.
                </span>
              </div>
            </div>

            <div>
              <div className="form-group glass-panel" style={{ padding: '1.25rem' }}>
                <label className="form-label" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Clean Energy Tariff Share: {data.energy.cleanEnergyShare}%
                </label>
                <p style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Does your home electricity plan use solar/wind certificates or have solar panels installed? Slide to credit clean electricity.
                </p>
                <div className="premium-slider-container">
                  <input 
                    type="range" 
                    className="premium-slider" 
                    min="0" 
                    max="100" 
                    value={data.energy.cleanEnergyShare}
                    onChange={(e) => updateEnergy('cleanEnergyShare', Number(e.target.value))}
                  />
                  <div className="slider-labels">
                    <span>0% Coal/Gas Grid</span>
                    <span>50% Mixed</span>
                    <span>100% Net Zero Solar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIET TAB */}
        {activeTab === 'diet' && (
          <div className="animate-fade-in grid-2">
            <div>
              <div className="form-group">
                <label className="form-label">Diet Classification</label>
                <select 
                  className="form-select"
                  value={data.diet.dietType}
                  onChange={(e) => updateDiet('dietType', e.target.value)}
                >
                  <option value="heavy-meat">Heavy Meat Eater (Daily beef/pork/lamb)</option>
                  <option value="medium-meat">Medium Meat Eater (Chicken/poultry, infrequent red meat)</option>
                  <option value="low-meat">Low Meat / Flexitarian (Occasional meat, mostly plant-based)</option>
                  <option value="vegetarian">Vegetarian (No meat, does eat eggs/dairy)</option>
                  <option value="vegan">Vegan (Strictly plant-based, 0 animal products)</option>
                </select>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
                  Red meat production generates significantly higher greenhouse gas emissions than plant protein.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Food Waste Levels</label>
                <select 
                  className="form-select"
                  value={data.diet.foodWaste}
                  onChange={(e) => updateDiet('foodWaste', e.target.value)}
                >
                  <option value="low">Low (Rarely throw away leftovers or expired foods)</option>
                  <option value="medium">Medium (Moderate food wastage)</option>
                  <option value="high">High (Throw away food often)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="form-group glass-panel" style={{ padding: '1.25rem' }}>
                <label className="form-label" style={{ color: 'var(--primary)' }}>
                  Locally Sourced Food: {data.diet.localFoodShare}%
                </label>
                <p style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Percentage of vegetables, fruits, and dry goods grown within your region (reduced food-miles).
                </p>
                <div className="premium-slider-container">
                  <input 
                    type="range" 
                    className="premium-slider" 
                    min="0" 
                    max="100" 
                    value={data.diet.localFoodShare}
                    onChange={(e) => updateDiet('localFoodShare', Number(e.target.value))}
                  />
                  <div className="slider-labels">
                    <span>Global Imports</span>
                    <span>50% Local Farms</span>
                    <span>100% Farmers Market</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WASTE TAB */}
        {activeTab === 'waste' && (
          <div className="animate-fade-in grid-2">
            <div>
              <div className="form-group">
                <label className="form-label">Household Trash Bags (kg / week)</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={data.waste.trashWeight || ''}
                  placeholder="e.g. 10"
                  onChange={(e) => updateWaste('trashWeight', Number(e.target.value))}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  1 typical full garbage bag is ~5 to 8 kg.
                </span>
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={data.waste.composting}
                    onChange={(e) => updateWaste('composting', e.target.checked)}
                    style={checkboxStyle}
                  />
                  <span style={{ textTransform: 'none', letterSpacing: 'normal', fontSize: '0.95rem' }}>
                    We compost kitchen organic waste (leaves, scraps)
                  </span>
                </label>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '1.8rem', marginTop: '0.2rem' }}>
                  Prevents organic waste from breaking down into harmful methane gas in traditional landfills.
                </p>
              </div>
            </div>

            <div>
              <div className="form-group glass-panel" style={{ padding: '1.25rem' }}>
                <label className="form-label" style={{ color: 'var(--primary)' }}>
                  Recycling Rate: {data.waste.recycleShare}%
                </label>
                <p style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Percentage of glass, plastic, paper, and metal that you successfully segregate and recycle.
                </p>
                <div className="premium-slider-container">
                  <input 
                    type="range" 
                    className="premium-slider" 
                    min="0" 
                    max="100" 
                    value={data.waste.recycleShare}
                    onChange={(e) => updateWaste('recycleShare', Number(e.target.value))}
                  />
                  <div className="slider-labels">
                    <span>No recycling</span>
                    <span>50% Moderate recycling</span>
                    <span>100% Full circular recycling</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '600' }}>
          <Check size={18} /> Stats automatically saved to browser storage.
        </div>
      </div>
    </div>
  );
};

const checkboxStyle: React.CSSProperties = {
  width: '18px',
  height: '18px',
  accentColor: 'var(--primary)',
  cursor: 'pointer',
};
