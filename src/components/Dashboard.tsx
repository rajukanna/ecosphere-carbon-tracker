import React from 'react';
import { 
  Car, 
  Zap, 
  Utensils, 
  Trash2,
  TreePine,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  Globe
} from 'lucide-react';

interface DashboardProps {
  emissions: {
    transport: number;
    energy: number;
    diet: number;
    waste: number;
    total: number;
  };
  netEmissions: number;
  offsetAmount: number;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  emissions, 
  netEmissions, 
  offsetAmount, 
  setActiveTab 
}) => {
  // Goals
  const targetMonthly = 167; // Paris target (approx 2 tons / year per person)
  const nationalAverage = 1200; // Standard monthly average (varies by region, using standard proxy)

  // Calculations
  const progressPercent = Math.min(100, Math.round((netEmissions / targetMonthly) * 100));
  const annualTotalTons = ((emissions.total * 12) / 1000).toFixed(1);
  const annualNetTons = ((netEmissions * 12) / 1000).toFixed(1);
  const treesNeeded = Math.round((emissions.total * 12) / 22); // average tree absorbs ~22kg/year

  // SVG Gauge Calculations
  const radius = 70;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // We want a 3/4 circle gauge
  const angleRange = 270; 
  const strokeDashoffset = circumference - (Math.min(100, progressPercent) / 100) * (angleRange / 360) * circumference;
  const rotationAngle = 180 - (360 - angleRange) / 2;

  // Determine feedback color
  let statusColor = 'var(--primary)';
  let statusText = 'Excellent (Net Zero Path)';
  if (netEmissions > nationalAverage) {
    statusColor = 'var(--accent)';
    statusText = 'Critical (Above Average)';
  } else if (netEmissions > targetMonthly) {
    statusColor = 'var(--warning)';
    statusText = 'Moderate (Above Paris Target)';
  }

  // Categories metadata
  const categories = [
    { name: 'Transport', value: emissions.transport, icon: Car, color: '#38bdf8', desc: 'Flights, driving, transit' },
    { name: 'Energy', value: emissions.energy, icon: Zap, color: '#fbbf24', desc: 'Electricity, natural gas' },
    { name: 'Diet & Food', value: emissions.diet, icon: Utensils, color: '#34d399', desc: 'Meat, local food, food waste' },
    { name: 'Waste', value: emissions.waste, icon: Trash2, color: '#f87171', desc: 'Landfill, recycling, compost' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Welcome / Overall Impact */}
      <div style={welcomeRowStyle}>
        <div>
          <h2 style={{ fontSize: '1.8rem' }}>Welcome Back, EcoCitizen</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Here is your real-time carbon footprint audit and reduction progress.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button className="btn btn-secondary" onClick={() => setActiveTab('calculator')}>
            Track Daily Activity
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('offsets')}>
            Offset Emissions
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={statsGridStyle}>
        {/* Left: Net Footprint Gauge */}
        <div className="glass-card" style={gaugeCardStyle}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Net Footprint Status
          </h3>
          
          <div style={gaugeContainerStyle}>
            <svg 
              width="200" 
              height="200" 
              style={{ transform: `rotate(${rotationAngle}deg)`, transformOrigin: 'center' }}
              role="img"
              aria-label={`Carbon Footprint Gauge: ${netEmissions} kilograms of CO2 per month, which is ${progressPercent}% of the Paris Agreement target`}
            >
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (angleRange / 360) * circumference}
                strokeLinecap="round"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={statusColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ 
                  transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease',
                  filter: `drop-shadow(0 0 6px ${statusColor}40)` 
                }}
              />
            </svg>
            <div style={gaugeTextContainerStyle} aria-live="polite" aria-atomic="true">
              <span style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'white', lineHeight: 1 }}>
                {netEmissions}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.2rem' }}>
                kg CO₂ / mo
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '-1rem' }}>
            <div style={{ fontWeight: '700', color: statusColor, fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              {netEmissions > targetMonthly && <AlertTriangle size={16} aria-hidden="true" />}
              {statusText}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Your net footprint is <strong>{progressPercent}%</strong> of the Paris Agreement target ({targetMonthly} kg/person).
            </p>
          </div>
        </div>

        {/* Right: Interactive Equivalents & Eco Metrics */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} color="var(--info)" aria-hidden="true" /> Environmental Footprint Impact
            </h3>
            <p style={{ fontSize: '0.9rem' }}>
              Calculations are based on monthly totals and annualized projection metrics.
            </p>
          </div>

          <div style={equivalentGridStyle}>
            <div style={equivalentItemStyle}>
              <div style={equivalentIconStyle('rgba(16, 185, 129, 0.1)', 'var(--primary)')}>
                <TreePine size={24} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>{treesNeeded}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pine Trees Needed / yr</div>
              </div>
            </div>

            <div style={equivalentItemStyle}>
              <div style={equivalentIconStyle('rgba(99, 102, 241, 0.1)', 'var(--secondary)')}>
                <Globe size={24} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>{annualTotalTons} t</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Annual CO₂ Gross</div>
              </div>
            </div>

            <div style={equivalentItemStyle}>
              <div style={equivalentIconStyle('rgba(14, 165, 233, 0.1)', 'var(--info)')}>
                <TrendingDown size={24} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>{offsetAmount} kg</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Offsets Purchased</div>
              </div>
            </div>

            <div style={equivalentItemStyle}>
              <div style={equivalentIconStyle('rgba(244, 63, 94, 0.1)', 'var(--accent)')}>
                <AlertTriangle size={24} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>{annualNetTons} t</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Annual CO₂ Net</div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ fontSize: '0.85rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <Lightbulb size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '0.1rem' }} aria-hidden="true" />
            <div>
              <strong>Quick Tip:</strong> Your household energy accounts for {Math.round((emissions.energy / (emissions.total || 1)) * 100)}% of your carbon footprint. Adjusting heating temperature dials or opting for wind energy offsets will yield major footprint reductions.
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Progress bars */}
      <div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Category Breakdown</h3>
        <div className="grid-4">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const percentage = Math.round((cat.value / (emissions.total || 1)) * 100);
            return (
              <div key={cat.name} className="glass-card" style={categoryCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={categoryIconStyle(cat.color)}>
                    <CatIcon size={18} color={cat.color} />
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>
                    {cat.value} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>kg</span>
                  </span>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'white' }}>{cat.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{cat.desc}</p>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Share</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>{percentage}%</span>
                  </div>
                  <div style={progressBarBgStyle}>
                    <div style={progressBarFillStyle(percentage, cat.color)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Guidance Call-to-action */}
      <div className="glass-card" style={actionBannerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '70%' }}>
          <h3 style={{ color: 'white', fontSize: '1.25rem' }}>Ready to trim down your carbon score?</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Check your Eco-Advisor tips or take part in our weekly reduction challenges to build long-term carbon reduction habits.
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setActiveTab('challenges')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
        >
          View Eco Challenges <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Styling Object details
const welcomeRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1.6fr',
  gap: '1.5rem',
};

