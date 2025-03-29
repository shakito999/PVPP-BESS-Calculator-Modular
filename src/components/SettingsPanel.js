import React from 'react';
import { useAppContext } from '../context/AppContext';
import BatterySettings from './BatterySettings';

const SettingsPanel = () => {
  const { 
    showSettings,
    setShowSettings,
    showAdvanced,
    setShowAdvanced,
    hasBatteryStorage,
    settings,
    handleSettingChange,
    handlePlantCapacityChange,
    fixedEnergyYieldPerMW,
    trackingEnergyYieldPerMW,
    handleFixedEnergyYieldChange,
    handleTrackingEnergyYieldChange
  } = useAppContext();

  if (!showSettings) return null;

  return (
    <div className={`settings-panel ${showSettings ? 'show' : ''}`}>
      <div className="panel-header">
        <h3>Settings</h3>
        <button 
          className="close-panel-button"
          onClick={() => setShowSettings(false)}
        >
          ×
        </button>
      </div>
      
      <div className="settings-content">
        <h3>Basic Settings</h3>
        <div className="settings-group">
          <label>
            Plant Capacity (MW)
            <input
              type="number"
              value={settings.plantCapacity}
              onChange={(e) => handlePlantCapacityChange(parseFloat(e.target.value))}
            />
          </label>
          <label>
            Electricity Price 2025 (€/kWh)
            <input
              type="number"
              step="0.01"
              value={settings.electricityPrice2025}
              onChange={(e) => handleSettingChange('electricityPrice2025', e.target.value)}
            />
          </label>
          <label>
            Fixed System Energy Yield (MWh/y/MW)
            <input
              type="number"
              step="0.01"
              value={fixedEnergyYieldPerMW}
              onChange={(e) => handleFixedEnergyYieldChange(e.target.value)}
            />
          </label>
          <label>
            Tracking System Energy Yield (MWh/y/MW)
            <input
              type="number"
              step="0.01"
              value={trackingEnergyYieldPerMW}
              onChange={(e) => handleTrackingEnergyYieldChange(e.target.value)}
            />
          </label>
          <label>
            Operation Time (years)
            <input
              type="number"
              value={settings.operationTime}
              onChange={(e) => handleSettingChange('operationTime', e.target.value)}
            />
          </label>
        </div>

        <div className="advanced-toggle">
          <button 
            className="toggle-advanced-button"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
          </button>
        </div>

        {showAdvanced && (
          <div className="settings-group">
            <h3>Advanced Settings</h3>
            <label>
              Loan Percentage (%)
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={settings.loanPercentage * 100}
                onChange={(e) => handleSettingChange('loanPercentage', parseFloat(e.target.value) / 100)}
              />
            </label>
            <label>
              Loan Interest Rate (%)
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={(settings.loanInterestRate * 100).toFixed(2)}
                onChange={(e) => handleSettingChange('loanInterestRate', parseFloat(e.target.value) / 100)}
              />
            </label>
            <label>
              Loan Term (years)
              <input
                type="number"
                min="1"
                max={settings.operationTime}
                value={settings.loanTerm}
                onChange={(e) => handleSettingChange('loanTerm', e.target.value)}
              />
            </label>
            <label>
              Inflation Rate (%)
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={settings.inflationRate * 100}
                onChange={(e) => handleSettingChange('inflationRate', parseFloat(e.target.value) / 100)}
              />
            </label>
            <label>
              Discount Rate (%)
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={settings.discountRate * 100}
                onChange={(e) => handleSettingChange('discountRate', parseFloat(e.target.value) / 100)}
              />
            </label>
          </div>
        )}

        {/* Render Battery Settings if battery storage is enabled */}
        {hasBatteryStorage && <BatterySettings />}
      </div>
    </div>
  );
};

export default SettingsPanel;
