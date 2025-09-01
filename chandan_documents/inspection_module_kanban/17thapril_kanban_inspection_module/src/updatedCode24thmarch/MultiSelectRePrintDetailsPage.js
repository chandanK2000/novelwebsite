import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { QRCodeCanvas } from 'qrcode.react';
import SpinnerLoader from '../../pages/loaderspinner/SpinnerLoader';
import { toast } from 'react-toastify';
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { BsFillPrinterFill } from "react-icons/bs";
import './MultiSelectPrintDetailsPage.css';
import { data } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const MultiSelectRePrintDetailsPage = () => {

    const [serialNumbersByPart, setSerialNumbersByPart] = useState({});
    const [loading, setLoading] = useState(false);
    const [parts, setParts] = useState([]);
    const [selectedParts, setSelectedParts] = useState([]);
    const [serialNumberLength, setSerialNumberLength] = useState(0);
    const [checkedItems, setCheckedItems] = useState({});
    const [checkAll, setCheckAll] = useState(false);
    const [checkedSerialNumber, setCheckedSerialNumber] = useState();
    const [isVisibleCheckbox, setIsVisibleCheckbox] = useState(false);
    const [showMessage, setShowMessage] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [startDate, setStartDate] = useState(null); // Start Date state
    const [endDate, setEndDate] = useState(null); // End Date state
    const [isSerialNumbersFetched, setIsSerialNumbersFetched] = useState(false);

    const fetchedPartsRef = useRef(new Set());

    // console.log("checked serial number printing here chandan", checkedSerialNumber);

    const fetchSerialNumbers = async (part) => {
        if (!part || fetchedPartsRef.current.has(part.PARTNO)) return;

        const currentUser = JSON.parse(localStorage.getItem("userData"));
        setLoading(true);
        fetchedPartsRef.current.add(part.PARTNO);

        try {
            const roleName = currentUser?.roles?.[0]?.Role_Name || "defaultRole";
            const response = await fetch(
                `http://127.0.0.1:5000/get_part_serialno_for_reprint/${part.PART_ID}?roleName=${encodeURIComponent(roleName)}`
            );

            if (!response.ok) throw new Error("Failed to fetch serial numbers");

            const data = await response.json();
            console.log("Reprint data details", data);

            if (Array.isArray(data) && data.length > 0) {
                setSerialNumbersByPart((prevState) => ({
                    ...prevState,
                    [part.PARTNO]: data,
                }));
                toast.success(`Serial numbers fetched successfully for part ${part.PARTNO}`);
                setIsVisibleCheckbox(true)
                setShowMessage(false);
                setIsSerialNumbersFetched(true);

                
                

            } else {
                toast.error("No serial numbers found or already printed. Contact admin for a reprint.");
            }
        } catch (error) {
            console.error("Error fetching serial numbers:", error);
            toast.error("No serial numbers found or already printed. Contact admin for a reprint.");
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/parts_active_list');
                const data = await response.json();
                setParts(data || []);
            } catch (error) {
                console.error('Error fetching parts:', error);
                setParts(Array.isArray(data) ? data : []);

                // setParts([]);
            }
        };

        fetchParts();
    }, []);

    // const filteredSerialNumbers = Object.entries(serialNumbersByPart).reduce(
    //     (acc, [partNo, serials]) => {
    //         const filteredSerials = serials.filter(item => {
    //             const serialNo = item?.serialNo || "";  // Use correct key
    //             const model = item?.model || "";        // Use correct key
    //             const partNumber = item?.partNumber || ""; // Use correct key
    //             const usedName = item?.usedname || "";  // Include usedName for filtering

    //             return (
    //                 serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //                 partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //                 model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //                 usedName.toLowerCase().includes(searchQuery.toLowerCase()) // Added usedName filter
    //             );
    //         });

    //         if (filteredSerials.length > 0) {
    //             acc[partNo] = filteredSerials;
    //         }
    //         return acc;
    //     }, {}
    // );



    const filteredSerialNumbers = Object.entries(serialNumbersByPart).reduce(
        (acc, [partNo, serials]) => {
            const filteredSerials = serials.filter(item => {
                const serialNo = item?.serialNo || "";
                const model = item?.model || "";
                const partNumber = item?.partNumber || "";
                const usedName = item?.usedname || "";
                const itemDate = item?.Planing_date ? new Date(item.Planing_date) : null; // Convert to Date

                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null; // ✅ Fix applied

                const matchesSearchQuery =
                    serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    usedName.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesDateRange =
                    (!start || (itemDate && itemDate >= start)) &&
                    (!end || (itemDate && itemDate <= end));

                return matchesSearchQuery && matchesDateRange; // Apply both filters
            });

            if (filteredSerials.length > 0) {
                acc[partNo] = filteredSerials;
            }
            return acc;
        }, {}
    );


    const handlePartSelect = (selectedOptions) => {
        if (!Array.isArray(parts)) {
            console.error("Error: 'parts' is not an array!", parts);
            return;
        }

        const newSelectedParts = selectedOptions.map((option) =>
            parts.find((part) => part.PARTNO === option.value)
        );

        setSelectedParts(newSelectedParts);

        // If no parts are selected, hide the search input
        if (newSelectedParts.length === 0) {
            setIsSerialNumbersFetched(false); // Hide search input
            setSearchQuery(''); // Clear search query
        } else {
            // Set isSerialNumbersFetched to true when parts are selected
            setIsSerialNumbersFetched(true);

            // Fetch serial numbers for newly selected parts
            newSelectedParts.forEach((part) => {
                if (part) fetchSerialNumbers(part);
            });
        }

        setCheckedItems({});
        setCheckAll(false);
    };

    // const partOptions = Array.isArray(parts)
    //     ? parts.map((part) => ({
    //         value: part.PARTNO,
    //         label: `${part.PARTNO}`,
    //     }))
    //     : [];

    const partOptions = Array.isArray(parts)
        ? parts.map((part) => ({
            value: part.PARTNO,  // Store PARTNO as value
            label: `${part.PARTNO}`,  // Display both
            model: part.MODEL.toLowerCase()  // ✅ Store lowercase MODEL for filtering
        }))
        : [];



    useEffect(() => {
        const totalSerialNumbers = selectedParts.reduce((count, part) => {
            const partSerialNumbers = serialNumbersByPart[part.PARTNO] || [];
            return count + partSerialNumbers.length;
        }, 0);

        setSerialNumberLength(totalSerialNumbers);
    }, [selectedParts, serialNumbersByPart]);

    const company_name = 'Wipro Kawasaki Precision Machinery Pvt Ltd';

    const handleCheckboxChange = (partNumber, serialNo, checked) => {
        setCheckedItems((prevState) => {
            const newCheckedItems = {
                ...prevState,
                [`${partNumber}-${serialNo}`]: checked,
            };

            logCheckedItems(newCheckedItems);

            return newCheckedItems;
        });
    };

    // const handleCheckAll = () => {

    //     const newCheckedItems = {};
    //     const isChecked = !checkAll;

    //     selectedParts.forEach((part) => {
    //         serialNumbersByPart[part.PARTNO]?.forEach((item) => {
    //             newCheckedItems[`${part.PARTNO}-${item.serialNo}`] = isChecked;
    //         });
    //     });

    //     setCheckedItems(newCheckedItems);
    //     setCheckAll(isChecked);

    //     logCheckedItems(newCheckedItems);
    // };


    const handleCheckAll = () => {
        const newCheckedItems = {};
        const isChecked = !checkAll;

        selectedParts.forEach((part) => {
            const filteredSerialNumbers = serialNumbersByPart[part.PARTNO]?.filter((item) => {
                const itemDate = new Date(item.Planing_date);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                return (
                    (!start || itemDate >= start) &&
                    (!end || itemDate <= new Date(end.setHours(23, 59, 59, 999))) // Ensure end date is inclusive
                );
            });

            filteredSerialNumbers?.forEach((item) => {
                newCheckedItems[`${part.PARTNO}-${item.serialNo}`] = isChecked;
            });
        });

        setCheckedItems(newCheckedItems);
        setCheckAll(isChecked);
        logCheckedItems(newCheckedItems);
    };


    const logCheckedItems = (checkedItems) => {
        const groupedCheckedItems = {};
        const serialNumbersArray = []; // Array to store all serial numbers

        selectedParts.forEach((part) => {
            const partNo = part.PARTNO;
            const serialNumbers = serialNumbersByPart[partNo] || [];

            const checkedSerialNumbers = serialNumbers
                .filter((item) => checkedItems[`${partNo}-${item.serialNo}`])
                .map((item) => {
                    serialNumbersArray.push(item.serialNo); // Add serialNo to the array
                    return {
                        partNo: partNo,
                        serialNo: item.serialNo,
                        model: item.model,
                        usedname: item.usedname,
                    };
                });

            if (checkedSerialNumbers.length > 0) {
                groupedCheckedItems[partNo] = checkedSerialNumbers;
            }
        });

        console.log('Checked Items (Grouped by Part Number):', groupedCheckedItems);
        console.log('Checked Serial Numbers (Array):', serialNumbersArray); // Log only serial numbers
        setCheckedSerialNumber(serialNumbersArray)
    };


    const handlePrintPDF = async () => {

        if (!selectedParts || !checkedSerialNumber) {
            toast("Please Select at Least One parts Number And Checked Items")
        }
        if (!Array.isArray(checkedSerialNumber)) {
            console.error("checkedItems is not an array:", checkedItems);
            return;
        }

        try {
            setLoading(true); // Set loading state
            const currentUser = JSON.parse(localStorage.getItem('userData'));

            if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
                const roleName = currentUser.roles[0].Role_Name;
                console.log("Role name is here:", roleName);
            } else {
                console.log("No roles found for the user.");
            }

            // Loop through selected parts and generate PDFs
            for (const part of selectedParts) {
                const partId = part.PART_ID; // Get the partId for the current part
                const partNo = part.PARTNO; // Get the part number for the current part

                // Filter checked serial numbers for the current part
                const partSerialNumbers = serialNumbersByPart[partNo] || [];
                const checkedSerialNumbersForPart = partSerialNumbers
                    .filter((item) => checkedItems[`${partNo}-${item.serialNo}`])
                    .map((item) => item.serialNo);

                if (checkedSerialNumbersForPart.length === 0) {
                    console.log(`No checked serial numbers for part ${partNo}. Skipping PDF generation.`);
                    continue; // Skip if no serial numbers are checked for this part
                }

                // Update print flag for the current part
                const statusResponse = await fetch(`http://127.0.0.1:5000/update_print_flg/${partId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        serial_no: checkedSerialNumbersForPart, // Send selected serial numbers for the current part
                    }),
                });

                if (!statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    console.log("statusdata", statusData);
                    toast.error(statusData.message || `Failed to check print status for part ${partNo}.`);
                    continue; // Skip to the next part if there's an error
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

                for (const [index, serialNo] of checkedSerialNumbersForPart.entries()) {
                    if (yOffset + rowHeight > pageHeight) {
                        pdf.addPage();
                        xOffset = xOffsetStart;
                        yOffset = yOffsetStart;
                    }

                    const topPadding = 3;
                    const lineSpacing = 3.5;
                    const lineHeight = 4;
                    let currentY = yOffset + topPadding + lineHeight;

                    // Increase font size for "Passing Certificate:"
                    pdf.setFontSize(11);
                    pdf.setFont("helvetica", "bold");
                    pdf.text("Passing Certificate:", xOffset + 2, currentY);

                    // Reset font size for labels
                    pdf.setFontSize(8);

                    const labelXOffset = xOffset + 2;
                    const valueXOffset = xOffset + 25;

                    const labels = ["Serial Number:", "Model:", "Part Number:", "USE FOR NAME:"];
                    const values = [
                        serialNo || "",
                        partSerialNumbers.find((item) => item.serialNo === serialNo)?.model || "",
                        partNo || "",
                        partSerialNumbers.find((item) => item.serialNo === serialNo)?.usedname || "",
                    ];

                    for (let i = 0; i < labels.length; i++) {
                        currentY += lineHeight;
                        pdf.setFont("helvetica", "bold"); // Make labels bold
                        pdf.text(labels[i], labelXOffset, currentY);

                        pdf.setFont("helvetica", "normal"); // Keep values normal
                        pdf.text(values[i], valueXOffset, currentY);
                    }

                    // Draw input boxes for "Assemble" and "Inspect"
                    const inputBoxWidth = 29;
                    const inputBoxHeight = 6.5;

                    pdf.text('Assemble:', xOffset + columnWidth - 35, yOffset + topPadding + 4);
                    pdf.rect(xOffset + columnWidth - 35, yOffset + topPadding + 6, inputBoxWidth, inputBoxHeight);

                    pdf.text('Inspect:', xOffset + columnWidth - 35, yOffset + topPadding + 16);
                    pdf.rect(xOffset + columnWidth - 35, yOffset + topPadding + 18, inputBoxWidth, inputBoxHeight);

                    try {
                        const qrSize = 17;
                        const qrYPosition = yOffset + rowHeight - 30;

                        const partQR = await QRCode.toDataURL(`${partNo}`, { width: qrSize });
                        const serialQR = await QRCode.toDataURL(`${serialNo}`, { width: qrSize });

                        const partQrXPosition = xOffset + 4;
                        const partTextXPosition = partQrXPosition + qrSize / 2 - (pdf.getTextWidth(`${partNo}`) / 2);

                        // 🔹 Shift the serial number QR code further right
                        const serialQrXPosition = xOffset + columnWidth - qrSize - 14; // Moved right
                        const serialTextXPosition = serialQrXPosition + qrSize / 2 - (pdf.getTextWidth(`${serialNo}`) / 2);

                        pdf.addImage(serialQR, 'PNG', serialQrXPosition, qrYPosition, qrSize, qrSize);
                        pdf.text(`S/N : ${serialNo}`, serialTextXPosition, qrYPosition + qrSize + 2);

                        pdf.addImage(partQR, 'PNG', partQrXPosition, qrYPosition, qrSize, qrSize);
                        pdf.text(`Part No : ${partNo}`, partTextXPosition, qrYPosition + qrSize + 2);
                    } catch (err) {
                        console.error("Error generating QR code:", err);
                    }


                    // Center the company name in each block
                    const companyFontSize = 10;
                    pdf.setFontSize(companyFontSize);
                    pdf.setFont("helvetica", "normal");

                    const companyYPosition = yOffset + rowHeight - 4;
                    const textWidth = pdf.getTextWidth(company_name);
                    const centeredX = xOffset + (columnWidth - textWidth) / 2;

                    pdf.text(`${company_name}`, centeredX, companyYPosition);

                    xOffset += columnWidth;


                    if ((index + 1) % itemsPerRow === 0) {
                        xOffset = xOffsetStart;
                        yOffset += rowHeight;
                    }
                }

                // Save the PDF for the current part
                const currentDate = new Date().toLocaleString().replace(/[/:,]/g, '-');
                pdf.save(`${currentDate}_part_${partNo}_print.pdf`);

                // pdf.save(`part_${partNo}_print.pdf`);
                toast.success(`PDF generated successfully for part ${partNo}.`);

            }

            //    await fetchSerialNumbers();
            //    setCheckedItems({});
            //    window.location.reload();

            // await fetchSerialNumbers(); // Fetch serial numbers

            // setCheckedItems((prevCheckedItems) => {
            //     const updatedCheckedItems = { ...prevCheckedItems };

            //     for (const part of selectedParts) {
            //         const partNo = part.PARTNO;
            //         serialNumbersByPart[partNo] = serialNumbersByPart[partNo]?.filter((item) => {
            //             const key = `${partNo}-${item.serialNo}`;
            //             return !prevCheckedItems[key]; // ✅ Remove already selected serial numbers
            //         });
            //     }

            //     return updatedCheckedItems; // Keep only unchecked items
            // });


            // setCheckedItems({});

            await fetchSerialNumbers(); // Fetch serial numbers

            setCheckedItems((prevCheckedItems) => {
                const updatedCheckedItems = { ...prevCheckedItems };
            
                for (const part of selectedParts) {
                    const partNo = part.PARTNO;
                    serialNumbersByPart[partNo] = serialNumbersByPart[partNo]?.filter((item) => {
                        const key = `${partNo}-${item.serialNo}`;
                        return !prevCheckedItems[key]; // ✅ Remove already selected serial numbers
                    });
                }
            
                return updatedCheckedItems; // Keep only unchecked items
            });
            setCheckedItems({});
            
            // ✅ Ensure serialNumberLength updates correctly
            setSerialNumberLength((prevLength) => {
                const totalSerialNumbers = selectedParts.reduce((count, part) => {
                    const partSerialNumbers = serialNumbersByPart[part.PARTNO] || [];
                    return count + partSerialNumbers.length;
                }, 0);
            
                return totalSerialNumbers; // Return the updated count
            });
            
            

            


        } catch (error) {
            console.error('Error checking print status or printing PDF:', error);
            toast.error('Error checking print status or printing PDF.');
        } finally {
            setLoading(false);
        }
    };

    const getDayDifference = () => {
        if (startDate && endDate) {
            const diffTime = Math.abs(endDate - startDate);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both dates
        }
        return null;
    };


    return (
        <div className="container printsection" style={{ marginTop: '130px' }}>
            <h3 className="pagesHeading my-4">
                <i className="bi bi-printer-fill"></i> Kanban Issue ({serialNumberLength})
            </h3>

            <div className="row">
                <div className="col-lg-5">
                    {/* <Select
                        id="part-select"
                        options={partOptions}
                        isMulti
                        onChange={handlePartSelect}
                        value={selectedParts.map((part) => ({
                            value: part.PARTNO,
                            label: `${part.PARTNO}`,
                        }))}
                        placeholder=" &#128270; Search by part Number or Model......."
                        isClearable
                        noOptionsMessage={() => 'No parts found'}
                        getOptionLabel={e => (
                            <div>
                                <input type="checkbox" checked={selectedParts.some(part => part.value === e.value)} readOnly />
                                <span> {e.label} </span>
                            </div>
                        )}
                    /> */}


                    <Select
                        id="part-select"
                        options={partOptions}
                        className=""
                        isMulti
                        onChange={handlePartSelect}
                        value={selectedParts.map((part) => ({
                            value: part.PARTNO,
                            label: `${part.PARTNO}`, // ✅ Show both for selection
                        }))}
                        placeholder="🔍 Search by Part Number or Model..."
                        isClearable
                        noOptionsMessage={() => "No parts found"}
                        filterOption={(option, inputValue) => {
                            const searchValue = inputValue.toLowerCase();
                            const partNumber = option.value ? option.value.toLowerCase() : ""; // ✅ Ensure PARTNO is searchable
                            const model = option.data?.model ? option.data.model.toLowerCase() : ""; // ✅ Ensure MODEL is searchable

                            return partNumber.includes(searchValue) || model.includes(searchValue);
                        }}
                        getOptionLabel={(e) => (
                            <div>
                                <input
                                    type="checkbox"
                                    checked={selectedParts.some((part) => part.PARTNO === e.value)}
                                    readOnly
                                />
                                <span> {e.label} </span>
                            </div>
                        )}
                        styles={{
                            valueContainer: (provided) => ({
                                ...provided,
                                maxHeight: "80px",
                                overflowY: "auto",
                            }),
                        }}

                    />
                </div>


                <div className="col-lg-3">
                    <div className="d-flex justify-content-start">
                        {isVisibleCheckbox && (
                            <div>
                                <input
                                    type="checkbox"
                                    checked={checkAll}
                                    onChange={handleCheckAll}
                                    style={{ height: '25px', width: '25px' }}
                                    id="checkAllCheckbox"
                                />
                            </div>
                        )}

                        {isVisibleCheckbox ? (
                            <div>
                                <label htmlFor="checkAllCheckbox">
                                    {checkAll ? "Uncheck All" : "Check All"}
                                </label>
                                <span> ({Object.values(checkedItems).filter(Boolean).length} items) </span>
                            </div>
                        ) : (<div></div>)}

                    </div>
                </div>



                <div className="col-lg-4">
                    <div className='text-end'>
                        <button className='btn btn-primary' onClick={handlePrintPDF}>
                            <BsFillPrinterFill size={20} color='white' className='mb-1' /> RePrint Pdf

                        </button>

                    </div>
                </div>
            </div>

            {isSerialNumbersFetched && (
                <div className='row my-4'>

                    <div className='col-lg-3'>
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FaSearch />
                            </span>
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search by Serial Number, Part Number, or Part Model..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-lg-3">
                        <div className="position-relative">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select start date"
                                className="form-control"
                            />
                            {startDate && (
                                <button
                                    className="btn btn-sm btn-danger position-absolute"
                                    style={{ left: "170px", top: "50%", transform: "translateY(-50%)" }}
                                    onClick={() => setStartDate(null)}
                                >
                                    ❌
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-3">
                        {startDate && endDate && (
                            <p className="mt-2 text-primary">
                                Day Difference: <strong>{getDayDifference()} days</strong>
                            </p>
                        )}
                    </div>

                    <div className="col-lg-3">
                        <div className="position-relative">
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select end date"
                                className="form-control"
                            />
                            {endDate && (
                                <button
                                    className="btn btn-sm btn-danger position-absolute"
                                    style={{ left: "170px", top: "50%", transform: "translateY(-50%)" }}
                                    onClick={() => setEndDate(null)}
                                >
                                    ❌
                                </button>
                            )}
                        </div>
                    </div>


                </div>
            )}



            {showMessage && (
                <div><p className='message'>Please select the part number</p></div>
            )}

            <div className="row my-3">
                {loading ? (
                    <div className="d-flex justify-content-center w-100">
                        <SpinnerLoader animation="border" role="status" />
                    </div>
                ) : (
                    selectedParts.map((part, partIndex) => {
                        if (!serialNumbersByPart[part.PARTNO] || serialNumbersByPart[part.PARTNO].length === 0) {
                            return null;
                        }

                        return (
                            <div key={partIndex} className="col-12 mb-4">
                                <div className="my-1" style={{ cursor: 'pointer' }}>
                                    <h6 className="bg-primary p-2 text-white rounded text-center">
                                        Part Number - {part.PARTNO} <span className='text-warning'>( Serial Number - {serialNumbersByPart[part.PARTNO]?.length || 0} </span>)
                                    </h6>
                                </div>


                                <div className="row">

                                    {filteredSerialNumbers[part.PARTNO]?.map((item, index) => (
                                        <div key={index} className="col-lg-4 card-container">
                                            <div className="certificate-card" onClick={() => handleCheckboxChange(part.PARTNO, item.serialNo, !checkedItems[`${part.PARTNO}-${item.serialNo}`])}>
                                                <h6 className="title">Passing Certificate</h6>

                                                {/* Checkbox */}
                                                <div className="checkbox-container" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        id={`checkbox-${index}`}
                                                        className="checkbox-input"
                                                        checked={checkedItems[`${part.PARTNO}-${item.serialNo}`] || false}
                                                        onChange={(e) => handleCheckboxChange(part.PARTNO, item.serialNo, e.target.checked)}
                                                    />
                                                </div>

                                                {/* Serial & Model Details */}
                                                <div className="details-container">
                                                    <div className="details">
                                                        <p><span>S/No:</span> {item.serialNo}</p>
                                                        <p><span>Model Code:</span> {item.model}</p>
                                                        <p><span>Part No:</span> {item.partNumber}</p>
                                                        <p><span>USE FOR NAME:</span> {item.usedname}</p>
                                                        <p><span>Planing_date:</span> {item.Planing_date}</p>

                                                    </div>

                                                    {/* Assemble & Inspect Sections */}
                                                    <div className="inspect-container">
                                                        <div>
                                                            <label htmlFor={`assemble-${index}`}>Assemble</label>
                                                            <div className="input-box"></div>
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`inspect-${index}`}>Inspect</label>
                                                            <div className="input-box"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* QR Codes */}
                                                <div className="qrcode-container">
                                                    <div className="qrcode-box">
                                                        <QRCodeCanvas value={`Part Number: ${item.partNumber}`} size={80} />
                                                        <p>PART No: {item.partNumber}</p>
                                                    </div>
                                                    <div className="qrcode-box" style={{ textAlign: 'right' }}>
                                                        <QRCodeCanvas value={`Serial Number: ${item.serialNo}`} size={80} />
                                                        <p>S/N: {item.serialNo}</p>
                                                    </div>
                                                </div>

                                                <p className="company-name">{company_name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>


                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MultiSelectRePrintDetailsPage;