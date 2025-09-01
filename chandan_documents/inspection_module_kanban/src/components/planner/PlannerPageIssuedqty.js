
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './PlannerPageDetails.css';
import { toast } from 'react-toastify';
import { FaSave } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { MdAddCircle, MdDateRange } from "react-icons/md";
import { FaRegPaperPlane } from "react-icons/fa6";
import PlannerPageUpdated from '../../PlannerPageUpdated';


const PlannerPageIssuedqty = () => {
    const [parts, setParts] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 5)));
    const [planData, setPlanData] = useState({});
    const [selectedParts, setSelectedParts] = useState(new Array(8).fill(null)); // Initialize with 5 rows

    const [isAdmin, setIsAdmin] = useState(false);
    const [showIssuedQty, setShowIssuedQty] = useState(true); // State to control visibility of Issued Qty row

    useEffect(() => {
        const currentUsers = JSON.parse(localStorage.getItem('userData'));
        console.log('Current User:', currentUsers);  // Check the current user data to see if role_name is Admin

        // Check if currentUsers is not null, and role_name exists and is "Admin"
        if (currentUsers && currentUsers.role_name && currentUsers.role_name === "Admin") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);






    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/parts_active_list');
                const data = await response.json();

                // Ensure the response is an array before updating state
                if (Array.isArray(data)) {
                    setParts(data);
                } else {
                    setParts([]); // Set empty array if data is invalid
                }
            } catch (error) {
                console.error('Error fetching parts:', error);
                setParts([]); // Ensure it's always an array to avoid .map() errors
            }
        };

        fetchParts();
    }, []);


    const currentUser = JSON.parse(localStorage.getItem('userData'));

    // console.log(currentUser);

    console.log("current user name", currentUser.role_name);



    // const fetchPartPlanningData = async (partId, rowIndex) => {
    //     try {
    //         const roleName = currentUser?.role_name;

    //         const response = await fetch(`http://127.0.0.1:5000/get_part_planing/${partId}?role_name=${roleName}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         const data = await response.json();
    //         console.log("fetched plan data", data);

    //         if (data.error || !data.length) {
    //             const fullDateRange = dateRange.map((date) => ({
    //                 date: new Date(date).toISOString().split("T")[0],
    //                 value: "",
    //                 serialized: false,  // Default to false
    //             }));

    //             setPlanData((prevState) => ({
    //                 ...prevState,
    //                 [partId]: fullDateRange.reduce((acc, item) => {
    //                     acc[item.date] = item;
    //                     return acc;
    //                 }, {}),
    //             }));
    //         } else {
    //             const dataMap = data.reduce((acc, item) => {
    //                 const date = new Date(item.PLNG_DATE).toISOString().split("T")[0];
    //                 acc[date] = {
    //                     quantity: item.PLNG_QTY || 0,
    //                     serialized: item.SERIALIZE_FLG === "Y",  // Mark as serialized if "Y"
    //                 };
    //                 return acc;
    //             }, {});

    //             setPlanData((prevState) => ({
    //                 ...prevState,
    //                 [partId]: dataMap,
    //             }));
    //         }
    //     } catch (error) {
    //         console.error("Error fetching part planning data:", error);
    //         toast.error("Error fetching part planning data.");
    //     }
    // };



    const fetchPartPlanningData = async (partId, rowIndex) => {
        try {
            const roleName = currentUser?.role_name;
            const response = await fetch(`http://127.0.0.1:5000/get_part_planing/${partId}?role_name=${roleName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log("Fetched plan data", data);

            if (data.error || !data.length) {
                const fullDateRange = dateRange.map((date) => ({
                    date: new Date(date).toISOString().split("T")[0],
                    quantity: "",  // PLNG_QTY
                    issued: "",    // ISSUED_QTY
                    serialized: false,
                }));

                setPlanData((prevState) => ({
                    ...prevState,
                    [partId]: fullDateRange.reduce((acc, item) => {
                        acc[item.date] = item;
                        return acc;
                    }, {}),
                }));
            } else {
                const dataMap = data.reduce((acc, item) => {
                    const date = new Date(item.PLNG_DATE).toISOString().split("T")[0];
                    acc[date] = {
                        quantity: item.PLNG_QTY || 0,  // Planned Quantity
                        issued: item.ISSUED_QTY || 0,  // Issued Quantity
                        // serialized: item.SERIALIZE_FLG === "Y",
                    };
                    return acc;
                }, {});

                setPlanData((prevState) => ({
                    ...prevState,
                    [partId]: dataMap,
                }));
            }
        } catch (error) {
            console.error("Error fetching part planning data:", error);
            toast.error("Error fetching part planning data.");
        }
    };


    useEffect(() => {
        if (selectedParts[selectedParts.length - 1] && selectedParts[selectedParts.length - 1].PARTID) {
            const lastPartId = selectedParts[selectedParts.length - 1].PARTID;
            fetchPartPlanningData(lastPartId, selectedParts.length - 1);
        }
    }, [startDate, endDate, selectedParts]);

    console.log(startDate)
    console.log(endDate)

    const generateDateRange = (start, end) => {
        const dates = [];

        // Set both start and end date times to midnight UTC
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999); // Ensure the end date is at the end of the day

        let currentDate = new Date(start);

        while (currentDate <= end) {
            dates.push(new Date(currentDate));  // Push each date into the array
            currentDate.setDate(currentDate.getDate() + 1);  // Increment the date by 1
        }

        return dates;
    };



    const dateRange = startDate && endDate ? generateDateRange(startDate, endDate) : [];
    // console.log("date range", dateRange);

    const handlePartSelect = (selectedOption, rowIndex) => {
        const selectedPart = parts.find((part) => part.PARTNO === selectedOption.value);
        const updatedParts = [...selectedParts];
        updatedParts[rowIndex] = selectedPart;
        setSelectedParts(updatedParts);
        fetchPartPlanningData(selectedPart.PART_ID, rowIndex);
    };



    const getFilteredOptions = (rowIndex) => {
        const selectedPartNumbers = selectedParts.map((part) => part?.PARTNO);
        return parts
            .filter((part) => !selectedPartNumbers.includes(part.PARTNO) || selectedParts[rowIndex]?.PARTNO === part.PARTNO)
            .map((part) => ({ value: part.PARTNO, label: `${part.PARTNO}` }));
    };



    const addNewRow = () => {
        setSelectedParts((prev) => [...prev, null]); // Always add a new row
    };



    const handleInputChange = (partId, date, value) => {
        const quantity = isNaN(value) || Number(value) < 0 ? 0 : Number(value);

        setPlanData((prevData) => ({
            ...prevData,
            [partId]: {
                ...prevData[partId],
                [date]: {
                    ...prevData[partId][date],
                    quantity: quantity, // Update the quantity, or default to 0 if invalid
                    serialized: prevData[partId][date]?.serialized || false, // Maintain the serialized flag (it doesn’t change here)
                },
            },
        }));
    };



    useEffect(() => {
        console.log("Plan Data:", planData);
        console.log("Selected Parts:", selectedParts);
    }, [planData, selectedParts]);



    const handleRemoveRow = (rowIndex) => {
        const updatedParts = [...selectedParts];
        const updatedPlanData = { ...planData };

        updatedParts.splice(rowIndex, 1);
        setSelectedParts(updatedParts);

        const partKey = Object.keys(updatedPlanData)[rowIndex];
        delete updatedPlanData[partKey];
        setPlanData(updatedPlanData);
    };

    const partOptions = parts.map((part) => ({
        value: part.PARTNO,
        label: `${part.PARTNO}`,
    }));

    const calculateDateDifference = (start, end) => {
        const diffTime = end - start;  // Difference in milliseconds
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;  // Add 1 to include both the start and end days
    };



    const dateDifference = calculateDateDifference(startDate, endDate);



    const handleSave = () => {
        const collectedData = selectedParts
            .filter((part) => part !== null && part.PART_ID)
            .map((part) => {
                const partPlanData = planData[part.PART_ID] || {};
                // console.log("Collected planData:", partPlanData);

                const productionData = dateRange.map((date) => {
                    const formatDateForBackend = (date) => {
                        const d = new Date(date);
                        const month = d.getMonth() + 1;
                        const day = d.getDate();
                        const year = d.getFullYear();

                        return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}/${year}`;
                    };

                    const formattedDateForBackend = formatDateForBackend(date);
                    // console.log("Formatted Date for Backend:", formattedDateForBackend);

                    // Fetch the actual quantity from the plan data
                    const formattedDateForCheck = new Date(date).toISOString().split("T")[0];

                    const quantity = Number(partPlanData[formattedDateForCheck]?.quantity) || 0;  // Ensure the correct quantity is used
                    console.log("Quantity for", formattedDateForBackend, ":", quantity);

                    return { date: formattedDateForBackend, quantity };
                }).filter(data => !isNaN(data.quantity));

                return {
                    createdBy: currentUser.User_code,
                    modifiedBy: currentUser.User_code,
                    partId: part.PART_ID,
                    partNumber: part.PARTNO || '',
                    model: part.MODEL || '',
                    pc: part.PC || '',
                    productionData,
                };
            });

        // console.log('Collected data to save:', collectedData);

        // Send collected data to backend
        fetch('http://127.0.0.1:5000/add_part_and_save_data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collectedData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    toast(`Error: ${data.error}`, { type: 'error' });
                } else {
                    toast('Data saved successfully!', { type: 'success' });
                }
            })
            .catch((error) => {
                console.error('Error saving data:', error);
                toast('Error: Could not save the data. Please try again.', { type: 'error' });
            });
    };


    useEffect(() => {
        const staticTableRows = document.querySelectorAll('.static-table tbody tr');
        const scrollableTableRows = document.querySelectorAll('.scrollable-table tbody tr');

        staticTableRows.forEach((row, index) => {
            const scrollableRow = scrollableTableRows[index];
            if (scrollableRow) {
                const maxHeight = Math.max(row.offsetHeight, scrollableRow.offsetHeight);
                row.style.height = `${maxHeight}px`;
                scrollableRow.style.height = `${maxHeight}px`;
            }
        });
    }, [selectedParts, dateRange, planData]);

    const handleReset = () => {
        setStartDate(new Date());
        setEndDate(new Date(new Date().setDate(new Date().getDate() + 5)));
        // setSelectedParts([null]);
        setSelectedParts(new Array(3).fill(null)); // Reset selectedParts to 3 rows

        setPlanData({});
    };

  // Function to calculate total issued quantity
  const getTotalIssuedQty = (selectedPart) => {
    if (!selectedPart || !Array.isArray(dateRange)) return 0;
    return dateRange.reduce((total, date) => {
        const issuedQty = planData[selectedPart.PART_ID]?.[date.toISOString().split("T")[0]]?.issued || 0;
        return total + Number(issuedQty);
    }, 0);
};

