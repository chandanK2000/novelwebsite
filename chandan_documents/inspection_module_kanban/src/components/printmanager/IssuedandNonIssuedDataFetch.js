import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsFillPrinterFill } from "react-icons/bs";
import { AiOutlinePrinter } from "react-icons/ai";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { toast } from 'react-toastify';

const IssuedandNonIssuedDataFetch = () => {
    const defaultStartDate = new Date();
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 7);

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [issueData, setIssueData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("unissued");
    const [noDataMessage, setNoDataMessage] = useState("");
    const [checkedItems, setCheckedItems] = useState({});
    const [checkedSerialNumbers, setCheckedSerialNumbers] = useState([]); // Track checked serial numbers
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectAllChecked, setSelectAllChecked] = useState(false); // For Check All button
    const [loading, setLoading] = useState(false);

    const formatDate = (date) => date ? date.toISOString().split("T")[0] : null;


    const fetchIssuedandNonIssuedData = async (status) => {
        try {
            setLoading(true); // Start loading before fetching data

            setActiveTab(status);
            setNoDataMessage(""); // Clear any previous messages

            const start = formatDate(startDate);
            const end = formatDate(endDate);
            const url = `http://127.0.0.1:5000/get_kanban_details?status=${status}&start_date=${start}&end_date=${end}`;

            console.log("Fetching from:", url);
            const response = await fetch(url);

            // Check if the response is successful
            if (!response.ok) {
                // Handle HTTP errors (e.g., 404, 500)
                throw new Error("Failed to fetch data");
            }

            const result = await response.json();
            console.log("API response:", result);

            // If result is empty, it's not an error with the fetch, just no data available
            if (!Array.isArray(result) || result.length === 0) {
                // Specific message when there is no data for the given status
                setNoDataMessage(`No ${status} data available for the selected date range.`);
                setIssueData([]);
                setFilteredData([]);
                return;
            }

            // If data exists, set it
            setIssueData(result);
            setFilteredData(result);
            setLoading(false); // Stop loading after the response is processed

        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle errors that are not related to empty data
            if (error.message === "Failed to fetch data") {
                setNoDataMessage(`No ${status} data available for the selected date range.`);
            } else {
                // Handle unexpected errors (e.g., other types of errors)
                setNoDataMessage("Unexpected error occurred. Please try again later.");
            }

            setIssueData([]);
            setFilteredData([]);
            setLoading(false); // Stop loading after error

        }
    };



    useEffect(() => {
        fetchIssuedandNonIssuedData(activeTab);  // Ensure status is passed correctly
    }, [startDate, endDate, activeTab]);


    console.log("Active Tab:", activeTab);
    useEffect(() => {
        console.log("Filtered data:", filteredData);  // Check if filtered data changes
    }, [filteredData]);


    useEffect(() => {
        const filtered = issueData.filter(item =>
            item.SERIAL_NO.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        resetCheckboxes(); // Reset checkboxes when the filter changes (search term)
    }, [searchTerm, issueData]);

    useEffect(() => {
        // Reset "Check All" and uncheck all items when the date range changes
        resetCheckboxes();
    }, [startDate, endDate]);

    useEffect(() => {
        // Check if all checkboxes are selected or not
        const allChecked = filteredData.every(item => checkedItems[item.SERIAL_NO]);
        setSelectAllChecked(allChecked);
    }, [checkedItems, filteredData]);

    // Get user data from localStorage and check if they are an Admin
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

    const resetCheckboxes = () => {
        setSelectAllChecked(false);
        setCheckedItems({});
        setCheckedSerialNumbers([]);
    };

    const handleCheckboxChange = (serialNo) => {
        setCheckedItems((prevCheckedItems) => {
            const updatedCheckedItems = { ...prevCheckedItems, [serialNo]: !prevCheckedItems[serialNo] };
            updateCheckedSerialNumbers(updatedCheckedItems);
            return updatedCheckedItems;
        });
    };


    const handleCheckAll = () => {
        const newSelectAllChecked = !selectAllChecked;
        setSelectAllChecked(newSelectAllChecked);

        const updatedCheckedItems = {};
        const updatedCheckedSerialNumbers = [];

        filteredData.forEach(item => {
            updatedCheckedItems[item.SERIAL_NO] = newSelectAllChecked;
            if (newSelectAllChecked) {
                updatedCheckedSerialNumbers.push(item.SERIAL_NO);
            }
        });

        setCheckedItems(updatedCheckedItems);
        setCheckedSerialNumbers(updatedCheckedSerialNumbers);

        // Log checked serial numbers (Array)
        console.log("Checked Serial Numbers (Array):", updatedCheckedSerialNumbers);
    };


    const updateCheckedSerialNumbers = (updatedCheckedItems) => {
        const updatedSerialNumbers = [];
        Object.keys(updatedCheckedItems).forEach(serialNo => {
            if (updatedCheckedItems[serialNo]) {
                updatedSerialNumbers.push(serialNo);
            }
        });
        setCheckedSerialNumbers(updatedSerialNumbers);
        setSelectAllChecked(false);
        console.log("Checked Serial Numbers (Array):", JSON.stringify(updatedSerialNumbers)); // Log checked serial numbers in the specified format
    };


    const handleTabChange = (status) => {
        console.log("Tab changed to:", status);
        setActiveTab(status);
        resetCheckboxes();
    };


    const company_name = 'Wipro Kawasaki Precision Machinery Pvt Ltd';


    const PrintPdf = async () => {
        if (checkedSerialNumbers.length === 0) {
            toast.success('Please Select At Least One Serial Number Before Print !');
            return; // Prevent execution if no serial numbers are selected
        }

        try {
            console.log("PrintPdf function triggered");
            setLoading(true);

            // Initialize the PDFs array to store all the PDFs for all parts
            let pdf;

            // Group checked serial numbers by PART_ID (partnumber)
            const partsGrouped = issueData.reduce((acc, part) => {
                const partid = String(part.PART_ID);  // Ensure PART_ID is a string
                console.log(`Processing part: ${partid}`);

                if (!partid) {
                    console.error('PARTID is missing for part:', part);
                    return acc;
                }

                // Filter checked serial numbers for the current part
                const checkedSerialNumbersForPart = checkedSerialNumbers.filter(serialNo => {
                    return part.SERIAL_NO === serialNo;  // Match serial number with part
                });

                if (checkedSerialNumbersForPart.length > 0) {
                    if (!acc[partid]) acc[partid] = [];
                    acc[partid].push({
                        part,
                        serialNumbers: checkedSerialNumbersForPart,
                    });
                }

                return acc;
            }, {});

            // Loop through each grouped part (by PART_ID) and generate a single PDF for each
            for (const [partId, partData] of Object.entries(partsGrouped)) {
                const part = partData[0].part;  // Get the part data (only the first one, since we are grouping by partId)
                const serialNumbers = partData.map(data => data.serialNumbers).flat();  // Flatten all serial numbers for the part

                console.log(`Generating PDF for part: ${partId} with serial numbers:`, serialNumbers);

                // 1. API call to update the print flag for the current part
                const statusResponse = await fetch(`http://127.0.0.1:5000/update_print_flg/${partId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        serial_no: serialNumbers, // Send selected serial numbers for the current part
                    }),
                });

                if (!statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    console.log("Status data", statusData);
                    toast.error(statusData.message || `Failed to check print status for part ${partId}.`);
                    continue; // Skip to the next part if there's an error
                }

                // Create a new PDF for the current part
                pdf = new jsPDF('p', 'mm', 'a4');
                console.log(`PDF created for part ${partId}`);

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margins = 3;
                const contentWidth = pageWidth - margins * 2;
                const contentHeight = pageHeight - margins * 2;

                const itemsPerRow = 2;
                const columnWidth = contentWidth / itemsPerRow;
                const rowHeight = contentHeight / 5;
                let xOffset = margins;
                let yOffset = margins;

                // Loop through all selected serial numbers for the part and generate content for each
                for (const serialNo of serialNumbers) {
                    console.log(`Generating content for serial number: ${serialNo}`);

                    if (yOffset + rowHeight > pageHeight) {
                        pdf.addPage();
                        xOffset = margins;
                        yOffset = margins;
                    }

                    // Ensure serialNo and other values are converted to string
                    const serialNoStr = String(serialNo);
                    const modelStr = String(part.MODEL || "");
                    const partNumber = String(part.PART_NO || "");
                    const usedNameStr = String(part.USEDNAME || "");

                    // Add content like Serial No, Model, Part ID, etc. to PDF
                    const topPadding = 3;
                    const lineHeight = 4;
                    let currentY = yOffset + topPadding + lineHeight;

                    pdf.setFontSize(13);
                    pdf.setFont("helvetica", "bold");
                    pdf.text("Passing Certificate:", xOffset + 2, currentY);

                    pdf.setFontSize(8);
                    const labelXOffset = xOffset + 2;
                    const valueXOffset = xOffset + 25;

                    const labels = ["Serial Number:", "Model:", "Part Number", "USE FOR NAME:"];
                    const values = [
                        serialNoStr,
                        modelStr,
                        partNumber,
                        usedNameStr,
                    ];

                    for (let i = 0; i < labels.length; i++) {
                        currentY += lineHeight;
                        pdf.setFont("helvetica", "bold");
                        pdf.text(labels[i], labelXOffset, currentY);
                        pdf.setFont("helvetica", "normal");
                        pdf.text(values[i], valueXOffset, currentY);
                    }

                    // Draw input boxes for "Assemble" and "Inspect"
                    const inputBoxWidth = 29;
                    const inputBoxHeight = 6.5;

                    pdf.text('Assemble:', xOffset + columnWidth - 35, yOffset + topPadding + 4);
                    pdf.rect(xOffset + columnWidth - 35, yOffset + topPadding + 6, inputBoxWidth, inputBoxHeight);

                    pdf.text('Inspect:', xOffset + columnWidth - 35, yOffset + topPadding + 16);
                    pdf.rect(xOffset + columnWidth - 35, yOffset + topPadding + 18, inputBoxWidth, inputBoxHeight);

                    // Generate QR codes
                    try {
                        const qrSize = 17;
                        const qrYPosition = yOffset + rowHeight - 30;

                        const partQR = await QRCode.toDataURL(`${partNumber}`, { width: qrSize });
                        const serialQR = await QRCode.toDataURL(`${serialNo}`, { width: qrSize });

                        const partQrXPosition = xOffset + 4;
                        const partTextXPosition = partQrXPosition + qrSize / 2 - (pdf.getTextWidth(`${partId}`) / 2);

                        const serialQrXPosition = xOffset + columnWidth - qrSize - 14;
                        const serialTextXPosition = serialQrXPosition + qrSize / 2 - (pdf.getTextWidth(`${serialNo}`) / 2);

                        pdf.addImage(serialQR, 'PNG', serialQrXPosition, qrYPosition, qrSize, qrSize);
                        pdf.text(`S/N : ${serialNo}`, serialTextXPosition, qrYPosition + qrSize + 2);

                        pdf.addImage(partQR, 'PNG', partQrXPosition, qrYPosition, qrSize, qrSize);
                        pdf.text(`Part No : ${partNumber}`, partTextXPosition, qrYPosition + qrSize + 2);
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

                    if (xOffset >= pageWidth - margins) {
                        xOffset = margins;
                        yOffset += rowHeight;
                    }
                }

                // Save the PDF for the current part
                const currentDate = new Date().toLocaleString().replace(/[/:,]/g, '-');
                pdf.save(`${currentDate}_part_${part.PART_NO}_print.pdf`);
                console.log(`PDF saved for part ${part.PART_NO}`);

                toast.success(`PDF generated successfully for part ${part.PART_NO}.`);
            }

            // Now refetch the unissued data
            console.log('Refetching unissued data...');
            // await fetchIssuedandNonIssuedData("unissued");
            window.location.reload();
            setSearchTerm('');

        } catch (error) {
            console.error('Error generating PDF or fetching data:', error);
            toast.error('Error generating PDF or fetching data.');
        } finally {
            setLoading(false);
            console.log("PrintPdf function finished");
        }
    };




    return (
        <div style={{ padding: '20px' }}>
            <div className="row">
                <div className="col-lg-3">
                    {/* Check if there is data to show the Check All and Selected Items */}
                    {filteredData.length > 0 && noDataMessage === "" && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                style={{
                                    height: '25px',
                                    width: '25px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                checked={selectAllChecked}
                                onChange={handleCheckAll}
                                id="checkall"
                            />
                            <label
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    cursor: 'pointer',
                                }}
                                htmlFor="checkall"
                            >
                                {selectAllChecked ? 'Uncheck All' : 'Check All'}
                            </label>
                        </div>
                    )}
                </div>

                <div className="col-lg-3">
                    {/* Check if there is data to show the Selected Items length */}
                    {filteredData.length > 0 && noDataMessage === "" && (
                        <p>Selected items: {checkedSerialNumbers.length}</p>
                    )}
                </div>

                <div className="col-lg-3">
                    <button
                        className={`btn m-1 ${activeTab === 'issued' ? 'btn-success' : 'btn-primary'}`}
                        onClick={() => handleTabChange("issued")}
                    >
                        Issued
                    </button>
                    <button
                        className={`btn m-1 ${activeTab === 'unissued' ? 'btn-success' : 'btn-primary'}`}
                        onClick={() => handleTabChange("unissued")}
                    >
                        Non Issued
                    </button>
                </div>
                <div className="col-lg-3 text-end">
                    {activeTab === 'unissued' ? (
                        <button className="btn btn-primary mx-1" onClick={PrintPdf}>
                            <BsFillPrinterFill size={20} color="white" className="mb-1" /> Printpdf
                        </button>
                    ) : (
                        isAdmin && (
                            <button className="btn btn-primary" onClick={PrintPdf}>
                                <AiOutlinePrinter /> RePrintpdf
                            </button>
                        )
                    )}
                </div>

{/* <div className="col-lg-3 text-end">
    {(filteredData.length > 0 && noDataMessage === "") && (
        activeTab === 'unissued' ? (
            <button className="btn btn-primary mx-1" onClick={PrintPdf}>
                <BsFillPrinterFill size={20} color="white" className="mb-1" /> Printpdf
            </button>
        ) : (
            isAdmin && (
                <button className="btn btn-primary" onClick={PrintPdf}>
                    <AiOutlinePrinter /> RePrintpdf
                </button>
            )
        )
    )}
</div> */}

            </div>

            <div className="row my-3">
                <div className="col-lg-3">
                    <input
                        type="search"
                        placeholder="Enter serial number"
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* {filteredData.length > 0 && noDataMessage === "" && (
    <div className="col-lg-3">
        <input
            type="search"
            placeholder="Enter serial number"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    </div>
)} */}


                <div className="col-lg-3">
                    {/* <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Select start date"
                        className="form-control"
                    /> */}

                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Select start date"
                        className="form-control custom-datepicker"  // Add a custom class name
                    />

                </div>
                <div className="col-lg-3">
                    Day Difference: {Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} days ({filteredData.length})
                </div>
                <div className="col-lg-3">
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Select end date"
                        className="form-control"
                    />
                </div>
            </div>

            {/* <div className="col-lg-12">
                <div className="table-container" style={{ height: '300px', overflowY: 'auto' }}>
                    {noDataMessage ? (
                        <h5 className='text-center text-danger my-3'>{noDataMessage}</h5>
                    ) : filteredData.length === 0 ? (
                        <h5 className="text-primary my-3">No Matching Records Found!</h5>
                    ) : (
                        <table className="table table-bordered my-3">
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                <tr>
                                    <th>check</th>
                                    <th>Part Id</th>
                                    <th>Part Number</th>
                                    <th>Model</th>
                                    <th>Used Name</th>
                                    <th>Planning Date</th>
                                    <th>Plng-Month</th>
                                    <th>Serial No</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="text-center">
                                            <input
                                                type="checkbox"
                                                className="checkboxSelect"
                                                checked={checkedItems[item.SERIAL_NO] || false}
                                                onChange={() => handleCheckboxChange(item.SERIAL_NO)}
                                            />
                                        </td>
                                        <td>{item.PART_ID}</td>
                                        <td>{item.PART_NO}</td>
                                        <td>{item.MODEL}</td>
                                        <td>{item.USEDNAME}</td>
                                        <td>{item.PLNG_DATE}</td>
                                        <td>{item.PLNG_MONTH}</td>
                                        <td>{item.SERIAL_NO}</td>
                                        <td>{item.PRINT_FLG === "Y" ? "Printed" : "Unprinted"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div> */}

<div className="col-lg-12">
    <div className="table-container" style={{ height: '300px', overflowY: 'auto' }}>
        {loading ? (
            // Display the loader spinner while loading
            <div className="loader_container my-5">
                <div className="loader">

                </div>
                <p className='text-primary'>Loading Data ....</p>

            </div>
        ) : noDataMessage ? (
            <h5 className='text-center text-danger my-3'>{noDataMessage}</h5>
        ) : filteredData.length === 0 ? (
            <h5 className="text-primary my-3">No Matching Records Found!</h5>
        ) : (
            <table className="table table-bordered my-3">
                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                    <tr>
                        <th>check</th>
                        <th>Part Id</th>
                        <th>Part Number</th>
                        <th>Model</th>
                        <th>Used Name</th>
                        <th>Planning Date</th>
                        <th>Planning Month</th>
                        <th>Serial No</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td className="text-center">
                                <input
                                    type="checkbox"
                                    className="checkboxSelect"
                                    checked={checkedItems[item.SERIAL_NO] || false}
                                    onChange={() => handleCheckboxChange(item.SERIAL_NO)}
                                />
                            </td>
                            <td>{item.PART_ID}</td>
                            <td>{item.PART_NO}</td>
                            <td>{item.MODEL}</td>
                            <td>{item.USEDNAME}</td>
                            <td>{item.PLNG_DATE}</td>
                            <td>{item.PLNG_MONTH}</td>
                            <td>{item.SERIAL_NO}</td>
                            <td>{item.PRINT_FLG === "Y" ? "Printed" : "Unprinted"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
</div>

        </div>
    );
};

export default IssuedandNonIssuedDataFetch;
