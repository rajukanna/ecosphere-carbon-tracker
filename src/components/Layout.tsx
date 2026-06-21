import React from 'react';
import { 
  LayoutGrid, 
  Calculator, 
  Map, 
  Leaf, 
  MessageSquare, 
  Award, 
  TrendingUp,
  CloudLightning,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  netFootprint: number; // in kg CO2
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab,
  netFootprint
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'calculator', label: 'Tracker', icon: Calculator },
    { id: 'route-planner', label: 'Travel Planner', icon: Map },
    { id: 'offsets', label: 'Offset Market', icon: Leaf },
    { id: 'ai-advisor', label: 'AI Advisor', icon: MessageSquare },
    { id: 'challenges', label: 'Challenges', icon: Award },
    { id: 'history', label: 'History & Export', icon: TrendingUp },
  ];

  // Paris Agreement recommended target per person per year: ~2000 kg (2 tonnes), which is ~167 kg per month.
  const targetMonthly = 167; 
  const isBelowTarget = netFootprint <= targetMonthly;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation Header */}
      <header style={headerStyle}>
        <div style={headerContainerStyle}>
          <div style={logoAreaStyle}>
            <CloudLightning size={28} color="#10b981" style={logoIconStyle} aria-hidden="true" />
            <h1 style={logoTextStyle}>EcoSphere</h1>
            <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', gap: '0.2rem' }} aria-label="Pro Version">
              <Sparkles size={10} aria-hidden="true" /> PRO
            </span>
          </div>

          {/* Quick Net Score view in Header */}
          <div style={headerStatsStyle} aria-live="polite" aria-label="Current net monthly carbon footprint">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Monthly CO₂</div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: isBelowTarget ? 'var(--primary)' : 'var(--warning)' }}>
                {netFootprint.toLocaleString()} kg
              </div>
            </div>
            <div style={statsIndicatorStyle(isBelowTarget)} role="status">
              {isBelowTarget ? 'Eco Safe' : 'Warning'}
            </div>
          </div>
        </div>
      </header>

      <div style={contentWrapperStyle}>
        {/* Navigation Sidebar */}
        <aside style={sidebarStyle} className="no-print">
          <nav 
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}
            role="tablist"
            aria-label="Application sections"
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={navButtonStyle(isActive)}
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="main-content"
                  id={`nav-tab-${item.id}`}
                >
                  <Icon size={18} color={isActive ? '#10b981' : '#94a3b8'} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main 
          style={mainContentStyle}
          id="main-content"
          role="tabpanel"
          aria-labelledby={`nav-tab-${activeTab}`}
        >
          <div className="animate-slide-up">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer style={footerStyle} className="no-print">
        <p style={{ fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} EcoSphere. Powered by Google Cloud Platform. 
          Empowering individuals to reach Net-Zero carbon emissions.
        </p>
      </footer>
    </div>
  );
};

// Inline Styles for Layout
const headerStyle: React.CSSProperties = {
  background: 'rgba(10, 13, 26, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--border-color)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const headerContainerStyle: React.CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0.8rem 1.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoAreaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
};

const logoIconStyle: React.CSSProperties = {
  filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))',
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '1.4rem',
  fontWeight: '800',
  margin: 0,
  letterSpacing: '-0.02em',
  background: 'linear-gradient(135deg, #ffffff 40%, #10b981 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const headerStatsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '0.4rem 0.8rem',
};

const statsIndicatorStyle = (safe: boolean): React.CSSProperties => ({
  fontSize: '0.7rem',
  fontWeight: '700',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  textTransform: 'uppercase',
  backgroundColor: safe ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
  color: safe ? 'var(--primary)' : 'var(--warning)',
  border: `1px solid ${safe ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
});

const contentWrapperStyle: React.CSSProperties = {
  maxWidth: '1280px',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flex: 1,
  padding: '1.5rem',
  gap: '1.5rem',
};

const sidebarStyle: React.CSSProperties = {
  width: '240px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  flexShrink: 0,
  position: 'sticky',
  top: '75px',
  height: 'fit-content',
};

const mainContentStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0, // prevents flex item overflow
};

const navButtonStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  width: '100%',
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: '1px solid transparent',
  backgroundColor: active ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
  borderColor: active ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
  color: active ? '#10b981' : '#94a3b8',
  fontFamily: 'var(--font-heading)',
  fontSize: '0.95rem',
  fontWeight: active ? '600' : '500',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.2s ease',
  outline: 'none',
});

const footerStyle: React.CSSProperties = {
  borderTop: '1px solid var(--border-color)',
  padding: '1.5rem',
  textAlign: 'center',
  color: 'var(--text-muted)',
  marginTop: 'auto',
  background: 'rgba(5, 7, 15, 0.5)',
};

// Add a quick stylesheet inject for hover state of sidebar buttons
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .nav-item-btn:hover {
      background-color: rgba(255, 255, 255, 0.03) !important;
      color: #ffffff !important;
      padding-left: 1.2rem !important;
    }
    .nav-item-btn.active:hover {
      background-color: rgba(16, 185, 129, 0.12) !important;
      color: #10b981 !important;
    }
    @media (max-width: 768px) {
      div[style*="display: flex; gap: 1.5rem"] {
        flex-direction: column !important;
      }
      aside[style*="width: 240px"] {
        width: 100% !important;
        position: relative !important;
        top: 0 !important;
      }
      aside nav {
        flex-direction: row !important;
        overflow-x: auto;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border-color);
      }
      .nav-item-btn {
        padding: 0.5rem 0.8rem !important;
        white-space: nowrap;
      }
    }
  `;
  document.head.appendChild(style);
}
