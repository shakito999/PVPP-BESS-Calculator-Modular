import * as XLSX from 'xlsx';
import { formatForExcel } from '../utils/helpers';

const formatDataForExport = (data) => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    return Object.entries(data).map(([key, value]) => ({
      Metric: key,
      Value: typeof value === 'number' ? formatForExcel(value) : value
    }));
  }
  return [];
};

const addWorksheet = (wb, data, sheetName) => {
  const formattedData = formatDataForExport(data);
  const ws = XLSX.utils.json_to_sheet(formattedData);
  
  // Add styling
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const headerCell = XLSX.utils.encode_cell({r: 0, c: C});
    if (ws[headerCell]) {
      // Style header row
      ws[headerCell].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'D3D3D3' } },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        }
      };
    }

    // Style data cells and set cell types
    for (let R = 1; R <= range.e.r; ++R) {
      const cell = XLSX.utils.encode_cell({r: R, c: C});
      if (ws[cell]) {
        const value = ws[cell].v;
        
        // Set cell type and number format
        if (typeof value === 'number') {
          ws[cell].t = 'n'; // Set as number type
          ws[cell].z = '0.00'; // Set number format with 2 decimal places
        }

        ws[cell].s = {
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          }
        };
      }
    }
  }

  // Auto-size columns
  const colWidths = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxLength = 0;
    for (let R = 0; R <= range.e.r; ++R) {
      const cell = XLSX.utils.encode_cell({r: R, c: C});
      if (ws[cell]) {
        const cellLength = ws[cell].v.toString().length;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      }
    }
    colWidths.push({ wch: Math.min(Math.max(maxLength, 10), 50) });
  }
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
};

export const exportToExcel = (data, fileName) => {
  try {
    const wb = XLSX.utils.book_new();

    // Add sheets for each system
    if (data['Fixed System Financial Metrics']) {
      addWorksheet(wb, data['Fixed System Financial Metrics'], 'Fixed System Metrics');
    }
    if (data['Fixed System Yearly Data']) {
      addWorksheet(wb, data['Fixed System Yearly Data'], 'Fixed System Yearly Data');
    }
    if (data['Tracking System Financial Metrics']) {
      addWorksheet(wb, data['Tracking System Financial Metrics'], 'Tracking System Metrics');
    }
    if (data['Tracking System Yearly Data']) {
      addWorksheet(wb, data['Tracking System Yearly Data'], 'Tracking System Yearly Data');
    }

    // Add other sheets
    if (data['Analysis Settings']) {
      addWorksheet(wb, data['Analysis Settings'], 'Settings');
    }
    if (data['Battery System']) {
      addWorksheet(wb, data['Battery System'], 'Battery');
    }
    if (data['Cash Flow Charts']) {
      addWorksheet(wb, data['Cash Flow Charts'], 'Cash Flow');
    }
    if (data['Revenue Charts']) {
      addWorksheet(wb, data['Revenue Charts'], 'Revenue');
    }
    if (data['DSCR Charts']) {
      addWorksheet(wb, data['DSCR Charts'], 'DSCR');
    }

    XLSX.writeFile(wb, `${fileName}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};
