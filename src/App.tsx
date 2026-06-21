import { useState, useEffect } from 'react';
import { 
  type CarbonData, 
  DEFAULT_CARBON_DATA, 
  calculateCategoryEmissions 
} from './utils/carbonCalculator';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CarbonCalculator } from './components/CarbonCalculator';
import { RoutePlanner } from './components/RoutePlanner';
import { OffsetMarket } from './components/OffsetMarket';
import { AIAdvisor } from './components/AIAdvisor';
import { Challenges } from './components/Challenges';
import { History } from './components/History';

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // State variables synchronized from localStorage
  const [carbonData, setCarbonData] = useState<CarbonData>(() => {
    const saved = localStorage.getItem('ecosphere_carbon_data');
    return saved ? JSON.parse(saved) : DEFAULT_CARBON_DATA;
  });

  const [offsetAmount, setOffsetAmount] = useState<number>(() => {
    const saved = localStorage.getItem('ecosphere_offsets');
    return saved ? Number(saved) : 0;
  });

  const [activeChallengeIds, setActiveChallengeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ecosphere_active_challenges');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ecosphere_completed_challenges');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state changes to Local Storage
  useEffect(() => {
    localStorage.setItem('ecosphere_carbon_data', JSON.stringify(carbonData));
  }, [carbonData]);

  useEffect(() => {
    localStorage.setItem('ecosphere_offsets', String(offsetAmount));
  }, [offsetAmount]);

  useEffect(() => {
    localStorage.setItem('ecosphere_active_challenges', JSON.stringify(activeChallengeIds));
  }, [activeChallengeIds]);

  useEffect(() => {
    localStorage.setItem('ecosphere_completed_challenges', JSON.stringify(completedChallengeIds));
  }, [completedChallengeIds]);

  // Compute emission metrics
  const emissions = calculateCategoryEmissions(carbonData);
  const netEmissions = Math.max(0, emissions.total - offsetAmount);

  // Toggle Challenges Acceptance
  const handleToggleChallenge = (id: string) => {
    setActiveChallengeIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  // Mark Challenges as Completed
  const handleCompleteChallenge = (id: string) => {
    setActiveChallengeIds(prev => prev.filter(cId => cId !== id));
    setCompletedChallengeIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  // Render View Components
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            emissions={emissions}
            netEmissions={netEmissions}
            offsetAmount={offsetAmount}
            setActiveTab={setActiveTab}
          />
        );
      case 'calculator':
        return (
          <CarbonCalculator 
            data={carbonData}
            onChange={setCarbonData}
          />
        );
      case 'route-planner':
        return <RoutePlanner />;
      case 'offsets':
        return (
          <OffsetMarket 
            monthlyEmissions={emissions.total}
            offsetAmount={offsetAmount}
            onOffsetChange={setOffsetAmount}
          />
        );
      case 'ai-advisor':
        return <AIAdvisor />;
      case 'challenges':
        return (
          <Challenges 
            activeChallengeIds={activeChallengeIds}
            completedChallengeIds={completedChallengeIds}
            onToggleChallenge={handleToggleChallenge}
            onCompleteChallenge={handleCompleteChallenge}
          />
        );
      case 'history':
        return (
          <History 
            emissions={emissions}
            netEmissions={netEmissions}
            offsetAmount={offsetAmount}
            activeChallengeCount={activeChallengeIds.length}
            completedChallengeCount={completedChallengeIds.length}
          />
        );
      default:
        return <Dashboard emissions={emissions} netEmissions={netEmissions} offsetAmount={offsetAmount} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} netFootprint={netEmissions}>
      {renderContent()}
    </Layout>
  );
}

export default App;
