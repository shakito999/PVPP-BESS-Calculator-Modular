import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/helpers';

const FinancialMetrics = () => {
  const { 
    viewMode,
    isLevered,
    hasBatteryStorage,
    fixedSystemFinancials,
    trackingSystemFinancials,
    batteryCosts,
    batterySettings,
    settings
  } = useAppContext();

  // Helper to determine which data to display based on view mode
  const getSelectedSystemData = () => {
    if (viewMode === 'fixed') return fixedSystemFinancials;
    if (viewMode === 'tracking') return trackingSystemFinancials;
    return null;
  };

  const selectedSystemData = getSelectedSystemData();

  return (
    <div className="chart-wrapper">
      <h3 className="text-highlight">Key Financial Metrics</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Metric</th>
            {viewMode === 'comparison' ? (
              <>
                <th>Fixed System</th>
                <th>Tracking System</th>
              </>
            ) : (
              <th>{viewMode === 'fixed' ? 'Fixed System' : 'Tracking System'}</th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{hasBatteryStorage ? `Initial Investment (${batterySettings.capacity * batterySettings.storageDuration} MWh)` : 'Initial Investment'}</td>
            {viewMode === 'comparison' ? (
              <>
                <td data-label="Fixed System" className="metric-value">{formatCurrency(fixedSystemFinancials.initialInvestment + (hasBatteryStorage ? batteryCosts.investment : 0))}</td>
                <td data-label="Tracking System" className="metric-value">{formatCurrency(trackingSystemFinancials.initialInvestment + (hasBatteryStorage ? batteryCosts.investment : 0))}</td>
              </>
            ) : (
              <td data-label={viewMode === 'fixed' ? 'Fixed System' : 'Tracking System'} className="metric-value">
                {formatCurrency(selectedSystemData.initialInvestment + (hasBatteryStorage ? batteryCosts.investment : 0))}
              </td>
            )}
          </tr>
          <tr>
            <td>NPV</td>
            {viewMode === 'comparison' ? (
              <>
                <td data-label="Fixed System" className="metric-value">{formatCurrency(fixedSystemFinancials.npv)}</td>
                <td data-label="Tracking System" className="metric-value">{formatCurrency(trackingSystemFinancials.npv)}</td>
              </>
            ) : (
              <td data-label={viewMode === 'fixed' ? 'Fixed System' : 'Tracking System'} className="metric-value">
                {formatCurrency(selectedSystemData.npv)}
              </td>
            )}
          </tr>
          <tr>
            <td>IRR</td>
            {viewMode === 'comparison' ? (
              <>
                <td data-label="Fixed System" className="metric-value">{formatPercentage(fixedSystemFinancials.irr)}</td>
                <td data-label="Tracking System" className="metric-value">{formatPercentage(trackingSystemFinancials.irr)}</td>
              </>
            ) : (
              <td data-label={viewMode === 'fixed' ? 'Fixed System' : 'Tracking System'} className="metric-value">
                {formatPercentage(selectedSystemData.irr)}
              </td>
            )}
          </tr>
          <tr>
            <td>ROE ({isLevered ? 'Levered' : 'Unlevered'})</td>
            {viewMode === 'comparison' ? (
              <>
                <td data-label="Fixed System" className="metric-value">{formatPercentage(fixedSystemFinancials.roe)}</td>
                <td data-label="Tracking System" className="metric-value">{formatPercentage(trackingSystemFinancials.roe)}</td>
              </>
            ) : (
              <td data-label={viewMode === 'fixed' ? 'Fixed System' : 'Tracking System'} className="metric-value">
                {formatPercentage(selectedSystemData.roe)}
              </td>
            )}
          </tr>
          <tr>
            <td>Payback Period (years)</td>
            {viewMode === 'comparison' ? (
              <>
                <td data-label="Fixed System" className="metric-value">{formatNumber(fixedSystemFinancials.paybackPeriod)}</td>
                <td data-label="Tracking System" className="metric-value">{formatNumber(trackingSystemFinancials.paybackPeriod)}</td>
              </>
            ) : (
              <td data-label={viewMode === 'fixed' ? 'Fixed System' : 'Tracking System'} className="metric-value">
                {formatNumber(selectedSystemData.paybackPeriod)}
              </td>
            )}
          </tr>
          {isLevered && (
            <tr>
              <td>Average DSCR</td>
              {viewMode === 'comparison' ? (
                <>
                  <td data-label="Fixed System" className="metric-value">{formatNumber(fixedSystemFinancials.averageDSCR)}</td>
                  <td data-label="Tracking System" className="metric-value">{formatNumber(trackingSystemFinancials.averageDSCR)}</td>
                </>
              ) : (
                <td data-label={viewMode === 'fixed' ? 'Fixed System' : 'Tracking System'} className="metric-value">
                  {formatNumber(selectedSystemData.averageDSCR)}
                </td>
              )}
            </tr>
          )}
          <tr>
            <td>Total Profit ({settings.operationTime} years)</td>
            {viewMode === 'comparison' ? (
              <>
                <td data-label="Fixed System" className="metric-value">{formatCurrency(fixedSystemFinancials.totalProfit)}</td>
                <td data-label="Tracking System" className="metric-value">{formatCurrency(trackingSystemFinancials.totalProfit)}</td>
              </>
            ) : (
              <td data-label={viewMode === 'fixed' ? 'Fixed System' : 'Tracking System'} className="metric-value">
                {formatCurrency(selectedSystemData.totalProfit)}
              </td>
            )}
          </tr>
          {hasBatteryStorage && (
            <>
              <tr>
                <td>Battery System Cost</td>
                {viewMode === 'comparison' ? (
                  <>
                    <td data-label="Fixed System" className="metric-value">{formatCurrency(batteryCosts.investment)}</td>
                    <td data-label="Tracking System" className="metric-value">{formatCurrency(batteryCosts.investment)}</td>
                  </>
                ) : (
                  <td data-label={viewMode === 'fixed' ? 'Fixed System' : 'Tracking System'} className="metric-value">
                    {formatCurrency(batteryCosts.investment)}
                  </td>
                )}
              </tr>
              <tr>
                <td>Battery Yearly OPEX</td>
                {viewMode === 'comparison' ? (
                  <>
                    <td data-label="Fixed System" className="metric-value">{formatCurrency(batteryCosts.opex)}</td>
                    <td data-label="Tracking System" className="metric-value">{formatCurrency(batteryCosts.opex)}</td>
                  </>
                ) : (
                  <td data-label={viewMode === 'fixed' ? 'Fixed System' : 'Tracking System'} className="metric-value">
                    {formatCurrency(batteryCosts.opex)}
                  </td>
                )}
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialMetrics;
