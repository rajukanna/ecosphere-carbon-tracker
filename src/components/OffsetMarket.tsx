import React, { useState } from 'react';
import { OFFSET_PROJECTS, type OffsetProject } from '../utils/carbonCalculator';
import { Leaf, Award, DollarSign, Check, Plus, RefreshCw } from 'lucide-react';

interface OffsetMarketProps {
  monthlyEmissions: number;
  offsetAmount: number;
  onOffsetChange: (amount: number) => void;
}

export const OffsetMarket: React.FC<OffsetMarketProps> = ({
  monthlyEmissions,
  offsetAmount,
  onOffsetChange
}) => {
  const [purchasedQty, setPurchasedQty] = useState<{ [id: string]: number }>({});
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const handleSimulateOffset = (project: OffsetProject) => {
    // We offset 100 kg at a time, or the remainder to reach carbon neutral
    const remainingToNeutral = Math.max(0, monthlyEmissions - offsetAmount);
    const amountToOffset = remainingToNeutral > 0 && remainingToNeutral < 100 ? remainingToNeutral : 100;
    
    if (amountToOffset === 0) return;

    onOffsetChange(offsetAmount + amountToOffset);
    setPurchasedQty(prev => ({
      ...prev,
      [project.id]: (prev[project.id] || 0) + amountToOffset
    }));

    setShowSuccess(project.title);
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleResetOffsets = () => {
    onOffsetChange(0);
    setPurchasedQty({});
  };

  const netEmissions = Math.max(0, monthlyEmissions - offsetAmount);
  const isNeutral = netEmissions === 0;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
      <div style={marketHeaderStyle}>
        <div>
          <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Leaf color="var(--primary)" /> Carbon Offset Marketplace
          </h2>
          <p style={{ marginTop: '0.4rem' }}>
            Support verified climate action projects to balance your footprint and achieve carbon neutrality.
          </p>
        </div>
        
        {offsetAmount > 0 && (
          <button onClick={handleResetOffsets} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <RefreshCw size={14} /> Clear Supported Projects
          </button>
        )}
      </div>

      {/* Net Neutral Banner */}
      <div style={neutralBannerStyle(isNeutral)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={neutralIconStyle(isNeutral)}>
            {isNeutral ? <Award size={24} /> : <Leaf size={24} />}
          </div>
          <div>
            <h3 style={{ color: 'white', fontSize: '1.15rem' }}>
              {isNeutral ? 'Congratulations! You are Carbon Neutral.' : 'Path to Carbon Neutrality'}
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', marginTop: '0.1rem' }}>
              {isNeutral 
                ? 'Your active offsets cover 100% of your monthly emissions. Keep it up!' 
                : `You need to support projects to offset your remaining ${netEmissions} kg CO₂ of emissions.`}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>Offset Support Status</span>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>
            {offsetAmount} / {monthlyEmissions} kg CO₂
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="glass-panel animate-fade-in" style={successBannerStyle}>
          <Check size={18} color="var(--primary)" /> Simulated offset contribution of <strong>100 kg CO₂</strong> registered to <strong>{showSuccess}</strong>!
        </div>
      )}

      {/* Project Catalog Grid */}
      <div className="grid-2" style={{ marginTop: '1.5rem' }}>
        {OFFSET_PROJECTS.map((project) => {
          const supportedForThis = purchasedQty[project.id] || 0;
          const costToOffset100Kg = (project.pricePerTon * 100) / 1000;
          const costToNeutralizeEntirely = (project.pricePerTon * netEmissions) / 1000;

          // Placeholder illustrations using styled SVG templates rather than missing files
          return (
            <div key={project.id} className="glass-card" style={projectCardStyle}>
              {/* Image banner replacement with clean CSS gradient blocks */}
              <div style={projectImageWrapperStyle(project.image)}>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }} className="badge badge-info">
                  ${project.pricePerTon} / Metric Ton
                </div>
                <div style={projectTitleBlockStyle}>
                  <h4 style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{project.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#c084fc', textShadow: '0 1px 2px rgba(0,0,0,0.8)', fontWeight: '600' }}>{project.location}</span>
                </div>
              </div>

              <div style={projectBodyStyle}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '65px' }}>
                  {project.description}
                </p>

                <div style={developerStyle}>
                  <span>Developed by: {project.developer}</span>
                  {supportedForThis > 0 && (
                    <span className="badge badge-success">Supporting {supportedForThis} kg CO₂</span>
                  )}
                </div>

                <div style={actionRowStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SUPPORT EMISSIONS (100 kg CO₂)</span>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center' }}>
                      <DollarSign size={16} color="var(--primary)" /> {costToOffset100Kg.toFixed(2)} USD
                    </span>
                  </div>

                  <button 
                    onClick={() => handleSimulateOffset(project)}
                    className="btn btn-primary"
                    disabled={isNeutral}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Plus size={14} /> Offset 100 kg
                  </button>
                </div>

                {netEmissions > 0 && (
                  <div style={neutralizeAllRowStyle}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Neutralize full remaining footprint ({netEmissions} kg):</span>
                    <button 
                      onClick={() => {
                        onOffsetChange(offsetAmount + netEmissions);
                        setPurchasedQty(prev => ({
                          ...prev,
                          [project.id]: (prev[project.id] || 0) + netEmissions
                        }));
                      }}
                      style={neutralizeAllButtonStyle}
                    >
                      Buy Net Zero (${costToNeutralizeEntirely.toFixed(2)})
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Styling Variables
const marketHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
  gap: '1rem',
};

const neutralBannerStyle = (isNeutral: boolean): React.CSSProperties => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: isNeutral 
    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.1) 100%)' 
    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(10, 13, 26, 0.8) 100%)',
  border: `1px solid ${isNeutral ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}`,
  padding: '1.25rem 1.5rem',
  borderRadius: '12px',
  flexWrap: 'wrap',
  gap: '1rem',
});

const neutralIconStyle = (isNeutral: boolean): React.CSSProperties => ({
  width: '45px',
  height: '45px',
  borderRadius: '50%',
  backgroundColor: isNeutral ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
  color: isNeutral ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: isNeutral ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none',
});

const successBannerStyle: React.CSSProperties = {
  marginTop: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: 'rgba(16, 185, 129, 0.08)',
  borderColor: 'rgba(16, 185, 129, 0.3)',
  color: '#34d399',
  padding: '0.8rem 1rem',
};

const projectCardStyle: React.CSSProperties = {
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const projectImageWrapperStyle = (imageType: string): React.CSSProperties => {
  let gradient = 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)'; // Reforestation
  if (imageType === 'mangroves') gradient = 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)';
  else if (imageType === 'wind_energy') gradient = 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)';
  else if (imageType === 'methane_capture') gradient = 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)';

  return {
    height: '140px',
    background: gradient,
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '1.25rem',
  };
};

const projectTitleBlockStyle: React.CSSProperties = {
  zIndex: 1,
  width: '100%',
};

const projectBodyStyle: React.CSSProperties = {
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  flex: 1,
};

const developerStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '0.5rem',
};

const actionRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '0.25rem',
};

const neutralizeAllRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px dashed var(--border-color)',
  padding: '0.4rem 0.6rem',
  borderRadius: '6px',
  marginTop: '0.5rem',
};

const neutralizeAllButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--primary)',
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: '700',
  textDecoration: 'underline',
  outline: 'none',
};
