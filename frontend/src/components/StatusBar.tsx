interface StatusBarProps {
  cellReference: string | null;
  cellValue: string | number | null;
  cellFormula: string | null;
}

const StatusBar = ({
  cellReference,
  cellValue,
  cellFormula,
}: StatusBarProps) => {
  return (
    // <div className="h-8 border-t border-border bg-muted/30 flex items-center px-4 gap-4 text-xs text-muted-foreground">
    //   {cellReference && (
    //     <>
    //       <div className="font-medium text-foreground min-w-[40px]">
    //         {cellReference}
    //       </div>
    //       <div className="h-4 w-px bg-border" />
    //       {cellFormula ? (
    //         <div className="flex gap-2">
    //           <span className="text-muted-foreground">fx</span>
    //           <span className="text-foreground font-mono">{cellFormula}</span>
    //           <span className="text-muted-foreground">=</span>
    //           <span className="text-foreground">{cellValue}</span>
    //         </div>
    //       ) : (
    //         <span className="text-foreground">
    //           {cellValue !== null ? String(cellValue) : '(empty)'}
    //         </span>
    //       )}
    //     </>
    //   )}
    //   {!cellReference && (
    //     <span>Select a cell to view details</span>
    //   )}
    // </div>

    <div className="h-10 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg flex items-center px-6 gap-4 text-sm shadow-sm">
      {cellReference && (
        <>
          <div className="font-semibold text-emerald-600 dark:text-emerald-400 min-w-[50px]">
            {cellReference}
          </div>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
          {cellFormula ? (
            <div className="flex gap-3 items-center text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">
                fx
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {cellFormula}
              </span>
              <span className="text-slate-400 dark:text-slate-500">=</span>
              <span className="font-medium">{cellValue}</span>
            </div>
          ) : (
            <span className="text-slate-700 dark:text-slate-300">
              {cellValue !== null ? (
                String(cellValue)
              ) : (
                <span className="text-slate-400 dark:text-slate-500 italic">
                  empty
                </span>
              )}
            </span>
          )}
        </>
      )}
      {!cellReference && (
        <span className="text-slate-500 dark:text-slate-400">
          Select a cell to view details
        </span>
      )}
    </div>
  );
};

export default StatusBar;
