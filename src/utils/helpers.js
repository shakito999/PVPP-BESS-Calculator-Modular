/**
 * Scales a value based on plant capacity with optional economies of scale
 * @param {number} baseValue - Base value per MW
 * @param {number} capacity - Plant capacity in MW
 * @param {number} scalingFactor - 1 for linear scaling, <1 for economies of scale
 * @returns {number} Scaled value
 */
export const scaleWithCapacity = (baseValue, capacity, scalingFactor = 1) => {
  return baseValue * Math.pow(capacity, scalingFactor);
};

/**
 * Formats numbers with commas and two decimal places
 * @param {number} num - Number to format
 * @returns {string} Formatted number string or 'N/A' if null
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(num);
};

/**
 * Formats currency values in EUR with no decimal places
 * @param {number} num - Number to format
 * @returns {string} Formatted currency string or 'N/A' if null
 */
export const formatCurrency = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Formats decimal as percentage with two decimal places
 * @param {number} num - Decimal number to convert to percentage
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return `${(num * 100).toFixed(2)}%`;
};

/**
 * Formats currency for chart axes with K/M suffixes
 * @param {number} value - Number to format
 * @returns {string} Formatted currency string with appropriate suffix
 */
export const formatChartCurrency = (value) => {
  if (value === null || value === undefined) return '';
  if (Math.abs(value) >= 1000000) {
    return `€${(value / 1000000).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1000) {
    return `€${(value / 1000).toFixed(1)}K`;
  }
  return `€${value.toFixed(0)}`;
};

/**
 * Formats cost input values with thousands separators
 * @param {number} value - Number to format
 * @returns {string} Formatted number string with commas
 */
export const formatCostInput = (value) => {
  if (value === null || value === undefined || value === '') return '';
  // Handle potential non-numeric values gracefully
  const num = parseFloat(String(value).replace(/,/g, ''));
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Parses a cost input string by removing commas
 * @param {string} value - Input value with potential commas
 * @returns {string} Cleaned numeric string
 */
export const parseCostInput = (value) => {
  if (value === null || value === undefined || value === '') return '';
  return String(value).replace(/,/g, '');
};

/**
 * Calculates yearly loan payment using PMT (Payment) formula
 * @param {number} rate - Annual interest rate (decimal)
 * @param {number} nper - Total number of payments (years)
 * @param {number} pv - Present value (loan amount)
 * @returns {number} Yearly payment amount
 */
export const calculatePMT = (rate, nper, pv) => {
  if (rate === 0) return pv / nper; // Handle zero interest rate
  const pvif = Math.pow(1 + rate, nper);
  return (rate * pv * pvif) / (pvif - 1);
};

/**
 * Calculates IRR using Newton-Raphson method
 * @param {number[]} cashFlows - Array of cash flows, starting with initial investment (negative)
 * @returns {number|null} Internal Rate of Return or null if no solution found
 */
export const calculateIRR = (cashFlows) => {
  let guess = 0.1; // Initial guess of 10%
  const tolerance = 0.0001;
  const maxIterations = 100;
  let iteration = 0;

  while (iteration < maxIterations) {
    let npv = 0;
    let derivative = 0;

    // Calculate NPV and its derivative at current guess
    for (let i = 0; i < cashFlows.length; i++) {
      const denominator = Math.pow(1 + guess, i);
      npv += cashFlows[i] / denominator;
      if (i > 0) {
        derivative -= i * cashFlows[i] / Math.pow(1 + guess, i + 1);
      }
    }

    if (Math.abs(npv) < tolerance) {
      return guess;
    }

    // Avoid division by zero or very small derivative
    if (Math.abs(derivative) < 1e-10) {
      return null; // Or handle as an error/unstable calculation
    }

    const newGuess = guess - npv / derivative;
    
    // Check if the new guess is significantly different
    if (Math.abs(newGuess - guess) < tolerance) {
      return newGuess;
    }

    guess = newGuess;
    iteration++;
  }

  return null; // Failed to converge
};

/**
 * Prepares data for pie charts from cost breakdown objects
 * @param {Object} breakdown - Object containing name-value pairs
 * @returns {Array} Array of objects formatted for pie chart
 */
export const preparePieData = (breakdown) => {
  if (!breakdown) return [];
  return Object.entries(breakdown).map(([name, value]) => ({
    name,
    value: value || 0 // Ensure value is numeric, default to 0 if undefined/null
  }));
};

/**
 * Gets complete investment breakdown including construction costs
 * @param {Object} initialInvestmentBreakdown - Breakdown of initial investment components
 * @param {number} staticConstructionCost - Cost for static construction
 * @param {number} singleAxisTrackerCost - Cost for tracker construction
 * @param {boolean} isFixed - Whether to use fixed system costs
 * @returns {Array} Array of objects formatted for pie chart
 */
export const getFullInvestmentBreakdown = (initialInvestmentBreakdown, staticConstructionCost, singleAxisTrackerCost, isFixed) => {
  if (!initialInvestmentBreakdown) return [];
  const baseInvestment = Object.entries(initialInvestmentBreakdown).map(([name, value]) => ({
    name,
    value: value || 0
  }));
  
  const constructionCost = {
    name: isFixed ? 'Static Construction' : 'Single Axis Tracker',
    value: (isFixed ? staticConstructionCost : singleAxisTrackerCost) || 0
  };

  return [...baseInvestment, constructionCost];
};

/**
 * Formats numbers for Excel export with commas as decimal separator and no currency symbol
 * @param {number} num - Number to format
 * @returns {string} Formatted number string or 'N/A' if null
 */
export const formatForExcel = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return num.toString().replace('.', ',');
};
