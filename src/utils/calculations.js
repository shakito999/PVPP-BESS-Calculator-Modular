import { 
  calculatePMT, 
  calculateIRR 
} from './helpers';
import {
  CORPORATE_TAX,
  FIRST_YEAR_DEGRADATION,
  SUBSEQUENT_YEAR_DEGRADATION
} from './constants';

/**
 * Calculates the loan amount based on initial investment and loan percentage
 * @param {number} initialInvestment - Total initial investment amount
 * @param {number} loanPercentage - Loan percentage (decimal)
 * @returns {number} Loan amount
 */
export const getLoanAmount = (initialInvestment, loanPercentage) => 
  initialInvestment * loanPercentage;

/**
 * Calculates the equity amount based on initial investment and loan percentage
 * @param {number} initialInvestment - Total initial investment amount
 * @param {number} loanPercentage - Loan percentage (decimal)
 * @returns {number} Equity amount
 */
export const getEquityAmount = (initialInvestment, loanPercentage) => 
  initialInvestment * (1 - loanPercentage);

/**
 * Calculates total battery system costs including investment and OPEX
 * @param {boolean} hasBatteryStorage - Whether battery storage is enabled
 * @param {Object} batteryInvestmentBreakdown - Battery investment components
 * @param {Object} batteryOpex - Battery OPEX percentages
 * @returns {{investment: number, opex: number}} Object containing battery investment and yearly OPEX
 */
export const calculateBatteryCosts = (hasBatteryStorage, batteryInvestmentBreakdown, batteryOpex) => {
  if (!hasBatteryStorage) return { investment: 0, opex: 0 };

  const totalBatteryInvestment = Object.values(batteryInvestmentBreakdown).reduce((a, b) => a + b, 0);
  const yearlyBatteryOpex = totalBatteryInvestment * (
    batteryOpex.maintenance / 100 +
    batteryOpex.insurance / 100 +
    batteryOpex.replacementReserve / 100
  );

  return {
    investment: totalBatteryInvestment,
    opex: yearlyBatteryOpex
  };
};

/**
 * Calculates yearly battery revenue considering degradation and efficiency
 * @param {number} year - Year number (1-based)
 * @param {boolean} hasBatteryStorage - Whether battery storage is enabled
 * @param {Object} batterySettings - Battery configuration settings
 * @returns {number} Yearly revenue from battery storage operations
 */
export const calculateBatteryRevenue = (year, hasBatteryStorage, batterySettings) => {
  if (!hasBatteryStorage) return 0;

  const storageMWh = batterySettings.capacity * batterySettings.storageDuration;
  const efficiency = 1; // Fixed efficiency
  
  // Calculate degradation considering reset at year 15
  const degradation = Math.pow(1 - 0.02 / 100, 
    year <= 15 ? year - 1 : (year - 1) - 15);  // Reset degradation calculation after year 15
  
  // Convert MWh to kWh for price calculations
  const storageKWh = storageMWh * 1000;
  const dailyStorageCost = storageKWh * batterySettings.peakSolarPrice;
  const dailyStorageRevenue = storageKWh * efficiency * batterySettings.eveningPeakPrice * degradation;
  const dailyProfit = (dailyStorageRevenue - dailyStorageCost);
  
  return dailyProfit * 365;
};

/**
 * Calculates comprehensive financial metrics for a solar system
 * @param {number} energyYield - Annual energy yield in MWh
 * @param {number} initialInvestment - Initial investment amount
 * @param {Object} settings - Financial settings
 * @param {boolean} isLevered - Whether financing is levered
 * @param {boolean} hasBatteryStorage - Whether battery storage is enabled
 * @param {Object} batteryCosts - Battery costs object
 * @param {Function} batteryRevenueCalculator - Function to calculate battery revenue
 * @returns {Object} Complete financial analysis including NPV, IRR, ROE, and yearly data
 */
