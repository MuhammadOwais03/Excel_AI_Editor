import { useEffect, useRef, useMemo } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { HyperFormula } from 'hyperformula';

// Correct CSS imports for Handsontable 16+
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';

registerAllModules();

interface SpreadsheetGridProps {
  data: (string | number | null)[][];
  onDataChange: (data: (string | number | null)[][]) => void;
  onCellSelect: (
    row: number,
    col: number,
    value: string | number | null,
    formula: string | null
  ) => void;
}

const SpreadsheetGrid = ({ data, onDataChange, onCellSelect }: SpreadsheetGridProps) => {
  const hotRef = useRef<HotTable>(null);

  // Create HyperFormula instance synchronously on first render (useMemo)
  const hyperformulaInstance = useMemo(() => {
    return HyperFormula.buildEmpty({
      licenseKey: 'internal-use-in-handsontable',
    });
  }, []); // empty deps → created once

  // Apply new data when prop changes
  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    try {
      hot.loadData(data as any[][]);
      hot.render();
      hot.scrollViewportTo({
        row: 0,
        col: 0,
        snapToTop: true,
        snapToLeft: true,
      });
      hot.selectCell(0, 0);
    } catch (err) {
      console.error('Failed to apply data to Handsontable:', err);
    }
  }, [data]);

  const handleAfterChange = (changes: any[] | null, source: string) => {
    if (
      source === 'loadData' ||
      source === 'updateData' ||
      source === 'Alter' ||
      source === 'autofill' ||
      source === 'CopyPaste.paste' ||
      !changes ||
      changes.length === 0
    ) {
      return;
    }

    const hot = hotRef.current?.hotInstance;
    if (hot) {
      const newData = hot.getData() as (string | number | null)[][];
      onDataChange(newData);
    }
  };

  const handleAfterSelectionEnd = (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ) => {
    if (startRow !== endRow || startCol !== endCol) return;

    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const value = hot.getDataAtCell(startRow, startCol);
    const sourceData = hot.getSourceDataAtCell(startRow, startCol);

    const formula =
      typeof sourceData === 'string' && sourceData.trim().startsWith('=')
        ? sourceData.trim()
        : null;

    onCellSelect(startRow, startCol, value, formula);
  };

  return (
    <div className="flex-1 overflow-hidden">
      <HotTable
        ref={hotRef}
        // data={data}
        colHeaders={true}
        rowHeaders={true}
        width="100%"
         height="calc(100vh - 140px)"
        // height="100%"
        licenseKey="non-commercial-and-evaluation"
        formulas={{
          engine: hyperformulaInstance,           // ← guaranteed not null
          sheetName: 'Arithmetic Demo',           // ← use your actual sheet name
        }}
        afterChange={handleAfterChange}
        afterSelectionEnd={handleAfterSelectionEnd}
        stretchH="all"
        autoWrapRow={true}
        autoWrapCol={true}
        manualColumnResize={true}
        manualRowResize={true}
        contextMenu={true}
        minSpareRows={10}
        minSpareCols={5}
        enterBeginsEditing={true}
        tabMoves={{ row: 0, col: 1 }}
      />
    </div>
  );
};

export default SpreadsheetGrid;