// Responsive layouts handled by CSS inject below


const gaugeCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.5rem',
  gap: '1rem',
};

const gaugeContainerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '200px',
  height: '170px', // slightly smaller to compensate for 3/4 circle cut
  overflow: 'hidden',
};

const gaugeTextContainerStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -45%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const equivalentGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
};

const equivalentItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '0.75rem',
};

const equivalentIconStyle = (bg: string, color: string): React.CSSProperties => ({
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  backgroundColor: bg,
  color: color,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
});

const categoryCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '1.25rem',
};

const categoryIconStyle = (color: string): React.CSSProperties => ({
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  backgroundColor: `${color}15`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const progressBarBgStyle: React.CSSProperties = {
  width: '100%',
  height: '6px',
  borderRadius: '3px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  overflow: 'hidden',
};

const progressBarFillStyle = (percent: number, color: string): React.CSSProperties => ({
  width: `${percent}%`,
  height: '100%',
  backgroundColor: color,
  borderRadius: '3px',
  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
});

const actionBannerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  padding: '1.5rem 2rem',
  flexWrap: 'wrap',
  gap: '1rem',
};

// CSS stylesheet overrides for responsive dashboard layout
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 820px) {
      div[style*="grid-template-columns: 1fr 1.6fr"] {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(style);
}