export const calculateFinancials = (
  energyYield, 
  initialInvestment, 
  settings, 
  isLevered, 
  hasBatteryStorage, 
  batteryCosts = { investment: 0, opex: 0 }, 
  batteryRevenueCalculator = () => 0
) => {
  const years = Array.from({ length: settings.operationTime }, (_, i) => i + 1);
  const totalInitialInvestment = initialInvestment + batteryCosts.investment;
  const loanAmount = getLoanAmount(totalInitialInvestment, settings.loanPercentage);
  const equityAmount = getEquityAmount(totalInitialInvestment, settings.loanPercentage);
  let remainingLoan = loanAmount;
  const yearlyLoanPayment = calculatePMT(settings.loanInterestRate, settings.loanTerm, loanAmount);

  // Initialize arrays for financial metrics
  const yearlyRevenue = [];
  const yearlyOpexInflated = [];
  const yearlyDepreciation = [];
  const yearlyInterest = [];
  const yearlyPrincipal = [];
  const yearlyTaxableIncome = [];
  const yearlyTax = [];
  const yearlyNetProfit = [];
  const yearlyCashFlow = [];
  const cumulativeCashFlow = [];
  const yearlyDSCR = [];

  // Calculate degradation factors for each year
  const degradationFactors = years.map((year) => {
    if (year === 1) {
      return 1 - FIRST_YEAR_DEGRADATION;
    } else {
      return (1 - FIRST_YEAR_DEGRADATION) * Math.pow(1 - SUBSEQUENT_YEAR_DEGRADATION, year - 1);
    }
  });

  // Calculate electricity price for each year with inflation
  const electricityPrices = years.map((year) => {
    if (year === 1) {
      return settings.electricityPrice2025;
    } else {
      return settings.electricityPrice2025 * Math.pow(1 + settings.inflationRate, year - 1);
    }
  });

  // Calculate OPEX for each year with inflation
  const opexValues = years.map((year) => {
    return settings.yearlyOpex * Math.pow(1 + settings.inflationRate, year - 1);
  });

  // Calculate straight-line depreciation over operation time
  const yearlyDepreciationValue = totalInitialInvestment / settings.operationTime;

  // Calculate yearly financial metrics
  years.forEach((year, index) => {
    // Revenue calculation
    const solarRevenue = energyYield * 1000 * degradationFactors[index] * electricityPrices[index];
    const batteryRevenue = batteryRevenueCalculator(year);
    const totalRevenue = solarRevenue + batteryRevenue;
    yearlyRevenue.push(totalRevenue);

    // OPEX with battery OPEX
    const totalOpex = opexValues[index] + (hasBatteryStorage ? batteryCosts.opex : 0);
    yearlyOpexInflated.push(totalOpex);

    // Depreciation
    yearlyDepreciation.push(yearlyDepreciationValue);

    // Interest payment (only for levered)
    let interest = 0;
    if (isLevered && year <= settings.loanTerm) {
      interest = remainingLoan * settings.loanInterestRate;
    }
    yearlyInterest.push(interest);

    // Principal payment (only for levered)
    let principal = 0;
    if (isLevered && year <= settings.loanTerm) {
      principal = yearlyLoanPayment - interest;
      remainingLoan -= principal;
    }
    yearlyPrincipal.push(principal);

    // Taxable income
    const taxableIncome = totalRevenue - totalOpex - yearlyDepreciationValue - interest;
    yearlyTaxableIncome.push(taxableIncome);

    // Tax
    const tax = Math.max(0, taxableIncome * CORPORATE_TAX);
    yearlyTax.push(tax);

    // Net profit
    const netProfit = taxableIncome - tax;
    yearlyNetProfit.push(netProfit);

    // Cash flow
    const cashFlow = netProfit + yearlyDepreciationValue - principal;
    yearlyCashFlow.push(cashFlow);

    // Cumulative cash flow (including initial investment)
    if (index === 0) {
      cumulativeCashFlow.push(cashFlow - (isLevered ? equityAmount : totalInitialInvestment));
    } else {
      cumulativeCashFlow.push(cumulativeCashFlow[index - 1] + cashFlow);
    }

    // DSCR (Debt Service Coverage Ratio) - only for levered
    if (isLevered && year <= settings.loanTerm) {
      const dscr = (totalRevenue - totalOpex - tax) / yearlyLoanPayment;
      yearlyDSCR.push(dscr);
    } else {
      yearlyDSCR.push(null);
    }
  });

  // Calculate NPV
  const npv = yearlyCashFlow.reduce((acc, cf, idx) => {
    return acc + cf / Math.pow(1 + settings.discountRate, idx + 1);
  }, -(isLevered ? equityAmount : totalInitialInvestment));

  // Calculate IRR
  const allCashFlows = [-(isLevered ? equityAmount : totalInitialInvestment), ...yearlyCashFlow];
  const irr = calculateIRR(allCashFlows);

  // Calculate payback period
  let paybackPeriod = 0;
  for (let i = 0; i < cumulativeCashFlow.length; i++) {
    if (cumulativeCashFlow[i] >= 0) {
      if (i === 0) {
        paybackPeriod = 1;
      } else {
        const previousCF = i === 0 ? -(isLevered ? equityAmount : totalInitialInvestment) : cumulativeCashFlow[i - 1];
        const currentCF = cumulativeCashFlow[i];
        paybackPeriod = i + Math.abs(previousCF) / (currentCF - previousCF);
      }
      break;
    }
  }
  if (paybackPeriod === 0) {
    paybackPeriod = settings.operationTime; // No payback within operation time
  }

  // Calculate ROE (average annual net profit over equity/investment)
  const totalNetProfit = yearlyNetProfit.reduce((sum, profit) => sum + profit, 0);
  const averageAnnualROE = totalNetProfit / settings.operationTime / (isLevered ? equityAmount : totalInitialInvestment);

  // Calculate average DSCR (only for levered)
  const averageDSCR = isLevered 
    ? yearlyDSCR.filter((d) => d !== null).reduce((sum, dscr) => sum + dscr, 0) / settings.loanTerm
    : null;

  return {
    npv,
    irr,
    roe: averageAnnualROE,
    paybackPeriod,
    averageDSCR,
    totalProfit: totalNetProfit,
    initialInvestment: totalInitialInvestment,
    yearlyData: years.map((year, i) => ({
      year,
      revenue: yearlyRevenue[i],
      opex: yearlyOpexInflated[i],
      depreciation: yearlyDepreciation[i],
      interest: yearlyInterest[i],
      principal: yearlyPrincipal[i],
      taxableIncome: yearlyTaxableIncome[i],
      tax: yearlyTax[i],
      netProfit: yearlyNetProfit[i],
      cashFlow: yearlyCashFlow[i],
      cumulativeCashFlow: cumulativeCashFlow[i],
      dscr: yearlyDSCR[i],
    })),
  };
};
