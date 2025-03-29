import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { COLORS } from '../utils/constants';
import { preparePieData, getFullInvestmentBreakdown, formatCurrency } from '../utils/helpers';

const PieCharts = () => {
  const { 
    viewMode,
    expandedChart,
    setExpandedChart,
    initialInvestmentBreakdown,
    staticConstructionCost,
    singleAxisTrackerCost,
    staticOpexBreakdown,
    trackerOpexBreakdown,
    setShowPieCharts,
    showPieCharts
  } = useAppContext();

  // Custom label renderer for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value, fill }) => {
    const RADIAN = Math.PI / 180;
    // Use a simpler radius calculation
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Only hide very small slices
    if (percent < 0.01) return null;

    // Calculate line points
    const innerX = cx + (outerRadius + 5) * Math.cos(-midAngle * RADIAN);
    const innerY = cy + (outerRadius + 5) * Math.sin(-midAngle * RADIAN);

    // Split long names into multiple lines
    const words = name.split(' ');
    const maxWordsPerLine = 2;
    const lines = [];
    for (let i = 0; i < words.length; i += maxWordsPerLine) {
      lines.push(words.slice(i, i + maxWordsPerLine).join(' '));
    }
    lines.push(formatCurrency(value));

    return (
      <g style={{ transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <path
          d={`M ${innerX},${innerY} L ${x},${y}`}
          stroke={fill}
          strokeWidth={1}
          fill="none"
          opacity={0.7}
          style={{ transition: 'd 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        {lines.map((line, i) => (
          <text
            key={i}
            x={x}
            y={y + (i - (lines.length - 1) / 2) * 15}
            fill={fill}
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize={12}
            fontWeight="600"
            style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  return (
    <div className={`pie-charts-overlay ${showPieCharts ? 'show' : ''}`}>
      <div className="pie-charts-container">
        <div className="pie-charts-header">
          <h3 className="text-highlight">Cost Breakdown Charts</h3>
          <button 
            className="close-panel-button"
            onClick={() => setShowPieCharts(false)}
          >
            ×
          </button>
        </div>
        
        <div className="pie-charts-content">
          <div className={`pie-chart-wrapper ${expandedChart === 'investment' ? 'expanded' : ''}`}>
            <h3 className="text-highlight">Initial Investment Breakdown</h3>
            <div 
              onClick={() => setExpandedChart(expandedChart === 'investment' ? null : 'investment')}
              className="pie-chart-clickable"
            >
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={getFullInvestmentBreakdown(initialInvestmentBreakdown, staticConstructionCost, singleAxisTrackerCost, viewMode === 'fixed')}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={expandedChart === 'investment' ? 80 : 60}
                    outerRadius={expandedChart === 'investment' ? 200 : 140}
                    label={renderCustomLabel}
                    labelLine={false}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={expandedChart === 'investment' ? 3 : 1}
                  >
                    {getFullInvestmentBreakdown(initialInvestmentBreakdown, staticConstructionCost, singleAxisTrackerCost, viewMode === 'fixed').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {(viewMode === 'comparison' || viewMode === 'fixed') && (
            <div className={`pie-chart-wrapper ${expandedChart === 'static-opex' ? 'expanded' : ''}`}>
              <h3 className="text-highlight">Fixed System OPEX Breakdown</h3>
              <div 
                onClick={() => setExpandedChart(expandedChart === 'static-opex' ? null : 'static-opex')}
                className="pie-chart-clickable"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={preparePieData(staticOpexBreakdown)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={expandedChart === 'static-opex' ? 80 : 60}
                      outerRadius={expandedChart === 'static-opex' ? 200 : 140}
                      label={renderCustomLabel}
                      labelLine={false}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={expandedChart === 'static-opex' ? 3 : 1}
                    >
                      {preparePieData(staticOpexBreakdown).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {(viewMode === 'comparison' || viewMode === 'tracking') && (
            <div className={`pie-chart-wrapper ${expandedChart === 'tracking-opex' ? 'expanded' : ''}`}>
              <h3 className="text-highlight">Tracking System OPEX Breakdown</h3>
              <div 
                onClick={() => setExpandedChart(expandedChart === 'tracking-opex' ? null : 'tracking-opex')}
                className="pie-chart-clickable"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={preparePieData(trackerOpexBreakdown)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={expandedChart === 'tracking-opex' ? 80 : 60}
                      outerRadius={expandedChart === 'tracking-opex' ? 200 : 140}
                      label={renderCustomLabel}
                      labelLine={false}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={expandedChart === 'tracking-opex' ? 3 : 1}
                    >
                      {preparePieData(trackerOpexBreakdown).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PieCharts;
