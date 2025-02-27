"use client"
import Image from "next/image";
import "./globals.css";
import { useState } from 'react';

export default function Home() {

  const [columns, setColumns] = useState(Array.from({ length: 27 }, () => 120)); //initial width
  const [rows, setRows] = useState(Array.from({ length: 100 }, () => 25)); //initial heights
  const [resizing, setResizing] = useState({ column: null, row: null });
  const [cellValues, setCellValues] = useState(() => {
      const initialValues = Array.from({ length: 100 }, (_, rowIndex) => 
        Array.from({ length: 27 }, (_, colIndex) => ({
          value: rowIndex === 0 && colIndex === 0 ? '' : 
                 rowIndex === 0 ? String.fromCharCode(64 + colIndex) : 
                 colIndex === 0 ? rowIndex : '',
          isBold: false,
          isItalic: false,
          fontSize: 14,
          textColor: '#000000',
        }))
      );
      return initialValues;
    });

  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState(null);

  const MathFunctions = (operation, indexes) => {
      // Extract values from cellValues based on provided indexes
      const values = indexes.map(({ row, col }) => parseFloat(cellValues[row][col].value)).filter(v => !isNaN(v));
  
      if (values.length === 0) return 0; // Handle case when no valid numbers are found
  

      switch (operation.toUpperCase()) {
          case "SUM":
              return parseFloat(values.reduce((sum, num) => sum + num, 0));
          case "AVG":
              return parseFloat(values.reduce((sum, num) => sum + num, 0) / values.length);
          case "COUNT":
              return parseFloat(values.length);
          case "MAX":
              return parseFloat(Math.max(...values));
          case "MIN":
              return parseFloat(Math.min(...values));
          case "MEAN":
              const mean1 = values.reduce((sum, num) => sum + num, 0) / values.length;
              return parseFloat(mean1);
          case "MEDIAN":
              const sorted = [...values].sort((a, b) => a - b);
              const mid = Math.floor(sorted.length / 2);
              return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
          case "MODE":
              const freqMap = values.reduce((acc, num) => (acc[num] = (acc[num] || 0) + 1, acc), {});
              const maxFreq = Math.max(...Object.values(freqMap));
              return parseFloat(Object.keys(freqMap).find(key => freqMap[key] === maxFreq));
          case "PRODUCT":
              return parseFloat(values.reduce((prod, num) => prod * num, 1));
          case "VARIANCE":
              const mean2 = values.reduce((sum, num) => sum + num, 0) / values.length;
              return parseFloat(values.reduce((sum, num) => sum + (num - mean2) ** 2, 0) / values.length);
          case "STDDEV":
              const mean3 = values.reduce((sum, num) => sum + num, 0) / values.length;
              const variance = values.reduce((sum, num) => sum + (num - mean3) ** 2, 0) / values.length;
              return parseFloat(Math.sqrt(variance));
          default:
              throw new Error("Invalid operation");
      }
  };


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [MathAns,setMathAns]=useState(null);
  const handleOptionSelect = (option) => {
      setMathAns(MathFunctions(option,selectedCells));
      setIsDropdownOpen(false); // Close the dropdown after selecting an option

  };

  const DataFunctions = (operation, selectedCells, cellValues, findText = '', replaceText = '') => {
      const newCellValues = cellValues.map(row => [...row]); // Create a deep copy of cellValues
  
      switch (operation.toUpperCase()) {
          case "TRIM":
              selectedCells.forEach(({ row, col }) => {
                  if (newCellValues[row][col].value) {
                      newCellValues[row][col].value = newCellValues[row][col].value.trim();
                  }
              });
              break;
  
          case "UPPER":
              selectedCells.forEach(({ row, col }) => {
                  if (newCellValues[row][col].value) {
                      newCellValues[row][col].value = newCellValues[row][col].value.toUpperCase();
                  }
              });
              break;
  
          case "LOWER":
              selectedCells.forEach(({ row, col }) => {
                  if (newCellValues[row][col].value) {
                      newCellValues[row][col].value = newCellValues[row][col].value.toLowerCase();
                  }
              });
              break;
  
          case "REMOVE_DUPLICATES":
              const uniqueRows = new Set();
              selectedCells.forEach(({ row, col }) => {
                  if (!uniqueRows.has(newCellValues[row][col].value)) {
                      uniqueRows.add(newCellValues[row][col].value);
                  } else {
                      newCellValues[row][col].value = "";
                  }
              });
              break;
  
          case "FIND_AND_REPLACE":
              if (!findText || !replaceText) {
                  alert("Please provide both 'Find' and 'Replace' text.");
                  break; // Return original values if inputs are invalid
              }
              selectedCells.forEach(({ row, col }) => {
                  if (String(newCellValues[row][col].value) === findText) {
                      newCellValues[row][col].value = replaceText;
                  }
              });
              break;
  
          case "REMOVE_SPECIAL_CHARS":
              selectedCells.forEach(({ row, col }) => {
                  if (newCellValues[row][col].value) {
                      newCellValues[row][col].value = newCellValues[row][col].value.replace(/[^\w\s]/g, '');
                  }
              });
              break;
  
          case "REMOVE_NUMBERS":
              selectedCells.forEach(({ row, col }) => {
                  if (newCellValues[row][col].value) {
                      newCellValues[row][col].value = newCellValues[row][col].value.replace(/\d+/g, '');
                  }
              });
              break;
          default:
              throw new Error("Invalid operation");
      }
  
      return newCellValues;
  };

  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const handleOptionSelect1 = (option) => {
      let updatedValues;

      if (option === "FIND_AND_REPLACE") {
          const findText = prompt("Enter text to find:");
          const replaceText = prompt("Enter text to replace:");
          if (findText && replaceText) {
              updatedValues = DataFunctions(option, selectedCells, cellValues, findText, replaceText);
          } else {
              alert("Invalid input for Find and Replace.");
              return;
          }
      } else {
          updatedValues = DataFunctions(option, selectedCells, cellValues);
      }

      setCellValues(updatedValues);
      setIsDropdownOpen1(false); // Close the dropdown after applying the operation
  };

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
      show: false,
      rowIndex: null,
      colIndex: null,
      x: 0,
      y: 0,
  });

  // Handle right-click to show context menu of add/del cols/rows
  const handleContextMenu = (e, rowIndex, colIndex) => {
      e.preventDefault(); // Prevent default browser context menu
      setContextMenu({
          show: true,
          rowIndex,
          colIndex,
          x: e.clientX,
          y: e.clientY,
      });
  };

  // Close context menu
  const closeContextMenu = () => {
      setContextMenu({ show: false, rowIndex: null, colIndex: null, x: 0, y: 0 });
  };

  // Add a column to the right of the selected column
  const addColumnRight = () => {
      const newColumns = [...columns];
      newColumns.splice(contextMenu.colIndex + 1, 0, 120); // Add a new column with default width
      setColumns(newColumns);

      const newCellValues = cellValues.map(row => {
          const newRow = [...row];
          newRow.splice(contextMenu.colIndex + 1, 0, { value: '', isBold: false, isItalic: false, fontSize: 14, textColor: '#000000' });
          return newRow;
      });
      setCellValues(newCellValues);
      closeContextMenu();
  };

  // Delete the selected column
  const deleteColumn = () => {
      if (columns.length > 1) {
          const newColumns = [...columns];
          newColumns.splice(contextMenu.colIndex, 1); // Remove the selected column
          setColumns(newColumns);

          const newCellValues = cellValues.map(row => {
              const newRow = [...row];
              newRow.splice(contextMenu.colIndex, 1);
              return newRow;
          });
          setCellValues(newCellValues);
      }
      closeContextMenu();
  };

  // Add a row below the selected row
  const addRowBelow = () => {
      const newRows = [...rows];
      newRows.splice(contextMenu.rowIndex + 1, 0, 25); // Add a new row with default height
      setRows(newRows);

      const newRow = Array.from({ length: columns.length }, (_, colIndex) => ({
          value: '',
          isBold: false,
          isItalic: false,
          fontSize: 14,
          textColor: '#000000',
      }));
      const newCellValues = [...cellValues];
      newCellValues.splice(contextMenu.rowIndex + 1, 0, newRow);
      setCellValues(newCellValues);
      closeContextMenu();
  };

  // Delete the selected row
  const deleteRow = () => {
      if (rows.length > 1) {
          const newRows = [...rows];
          newRows.splice(contextMenu.rowIndex, 1); // Remove the selected row
          setRows(newRows);

          const newCellValues = [...cellValues];
          newCellValues.splice(contextMenu.rowIndex, 1);
          setCellValues(newCellValues);
      }
      closeContextMenu();
  };

  // Handle column resize
  const handleColumnResize = (index, e) => {
      const startWidth = columns[index];
      const startX = e.clientX;

      const onMouseMove = (e) => {
          const newWidth = startWidth + (e.clientX - startX);
          const newColumns = [...columns];
          newColumns[index] = Math.max(50, newWidth); // Minimum width of 50px
          setColumns(newColumns);
      };

      const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          setResizing({ column: null, row: null });
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
  };

  // Handle row resize
  const handleRowResize = (index, e) => {
      const startHeight = rows[index];
      const startY = e.clientY;

      const onMouseMove = (e) => {
          const newHeight = startHeight + (e.clientY - startY);
          const newRows = [...rows];
          newRows[index] = Math.max(30, newHeight); // Minimum height of 30px
          setRows(newRows);
      };

      const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          setResizing({ column: null, row: null });
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
  };

  // Handle cell value change
  const handleCellChange = (rowIndex, colIndex, e) => {
      const newValue = e.target.value;
      const newCellValues = [...cellValues];
      newCellValues[rowIndex][colIndex].value = newValue;
      setCellValues(newCellValues);
  };

  // Handle mouse down for cell selection
  const handleMouseDown = (rowIndex, colIndex) => {
      setIsSelecting(true);
      setStartCell({ row: rowIndex, col: colIndex });
      setSelectedCells([{ row: rowIndex, col: colIndex }]);
  };

  // Handle mouse enter for cell selection
  const handleMouseEnter = (rowIndex, colIndex) => {
      if (isSelecting) {
          const newSelectedCells = [];
          const startRow = Math.min(startCell.row, rowIndex);
          const endRow = Math.max(startCell.row, rowIndex);
          const startCol = Math.min(startCell.col, colIndex);
          const endCol = Math.max(startCell.col, colIndex);

          for (let i = startRow; i <= endRow; i++) {
              for (let j = startCol; j <= endCol; j++) {
                  newSelectedCells.push({ row: i, col: j });
              }
          }
          setSelectedCells(newSelectedCells);
      }
  };

  // Handle mouse up for cell selection
  const handleMouseUp = () => {
      setIsSelecting(false);
      setStartCell(null);
  };

  // Get formatting settings of the first selected cell (for display)
  const toggleBold = () => {
      const newCellValues = [...cellValues];
      selectedCells.forEach(({ row, col }) => {
          newCellValues[row][col].isBold = !newCellValues[row][col].isBold;
      });
      setCellValues(newCellValues);
  };

  // Toggle italic for selected cells
  const toggleItalic = () => {
      const newCellValues = [...cellValues];
      selectedCells.forEach(({ row, col }) => {
          newCellValues[row][col].isItalic = !newCellValues[row][col].isItalic;
      });
      setCellValues(newCellValues);
  };

  // Update font size for selected cells
  const updateFontSize = (size) => {
      const newCellValues = [...cellValues];
      selectedCells.forEach(({ row, col }) => {
          newCellValues[row][col].fontSize = size;
      });
      setCellValues(newCellValues);
  };

  // Update text color for selected cells
  const updateTextColor = (color) => {
      const newCellValues = [...cellValues];
      selectedCells.forEach(({ row, col }) => {
          newCellValues[row][col].textColor = color;
      });
      setCellValues(newCellValues);
  };

  // Get formatting settings of the first selected cell (for display)
  const getSelectedCellFormatting = () => {
      if (selectedCells.length > 0) {
          const { row, col } = selectedCells[0];
          return cellValues[row][col];
      }
      return null;
  };

  const selectedFormatting = getSelectedCellFormatting();

  const foumula_bar_disply = () => {
      if (selectedCells.length === 0) {
          // No cells selected
          return '';
      } else {
          // Single cell selected
          const { row, col } = selectedCells[0];
          console.log(cellValues[row][col].value,selectedCells)
          return cellValues[row][col].value; // Return the value of the selected cell
      }
  } 
      
  const cells_disply = () => {

      const getCellReference = (row, col) => {
          const columnLetter = String.fromCharCode(64 + col);
          return `${columnLetter}${row}`;
      };

      if (selectedCells.length === 0) {
          // No cells selected
          return '';
      }
      else if (selectedCells.length === 1) {
          const startRow = selectedCells[0].row;
          const startCol = selectedCells[0].col;
          const startCellRef = getCellReference(startRow, startCol);
          return startCellRef
      }
      else{
          // Multiple cells selected
          const startRow = Math.min(...selectedCells.map(cell => cell.row));
          const endRow = Math.max(...selectedCells.map(cell => cell.row));
          const startCol = Math.min(...selectedCells.map(cell => cell.col));
          const endCol = Math.max(...selectedCells.map(cell => cell.col));
          // Convert row and column indices to cell references (e.g., A1, B2)
          const startCellRef = getCellReference(startRow, startCol);
          const endCellRef = getCellReference(endRow, endCol);
  
          // Return the range (e.g., A1:C3)
          return `${startCellRef}:${endCellRef}`;
      }
  };

  const handleLoad = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const gridData = JSON.parse(e.target.result); // Parse the JSON file

            // Update the state with the loaded data
            setCellValues(gridData.cellValues || []);
            setColumns(gridData.columns || Array.from({ length: 27 }, () => 120));
            setRows(gridData.rows || Array.from({ length: 100 }, () => 25));
        } catch (error) {
            alert("Invalid file format. Please upload a valid JSON file.");
        }
    };
    reader.readAsText(file); // Read the file as text
};

