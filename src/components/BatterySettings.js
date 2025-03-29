import React from 'react';
import { useAppContext } from '../context/AppContext';

const BatterySettings = () => {
  const { 
    batterySettings,
    batteryOpex,
    handleBatteryCapacityChange,
    handleBatteryStorageDurationChange,
    handleBatteryCostPerMWChange,
    handleBatteryMaintenanceChange,
    handleBatteryInsuranceChange,
    handleBatteryReplacementReserveChange
  } = useAppContext();

  return (
    <div className="settings-group">
      <h3>Battery Storage Settings</h3>
      <div className="battery-settings">
        <label>
          Capacity (MW)
          <input
            type="number"
            value={batterySettings.capacity}
            onChange={(e) => handleBatteryCapacityChange(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Storage Duration (hours)
          <input
            type="number"
            value={batterySettings.storageDuration}
            onChange={(e) => handleBatteryStorageDurationChange(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Cost per MW (€)
          <input
            type="number"
            value={batterySettings.costPerMW}
            onChange={(e) => handleBatteryCostPerMWChange(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Peak Solar Price (€/kWh)
          <input
            type="number"
            step="0.01"
            value={batterySettings.peakSolarPrice}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              setBatterySettings(prev => ({
                ...prev,
                peakSolarPrice: newValue
              }));
            }}
          />
        </label>
        <label>
          Evening Peak Price (€/kWh)
          <input
            type="number"
            step="0.01"
            value={batterySettings.eveningPeakPrice}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              setBatterySettings(prev => ({
                ...prev,
                eveningPeakPrice: newValue
              }));
            }}
          />
        </label>
      </div>

      <h4>Battery OPEX Settings</h4>
      <div className="battery-opex-settings">
        <label>
          Maintenance (% of initial cost)
          <input
            type="number"
            step="0.1"
            value={batteryOpex.maintenance}
            onChange={(e) => handleBatteryMaintenanceChange(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Insurance (% of initial cost)
          <input
            type="number"
            step="0.1"
            value={batteryOpex.insurance}
            onChange={(e) => handleBatteryInsuranceChange(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Replacement Reserve (% of initial cost)
          <input
            type="number"
            step="0.1"
            value={batteryOpex.replacementReserve}
            onChange={(e) => handleBatteryReplacementReserveChange(parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default BatterySettings;
