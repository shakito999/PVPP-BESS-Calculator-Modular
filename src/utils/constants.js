// Color palette for charts and visualizations
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57'];

// Base values per MW for initial investment components
export const BASE_INVESTMENT_PER_MW = {
  'Solar Panels': 137999.86,      // €/MW
  'Inverters': 30720.00,          // €/MW
  'Fence': 1200.00,               // €/MW
  'Grid Connection': 3000.00,     // €/MW
  'Land Lease': 7648.00,          // €/MW
  'Site Preparation': 478.00,     // €/MW
  'Foundations': 30000.00,        // €/MW
  'Electrical Equipment': 70000.00,// €/MW
  'Monitoring Systems': 1500.00,   // €/MW
  'Engineering': 7500.00,         // €/MW
  'Construction': 10000.00,       // €/MW
};

// Base construction costs per MW
export const BASE_STATIC_CONSTRUCTION_COST_PER_MW = 50000.00;    // €/MW
export const BASE_TRACKER_CONSTRUCTION_COST_PER_MW = 80000.00;    // €/MW

// Base OPEX values per MW with scaling factors
export const BASE_STATIC_OPEX_PER_MW = {
  'Balancing Fee': 6109.14,       // €/MW/year
  'Maintenance': 3225.00,         // €/MW/year
  'Insurance': 1290.00,           // €/MW/year
  'Monitoring & Performance Analysis': 1000.00,  // €/MW/year
  'Administrative Expenses': 4000.00,           // €/MW/year
  'Security': 2000.00,            // €/MW/year
  'Reserve Funds': 2000.00,       // €/MW/year
};

export const BASE_TRACKER_OPEX_PER_MW = {
  'Balancing Fee': 7824.46,       // €/MW/year
  'Maintenance': 5375.00,         // €/MW/year
  'Insurance': 1290.00,           // €/MW/year
  'Monitoring & Performance Analysis': 1000.00,  // €/MW/year
  'Administrative Expenses': 4000.00,           // €/MW/year
  'Security': 2000.00,            // €/MW/year
  'Reserve Funds': 2000.00,       // €/MW/year
};

// Energy yield per MW
export const BASE_FIXED_ENERGY_YIELD_PER_MW = 1745.47;    // MWh/y/MW for fixed system
export const BASE_TRACKING_ENERGY_YIELD_PER_MW = 2235.56;  // MWh/y/MW for tracking system

// Financial constants
export const CORPORATE_TAX = 0.1; // 10% corporate tax rate
export const FIRST_YEAR_DEGRADATION = 0.01; // 1% first year panel degradation
export const SUBSEQUENT_YEAR_DEGRADATION = 0.004; // 0.4% annual panel degradation

// Default battery investment components
export const DEFAULT_BATTERY_COMPONENTS = {
  'Battery System': 0,
  'Installation': 0,
  'Grid Connection': 0,
  'Control Systems': 0,
};

// Battery investment cost factors
export const BATTERY_INVESTMENT_FACTORS = {
  'Installation': 10000,      // € per MW
  'Grid Connection': 6000,    // € per MW
  'Control Systems': 4000,    // € per MW
};
