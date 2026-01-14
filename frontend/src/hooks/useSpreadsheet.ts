import { useState, useCallback } from 'react';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { uploadSpreadsheetToBackend } from '@/lib/api';

export interface CellData {
  value: string | number | null;
  formula?: string;
}

export interface SpreadsheetState {
  data: (string | number | null)[][];
  selectedCell: { row: number; col: number } | null;
  selectedCellValue: string | number | null;
  selectedCellFormula: string | null;
}

const createEmptyGrid = (rows: number, cols: number): (string | number | null)[][] => {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
};

export const useSpreadsheet = () => {
  const [data, setData] = useState<(string | number | null)[][]>(() => createEmptyGrid(100, 26));
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedCellValue, setSelectedCellValue] = useState<string | number | null>(null);
  const [selectedCellFormula, setSelectedCellFormula] = useState<string | null>(null);

  const handleCellSelect = useCallback((row: number, col: number, value: string | number | null, formula?: string) => {
    setSelectedCell({ row, col });
    setSelectedCellValue(value);
    setSelectedCellFormula(formula || null);
  }, []);

  const handleDataChange = useCallback((newData: (string | number | null)[][]) => {
    setData(newData);
  }, []);

  const parseCSV = useCallback((file: File): Promise<(string | number | null)[][]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          const parsedData = results.data as string[][];
          const processedData = parsedData.map(row =>
            row.map(cell => {
              if (cell === '' || cell === null || cell === undefined) return null;
              const num = Number(cell);
              return isNaN(num) ? cell : num;
            })
          );
          resolve(processedData);
        },
        error: (error) => reject(error),
      });
    });
  }, []);

  const parseXLSX = useCallback((file: File): Promise<(string | number | null)[][]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as (string | number | null)[][];
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }, []);

  // const handleFileUpload = useCallback(async (file: File) => {
  //   try {
  //     let parsedData: (string | number | null)[][];

  //     if (file.name.endsWith('.csv')) {
  //       parsedData = await parseCSV(file);
  //       console.log('CSV file parsed successfully');
  //     } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
  //       parsedData = await parseXLSX(file);
  //       console.log('Excel file parsed successfully');
  //       console.log('Parsed Data:', parsedData);  
  //     } else {
  //       throw new Error('Unsupported file format');
  //     }

  //     // Ensure minimum grid size
  //     const minRows = Math.max(parsedData.length, 100);
  //     const minCols = Math.max(parsedData[0]?.length || 0, 26);

  //     const paddedData = createEmptyGrid(minRows, minCols);
  //     parsedData.forEach((row, rowIndex) => {
  //       row.forEach((cell, colIndex) => {
  //         if (rowIndex < minRows && colIndex < minCols) {
  //           paddedData[rowIndex][colIndex] = cell;
  //         }
  //       });
  //     });

  //     setData(paddedData);
  //   } catch (error) {
  //     console.error('Error parsing file:', error);
  //   }
  // }, [parseCSV, parseXLSX]);

 const isValidSheet = (sheet: unknown): sheet is Record<string, any> =>
  !!sheet && typeof sheet === 'object' && !Array.isArray(sheet);

 const colLettersToIndex = (letters: string) => {
  let col = 0;
  for (let i = 0; i < letters.length; i++) {
    col = col * 26 + (letters.charCodeAt(i) - 65 + 1);
  }
  return col - 1;
};

 const computeGridSize = (sheetData: Record<string, any>) => {
  let maxRow = 0;
  let maxCol = 0;

  Object.keys(sheetData).forEach((cellRef) => {
    const match = cellRef.match(/^([A-Z]+)(\d+)$/);
    if (!match) return;

    const col = colLettersToIndex(match[1]);
    const row = parseInt(match[2], 10);

    maxRow = Math.max(maxRow, row);
    maxCol = Math.max(maxCol, col);
  });

  return {
    rows: Math.max(maxRow, 100),
    cols: Math.max(maxCol + 1, 26),
  };
};

 const mapSheetToGrid = (
  sheetData: unknown
): (string | number | null)[][] => {
  if (!isValidSheet(sheetData)) {
    return Array.from({ length: 100 }, () => Array(26).fill(null));
  }

  const { rows, cols } = computeGridSize(sheetData);

  const grid = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  Object.entries(sheetData).forEach(([cellRef, cell]) => {
    if (!cell || typeof cell !== 'object') return;

    const match = cellRef.match(/^([A-Z]+)(\d+)$/);
    if (!match) return;

    const col = colLettersToIndex(match[1]);
    const row = parseInt(match[2], 10) - 1;

    if (row >= rows || col >= cols) return;

    const { formula, value } = cell as {
      formula?: string | null;
      value?: string | number | null;
    };

    if (formula) {
      grid[row][col] = formula.startsWith("=")
        ? formula
        : `=${formula}`;
    } else {
      grid[row][col] = value ?? null;
    }
  });

  return grid;
};


