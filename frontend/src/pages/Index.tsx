import TopBar from "@/components/TopBar";
import SpreadsheetGrid from "@/components/SpreadsheetGrid";
import StatusBar from "@/components/StatusBar";
import ChatDrawer from "@/components/ChatDrawer";
import { useSpreadsheet } from "@/hooks/useSpreadsheet";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect } from "react";

const Index = () => {
  const {
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
  } = useSpreadsheet();

  const cellReference = selectedCell
    ? getCellReference(selectedCell.row, selectedCell.col)
    : null;

  const getDataOnstp = async () =>{
    try {

      const res = await fetch('/api/spreadsheets/latest', {
         method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()
      
      console.log(data.data)

      const sheetNames = Object.keys(data.data);
      const activeSheetName = sheetNames[0];
      const sheetData = data.data[activeSheetName].cells;
      const grid = mapSheetToGrid(sheetData);

      console.log(grid)

      setData(grid)
      
    } catch (error) {
      console.log("Error updating sheet data: ", error)
    }
  }

  useEffect(() => {
    
    getDataOnstp()



  }, []);

  return (


    
  <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
    <TopBar onFileUpload={handleFileUpload} />

    <div className="flex-1 min-h-0 p-4">
      <ErrorBoundary>
        <div className="h-full rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <SpreadsheetGrid
            key={`spreadsheet-${data.length}-${data?.[0]?.length || 0}`}
            data={data}
            onDataChange={handleDataChange}
            onCellSelect={handleCellSelect}
          />
        </div>
      </ErrorBoundary>
    </div>

    <StatusBar
      cellReference={cellReference}
      cellValue={selectedCellValue}
      cellFormula={selectedCellFormula}
    />

    <ChatDrawer />
  </div>

  );
};

export default Index;
