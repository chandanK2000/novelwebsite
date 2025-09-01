import React from 'react';
import * as XLSX from 'xlsx';
import { MdDownloadForOffline } from "react-icons/md";

const ExcelButton = () => {
  const handleDownload = () => {
    // Define column headers (example headers for a task template)
    
    const headers = [
        {
          PARTNO: '',
          MODEL: '',
          BORDKIND: '',
          MARKMODEL1: '',
          MARKMODEL2: '',
          USEFOR: '',
          ENGRAVINGNO:'',
          CHGMARK: '',
          SIZEFIG: '',
          SECTIONFIG: '',
          REMARK: '',
          OPERATEPOINT: '',
          DESTINATION: '',
          USERPARTNO: '',
          USEDNAME: '',
          SORT1: '',
          SORT2: '',
          LEADTIME: '',
          COSTPRICE: '',
          RESERVE01: '',
          RESERVE02: '',
          RESERVE03: '',
          RESERVE04: '',
          RESERVE05: '',
          RESERVE06: '',
          RESERVE07: '',
          RESERVE08: '',
          RESERVE09: '',
          RESERVE10: '',
          PICKING01: '',
          PICKING02: '',
          PICKING03: '',
          PICKING04: '',
          PICKING05: '',
          PICKING06: '',
          PICKING07: '',
          PICKING08: '',
          PICKING09: '',
          PICKING10: '',
          PC: '',
          COLOR: '',
          IS_ENABLE: '',
          CREATED_BY: '',
          MODIFIED_BY: '',
          ACTIVE: ''
        }
      ];
      

    // Create a worksheet from the headers data (empty rows)
    const ws = XLSX.utils.json_to_sheet(headers);

    // Create a new workbook and append the empty worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate file name
    const fileName = 'empty_template.xlsx';

    // Write the file and trigger the download
    XLSX.writeFile(wb, fileName);
  };

  return (
    <button onClick={handleDownload} className='btn btn-primary'><MdDownloadForOffline className='mb-1' color='orange' size={20}/> Download Empty Excel Template</button>
  );
};

export default ExcelButton;
