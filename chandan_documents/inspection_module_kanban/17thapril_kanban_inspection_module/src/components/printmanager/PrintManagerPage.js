import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from "jspdf";
import { VscPreview } from "react-icons/vsc";
import QRCode from "qrcode";
import { toast } from 'react-toastify';
import { BsFillPrinterFill } from "react-icons/bs";

import './PrintManagerPage.css'
import SpinnerLoader from '../../pages/loaderspinner/SpinnerLoader';
import MultiSelectPrintDetailsPage from './MultiSelectPrintDetailsPage';
const PrintManagerPage = () => {
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);

  const [allChecked, setAllChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  // const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);

  const fetchSerialNumbers = async () => {
    if (!selectedPart) {
      setSerialNumbers([]);
      return;
    }

    // Retrieve the user data from localStorage
    const currentUser = JSON.parse(localStorage.getItem('userData'));

    // Check if currentUser is available and has the role_name
    console.log("current user available here", currentUser);


    if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
      const roleName = currentUser.roles[0].Role_Name;  // Accessing the role name from the first element
      console.log("Role name is here:", roleName);
  } else {
      console.log("No roles found for the user.");
  }
  

    setLoading(true);
    try {
      // Get the role_name from currentUser
      const roleName = currentUser.roles[0].Role_Name; // Correct property name here
      console.log("role name is here", roleName);

      // Construct the fetch URL with role_name as a query parameter
      const response = await fetch(
        `http://127.0.0.1:5000/get_part_serialno/${selectedPart.PART_ID}?roleName=${encodeURIComponent(roleName)}`
      );

      // Ensure the response is valid
      if (!response.ok) {
        throw new Error('Failed to fetch serial numbers');
      }

      const data = await response.json();
      console.log("get part serial number", data);

      if (Array.isArray(data) && data.length === 0) {
        // Set state to empty array if no serial numbers found
        setSerialNumbers([]);
      } else {
        setSerialNumbers(data);
      }
    } catch (error) {
      console.error('Error fetching serial numbers:', error);
      toast.error(`"Serial numbers are not available for this part or have already been printed. Please contact the admin for reprint."`);
      setSerialNumbers([]);
    } finally {
      setLoading(false); // Ensure loading is set to false after the fetch completes
    }
  };


  useEffect(() => {

    fetchSerialNumbers();
  }, [selectedPart]);


  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/parts_active_list");
        const data = await response.json();

        if (Array.isArray(data)) {
          setParts(data); // Set data only if it's an array
        } else {
          setParts([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching parts:", error);
        setParts([]); // Ensure parts is an empty array if there's an error
      }
    };

    fetchParts();
  }, []);


  const handlePartSelect = (selectedOption) => {
    if (selectedOption) {
      const selected = parts.find((part) => part.PARTNO === selectedOption.value);
      setSelectedPart(selected);
    } else {
      setSelectedPart(null);
    }
  };

  const partOptions = parts.map((part) => ({
    value: part.PARTNO,
    label: `${part.PARTNO}`,
  }));

  const company_name = "Wipro Kawasaki Precision Machinery Pvt Ltd";

  const handlePrintPDF = async () => {
    if (!selectedPart || !selectedPart.PART_ID) {
      toast.error('Please select a part before printing.');
      return;
    }

    const partId = selectedPart.PART_ID;

    console.log("part id ", partId);

    if (!Array.isArray(checkedItems)) {
      console.error("checkedItems is not an array:", checkedItems);
      return;
    }

    const selectedItems = checkedItems.map((index) => serialNumbers[index]);

    // To log all serial numbers
    selectedItems.forEach(item => {
      console.log(item.serialNo); // This will log each serialNo from the selectedItems array
    });

    const serialNumbersArray = selectedItems
      .map(item => item.serialNo) // Extract serialNo values
      .filter(serialNo => typeof serialNo === 'string') // Ensure valid strings
      .sort((a, b) => a.localeCompare(b)); // Sort alphabetically (handles strings)

    console.log("Serial numbers (ascending order):", serialNumbersArray);
    console.log("Selected items:", selectedItems);

    try {
      setLoading(true); // Set loading state
      const currentUser = JSON.parse(localStorage.getItem('userData'));

      console.log("current user", currentUser);

      // if (!currentUser || !currentUser.role_name) {
      //   throw new Error('Role name is not available for the current user');
      // }

      if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
        const roleName = currentUser.roles[0].Role_Name;  // Accessing the role name from the first element
        console.log("Role name is here:", roleName);
    } else {
        console.log("No roles found for the user.");
    }
    

      // Get the role_name from currentUser
      const roleName = currentUser.roles[0].Role_Name; // Correct property name here
      console.log("role name is here", roleName);


      const statusResponse = await fetch(`http://localhost:5000/update_print_flg/${partId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serial_no: serialNumbersArray, // Send selected serial numbers
        }),
      });

      if (!statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log("statusdata", statusData);
        toast.error(statusData.message || 'Failed to check print status.');
        setLoading(false);
        return;
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margins = 3;
      const contentWidth = pageWidth - margins * 2;
      const contentHeight = pageHeight - margins * 2;

      const itemsPerRow = 2;
      const columnWidth = contentWidth / itemsPerRow;
      const rowHeight = contentHeight / 5;
      const xOffsetStart = margins;
      const yOffsetStart = margins;

      let xOffset = xOffsetStart;
      let yOffset = yOffsetStart;

      for (const [index, item] of selectedItems.entries()) {
        if (yOffset + rowHeight > pageHeight) {
          pdf.addPage();
          xOffset = xOffsetStart;
          yOffset = yOffsetStart;
        }

        const topPadding = 3;
        const lineSpacing = 3.5;

        pdf.setFontSize(8);

        const labelXOffset = xOffset + 2;
        const valueXOffset = xOffset + 27;

        const lineHeight = 4;
        let currentY = yOffset + topPadding + lineHeight;

        // Add each label and value
        pdf.setFont("helvetica", "bold");
        pdf.text("Passing Certificate:", labelXOffset, currentY);

        pdf.setFont("helvetica", "normal");
        currentY += lineHeight;
        pdf.text("Serial Number:", labelXOffset, currentY);
        pdf.text(item.serialNo || "", valueXOffset, currentY);

        currentY += lineHeight;
        pdf.text("Model:", labelXOffset, currentY);
        pdf.text(item.model || "", valueXOffset, currentY);

        currentY += lineHeight;
        pdf.text("Part Number:", labelXOffset, currentY);
        pdf.text(item.partNumber || "", valueXOffset, currentY);

        currentY += lineHeight;
        pdf.text("USE FOR NAME:", labelXOffset, currentY);
        pdf.text(item.usedname || "", valueXOffset, currentY);

        const inputBoxWidth = 29;
        const inputBoxHeight = 6.5;

        pdf.text('Assemble:', xOffset + columnWidth - 35, yOffset + topPadding + 4);
        pdf.rect(xOffset + columnWidth - 35, yOffset + topPadding + 6, inputBoxWidth, inputBoxHeight);

        pdf.text('Inspect:', xOffset + columnWidth - 33, yOffset + topPadding + 17);
        pdf.rect(xOffset + columnWidth - 35, yOffset + topPadding + 18, inputBoxWidth, inputBoxHeight);

        try {
          const qrSize = 17;
          const qrYPosition = yOffset + rowHeight - 30;

          const partQR = await QRCode.toDataURL(`${item.partNumber}`, { width: qrSize });
          const serialQR = await QRCode.toDataURL(`${item.serialNo}`, { width: qrSize });

          const serialQrXPosition = xOffset + columnWidth - qrSize - 22;
          const serialTextXPosition = serialQrXPosition + qrSize / 2 - (pdf.getTextWidth(`${item.serialNo}`) / 2);

          const partQrXPosition = xOffset + 4;
          const partTextXPosition = partQrXPosition + qrSize / 2 - (pdf.getTextWidth(`${item.partNumber}`) / 2);

          pdf.addImage(serialQR, 'PNG', serialQrXPosition, qrYPosition, qrSize, qrSize);
          pdf.text(`${item.serialNo}`, serialTextXPosition, qrYPosition + qrSize + 2);

          pdf.addImage(partQR, 'PNG', partQrXPosition, qrYPosition, qrSize, qrSize);
          pdf.text(`${item.partNumber}`, partTextXPosition, qrYPosition + qrSize + 2);
        } catch (err) {
          console.error("Error generating QR code:", err);
        }

        const companyYPosition = yOffset + rowHeight - 6;
        pdf.text(`${company_name}`, xOffset + 2, companyYPosition);

        xOffset += columnWidth;

        if ((index + 1) % itemsPerRow === 0) {
          xOffset = xOffsetStart;
          yOffset += rowHeight;
        }
      }

      pdf.save(`part_${partId}_print.pdf`);
      toast.success('PDF generated successfully and print flag updated.');
      setCheckedItems('');
      fetchSerialNumbers();

    } catch (error) {
      console.error('Error checking print status or printing PDF:', error);
      toast.error('Error checking print status or printing PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAll = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);

    if (newCheckedState) {
      setCheckedItems(serialNumbers.map((_, index) => index)); // Select all indices
    } else {
      setCheckedItems([]); // Deselect all
    }
  };


  const handleCheckboxChange = (index) => {
    // Update checked items state
    let newCheckedItems;
    if (checkedItems.includes(index)) {
      newCheckedItems = checkedItems.filter((item) => item !== index); // Remove from checked
    } else {
      newCheckedItems = [...checkedItems, index]; // Add to checked
    }

    setCheckedItems(newCheckedItems);

    // Update "Check All" state based on the newCheckedItems array length
    if (newCheckedItems.length === serialNumbers.length) {
      setAllChecked(true);  // All are selected
    } else {
      setAllChecked(false); // Not all are selected
    }

    // Log selected items immediately after state update
    if (newCheckedItems.length === serialNumbers.length) {
      // If all are selected
      console.log("All items are selected:", serialNumbers);
    } else {
      // If some items are selected
      const selectedItems = newCheckedItems.map((index) => serialNumbers[index]);
      console.log("Randomly selected items:", selectedItems);
    }
  };

  return (
    <div className="container" style={{ marginTop: '130px' }}>
      <h3 className="pagesHeading"><i className="bi bi-printer-fill"></i> Kanban Issue ({serialNumbers.length})</h3>

      {/* Search and Print Button Section */}
      <div className="row">
        <div className="col-lg-5">
          <Select
            id="part-select"
            options={partOptions}
            onChange={handlePartSelect}
            value={selectedPart ? { value: selectedPart.PARTNO, label: `${selectedPart.PARTNO}` } : null}
            placeholder=" &#128270; Search by part Number or Model......."
            isClearable
            noOptionsMessage={() => 'No parts found'}
          />
        </div>
        <div className="col-lg-3 mb-4 d-flex justify-content-center align-items-center">
          {/* Check All Section */}
          <input
            type="checkbox"
            id="checkAll"
            className="form-check-input me-2"
            onChange={handleCheckAll}
            checked={allChecked}
            style={{ height: '30px', width: '30px' }}
          />
          <label htmlFor="checkAll" className="form-check-label">
            Check All<span className='text-primary'> ( 
             {allChecked
              ? `${serialNumbers.length} items`
              : `${checkedItems.length} items`}
            )</span>
          </label>
      
        </div>

        <div className='col-lg-2'>
          {/* <button className='btn btn-primary m-2' onClick={handlePreview}><VscPreview color='white' size={20} className='mb-1' /> Preview</button> */}

        </div>

        <div className="col-lg-2 text-end">
          <button className="btn btn-primary" onClick={handlePrintPDF}>
            <BsFillPrinterFill size={20} color='white' className='mb-1' /> Print Pdf
          </button>
        </div>
      </div>


      <div className="row my-3">
        {loading ? (
          // Show spinner while loading
          <div className="d-flex justify-content-center w-100">
            <SpinnerLoader animation="border" role="status" />
          </div>
        ) : (
          // Show serial numbers once loading is complete
          serialNumbers.map((item, index) => (
            <div
              key={index}
              className="col-lg-4 mb-4"
              onClick={() => handleCheckboxChange(index)}
              style={{ cursor: 'pointer' }} // Make the div look clickable
            >
              <div className="border rounded p-3 shadow-sm position-relative">
                <h5 className="my-2 fst-italic text-primary">Passing Certificate</h5>

                {/* Checkbox in the top-right corner */}
                <div
                  className="checkbox-container position-absolute top-0 end-0 p-2"
                  onClick={(e) => e.stopPropagation()} // Prevent div click from toggling the checkbox
                >
                  <input
                    key={index}
                    type="checkbox"
                    id={`checkbox-${index}`}
                    className="form-check-input"
                    onChange={() => handleCheckboxChange(index)}
                    checked={checkedItems.includes(index)}
                  />
                </div>

                {/* Details Section: Left Side */}
                <div className="d-flex flex-column flex-md-row justify-content-between">
                  <div className="d-flex flex-column mb-3" style={{ fontSize: '14px', flex: 1 }}>
                    <p><strong>S/No:</strong> {item.serialNo}</p>
                    <p><strong>Model Code:</strong> {item.model}</p>
                    <p><strong>Part No:</strong> {item.partNumber}</p>
                    <p><strong>USE FOR NAME:</strong> {item.usedname}</p>
                  </div>

                  {/* Input Boxes Section: Right Side */}
                  <div className="d-flex flex-column align-items-end" style={{ flex: 1 }}>
                    <div className="mb-3" style={{ width: '70%' }}>
                      <label htmlFor={`assemble-${index}`} className="d-block">Assemble</label>
                      <div className="border p-2" style={{ height: '40px', borderRadius: '5px' }}></div>
                    </div>
                    <div className="mb-3" style={{ width: '70%' }}>
                      <label htmlFor={`inspect-${index}`} className="d-block">Inspect</label>
                      <div className="border p-2" style={{ height: '40px', borderRadius: '5px' }}></div>
                    </div>
                  </div>
                </div>

                {/* QR Codes */}
                <div className="d-flex justify-content-between mt-0">
                  <div className="my-1 text-center">
                    <QRCodeCanvas value={`Part Number: ${item.partNumber}`} size={100} />
                    <p>PART No: {item.partNumber}</p>
                  </div>
                  <div className="my-1 text-center">
                    <QRCodeCanvas value={`Serial Number: ${item.serialNo}`} size={100} />
                    <p>S/N: {item.serialNo}</p>
                  </div>
                </div>

                {/* Company Name */}
                <p className="my-0" style={{ fontSize: '14px', textAlign: 'center' }}>{company_name}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <MultiSelectPrintDetailsPage/>
    </div>
  );
};

export default PrintManagerPage;
