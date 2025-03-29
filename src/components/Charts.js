import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { formatChartCurrency, formatNumber } from '../utils/helpers';
import { captureChart } from '../utils/chartCapture';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const Charts = () => {
  const { 
    viewMode,
    isLevered,
    cashFlowChartData,
    revenueChartData,
    dscrChartData,
    fixedSystemFinancials,
    trackingSystemFinancials
  } = useAppContext();

  // Helper to determine which data to display based on view mode
  const getSelectedSystemData = () => {
    if (viewMode === 'fixed') return fixedSystemFinancials;
    if (viewMode === 'tracking') return trackingSystemFinancials;
    return null;
  };

  const selectedSystemData = getSelectedSystemData();

  // Custom tooltip for cash flow chart
  const CashFlowTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Year ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatChartCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for revenue chart
  const RevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Year ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatChartCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for DSCR chart
  const DSCRTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Year ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatNumber(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleDownloadChart = (chartId) => {
    captureChart(chartId);
  };

  return (
    <div>
      {/* Cash Flow Chart */}
      <div className="chart-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="text-highlight">Cash Flow Comparison</h3>
          <button 
            onClick={() => handleDownloadChart('cashFlowChart')}
            style={{ padding: '5px 10px', cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
        <div id="cashFlowChart">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={cashFlowChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} />
              <YAxis tickFormatter={formatChartCurrency} />
              <Tooltip content={<CashFlowTooltip />} />
              <Legend />
              {viewMode === 'comparison' && (
                <>
                  <Line type="monotone" dataKey="fixedCashFlow" name="Fixed Cash Flow" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="trackingCashFlow" name="Tracking Cash Flow" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </>
              )}
              {viewMode === 'fixed' && (
                <>
                  <Line type="monotone" dataKey="fixedCashFlow" name="Cash Flow" stroke="#8884d8" activeDot={{ r: 8 }} />
                </>
              )}
              {viewMode === 'tracking' && (
                <>
                  <Line type="monotone" dataKey="trackingCashFlow" name="Cash Flow" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Cash Flow Chart */}
      <div className="chart-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="text-highlight">Cumulative Cash Flow</h3>
          <button 
            onClick={() => handleDownloadChart('cumulativeCashFlowChart')}
            style={{ padding: '5px 10px', cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
        <div id="cumulativeCashFlowChart">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={cashFlowChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} />
              <YAxis tickFormatter={formatChartCurrency} />
              <Tooltip content={<CashFlowTooltip />} />
              <Legend />
              {viewMode === 'comparison' && (
                <>
                  <Line type="monotone" dataKey="fixedCumulativeCF" name="Fixed Cumulative CF" stroke="#0088FE" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="trackingCumulativeCF" name="Tracking Cumulative CF" stroke="#00C49F" strokeDasharray="5 5" />
                </>
              )}
              {viewMode === 'fixed' && (
                <>
                  <Line type="monotone" dataKey="fixedCumulativeCF" name="Cumulative CF" stroke="#0088FE" strokeDasharray="5 5" />
                </>
              )}
              {viewMode === 'tracking' && (
                <>
                  <Line type="monotone" dataKey="trackingCumulativeCF" name="Cumulative CF" stroke="#00C49F" strokeDasharray="5 5" />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue and Net Profit Chart */}
      <div className="chart-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="text-highlight">Revenue and Net Profit</h3>
          <button 
            onClick={() => handleDownloadChart('revenueChart')}
            style={{ padding: '5px 10px', cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
        <div id="revenueChart">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={revenueChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} />
              <YAxis tickFormatter={formatChartCurrency} />
              <Tooltip content={<RevenueTooltip />} />
              <Legend />
              {viewMode === 'comparison' && (
                <>
                  <Bar dataKey="fixedRevenue" name="Fixed Revenue" fill="#8884d8" />
                  <Bar dataKey="trackingRevenue" name="Tracking Revenue" fill="#82ca9d" />
                  <Bar dataKey="fixedNetProfit" name="Fixed Net Profit" fill="#0088FE" />
                  <Bar dataKey="trackingNetProfit" name="Tracking Net Profit" fill="#00C49F" />
                </>
              )}
              {viewMode === 'fixed' && (
                <>
                  <Bar dataKey="fixedRevenue" name="Revenue" fill="#8884d8" />
                  <Bar dataKey="fixedNetProfit" name="Net Profit" fill="#0088FE" />
                </>
              )}
              {viewMode === 'tracking' && (
                <>
                  <Bar dataKey="trackingRevenue" name="Revenue" fill="#82ca9d" />
                  <Bar dataKey="trackingNetProfit" name="Net Profit" fill="#00C49F" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DSCR Chart (only for levered) */}
      {isLevered && (
        <div className="chart-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-highlight">Debt Service Coverage Ratio (DSCR)</h3>
            <button 
              onClick={() => handleDownloadChart('dscrChart')}
              style={{ padding: '5px 10px', cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
          <div id="dscrChart">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={dscrChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'DSCR', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<DSCRTooltip />} />
                <Legend />
                {viewMode === 'comparison' && (
                  <>
                    <Line type="monotone" dataKey="fixedDSCR" name="Fixed DSCR" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="trackingDSCR" name="Tracking DSCR" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </>
                )}
                {viewMode === 'fixed' && (
                  <Line type="monotone" dataKey="fixedDSCR" name="DSCR" stroke="#8884d8" activeDot={{ r: 8 }} />
                )}
                {viewMode === 'tracking' && (
                  <Line type="monotone" dataKey="trackingDSCR" name="DSCR" stroke="#82ca9d" activeDot={{ r: 8 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Yearly Financial Data Table (only for single system view) */}
      {viewMode !== 'comparison' && (
        <div className="chart-wrapper">
          <h3 className="text-highlight">
            Yearly Financial Data - {viewMode === 'fixed' ? 'Fixed System' : 'Tracking System'}
          </h3>
          <div className="yearly-data-table-container">
            <table className="data-table yearly-data-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Revenue</th>
                  <th>OPEX</th>
                  <th>Depreciation</th>
                  <th>Interest</th>
                  <th>Principal</th>
                  <th>Tax</th>
                  <th>Net Profit</th>
                  <th>Cash Flow</th>
                  <th>Cumulative CF</th>
                  {isLevered && <th>DSCR</th>}
                </tr>
              </thead>
              <tbody>
                {selectedSystemData.yearlyData.map((data) => (
                  <tr key={data.year}>
                    <td>{data.year}</td>
                    <td>{formatChartCurrency(data.revenue)}</td>
                    <td>{formatChartCurrency(data.opex)}</td>
                    <td>{formatChartCurrency(data.depreciation)}</td>
                    <td>{formatChartCurrency(data.interest)}</td>
                    <td>{formatChartCurrency(data.principal)}</td>
                    <td>{formatChartCurrency(data.tax)}</td>
                    <td>{formatChartCurrency(data.netProfit)}</td>
                    <td>{formatChartCurrency(data.cashFlow)}</td>
                    <td>{formatChartCurrency(data.cumulativeCashFlow)}</td>
                    {isLevered && <td>{data.dscr ? formatNumber(data.dscr) : 'N/A'}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;
