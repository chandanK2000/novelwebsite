import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { QRCodeCanvas } from 'qrcode.react';
import SpinnerLoader from '../../pages/loaderspinner/SpinnerLoader';
import { toast } from 'react-toastify';
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { BsFillPrinterFill } from "react-icons/bs";
import './MultiSelectPrintDetailsPage.css';
import { data } from 'react-router-dom';
import { AiOutlinePrinter } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import IssuedandNonIssuedDataFetch from './IssuedandNonIssuedDataFetch';

const MultiSelectPrintDetailsPage = () => {
    const navigate = useNavigate();
    const [serialNumbersByPart, setSerialNumbersByPart] = useState({});
    const [loading, setLoading] = useState(false);
    const [parts, setParts] = useState([]);
    const [selectedParts, setSelectedParts] = useState([]);
    const [serialNumberLength, setSerialNumberLength] = useState(0);
    const [checkedItems, setCheckedItems] = useState({});
    const [checkAll, setCheckAll] = useState(false);
    const [checkedSerialNumber, setCheckedSerialNumber] = useState();
    const [isVisibleCheckbox, setIsVisibleCheckbox] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [isSerialNumbersFetched, setIsSerialNumbersFetched] = useState(false);
    const [issueData, setIssueData] = useState([]);
    const [IssuedsearchQuery, setIssuedSearchQuery] = useState('');
    const [showSearchBox, setShowSearchBox] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [activeFilter, setActiveFilter] = useState(null);
    const [showDataComponent, setShowDataComponent] = useState(true);



    useEffect(() => {
        const storedUser = localStorage.getItem('userData');

        if (storedUser) {
            try {
                const currentUser = JSON.parse(storedUser);
                const roleName = currentUser?.roles?.[0]?.Role_Name || '';

                setIsAdmin(roleName === 'Admin');
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);


    const fetchedPartsRef = useRef(new Set());

    // const fetchSerialNumbers = async (part) => {
    //     if (!part || fetchedPartsRef.current.has(part.PARTNO)) return;

    //     const currentUser = JSON.parse(localStorage.getItem("userData"));
    //     setLoading(true);
    //     fetchedPartsRef.current.add(part.PARTNO);

    //     try {

    //         const roleName = currentUser?.roles?.[0]?.Role_Name || "defaultRole";
    //         const response = await fetch(
    //             `http://127.0.0.1:5000/get_part_serialno/${part.PART_ID}?roleName=${encodeURIComponent(roleName)}`
    //         );

    //         if (!response.ok) throw new Error("Failed to fetch serial numbers");

    //         const data = await response.json();
    //         console.log("fetched serial number here", data);

    //         if (Array.isArray(data) && data.length > 0) {
    //             setSerialNumbersByPart((prevState) => ({
    //                 ...prevState,
    //                 [part.PARTNO]: data,
    //             }));
    //             toast.success(`Serial numbers fetched successfully for part ${part.PARTNO}`);

    //             setIsVisibleCheckbox(true)
    //             setIsSerialNumbersFetched(true);
    //             setShowSearchBox(false);
    //             setShowDataComponent(false);

    //         } else {
    //             toast.error("No serial numbers found or already printed. Contact admin for a reprint.");
    //             setShowDataComponent(true);

    //         }
    //     } catch (error) {
    //         console.error("Error fetching serial numbers:", error);
    //         toast.error("No serial numbers found or already printed. Contact admin for a reprint.");
    //         setShowDataComponent(true);

    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const fetchSerialNumbers = async (part) => {
        if (!part || fetchedPartsRef.current.has(part.PARTNO)) return;

        const currentUser = JSON.parse(localStorage.getItem("userData"));
        setLoading(true);
        fetchedPartsRef.current.add(part.PARTNO);

        try {
            const roleName = currentUser?.roles?.[0]?.Role_Name || "defaultRole";
            const response = await fetch(
                `http://127.0.0.1:5000/get_part_serialno/${part.PART_ID}?roleName=${encodeURIComponent(roleName)}`
            );

            if (!response.ok) throw new Error("Failed to fetch serial numbers");

            const data = await response.json();
            console.log("Fetched serial numbers:", data);

            if (Array.isArray(data) && data.length > 0) {
                setSerialNumbersByPart((prevState) => ({
                    ...prevState,
                    [part.PARTNO]: data,
                }));
                toast.success(`Serial numbers fetched successfully for part ${part.PARTNO}`);

                setIsVisibleCheckbox(true);
                setIsSerialNumbersFetched(true);
                setShowSearchBox(false);

                // ✅ Set `false` only when data exists
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



    const handlePartSelect = (selectedOptions) => {
        if (!Array.isArray(parts)) {
            console.error("Error: 'parts' is not an array!", parts);
            return;
        }

        const newSelectedParts = selectedOptions.map((option) => {
            return parts.find(
                (part) =>
                    part.PARTNO === option.value ||
                    part.MODEL.toLowerCase() === option.model
            );
        });

        setSelectedParts(newSelectedParts);
        setIssueData([]);
        setShowSearchBox(false);
        setActiveFilter(null);
        setStartDate(null);
        setEndDate(null);
        setShowDataComponent(false);

        if (newSelectedParts.length === 0) {
            setIsSerialNumbersFetched(false);
            setSearchQuery('');
            setShowDataComponent(true); // ✅ Show component when all parts are removed

        } else {
            setIsSerialNumbersFetched(true);
            newSelectedParts.forEach((part) => {
                if (part) fetchSerialNumbers(part);
            });
        }

        setCheckedItems({});
        setCheckAll(false);
    };

    const partOptions = Array.isArray(parts)
        ? parts.map((part) => ({
            value: part.PARTNO,
            label: `${part.PARTNO}`,
            model: part.MODEL.toLowerCase()
        }))
        : [];




    useEffect(() => {
        const totalSerialNumbers = selectedParts.reduce((count, part) => {
            const partSerialNumbers = serialNumbersByPart[part.PARTNO] || [];
            return count + partSerialNumbers.length;
        }, 0);

        setSerialNumberLength(totalSerialNumbers);
    }, [selectedParts, serialNumbersByPart]);

    useEffect(() => {
        let hasResults = false;

        selectedParts.forEach((part) => {
            if (serialNumbersByPart[part.PARTNO]) {
                const filtered = serialNumbersByPart[part.PARTNO].filter((item) =>
                    item.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (filtered.length > 0) {
                    hasResults = true;
                }
            }
        });

        setNoResultsFound(!hasResults);
    }, [searchQuery, selectedParts, serialNumbersByPart]);

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

        // After the PDF is generated, update the serial number length
        const totalSerialNumbers = selectedParts.reduce((count, part) => {
            const partSerialNumbers = serialNumbersByPart[part.PARTNO] || [];
            return count + partSerialNumbers.length;
        }, 0);

        setSerialNumberLength(totalSerialNumbers);

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
                    pdf.setFontSize(13);
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


    // Function to calculate the day difference including both start & end date
    const getDayDifference = () => {
        if (startDate && endDate) {
            const diffTime = Math.abs(endDate - startDate);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both dates
        }
        return null;
    };


    return (
        <div className="container printsection" style={{ marginTop: '130px', zIndex: 10, position: 'relative' }}>
            <div className=''>
                <h3 className="pagesHeading my-4">
                    <i className="bi bi-printer-fill"></i> Kanban Issue ({serialNumberLength})
                </h3>
            </div>

            <div className="row">
                <div className="col-lg-4">

                    {/* <Select
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
                        onMenuOpen={() => {
                            setIssueData([]);
                        }}
                    /> */}

                    {/* <Select
                        id="part-select"
                        options={partOptions}
                        className="customselect"
                        isMulti
                        onChange={handlePartSelect}
                        value={selectedParts.map((part) => ({
                            value: part.PARTNO,
                            label: `${part.PARTNO}`,
                        }))}
                        placeholder="🔍 Search by Part Number or Model..."
                        isClearable
                        noOptionsMessage={() => "No parts found"}
                        filterOption={(option, inputValue) => {
                            const searchValue = inputValue.toLowerCase();
                            const partNumber = option.value ? option.value.toLowerCase() : "";
                            const model = option.data?.model ? option.data.model.toLowerCase() : "";
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
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 1050, // Ensure dropdown appears on top
                                position: "absolute"
                            }),
                            valueContainer: (provided) => ({
                                ...provided,
                                maxHeight: "80px",
                                overflowY: "auto",
                            }),
                        }}
                        menuPlacement="auto" // Auto-adjust dropdown placement
                        menuShouldScrollIntoView={false} // Prevent scrolling issues
                        onMenuOpen={() => setIssueData([])}
                    /> */}

                    <Select
                        id="part-select"
                        options={partOptions}
                        className="customselect"
                        isMulti
                        onChange={handlePartSelect}
                        value={selectedParts.map((part) => ({
                            value: part.PARTNO,
                            label: `${part.PARTNO}`,
                        }))}
                        placeholder="🔍 Search by Part Number or Model..."
                        isClearable
                        noOptionsMessage={() => "No parts found"}
                        filterOption={(option, inputValue) => {
                            const searchValue = inputValue.toLowerCase();
                            const partNumber = option.value ? option.value.toLowerCase() : "";
                            const model = option.data?.model ? option.data.model.toLowerCase() : "";
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
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure dropdown is on top
                            valueContainer: (provided) => ({
                                ...provided,
                                maxHeight: "80px",
                                overflowY: "auto",
                            }),
                        }}
                        menuPlacement="auto"
                        menuShouldScrollIntoView={false}
                        menuPortalTarget={document.body} // ⬅️ This will prevent scrolling issues
                        onMenuOpen={() => setIssueData([])}
                    />



                </div>

                <div className="col-lg-5">
                    <div className="d-flex justify-content-between">
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
                                <span> ({Object.values(checkedItems).filter(Boolean).length}) </span>
                            </div>
                        ) : (<div></div>)}


                    </div>
                </div>

                <div className="col-lg-3">
                    <div className='text-end'>
                        <button className='btn btn-primary' onClick={handlePrintPDF}>
                            <BsFillPrinterFill size={20} color='white' className='mb-1' /> Print Pdf

                        </button>
                        {isAdmin && (
                            <button className="btn btn-primary m-1" onClick={() => navigate('/Reprint-manager')}>
                                <AiOutlinePrinter /> Reprint
                            </button>
                        )}

                    </div>
                </div>

                <div>
                    {/* <IssuedandNonIssuedDataFetch /> */}
                    {showDataComponent && <IssuedandNonIssuedDataFetch />}

                </div>
                <div>
                </div>
            </div>

            {isSerialNumbersFetched && (

                <div className='row my-3'>
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
                                onChange={(e) => setSearchQuery(e.target.value.trim())}
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
                            {startDate && ( // Show the clear button only when a date is selected
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


            {/* Show Search Box Only If Data is Available */}
            {showSearchBox && (
                <div className='row my-3'>
                    <div className="col-lg-3">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" style={{ height: "100%", borderRadius: "0" }}>
                                    <i className="fas fa-search"></i> {/* Font Awesome search icon */}
                                </span>
                            </div>
                            <input
                                type="search"
                                placeholder="Search by Serial Number, Model, or Part Number"
                                className="form-control"
                                value={IssuedsearchQuery}
                                onChange={(e) => setIssuedSearchQuery(e.target.value.trim())}
                                style={{ height: "100%" }}
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
                            {startDate && ( // Show the clear button only when a date is selected
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
                                Day Difference: <strong>{getDayDifference()} days ({issueData.length})</strong>
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

            <div className="row my-3">
                {loading ? (
                    <div className="d-flex justify-content-center w-100 align-items-center">
                        <SpinnerLoader animation="border" role="status" />
                    </div>
                ) : (
                    <>

                        {
                            selectedParts.map((part, partIndex) => {
                                if (!serialNumbersByPart[part.PARTNO] || serialNumbersByPart[part.PARTNO].length === 0) {
                                    return null;
                                }


                                const filteredSerialNumbers = serialNumbersByPart[part.PARTNO].filter((item) => {
                                    const itemDate = new Date(item.Planing_date); // Convert Planing_date to Date object
                                    const start = startDate ? new Date(startDate) : null;
                                    const end = endDate ? new Date(endDate) : null;

                                    const matchesSearchQuery =
                                        item.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        item.partNumber.toLowerCase().includes(searchQuery.toLowerCase());

                                    const matchesDateRange =
                                        (!start || itemDate >= start) &&
                                        (!end || itemDate <= new Date(end.setHours(23, 59, 59, 999))); // Ensure end date is inclusive

                                    return matchesSearchQuery && matchesDateRange;
                                });


                                return (
                                    <div key={partIndex} className="col-12 mb-4">
                                        <div className="my-1" style={{ cursor: 'pointer' }}>
                                            <h6 className="bg-primary p-2 text-white rounded text-center">
                                                Part Number - {part.PARTNO} <span className='text-warning'>( Serial Number - {filteredSerialNumbers.length} </span>)
                                            </h6>
                                        </div>

                                        <div className="row">
                                            {filteredSerialNumbers.map((item, index) => (
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
                        }
                    </>
                )}
            </div>
        </div>
    );
};

export default MultiSelectPrintDetailsPage;