// const handleFileUpload = useCallback(async (file: File) => {
//   try {
//     console.log('Uploading file to backend:', file.name);
//     const backendResponse = await uploadSpreadsheetToBackend(file);
//     console.log('Processed spreadsheet from backend:', backendResponse);

//     if (!backendResponse.success || !backendResponse.data) {
//       throw new Error('Invalid backend response');
//     }

//     // Assuming single sheet for now; use backendResponse.sheet_name if multiple
//     const sheetData = backendResponse.data["Arithmetic Demo"] as Record<string, {
//       value: string | number | null;
//       formula: string | null;
//       dependencies: string[];
//     }>;

//     if (!sheetData) throw new Error('Sheet data not found');

//     // Find max row & col to size the grid
//     let maxRow = 0;
//     let maxCol = 0;

//     Object.keys(sheetData).forEach((cellRef) => {
//       const match = cellRef.match(/^([A-Z]+)(\d+)$/);
//       if (match) {
//         const colStr = match[1];
//         const rowNum = parseInt(match[2], 10);

//         let colNum = 0;
//         for (let i = 0; i < colStr.length; i++) {
//           colNum = colNum * 26 + (colStr.charCodeAt(i) - 65 + 1);
//         }
//         colNum--; // 0-based

//         maxRow = Math.max(maxRow, rowNum);
//         maxCol = Math.max(maxCol, colNum);
//       }
//     });

//     // Add some padding if needed (e.g. at least 100 rows / 26 cols)
//     const rows = Math.max(maxRow, 100);
//     const cols = Math.max(maxCol + 1, 26); // +1 because 0-based

//     const grid: (string | number | null)[][] = Array.from({ length: rows }, () =>
//       Array(cols).fill(null)
//     );

//     // Populate with backend values
//     Object.entries(sheetData).forEach(([cellRef, cellInfo]) => {
//       const match = cellRef.match(/^([A-Z]+)(\d+)$/);
//       if (match) {
//         const colStr = match[1];
//         const rowNum = parseInt(match[2], 10) - 1; // 0-based row

//         let colNum = 0;
//         for (let i = 0; i < colStr.length; i++) {
//           colNum = colNum * 26 + (colStr.charCodeAt(i) - 65 + 1);
//         }
//         colNum--; // 0-based

//         if (rowNum < rows && colNum < cols) {
//           grid[rowNum][colNum] = cellInfo.value; // Use computed value
//           // If you want to store formula too → see next section
//         }
//       }
//     });


//     console.log('Mapped grid data:', grid);

//     setData(grid);

//     // Optional: scroll to top-left or select A1
//     // if you have a ref to Handsontable instance: hotInstance?.selectCell(0, 0);

//   } catch (error) {
//     console.error('Upload / mapping failed:', error);
//   }
// }, []);


const handleFileUpload = useCallback(async (file: File) => {
  try {
    const backendResponse = await uploadSpreadsheetToBackend(file);
    console.log(backendResponse.success)

    if (!backendResponse?.success || !backendResponse.data) {
      throw new Error('Invalid backend response');
    }

    const sheetNames = Object.keys(backendResponse.data);

    if (sheetNames.length === 0) {
      throw new Error('No sheets found');
    }

    
    const activeSheetName = sheetNames[0];
    const sheetData = backendResponse.data[activeSheetName];
    const grid = mapSheetToGrid(sheetData);

  

    setData(grid);

  } catch (err) {
    console.error('Spreadsheet upload failed:', err);
  }
}, []);


  const getCellReference = useCallback((row: number, col: number): string => {
    const colLetter = String.fromCharCode(65 + col);
    return `${colLetter}${row + 1}`;
  }, []);

  return {
    data,
    selectedCell,
    selectedCellValue,
    selectedCellFormula,
    setData,
    handleCellSelect,
    handleDataChange,
    handleFileUpload,
    getCellReference,
    isValidSheet,
    computeGridSize,
    mapSheetToGrid
  };
};
