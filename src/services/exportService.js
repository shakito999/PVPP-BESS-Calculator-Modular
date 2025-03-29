import { exportToExcel } from '../utils/export';
import { formatForExcel } from '../utils/helpers';

const formatNumber = (value, decimalPlaces = 2) => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'number') return parseFloat(value.toFixed(decimalPlaces));
  return value;
};

const formatPercentage = (value) => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'number') return parseFloat((value * 100).toFixed(2));
  return value;
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'number') return parseFloat(value.toFixed(2));
  return value;
};

const formatYears = (value) => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'number') return parseFloat(value.toFixed(2));
  return value;
};

const prepareSystemData = (system, systemName) => {
  if (!system) return null;

  return {
    [`${systemName} Financial Metrics`]: {
      'NPV': formatCurrency(system.npv),
      'IRR': formatPercentage(system.irr),
      'ROE': formatPercentage(system.roe),
      'Payback Period': formatYears(system.paybackPeriod),
      'Total Profit': formatCurrency(system.totalProfit),
      ...(system.averageDSCR !== undefined && { 'Average DSCR': formatNumber(system.averageDSCR, 2) })
    },
    [`${systemName} Yearly Data`]: Array.isArray(system.yearlyData) ? system.yearlyData.map((yearData, index) => ({
      'Year': yearData.year,
      'Revenue': formatCurrency(yearData.revenue),
      'OPEX': formatCurrency(yearData.opex),
      'Depreciation': formatCurrency(yearData.depreciation),
      'Interest': formatCurrency(yearData.interest),
      'Principal': formatCurrency(yearData.principal),
      'Taxable Income': formatCurrency(yearData.taxableIncome),
      'Tax': formatCurrency(yearData.tax),
      'Net Profit': formatCurrency(yearData.netProfit),
      'Cash Flow': formatCurrency(yearData.cashFlow),
      'Cumulative Cash Flow': formatCurrency(yearData.cumulativeCashFlow),
      ...(yearData.dscr !== undefined && { 'DSCR': formatNumber(yearData.dscr, 2) })
    })) : []
  };
};

export const prepareExportData = (context) => {
  const {
    viewMode,
    isLevered,
    fixedSystemFinancials,
    trackingSystemFinancials,
    plantCapacity,
    settings,
    hasBatteryStorage,
    batterySettings,
    batteryCosts,
    cashFlowChartData,
    revenueChartData,
    dscrChartData,
    fixedEnergyYieldPerMW,
    trackingEnergyYieldPerMW
  } = context;

  const data = {
    ...prepareSystemData(fixedSystemFinancials, 'Fixed System'),
    ...prepareSystemData(trackingSystemFinancials, 'Tracking System'),
    'Analysis Settings': {
      'Plant Capacity': `${plantCapacity || 0} MW`,
      'View Mode': viewMode || 'N/A',
      'Levered Analysis': isLevered ? 'Yes' : 'No',
      'Fixed System Energy Yield': `${fixedEnergyYieldPerMW || 0} MWh/y/MW`,
      'Tracking System Energy Yield': `${trackingEnergyYieldPerMW || 0} MWh/y/MW`,
      'Operation Time': `${settings?.operationTime || 0} years`,
      'Loan Term': `${settings?.loanTerm || 0} years`,
      'Discount Rate': formatPercentage(settings?.discountRate),
      'Inflation Rate': formatPercentage(settings?.inflationRate),
      'Loan Interest Rate': formatPercentage(settings?.loanInterestRate)
    }
  };

  if (hasBatteryStorage && batterySettings) {
    data['Battery System'] = {
      'Capacity': `${batterySettings.capacity || 0} MW`,
      'Storage Duration': `${batterySettings.storageDuration || 0} hours`,
      'Cost Per MW': formatCurrency(batterySettings.costPerMW),
      'Peak Solar Price': formatCurrency(batterySettings.peakSolarPrice),
      'Evening Peak Price': formatCurrency(batterySettings.eveningPeakPrice),
      'Total Investment': formatCurrency(batteryCosts?.investment),
      'Yearly OPEX': formatCurrency(batteryCosts?.opex)
    };
  }

  return data;
};

export const prepareExportDataWithCharts = (context) => {
  const data = prepareExportData(context);

  // Add chart data if available
  if (context.cashFlowChartData) {
    data['Cash Flow Charts'] = context.cashFlowChartData.map(data => ({
      'Year': data.year,
      'Fixed Cash Flow': formatCurrency(data.fixedCashFlow),
      'Tracking Cash Flow': formatCurrency(data.trackingCashFlow),
      'Fixed Cumulative CF': formatCurrency(data.fixedCumulativeCF),
      'Tracking Cumulative CF': formatCurrency(data.trackingCumulativeCF)
    }));
  }

  if (context.revenueChartData) {
    data['Revenue Charts'] = context.revenueChartData.map(data => ({
      'Year': data.year,
      'Fixed Revenue': formatCurrency(data.fixedRevenue),
      'Tracking Revenue': formatCurrency(data.trackingRevenue),
      'Fixed Net Profit': formatCurrency(data.fixedNetProfit),
      'Tracking Net Profit': formatCurrency(data.trackingNetProfit)
    }));
  }

  if (context.dscrChartData) {
    data['DSCR Charts'] = context.dscrChartData.map(data => ({
      'Year': data.year,
      'Fixed DSCR': formatNumber(data.fixedDSCR, 2),
      'Tracking DSCR': formatNumber(data.trackingDSCR, 2)
    }));
  }

  return data;
};

export const generateExportFilename = (viewMode, includeCharts = false) => {
  const date = new Date().toISOString().split('T')[0];
  const baseName = `solar_financial_analysis_${viewMode || 'N/A'}_${date}`;
  return includeCharts ? `${baseName}_with_charts` : baseName;
};

export const exportAnalysis = async (context, includeCharts = false) => {
  try {
    const data = includeCharts 
      ? prepareExportDataWithCharts(context)
      : prepareExportData(context);

    const filename = generateExportFilename(context.viewMode, includeCharts);
    
    if (exportToExcel(data, filename)) {
      return { success: true, message: 'Export completed successfully!' };
    }
    return { success: false, message: 'Failed to export data' };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};