const handleSave = () => {
  const gridData = {
      cellValues,
      columns,
      rows,
  };

  const data = JSON.stringify(gridData);

  const blob = new Blob([data], { type: 'application/json' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'grid_data.json'; 
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

  return (
  <div>
    {/* Title and LOGO */}
    <div className="flex h-20">
      <div className="w-[5%] px-3 pt-3 flex items-center justify-center">
         <img src="/images/logo.png"/>
      </div>
      
      <div className="w-[95%] flex flex-col">
        <div className="h-[60%] flex items-end">
          <input className="text-xl" placeholder="Untitled"></input>
        </div>
      {/* Save and Load*/}
      <div className="h-[40%] flex items-start gap-4">
        <button >File</button>
        <button>Edit</button>
        <button>View</button>
        <button>Insert</button>
        <button>Format</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer" onClick={handleSave}>Save</button>
        <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Load
        <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleLoad}/>
        </label>
      </div>
    </div>
  </div>

  {/* grid */}
  <div className="p-4" style={{ overflowX: 'auto', width: '100%' }} onClick={closeContextMenu}>
          {/* Toolbox */}
          <div className="flex h-10 bg-gray-100">
              {/* Formatting controls */}
              <div className="flex w-1/2 items-center justify-end gap-2">
                  <input type="number" className="bg-white w-10" value={selectedFormatting?.fontSize || 14} onChange={(e) => updateFontSize(Number(e.target.value))} min="10" max="36"/>
                  <button className={`w-10 ${selectedFormatting?.isBold ? "bg-blue-200" : "bg-gray-200"}`} onClick={toggleBold}>B</button>
                  <button className={`w-10 ${selectedFormatting?.isItalic ? "bg-blue-200" : "bg-gray-200"}`} onClick={toggleItalic}>I</button>
                  <input type="color" value={selectedFormatting?.textColor || '#000000'} onChange={(e) => updateTextColor(e.target.value)}/>
              </div>
              {/* Math functions */}
              <div className="flex w-1/2 items-center justify-center">
                  <div className="relative">
                      <button className="flex w-10" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                          <img className="p-1" src="/images/functions.png" alt="Functions" />
                          <p className='flex items-center'>{MathAns}</p>
                      </button>
                      {isDropdownOpen && (
                          <div className="absolute bg-white border border-gray-300 shadow-md mt-1 z-50">
                              <ul className="space-y-1">
                                  {["SUM", "AVG", "COUNT", "MAX", "MIN","MEAN", "MEDIAN", "MODE", "PRODUCT", "VARIANCE", "STDDEV"].map((option) => (
                                      <li key={option} className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => handleOptionSelect(option)}>
                                          {option}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                  </div>
              </div>

              {/*data quality functions */}
              <div className="flex w-1/2 items-center justify-center">
                  <div className="relative">
                      <button className="flex w-10" onClick={() => setIsDropdownOpen1(!isDropdownOpen1)}>
                          <p>DataQ functions </p>
                      </button>
                      {isDropdownOpen1 && (
                          <div className="absolute bg-white border border-gray-300 shadow-md mt-1 z-50">
                              <ul className="space-y-1">
                                  {["TRIM", "UPPER", "LOWER", "REMOVE_DUPLICATES","FIND_AND_REPLACE","REMOVE_SPECIAL_CHARS","REMOVE_NUMBERS"].map((option) => (
                                      <li key={option} className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => handleOptionSelect1(option)}>
                                          {option}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                  </div>
              </div>

          </div>

          {/* Formulae bar */}
          <div className="flex h-8 border-2 border-black-500">
              <div className="flex justify-center w-[7%] border-r-2 border-black-500">
                  <p>{cells_disply()}</p>
              </div>
              <div className="flex pl-2 w-[3%]">
                  <p>FX:</p>
              </div>
              <div className="flex w-[90%]">
                  <p className="flex w-[100%]">{foumula_bar_disply()}</p>
              </div>
          </div>

          {/* Grid */}
          <div style={{ height: '100vh', overflow: 'hidden' }}>
              <div style={{ height: '100%', overflowY: 'auto' }}>
                  <div className="flex flex-col" style={{ minWidth: `${columns.reduce((acc, width) => acc + width, 0)}px` }}>
                      {rows.map((rowHeight, rowIndex) => (
                          <div key={rowIndex} className="flex" style={{ height: `${rowHeight}px` }}>
                              {columns.map((colWidth, colIndex) => (
                                  <div
                                      key={colIndex}
                                      className="border border-gray-300 relative"
                                      style={{ width: `${colWidth}px`, minWidth: `${colWidth}px` }}
                                      onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                                  >
                                      {(rowIndex === 0 || colIndex === 0) ? (
                                          <>
                                              <p className="w-full h-full p-1">{cellValues[rowIndex][colIndex].value}</p>
                                              <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-gray-500"
                                                  onMouseDown={(e) => {
                                                      e.preventDefault();
                                                      setResizing({ column: colIndex, row: null });
                                                      handleColumnResize(colIndex, e);
                                                  }} />
                                              <div className="absolute bottom-0 left-0 right-0 h-1 cursor-row-resize hover:bg-gray-500"
                                                  onMouseDown={(e) => {
                                                      e.preventDefault();
                                                      setResizing({ column: null, row: rowIndex });
                                                      handleRowResize(rowIndex, e);
                                                  }} />
                                          </>
                                      ) : (
                                          <>
                                              <input
                                                  type="text"
                                                  className="w-full h-full p-1"
                                                  value={cellValues[rowIndex][colIndex].value}
                                                  onChange={(e) => handleCellChange(rowIndex, colIndex, e)}
                                                  style={{
                                                      backgroundColor: selectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex) ? '#b3d9ff' : 'white',
                                                      fontWeight: cellValues[rowIndex][colIndex].isBold ? 'bold' : 'normal',
                                                      fontStyle: cellValues[rowIndex][colIndex].isItalic ? 'italic' : 'normal',
                                                      color: cellValues[rowIndex][colIndex].textColor,
                                                      fontSize: `${cellValues[rowIndex][colIndex].fontSize}px`,
                                                  }}
                                                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                                  onMouseUp={handleMouseUp}
                                              />
                                              <div className="absolute right-0 top-0 bottom-0 w-1" />
                                              <div className="absolute bottom-0 left-0 right-0 h-1" />
                                          </>
                                      )}
                                  </div>
                              ))}
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Context Menu */}
          {contextMenu.show && (
              <div className="absolute bg-white border border-gray-300 shadow-lg rounded p-2" style={{ top: contextMenu.y, left: contextMenu.x }}>
                  <div className="cursor-pointer hover:bg-gray-100 p-1" onClick={addColumnRight}>Add Column Right</div>
                  <div className="cursor-pointer hover:bg-gray-100 p-1" onClick={deleteColumn}>Delete Column</div>
                  <div className="cursor-pointer hover:bg-gray-100 p-1" onClick={addRowBelow}>Add Row Below</div>
                  <div className="cursor-pointer hover:bg-gray-100 p-1" onClick={deleteRow}>Delete Row</div>
              </div>
          )}
      </div>
</div> 
);
}
