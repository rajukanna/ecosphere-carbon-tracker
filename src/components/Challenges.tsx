import React, { useState } from 'react';
import { ECO_CHALLENGES } from '../utils/carbonCalculator';
import { Award, Zap, Trophy, CheckCircle, Flame, Star } from 'lucide-react';

interface ChallengesProps {
  activeChallengeIds: string[];
  completedChallengeIds: string[];
  onToggleChallenge: (id: string) => void;
  onCompleteChallenge: (id: string) => void;
}

export const Challenges: React.FC<ChallengesProps> = ({
  activeChallengeIds,
  completedChallengeIds,
  onToggleChallenge,
  onCompleteChallenge
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const getFilteredChallenges = () => {
    switch (filter) {
      case 'active':
        return ECO_CHALLENGES.filter(c => activeChallengeIds.includes(c.id));
      case 'completed':
        return ECO_CHALLENGES.filter(c => completedChallengeIds.includes(c.id));
      default:
        return ECO_CHALLENGES;
    }
  };

  const filteredChallenges = getFilteredChallenges();

  // Stats
  const activeCount = activeChallengeIds.length;
  const completedCount = completedChallengeIds.length;
  const monthlySavings = ECO_CHALLENGES
    .filter(c => activeChallengeIds.includes(c.id))
    .reduce((sum, c) => sum + c.co2Savings, 0);

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
      <div style={headerRowStyle}>
        <div>
          <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Award color="var(--primary)" /> Climate Action Challenges
          </h2>
          <p style={{ marginTop: '0.4rem' }}>
            Gamify your carbon reduction. Accept habit-forming challenges and track your environmental achievements.
          </p>
        </div>
      </div>

      {/* Challenges Dashboard Stats */}
      <div style={challengesStatsGridStyle}>
        <div className="glass-panel" style={statCardStyle}>
          <Flame size={20} color="var(--accent)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Tasks</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white' }}>{activeCount}</div>
          </div>
        </div>

        <div className="glass-panel" style={statCardStyle}>
          <Trophy size={20} color="var(--warning)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white' }}>{completedCount}</div>
          </div>
        </div>

        <div className="glass-panel" style={statCardStyle}>
          <Zap size={20} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Savings Rate</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>-{monthlySavings} kg CO₂ / mo</div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div style={filterToolbarStyle}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn btn-secondary ${filter === 'all' ? 'active-filter' : ''}`}
            onClick={() => setFilter('all')}
            style={filterBtnStyle(filter === 'all')}
          >
            All Challenges
          </button>
          <button 
            className={`btn btn-secondary ${filter === 'active' ? 'active-filter' : ''}`}
            onClick={() => setFilter('active')}
            style={filterBtnStyle(filter === 'active')}
          >
            Active ({activeCount})
          </button>
          <button 
            className={`btn btn-secondary ${filter === 'completed' ? 'active-filter' : ''}`}
            onClick={() => setFilter('completed')}
            style={filterBtnStyle(filter === 'completed')}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid-2" style={{ marginTop: '1.5rem' }}>
        {filteredChallenges.map((challenge) => {
          const isActive = activeChallengeIds.includes(challenge.id);
          const isCompleted = completedChallengeIds.includes(challenge.id);

          return (
            <div 
              key={challenge.id} 
              className="glass-panel" 
              style={challengeCardStyle(isActive, isCompleted)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={categoryBadgeStyle(challenge.category)}>
                    {challenge.category.toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{challenge.durationDays} Days</span>
                </div>
                <div style={savingsBadgeStyle}>
                  -{challenge.co2Savings} kg CO₂
                </div>
              </div>

              <div style={{ marginTop: '0.8rem', flex: 1 }}>
                <h4 style={{ color: 'white', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {isCompleted && <CheckCircle size={16} color="var(--primary)" />}
                  {challenge.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                  {challenge.description}
                </p>
              </div>

              <div style={challengeActionsStyle}>
                {!isCompleted ? (
                  <>
                    <button 
                      onClick={() => onToggleChallenge(challenge.id)}
                      className={`btn ${isActive ? 'btn-secondary' : 'btn-outline-primary'}`}
                      style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', flex: 1 }}
                    >
                      {isActive ? 'Abandon Challenge' : 'Accept Challenge'}
                    </button>
                    
                    {isActive && (
                      <button 
                        onClick={() => onCompleteChallenge(challenge.id)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <Trophy size={14} /> Complete
                      </button>
                    )}
                  </>
                ) : (
                  <div style={completedStateStyle}>
                    <Star size={16} color="var(--warning)" fill="var(--warning)" /> COMPLETED ACHIEVEMENT
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredChallenges.length === 0 && (
          <div className="glass-panel" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No challenges matching the filter. Get started by selecting "All Challenges".
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
};

const challengesStatsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
  marginBottom: '1.5rem',
};

const statCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  padding: '1rem',
};

const filterToolbarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '1rem',
};

const filterBtnStyle = (active: boolean): React.CSSProperties => ({
  fontSize: '0.85rem',
  padding: '0.4rem 0.8rem',
  backgroundColor: active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
  borderColor: active ? 'var(--primary)' : 'var(--border-color)',
  color: active ? 'var(--primary)' : 'var(--text-secondary)',
});

const challengeCardStyle = (active: boolean, completed: boolean): React.CSSProperties => ({
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  border: active 
    ? '1px solid rgba(16, 185, 129, 0.4)' 
    : completed 
      ? '1px dashed rgba(245, 158, 11, 0.3)' 
      : '1px solid var(--border-color)',
  background: active 
    ? 'rgba(16, 185, 129, 0.03)' 
    : completed 
      ? 'rgba(245, 158, 11, 0.02)' 
      : 'rgba(8, 12, 28, 0.3)',
});

const categoryBadgeStyle = (category: string): React.CSSProperties => {
  let bg = 'rgba(14, 165, 233, 0.15)';
  let color = 'var(--info)';
  if (category === 'diet') {
    bg = 'rgba(16, 185, 129, 0.15)';
    color = 'var(--primary)';
  } else if (category === 'waste') {
    bg = 'rgba(244, 63, 94, 0.15)';
    color = 'var(--accent)';
  } else if (category === 'energy') {
    bg = 'rgba(245, 158, 11, 0.15)';
    color = 'var(--warning)';
  }
  return {
    fontSize: '0.65rem',
    fontWeight: '700',
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
    backgroundColor: bg,
    color: color,
  };
};

const savingsBadgeStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: '700',
  color: 'var(--primary)',
};

const challengeActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '1.25rem',
};

const completedStateStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
  width: '100%',
  fontSize: '0.8rem',
  fontWeight: '700',
  color: 'var(--warning)',
  padding: '0.4rem',
  background: 'rgba(245, 158, 11, 0.08)',
  border: '1px solid rgba(245, 158, 11, 0.2)',
  borderRadius: '6px',
};