const getTotalPlannedQty = (selectedPart) => {
    if (!selectedPart) return 0;
    return dateRange.reduce((sum, date) => {
        const dateKey = date.toISOString().split("T")[0];
        const quantity = planData[selectedPart.PART_ID]?.[dateKey]?.quantity || 0;
        return sum + Number(quantity);
    }, 0);
};



    return (
        <div
            style={{ marginTop: "130px" }}
            className="container rounded shadow-sm  planner-page"
        >

            <div className="row">
                <div className="col-12 text-center">
                    <h3 className="pagesHeading"><FaRegPaperPlane color='gray' className='mb-1' size={25} /> Production Plan</h3>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-4">
                    <label htmlFor="startDate" className="form-label"> <MdDateRange color='orange' className='mb-1' size={20} /> Start Date</label>
                    <div>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select start date"
                            className="form-control"
                            minDate={isAdmin ? null : new Date()}  // Admin can select any date, others can only select from today onwards
                        />
                    </div>
                </div>


                <div className="col-lg-4">
                    <label className="form-label daydifference">Day Difference</label>
                    <input
                        type="text"
                        value={dateDifference}
                        readOnly
                        className="form-control daydifference"
                    />
                </div>

                <div className="col-lg-4">
                    <label htmlFor="endDate" className="form-label">  <MdDateRange color='orange' className='mb-1' size={20} /> End Date</label>
                    <div>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select end date"
                            className="form-control"
                            minDate={startDate ? startDate : new Date()}
                            disabled={!startDate}
                        />
                    </div>
                </div>
            </div>


            {/* <div className='scroll_container_table'>
                <div className="row my-3">
                    <div className="col-lg-12">
                        <div style={{ display: "flex", flexWrap: "nowrap", position: "relative" }}>
                            <div style={{ flex: "0 0 auto" }}>
                                <table className="table table-bordered shadow-sm static-table">
                                    <thead>
                                        <tr>
                                            <th className="partnumber">Part Number</th>
                                            <th className="partnumber">Part Model</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedParts.map((selectedPart, rowIndex) => (
                                            <React.Fragment key={rowIndex}>
                                                <tr>
                                                    <td>
                                                        <Select
                                                            key={rowIndex}
                                                            options={getFilteredOptions(rowIndex)}
                                                            value={selectedPart
                                                                ? { value: selectedPart.PARTNO, label: `${selectedPart.PARTNO}` }
                                                                : null
                                                            }
                                                            onChange={(option) => handlePartSelect(option, rowIndex)}
                                                            className='custom_select_plannerpage'
                                                            classNamePrefix='custom'
                                                        />
                                                    </td>
                                                    <td>{selectedPart ? selectedPart.MODEL : "-"}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleRemoveRow(rowIndex)}
                                                        >
                                                            <i className="bi bi-trash3-fill"></i>
                                                        </button>
                                                    </td>
                                                </tr>

                                                <tr className="issued-row">
                                                    <td colSpan="3" className="text-muted text-center">
                                                        Issued Qty: {Array.isArray(dateRange) && dateRange.length > 0 ? (
                                                            dateRange.map((date) => (
                                                                <span key={date.toISOString()} className="issued_details">
                                                                     {planData[selectedPart?.PART_ID]?.[date.toISOString().split("T")[0]]?.issued || "-"} 
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span>No Date Available</span>
                                                        )}

                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ overflowX: "auto", flexGrow: 1 }}>
                                <table className="table table-bordered shadow-sm scrollable-table">
                                    <thead>
                                        <tr>
                                            {dateRange.map((date, index) => (
                                                <th key={index}>{date.toLocaleDateString()}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedParts.map((selectedPart, rowIndex) => (
                                            <React.Fragment key={rowIndex}>
                                                <tr>
                                                    {dateRange.map((date) => (
                                                        <td key={date.toISOString()}>
                                                            <input
                                                                className='form-control'
                                                                type="number"
                                                                value={planData[selectedPart?.PART_ID]?.[date.toISOString().split("T")[0]]?.quantity || ""}
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        selectedPart?.PART_ID,
                                                                        date.toISOString().split("T")[0],
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    !selectedPart ||
                                                                    planData[selectedPart?.PART_ID]?.[date.toISOString().split("T")[0]]?.serialized
                                                                }
                                                                min="0"
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>

                                                <tr className="issued-row">
                                                    {dateRange.map((date) => (
                                                        <td key={date.toISOString()} className="issued_details">
                                                            {planData[selectedPart?.PART_ID]?.[date.toISOString().split("T")[0]]?.issued || "-"}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}


            <div className='scroll_container_table'>
                <div className="row my-3">
                    <div className="col-lg-12">
                        {/* Checkbox to toggle Issued Qty Row */}
                        <div className="mb-3">
                            <input
                                type="checkbox"
                                id="toggleIssuedQty"
                                checked={showIssuedQty}
                                onChange={() => setShowIssuedQty(!showIssuedQty)}
                            />
                            <label htmlFor="toggleIssuedQty" className="ms-2"> Issued Qty</label>
                        </div>

                        <div style={{ display: "flex", flexWrap: "nowrap", position: "relative" }}>
                            {/* Static Table */}
                            <div style={{ flex: "0 0 auto" }}>
                                <table className="table table-bordered shadow-sm static-table">
                                    <thead>
                                        <tr>
                                            <th className="partnumber">Part Number</th>
                                            <th className="partnumber">Part Model</th>
                                            <th>Action</th>
                                            <th>sum</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedParts.map((selectedPart, rowIndex) => (
                                            <React.Fragment key={rowIndex}>
                                                {/* Row for Part Details */}
                                                <tr>
                                                    <td>
                                                        <Select
                                                            key={rowIndex}
                                                            options={getFilteredOptions(rowIndex)}
                                                            value={selectedPart
                                                                ? { value: selectedPart.PARTNO, label: `${selectedPart.PARTNO}` }
                                                                : null
                                                            }
                                                            onChange={(option) => handlePartSelect(option, rowIndex)}
                                                            className='custom_select_plannerpage'
                                                            classNamePrefix='custom'
                                                        />
                                                    </td>
                                                    <td>{selectedPart ? selectedPart.MODEL : "-"}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleRemoveRow(rowIndex)}
                                                        >
                                                            <i className="bi bi-trash3-fill"></i>
                                                            {/* Delete */}
                                                        </button>
                                                    </td>
                                                    {/* <td>347</td> */}
                                                    <td>{getTotalPlannedQty(selectedPart)}</td>

                                                </tr>

                                                {/* Row for ISSUED_QTY in Static Table (Only if checkbox is checked) */}
                                                {showIssuedQty && (
                                                <tr className="issued-row" >
                                                    <td  className="text-muted text-center">
                                                        {/* Issued Qty:{" "} */}
                                                        {/* {dateRange.length > 0 ? (
                                                            dateRange.map((date) => (
                                                                <span key={date.toISOString()} className="issued_details">
                                                                     {planData[selectedPart?.PART_ID]?.[date.toISOString().split("T")[0]]?.issued || "-"}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span>No Date Available</span>
                                                        )} */}
                                                        {/* <br /> */}
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                    {getTotalIssuedQty(selectedPart)}

                                                    </td>
                                                </tr>
                                            )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Scrollable Table */}
                            <div style={{ overflowX: "auto", flexGrow: 1 }}>
                                <table className="table table-bordered shadow-sm scrollable-table">
                                    <thead>
                                        <tr>
                                            {dateRange.map((date, index) => (
                                                <th key={index}>{date.toLocaleDateString()}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedParts.map((selectedPart, rowIndex) => (
                                            <React.Fragment key={rowIndex}>
                                                {/* Row for PLNG_QTY */}
                                                <tr>
                                                    {dateRange.map((date) => (
                                                        <td key={date.toISOString()}>
                                                            <input
                                                                className='form-control'
                                                                type="number"
                                                                value={planData[selectedPart?.PART_ID]?.[date.toISOString().split("T")[0]]?.quantity || ""}
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        selectedPart?.PART_ID,
                                                                        date.toISOString().split("T")[0],
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    !selectedPart ||
                                                                    planData[selectedPart?.PART_ID]?.[date.toISOString().split("T")[0]]?.serialized
                                                                }
                                                                min="0"
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>

                                                {/* Row for ISSUED_QTY (Only if checkbox is checked) */}
                                                {showIssuedQty && (
                                                    <tr className="issued-row">
                                                        {dateRange.map((date) => (
                                                            <td key={date.toISOString()} className="issued_details">
                                                                {planData[selectedPart?.PART_ID]?.[date.toISOString().split("T")[0]]?.issued || "-"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="col-lg-4">
                    <button className="btn btn-primary" onClick={addNewRow}>
                        <MdAddCircle color='orange' size={20} className='mb-1' /> Add
                    </button>
                </div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                    <button className="btn btn-primary m-2" onClick={handleSave}>
                        <FaSave size={20} color="white" className="coffee-icon mb-1" /> Save

                    </button>
                    <button className="btn btn-primary" onClick={handleReset}>
                        <GrPowerReset size={20} color='orange' className="growpower-icon mb-1" /> Reset

                    </button>
                </div>
            </div>
            <PlannerPageUpdated/>
        </div>

    );
};

export default PlannerPageIssuedqty;

