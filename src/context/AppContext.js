import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  BASE_INVESTMENT_PER_MW,
  BASE_STATIC_CONSTRUCTION_COST_PER_MW,
  BASE_TRACKER_CONSTRUCTION_COST_PER_MW,
  BASE_STATIC_OPEX_PER_MW,
  BASE_TRACKER_OPEX_PER_MW,
  BASE_FIXED_ENERGY_YIELD_PER_MW,
  BASE_TRACKING_ENERGY_YIELD_PER_MW,
  DEFAULT_BATTERY_COMPONENTS,
  BATTERY_INVESTMENT_FACTORS
} from '../utils/constants';
import { scaleWithCapacity } from '../utils/helpers';
import { 
  calculateFinancials, 
  calculateBatteryCosts, 
  calculateBatteryRevenue 
} from '../utils/calculations';
import { exportAnalysis } from '../services/exportService';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Context provider component
export const AppProvider = ({ children }) => {
  // Core state variables
  const [plantCapacity, setPlantCapacity] = useState(100);
  const [viewMode, setViewMode] = useState('comparison');
  const [isLevered, setIsLevered] = useState(false);
  const [hasBatteryStorage, setHasBatteryStorage] = useState(false);
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [showPieCharts, setShowPieCharts] = useState(false);
  const [expandedChart, setExpandedChart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Investment breakdown state
  const [initialInvestmentBreakdown, setInitialInvestmentBreakdown] = useState(() => {
    const scaled = {};
    Object.entries(BASE_INVESTMENT_PER_MW).forEach(([key, value]) => {
      const scalingFactor = key === 'Monitoring Systems' || key === 'Administrative Expenses' ? 0.8 : 1;
      scaled[key] = scaleWithCapacity(value, plantCapacity, scalingFactor);
    });
    return scaled;
  });

  // Construction costs state
  const [staticConstructionCost, setStaticConstructionCost] = useState(
    scaleWithCapacity(BASE_STATIC_CONSTRUCTION_COST_PER_MW, plantCapacity)
  );
  
  const [singleAxisTrackerCost, setSingleAxisTrackerCost] = useState(
    scaleWithCapacity(BASE_TRACKER_CONSTRUCTION_COST_PER_MW, plantCapacity)
  );

  // OPEX breakdown state
  const [staticOpexBreakdown, setStaticOpexBreakdown] = useState(() => {
    const scaled = {};
    Object.entries(BASE_STATIC_OPEX_PER_MW).forEach(([key, value]) => {
      const scalingFactor = key === 'Administrative Expenses' || key === 'Monitoring & Performance Analysis' ? 0.8 : 1;
      scaled[key] = scaleWithCapacity(value, plantCapacity, scalingFactor);
    });
    return scaled;
  });

  const [trackerOpexBreakdown, setTrackerOpexBreakdown] = useState(() => {
    const scaled = {};
    Object.entries(BASE_TRACKER_OPEX_PER_MW).forEach(([key, value]) => {
      const scalingFactor = key === 'Administrative Expenses' || key === 'Monitoring & Performance Analysis' ? 0.8 : 1;
      scaled[key] = scaleWithCapacity(value, plantCapacity, scalingFactor);
    });
    return scaled;
  });

  // Battery settings state
  const [batterySettings, setBatterySettings] = useState({
    capacity: plantCapacity * 1,  // 100% of plant capacity
    storageDuration: 2,             // hours
    costPerMW: 200000,              // € per MW
    peakSolarPrice: 0.02,           // €/kWh
    eveningPeakPrice: 0.16,         // €/kWh
  });

  // Battery OPEX state
  const [batteryOpex, setBatteryOpex] = useState({
    maintenance: 1,           // % of initial cost
    insurance: 0.5,           // % of initial cost
    replacementReserve: 5,    // % of initial cost per year
  });

  // Energy yield state variables
  const [fixedEnergyYieldPerMW, setFixedEnergyYieldPerMW] = useState(BASE_FIXED_ENERGY_YIELD_PER_MW);
  const [trackingEnergyYieldPerMW, setTrackingEnergyYieldPerMW] = useState(BASE_TRACKING_ENERGY_YIELD_PER_MW);

  // Battery investment breakdown state
  const [batteryInvestmentBreakdown, setBatteryInvestmentBreakdown] = useState(() => {
    return {
      'Battery System': batterySettings.capacity * batterySettings.costPerMW,
      'Installation': batterySettings.capacity * BATTERY_INVESTMENT_FACTORS['Installation'],
      'Grid Connection': batterySettings.capacity * BATTERY_INVESTMENT_FACTORS['Grid Connection'],
      'Control Systems': batterySettings.capacity * BATTERY_INVESTMENT_FACTORS['Control Systems'],
    };
  });

  // Financial settings state
  const [settings, setSettings] = useState({
    // Basic settings
    plantCapacity: plantCapacity,
    fixedInitialInvestment: Object.values(initialInvestmentBreakdown).reduce((a, b) => a + b, 0) + staticConstructionCost,
    trackingInitialInvestment: Object.values(initialInvestmentBreakdown).reduce((a, b) => a + b, 0) + singleAxisTrackerCost,
    yearlyOpex: viewMode === 'fixed' ? 
      Object.values(staticOpexBreakdown).reduce((a, b) => a + b, 0) : 
      Object.values(trackerOpexBreakdown).reduce((a, b) => a + b, 0),
    electricityPrice2024: 0.07,
    electricityPrice2025: 0.07,
    operationTime: 35,
    
    // Advanced settings
    loanPercentage: 0.7,
    loanInterestRate: 0.035,
    inflationRate: 0.04,
    discountRate: 0.06,
    loanTerm: 15,
  });

  // Energy yields
  const fixedEnergyYield = fixedEnergyYieldPerMW * plantCapacity;
  const trackingEnergyYield = trackingEnergyYieldPerMW * plantCapacity;

  // Update battery investment breakdown when battery settings change
  useEffect(() => {
    if (hasBatteryStorage) {
      setBatteryInvestmentBreakdown({
        'Battery System': batterySettings.capacity * batterySettings.costPerMW,
        'Installation': batterySettings.capacity * BATTERY_INVESTMENT_FACTORS['Installation'],
        'Grid Connection': batterySettings.capacity * BATTERY_INVESTMENT_FACTORS['Grid Connection'],
        'Control Systems': batterySettings.capacity * BATTERY_INVESTMENT_FACTORS['Control Systems'],
      });
    }
  }, [batterySettings.capacity, batterySettings.costPerMW, hasBatteryStorage]);

  // Handler functions
  const handlePlantCapacityChange = (newCapacity) => {
    setPlantCapacity(newCapacity);
    
    // Update initial investment breakdown
    const newInitialInvestment = {};
    Object.entries(BASE_INVESTMENT_PER_MW).forEach(([key, value]) => {
      const scalingFactor = key === 'Monitoring Systems' || key === 'Administrative Expenses' ? 0.8 : 1;
      newInitialInvestment[key] = scaleWithCapacity(value, newCapacity, scalingFactor);
    });
    setInitialInvestmentBreakdown(newInitialInvestment);

    // Update construction costs
    const newStaticConstructionCost = scaleWithCapacity(BASE_STATIC_CONSTRUCTION_COST_PER_MW, newCapacity);
    const newTrackerConstructionCost = scaleWithCapacity(BASE_TRACKER_CONSTRUCTION_COST_PER_MW, newCapacity);
    setStaticConstructionCost(newStaticConstructionCost);
    setSingleAxisTrackerCost(newTrackerConstructionCost);

    // Update OPEX breakdowns
    const newStaticOpex = {};
    const newTrackerOpex = {};
    Object.entries(BASE_STATIC_OPEX_PER_MW).forEach(([key, value]) => {
      const scalingFactor = key === 'Administrative Expenses' || key === 'Monitoring & Performance Analysis' ? 0.8 : 1;
      newStaticOpex[key] = scaleWithCapacity(value, newCapacity, scalingFactor);
    });
    Object.entries(BASE_TRACKER_OPEX_PER_MW).forEach(([key, value]) => {
      const scalingFactor = key === 'Administrative Expenses' || key === 'Monitoring & Performance Analysis' ? 0.8 : 1;
      newTrackerOpex[key] = scaleWithCapacity(value, newCapacity, scalingFactor);
    });
    setStaticOpexBreakdown(newStaticOpex);
    setTrackerOpexBreakdown(newTrackerOpex);

    // Update battery settings to maintain ratio with plant size
    const newBatteryCapacity = newCapacity * 1; // Maintain 100% ratio
    setBatterySettings(prev => ({
      ...prev,
      capacity: newBatteryCapacity
    }));

    // Update settings with new values
    setSettings(prev => ({
      ...prev,
      plantCapacity: newCapacity,
      fixedInitialInvestment: Object.values(newInitialInvestment).reduce((a, b) => a + b, 0) + newStaticConstructionCost,
      trackingInitialInvestment: Object.values(newInitialInvestment).reduce((a, b) => a + b, 0) + newTrackerConstructionCost,
      yearlyOpex: viewMode === 'fixed' ? 
        Object.values(newStaticOpex).reduce((a, b) => a + b, 0) : 
        Object.values(newTrackerOpex).reduce((a, b) => a + b, 0),
    }));
  };

  const handleSettingChange = (setting, value) => {
    const parsedValue = parseFloat(value);
    
    if (setting === 'operationTime') {
      setSettings(prev => ({
        ...prev,
        [setting]: parsedValue
      }));
      return;
    }

    if (setting === 'loanTerm') {
      if (parsedValue > settings.operationTime) {
        alert(`Loan term cannot be greater than operation time (${settings.operationTime} years)`);
        return;
      }
    }

    setSettings(prev => ({
      ...prev,
      [setting]: parsedValue
    }));
  };

  // Battery handlers
  const handleBatteryCapacityChange = (newCapacity) => {
    setBatterySettings(prev => ({
      ...prev,
      capacity: newCapacity
    }));
  };

  const handleBatteryStorageDurationChange = (newDuration) => {
    setBatterySettings(prev => ({
      ...prev,
      storageDuration: newDuration
    }));
  };

  const handleBatteryCostPerMWChange = (newCost) => {
    setBatterySettings(prev => ({
      ...prev,
      costPerMW: newCost
    }));
  };

  const handleBatteryMaintenanceChange = (newMaintenance) => {
    setBatteryOpex(prev => ({
      ...prev,
      maintenance: newMaintenance
    }));
  };

  const handleBatteryInsuranceChange = (newInsurance) => {
    setBatteryOpex(prev => ({
      ...prev,
      insurance: newInsurance
    }));
  };

  const handleBatteryReplacementReserveChange = (newReserve) => {
    setBatteryOpex(prev => ({
      ...prev,
      replacementReserve: newReserve
    }));
  };

  // Handler for fixed energy yield change
  const handleFixedEnergyYieldChange = (newValue) => {
    setFixedEnergyYieldPerMW(parseFloat(newValue));
  };

  // Handler for tracking energy yield change
  const handleTrackingEnergyYieldChange = (newValue) => {
    setTrackingEnergyYieldPerMW(parseFloat(newValue));
  };

  // Cost breakdown handlers
  const handleInitialInvestmentChange = (component, value) => {
    const parsedValue = parseFloat(value.replace(/,/g, '')) || 0;
    setInitialInvestmentBreakdown(prev => ({
      ...prev,
      [component]: parsedValue
    }));
    
    // Update total initial investment for both systems
    const newTotal = Object.values({ ...initialInvestmentBreakdown, [component]: parsedValue }).reduce((a, b) => a + b, 0);
    handleSettingChange('fixedInitialInvestment', newTotal + staticConstructionCost);
    handleSettingChange('trackingInitialInvestment', newTotal + singleAxisTrackerCost);
  };

  const handleConstructionCostChange = (isStatic, value) => {
    const parsedValue = parseFloat(value.replace(/,/g, '')) || 0;
    if (isStatic) {
      setStaticConstructionCost(parsedValue);
      const newTotal = Object.values(initialInvestmentBreakdown).reduce((a, b) => a + b, 0) + parsedValue;
      handleSettingChange('fixedInitialInvestment', newTotal);
    } else {
      setSingleAxisTrackerCost(parsedValue);
      const newTotal = Object.values(initialInvestmentBreakdown).reduce((a, b) => a + b, 0) + parsedValue;
      handleSettingChange('trackingInitialInvestment', newTotal);
    }
  };

  const handleOpexChange = (component, value, isStatic) => {
    const parsedValue = parseFloat(value.replace(/,/g, '')) || 0;
    if (isStatic) {
      setStaticOpexBreakdown(prev => ({
        ...prev,
        [component]: parsedValue
      }));
      const newTotal = Object.values({ ...staticOpexBreakdown, [component]: parsedValue }).reduce((a, b) => a + b, 0);
      handleSettingChange('yearlyOpex', newTotal);
    } else {
      setTrackerOpexBreakdown(prev => ({
        ...prev,
        [component]: parsedValue
      }));
      const newTotal = Object.values({ ...trackerOpexBreakdown, [component]: parsedValue }).reduce((a, b) => a + b, 0);
      handleSettingChange('yearlyOpex', newTotal);
    }
  };

  // Export functions
  const handleExportExcelWithCharts = async () => {
    setIsLoading(true);
    
    try {
      const result = await exportAnalysis(contextValue, true);
      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (error) {
      alert('Error exporting data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate battery costs
  const batteryCosts = calculateBatteryCosts(
    hasBatteryStorage, 
    batteryInvestmentBreakdown, 
    batteryOpex
  );

  // Function to calculate battery revenue for a specific year
  const batteryRevenueCalculator = (year) => calculateBatteryRevenue(
    year, 
    hasBatteryStorage, 
    batterySettings
  );

  // Calculate financials for both systems
  const fixedSystemFinancials = calculateFinancials(
    fixedEnergyYield, 
    settings.fixedInitialInvestment, 
    settings, 
    isLevered, 
    hasBatteryStorage,
    batteryCosts,
    batteryRevenueCalculator
  );
  
  const trackingSystemFinancials = calculateFinancials(
    trackingEnergyYield, 
    settings.trackingInitialInvestment, 
    settings, 
    isLevered, 
    hasBatteryStorage,
    batteryCosts,
    batteryRevenueCalculator
  );

  // Prepare chart data
  const cashFlowChartData = Array.from({ length: settings.operationTime }, (_, i) => ({
    year: i + 1,
    fixedCashFlow: fixedSystemFinancials.yearlyData[i].cashFlow,
    trackingCashFlow: trackingSystemFinancials.yearlyData[i].cashFlow,
    fixedCumulativeCF: fixedSystemFinancials.yearlyData[i].cumulativeCashFlow,
    trackingCumulativeCF: trackingSystemFinancials.yearlyData[i].cumulativeCashFlow,
  }));

  const revenueChartData = Array.from({ length: settings.operationTime }, (_, i) => ({
    year: i + 1,
    fixedRevenue: fixedSystemFinancials.yearlyData[i].revenue,
    trackingRevenue: trackingSystemFinancials.yearlyData[i].revenue,
    fixedNetProfit: fixedSystemFinancials.yearlyData[i].netProfit,
    trackingNetProfit: trackingSystemFinancials.yearlyData[i].netProfit,
  }));

  const dscrChartData = Array.from({ length: Math.min(settings.loanTerm, settings.operationTime) }, (_, i) => ({
    year: i + 1,
    fixedDSCR: fixedSystemFinancials.yearlyData[i].dscr,
    trackingDSCR: trackingSystemFinancials.yearlyData[i].dscr,
  }));

  // Create context value
  const contextValue = {
    // State
    plantCapacity,
    setPlantCapacity,
    viewMode,
    setViewMode,
    isLevered,
    setIsLevered,
    hasBatteryStorage,
    setHasBatteryStorage,
    showSettings,
    setShowSettings,
    showAdvanced,
    setShowAdvanced,
    showCostBreakdown,
    setShowCostBreakdown,
    showPieCharts,
    setShowPieCharts,
    expandedChart,
    setExpandedChart,
    isLoading,
    setIsLoading,
    settings,
    setSettings,
    initialInvestmentBreakdown,
    staticConstructionCost,
    singleAxisTrackerCost,
    staticOpexBreakdown,
    trackerOpexBreakdown,
    batterySettings,
    batteryOpex,
    batteryInvestmentBreakdown,
    setBatteryInvestmentBreakdown,
    fixedEnergyYieldPerMW,
    setFixedEnergyYieldPerMW,
    trackingEnergyYieldPerMW,
    setTrackingEnergyYieldPerMW,
    
    // Calculated values
    fixedEnergyYield,
    trackingEnergyYield,
    fixedSystemFinancials,
    trackingSystemFinancials,
    batteryCosts,
    cashFlowChartData,
    revenueChartData,
    dscrChartData,
    
    // Financial data
    financialData: {
      fixedSystemFinancials,
      trackingSystemFinancials,
    },
    
    // Handlers
    handlePlantCapacityChange,
    handleSettingChange,
    handleBatteryCapacityChange,
    handleBatteryStorageDurationChange,
    handleBatteryCostPerMWChange,
    handleBatteryMaintenanceChange,
    handleBatteryInsuranceChange,
    handleBatteryReplacementReserveChange,
    handleInitialInvestmentChange,
    handleConstructionCostChange,
    handleOpexChange,
    handleFixedEnergyYieldChange,
    handleTrackingEnergyYieldChange,
    handleExportExcelWithCharts
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
