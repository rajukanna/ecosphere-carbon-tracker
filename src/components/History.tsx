import React from 'react';
import { Printer, Globe, Cloud, Calendar, ShieldCheck, TreePine } from 'lucide-react';

interface HistoryProps {
  emissions: {
    transport: number;
    energy: number;
    diet: number;
    waste: number;
    total: number;
  };
  netEmissions: number;
  offsetAmount: number;
  activeChallengeCount: number;
  completedChallengeCount: number;
}

export const History: React.FC<HistoryProps> = ({
  emissions,
  netEmissions,
  offsetAmount,
  activeChallengeCount,
  completedChallengeCount
}) => {
  
  // Global country data comparisons (kg CO2 per person per month)
  const countries = [
    { name: 'United States', co2: 1300, color: '#ef4444' },
    { name: 'Germany', co2: 700, color: '#f59e0b' },
    { name: 'China', co2: 620, color: '#eab308' },
    { name: 'Global Average', co2: 400, color: '#3b82f6' },
    { name: 'YOUR FOOTPRINT', co2: emissions.total, color: '#ec4899', isUser: true },
    { name: 'YOUR NET FOOTPRINT', co2: netEmissions, color: '#10b981', isUser: true },
    { name: 'India', co2: 160, color: '#06b6d4' },
    { name: 'Paris Agreement Target', co2: 167, color: '#10b981' }
  ];

  // Sort country array by footprint
  const sortedComparisons = [...countries].sort((a, b) => b.co2 - a.co2);
  const maxCO2 = Math.max(...sortedComparisons.map(c => c.co2));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Exporter Block */}
      <div className="glass-card animate-fade-in no-print" style={{ padding: '2rem' }}>
        <div style={headerRowStyle}>
          <div>
            <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Printer color="var(--primary)" /> Carbon Audit Report Exporter
            </h2>
            <p style={{ marginTop: '0.4rem' }}>
              Generate, preview, or print a formal carbon audit report of your household footprint.
            </p>
          </div>
          <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Printer size={16} /> Print/Save PDF Audit
          </button>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '1.25rem' }}>
          <ShieldCheck size={24} color="var(--primary)" />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>Official Audit:</strong> This report compiles your inputs, active offsets, and reduction achievements. Clicking "Print/Save PDF" opens the native browser print dialogue configured with a clean print layout stylesheet.
          </div>
        </div>
      </div>

      {/* Global Comparisons (SVG charts) */}
      <div className="glass-card animate-fade-in no-print" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={20} color="var(--info)" /> Global Carbon Comparisons
        </h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          See how your footprint compares to national per-capita averages and global sustainability targets (kg CO₂/month).
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {sortedComparisons.map((country, idx) => {
            const widthPct = (country.co2 / maxCO2) * 100;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '170px', fontWeight: country.isUser ? '700' : 'normal', color: country.isUser ? 'white' : 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {country.name} {country.isUser && '⭐'}
                </div>
                <div style={{ flex: 1, height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${widthPct}%`, 
                    height: '100%', 
                    backgroundColor: country.color, 
                    borderRadius: '4px',
                    boxShadow: country.isUser ? `0 0 10px ${country.color}` : 'none',
                    transition: 'width 1s ease'
                  }} />
                </div>
                <div style={{ width: '90px', textAlign: 'right', fontWeight: '700', fontSize: '0.9rem', color: country.color }}>
                  {Math.round(country.co2)} kg
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRINT-ONLY AUDIT CERTIFICATE LAYOUT */}
      <div className="glass-card print-report-container" style={printReportStyle}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #10b981', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <h1 style={{ color: '#0f172a', margin: 0, fontSize: '2.5rem' }}>EcoSphere Carbon Audit Report</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Personal Sustainability & Footprint Ledger
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', color: '#475569', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> Audit Date: {new Date().toLocaleDateString()}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Cloud size={14} /> Scope: Individual Lifestyle</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ color: '#0f172a', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>
              Footprint Summary
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <tbody>
                <tr style={tableRowStyle}><td style={tdStyle}>Transport Footprint</td><td style={tdRightStyle}>{emissions.transport} kg CO₂/mo</td></tr>
                <tr style={tableRowStyle}><td style={tdStyle}>Energy Footprint</td><td style={tdRightStyle}>{emissions.energy} kg CO₂/mo</td></tr>
                <tr style={tableRowStyle}><td style={tdStyle}>Diet Footprint</td><td style={tdRightStyle}>{emissions.diet} kg CO₂/mo</td></tr>
                <tr style={tableRowStyle}><td style={tdStyle}>Waste Footprint</td><td style={tdRightStyle}>{emissions.waste} kg CO₂/mo</td></tr>
                <tr style={{ fontWeight: '700', borderTop: '2px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 0' }}>Total Gross Footprint</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{emissions.total} kg CO₂/mo</td>
                </tr>
                <tr style={{ fontWeight: '700', color: '#059669' }}>
                  <td style={{ padding: '0.75rem 0' }}>Simulated Offset Credit</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>-{offsetAmount} kg CO₂/mo</td>
                </tr>
                <tr style={{ fontWeight: '800', borderTop: '2px solid #0f172a', fontSize: '1.05rem', color: '#0f172a' }}>
                  <td style={{ padding: '0.75rem 0' }}>NET CARBON FOOTPRINT</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{netEmissions} kg CO₂/mo</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ color: '#0f172a', fontSize: '1.2rem', marginBottom: '0.2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>
              Eco Achievements
            </h3>
            
            <div style={achievementBoxStyle}>
              <TreePine size={24} color="#059669" />
              <div>
                <h4 style={{ color: '#0f172a', fontSize: '0.95rem' }}>Offset Support Status</h4>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  Supporting verified climate actions, offsetting <strong>{offsetAmount} kg CO₂</strong> of emissions.
                </p>
              </div>
            </div>

            <div style={achievementBoxStyle}>
              <ShieldCheck size={24} color="#0284c7" />
              <div>
                <h4 style={{ color: '#0f172a', fontSize: '0.95rem' }}>Active Eco-Challenges</h4>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  Currently working on <strong>{activeChallengeCount}</strong> active habits, with <strong>{completedChallengeCount}</strong> completed goals.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 'auto', border: '1px solid #10b981', padding: '0.8rem', borderRadius: '6px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: '700' }}>
                {netEmissions <= 167 ? '✔ SUSTAINABLE: Footprint matches Paris Agreement targets.' : '⚠ ACTION NEEDED: Emissions exceed 167 kg Paris standard.'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '1.5rem', marginTop: '3rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
          Report issued dynamically via EcoSphere Green Computing Framework on Google Cloud Platform. 
          Auditor ID: ES-{Math.round(Math.random() * 89999 + 10000)}
        </div>
      </div>
    </div>
  );
};

// Styling Variables
const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const printReportStyle: React.CSSProperties = {
  background: '#ffffff',
  color: '#0f172a',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  padding: '2.5rem',
  boxShadow: 'none',
  display: 'none', // hidden by default on screens, shown on printing/PDF
};

const tableRowStyle: React.CSSProperties = {
  borderBottom: '1px solid #f1f5f9',
};

const tdStyle: React.CSSProperties = {
  padding: '0.5rem 0',
  color: '#475569',
};

const tdRightStyle: React.CSSProperties = {
  padding: '0.5rem 0',
  textAlign: 'right',
  fontWeight: '600',
  color: '#334155',
};

const achievementBoxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
  padding: '0.75rem',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
};

// CSS Rules for responsive and printable layouts
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      .print-report-container {
        display: block !important;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
      }
      .no-print, header, aside, footer {
        display: none !important;
      }
      body {
        background: white !important;
      }
    }
  `;
  document.head.appendChild(style);
}
