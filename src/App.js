import React from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import CostBreakdown from './components/CostBreakdown';
import PieCharts from './components/PieCharts';
import FinancialMetrics from './components/FinancialMetrics';
import Charts from './components/Charts';
import './styles/SolarPlantFinancialAnalysis.css';
import { useAppContext } from './context/AppContext';

// Main application container component
const SolarPlantFinancialAnalysis = () => {
  const { 
    showSettings, 
    showCostBreakdown, 
    showPieCharts 
  } = useAppContext();

  return (
    <div className={`analysis-container ${showSettings || showCostBreakdown ? 'settings-open' : ''}`}>
      <Header />
      
      <SettingsPanel />
      <CostBreakdown />
      
      {showPieCharts && <PieCharts />}
      
      <FinancialMetrics />
      <Charts />
    </div>
  );
};

// Root App component
function App() {
  return (
    <div className="App">
      <AppProvider>
        <SolarPlantFinancialAnalysis />
      </AppProvider>
    </div>
  );
}

export default App;
