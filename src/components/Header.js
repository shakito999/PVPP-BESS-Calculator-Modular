import React from 'react';
import { useAppContext } from '../context/AppContext';
import HelpButton from './HelpButton';
import './styles.css';

const Header = () => {
  const { 
    plantCapacity,
    viewMode, 
    setViewMode,
    isLevered,
    setIsLevered,
    hasBatteryStorage,
    setHasBatteryStorage,
    showSettings,
    setShowSettings,
    showCostBreakdown,
    setShowCostBreakdown,
    showPieCharts,
    setShowPieCharts,
    isLoading,
    handleExportExcelWithCharts
  } = useAppContext();

  return (
    <div className="header-section" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h2 className="text-highlight">
          {plantCapacity}MW PV Power Plant Financial Analysis
        </h2>
        <HelpButton />
      </div>
      
      <div className="button-group">
        <button 
          className={`view-button ${viewMode === 'comparison' ? 'active' : ''}`}
          onClick={() => setViewMode('comparison')}
          title="View both systems side by side"
        >
          Comparison View
        </button>
        <button 
          className={`view-button ${viewMode === 'fixed' ? 'active' : ''}`}
          onClick={() => setViewMode('fixed')}
          title="View fixed system analysis"
        >
          Fixed System
        </button>
        <button 
          className={`view-button ${viewMode === 'tracking' ? 'active' : ''}`}
          onClick={() => setViewMode('tracking')}
          title="View tracking system analysis"
        >
          Tracking System
        </button>
      </div>

      <div className="button-group">
        <button 
          className={`toggle-button ${isLevered ? 'active' : ''}`}
          onClick={() => setIsLevered(!isLevered)}
          title="Toggle between levered and unlevered analysis"
        >
          {isLevered ? 'Levered' : 'Unlevered'}
        </button>
        <button 
          className={`toggle-button ${hasBatteryStorage ? 'active' : ''}`}
          onClick={() => setHasBatteryStorage(!hasBatteryStorage)}
          title="Toggle battery storage integration"
        >
          {hasBatteryStorage ? 'With Storage' : 'No Storage'}
        </button>
      </div>

      <div className="button-group">
        <button 
          className={`settings-button ${showSettings ? 'active' : ''}`}
          onClick={() => setShowSettings(!showSettings)}
          title="Show/hide settings panel"
        >
          Settings
        </button>
        <button 
          className={`settings-button ${showCostBreakdown ? 'active' : ''}`}
          onClick={() => setShowCostBreakdown(!showCostBreakdown)}
          title="Show/hide cost breakdown"
        >
          Cost Breakdown
        </button>
        <button 
          className={`settings-button ${showPieCharts ? 'active' : ''}`}
          onClick={() => setShowPieCharts(!showPieCharts)}
          title="Show/hide pie charts"
        >
          Pie Charts
        </button>
      </div>

      <div className="button-group">
        <button 
          className="export-button"
          onClick={handleExportExcelWithCharts}
          disabled={isLoading}
        >
          {isLoading ? 'Exporting...' : 'Export to Excel'}
        </button>
      </div>
    </div>
  );
};

export default Header;
