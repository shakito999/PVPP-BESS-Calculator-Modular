import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCostInput, parseCostInput } from '../utils/helpers';

const CostBreakdown = () => {
  const { 
    showCostBreakdown,
    setShowCostBreakdown,
    viewMode,
    hasBatteryStorage,
    initialInvestmentBreakdown,
    staticConstructionCost,
    singleAxisTrackerCost,
    staticOpexBreakdown,
    trackerOpexBreakdown,
    batteryInvestmentBreakdown,
    handleInitialInvestmentChange,
    handleConstructionCostChange,
    handleOpexChange
  } = useAppContext();

  if (!showCostBreakdown) return null;

  // Battery investment breakdown component
  const BatteryInvestmentBreakdown = () => {
    if (!hasBatteryStorage) return null;

    return (
      <div className="cost-breakdown-group">
        <h4>Battery System Components</h4>
        {Object.entries(batteryInvestmentBreakdown).map(([name, value]) => (
          <div key={name} className="cost-item">
            <span>{name}</span>
            <input
              type="text"
              value={formatCostInput(value)}
              onChange={(e) => {
                const cleanedValue = parseCostInput(e.target.value);
                const parsedValue = parseFloat(cleanedValue) || 0;
                setBatteryInvestmentBreakdown(prev => ({
                  ...prev,
                  [name]: parsedValue
                }));
              }}
              className="cost-input"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`cost-breakdown-panel ${showCostBreakdown ? 'show' : ''}`}>
      <div className="panel-header">
        <h3>Cost Breakdown</h3>
        <button 
          className="close-panel-button"
          onClick={() => setShowCostBreakdown(false)}
        >
          ×
        </button>
      </div>
      
      <div className="cost-breakdown-content">
        <div className="cost-breakdown-group">
          <h4>Initial Investment Components</h4>
          {Object.entries(initialInvestmentBreakdown).map(([component, value]) => (
            <div key={component} className="cost-item">
              <span>{component}</span>
              <input
                type="text"
                value={formatCostInput(value)}
                onChange={(e) => handleInitialInvestmentChange(component, e.target.value)}
                className="cost-input"
              />
            </div>
          ))}
        </div>

        <div className="cost-breakdown-group">
          <h4>Construction Costs</h4>
          <div className="cost-item">
            <span>Static System Construction</span>
            <input
              type="text"
              value={formatCostInput(staticConstructionCost)}
              onChange={(e) => handleConstructionCostChange(true, e.target.value)}
              className="cost-input"
            />
          </div>
          <div className="cost-item">
            <span>Single Axis Tracker Construction</span>
            <input
              type="text"
              value={formatCostInput(singleAxisTrackerCost)}
              onChange={(e) => handleConstructionCostChange(false, e.target.value)}
              className="cost-input"
            />
          </div>
        </div>

        {(viewMode === 'comparison' || viewMode === 'fixed') && (
          <div className="cost-breakdown-group">
            <h4>Fixed System OPEX</h4>
            {Object.entries(staticOpexBreakdown).map(([component, value]) => (
              <div key={component} className="cost-item">
                <span>{component}</span>
                <input
                  type="text"
                  value={formatCostInput(value)}
                  onChange={(e) => handleOpexChange(component, e.target.value, true)}
                  className="cost-input"
                />
              </div>
            ))}
          </div>
        )}

        {(viewMode === 'comparison' || viewMode === 'tracking') && (
          <div className="cost-breakdown-group">
            <h4>Tracking System OPEX</h4>
            {Object.entries(trackerOpexBreakdown).map(([component, value]) => (
              <div key={component} className="cost-item">
                <span>{component}</span>
                <input
                  type="text"
                  value={formatCostInput(value)}
                  onChange={(e) => handleOpexChange(component, e.target.value, false)}
                  className="cost-input"
                />
              </div>
            ))}
          </div>
        )}

        {/* Render Battery Investment Breakdown if battery storage is enabled */}
        {hasBatteryStorage && <BatteryInvestmentBreakdown />}
      </div>
    </div>
  );
};

export default CostBreakdown;
