import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import './PlannerPage.css';
import { toast } from 'react-toastify';
import PlannerPageDetails from './PlannerPageDetails';
// import './PlannerPageDetails.css'

const PlannerPage = () => {
    const today = new Date();
    const defaultStartDate = today;
    const defaultEndDate = new Date(today);
    defaultEndDate.setDate(today.getDate() + 8); 

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedParts, setSelectedParts] = useState([ // Initialize with one row
        { partNumber: "", model: "", pc: 0, production: [] }
    ]);
    const [parts, setParts] = useState([]);
    const [partPlanningData, setPartPlanningData] = useState({});

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/parts_list');
                const data = await response.json();
                const partsList = data.map(item => ({
                    id: item.PART_ID,
                    partNumber: item.PARTNO,
                    model: item.MODEL,
                    pc: item.PC,
                }));
                setParts(partsList);
            } catch (error) {
                console.error('Error fetching parts:', error);
            }
        };

        fetchParts();
    }, []);
    const fetchPartPlanningData = async (partId, rowIndex) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_part_planing/${partId}`);
            const data = await response.json();
    
            if (data.error || !data.length) {
                // Handle the case where no data is found in the DB
                toast.info("No data found in the database. You can create new plans.");
    
                // Create the full date range from startDate to endDate with empty values
                const fullDateRange = [];
                let currentDate = new Date(startDate);
                const end = new Date(endDate);
    
                while (currentDate <= end) {
                    const dateStr = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
                    fullDateRange.push({
                        date: dateStr,
                        value: "", // Empty value for user input
                    });
                    currentDate.setDate(currentDate.getDate() + 1); // Increment day
                }
    
                // Update the state with empty fields for user input
                setSelectedParts(prevParts => {
                    const updatedParts = [...prevParts];
                    updatedParts[rowIndex].production = fullDateRange.map(item => item.value); // Keep empty values
                    return updatedParts;
                });
    
                // Optional: Keep the raw mapped data in the state if needed
                setPartPlanningData(prevState => ({
                    ...prevState,
                    [partId]: fullDateRange,
                }));
            } else {
                // Convert backend data to a date-value map
                const dataMap = new Map(
                    data.map(item => [new Date(item.PLNG_DATE).toISOString().split("T")[0], item.PLNG_QTY || 0])
                );
    
                // Create the full date range from startDate to endDate
                const fullDateRange = [];
                let currentDate = new Date(startDate);
                const end = new Date(endDate);
    
                while (currentDate <= end) {
                    const dateStr = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
                    fullDateRange.push({
                        date: dateStr,
                        value: dataMap.get(dateStr) || 0, // Use backend data or default to 0
                    });
                    currentDate.setDate(currentDate.getDate() + 1); // Increment day
                }
    
                // Update the state with the generated data
                setSelectedParts(prevParts => {
                    const updatedParts = [...prevParts];
                    updatedParts[rowIndex].production = fullDateRange.map(item => item.value); // Only keep the values
                    return updatedParts;
                });
    
                // Optional: Keep the raw mapped data in the state if needed
                setPartPlanningData(prevState => ({
                    ...prevState,
                    [partId]: fullDateRange,
                }));
            }
        } catch (error) {
            console.error('Error fetching part planning data:', error);
            toast.error("Error fetching part planning data.");
        }
    };
    
    
    

    const handlePartChange = (selectedOption, rowIndex) => {
        if (!selectedOption) {
            setSelectedParts(prevParts => {
                const updatedParts = [...prevParts];
                updatedParts[rowIndex] = { partNumber: "", model: "", pc: 0, production: [] }; // Reset row
                return updatedParts;
            });
        } else {
            const part = parts.find(p => p.partNumber === selectedOption.value);

            if (part) {
                setSelectedParts(prevParts => {
                    const updatedParts = [...prevParts];
                    updatedParts[rowIndex] = { ...part, production: [] }; // Update row with selected part
                    return updatedParts;
                });

                // Fetch part planning data for the selected part
                fetchPartPlanningData(part.id, rowIndex);
            }
        }
    };

    const handleProductionInput = (rowIndex, dayIndex, value) => {
        const numericValue = value === "" ? 0 : Number(value);

        setSelectedParts(prevParts => {
            const updatedParts = [...prevParts];
            const updatedProduction = [...updatedParts[rowIndex].production];
            updatedProduction[dayIndex] = numericValue;
            updatedParts[rowIndex].production = updatedProduction;
            return updatedParts;
        });
    };

    const calculateDaysDifference = (start, end) => {
        if (!start || !end) return 0;
        if (start.getTime() === end.getTime()) {
            return 1; // Same day, 1 day difference
        }
        const timeDiff = end.getTime() - start.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Calculate days difference
    };

    const daysDifference = calculateDaysDifference(startDate, endDate);

    const getDateStrings = () => {
        let dates = [];
        if (startDate && endDate) {
            const diff = calculateDaysDifference(startDate, endDate);
            for (let i = 0; i <= diff; i++) {
                let newDate = new Date(startDate);
                newDate.setDate(newDate.getDate() + i);
                dates.push(newDate.toLocaleDateString());
            }
        }
        return dates;
    };

    const dateStrings = getDateStrings();

    const getAvailableParts = () => {
        const selectedPartNumbers = selectedParts.map(part => part.partNumber);
        return parts.filter(part => !selectedPartNumbers.includes(part.partNumber));
    };

    const currentUser = JSON.parse(localStorage.getItem('userData'));
    const collectPartsData = () => {
        const dataToSend = selectedParts.map((part, rowIndex) => {
            const productionData = dateStrings.map((date, dayIndex) => ({
                date: date,
                quantity: part.production[dayIndex] || 0,  // Default to 0 if no quantity is entered
            }));

            return {
                partId: part.id,
                partNumber: part.partNumber,
                model: part.model,
                pc: part.pc,
                productionData: productionData,
                createdBy: currentUser.User_First_name,
                modifiedBy: currentUser.User_First_name,
            };
        });

        console.log("Collected Parts Data:", dataToSend);

        fetch('http://127.0.0.1:5000/add_part_and_save_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                if (data.error.includes('already exists')) {
                    toast(`Error: ${data.error}`, { type: 'error' });
                }
            } else {
                // window.location.reload();
                toast("Data saved successfully!");
            }
        })
        .catch(error => {
            console.error('Error saving data:', error);
            toast("Error: Could not save the data. Please try again.", { type: 'error' });
        });
    };

    const handleReset = () => {
        setStartDate(defaultStartDate);
        setEndDate(defaultEndDate);
        setErrorMessage("");
        setSelectedParts([{ partNumber: "", model: "", pc: 0, production: [] }]);
    };

    const partOptions = parts.map(part => ({
        value: part.partNumber,
        label: `${part.partNumber} - ${part.model}`,
    }));

    const handleAddRow = () => {
        setSelectedParts(prevParts => [
            ...prevParts,
            { partNumber: "", model: "", pc: 0, production: [] } // Add a new row with empty values
        ]);
    };

    return (
        <div className="planner-page">
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 text-center">
                    <h3 className="pagesHeading"><i className="bi bi-airplane-engines-fill"></i> Planner Page</h3>
                </div>
            </div>
    
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card mb-3">
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="start-date">Start Date</label>
                                <div>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control"
                                        placeholderText="Pick a start date"
                                        minDate={today}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div className="col-md-4">
                    <div className="selected-difference-card">
                        <h5>Selected Days:</h5>
                        <p>{daysDifference} days</p>
                    </div>
                </div>
    
                <div className="col-md-4">
                    <div className="card mb-3">
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="end-date">End Date</label>
                                <div>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control"
                                        placeholderText="Pick an end date"
                                        minDate={startDate ? startDate : today}
                                        disabled={!startDate}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {errorMessage && (
                <div className="alert alert-danger mt-3">
                    {errorMessage}
                </div>
            )}
    
            <div className="table-container">
                <div className="static-table">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className="partnumber">Part Number</th>
                                <th>Model</th>
                                <th>PC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedParts.map((part, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td>
                                        <Select
                                            options={getAvailableParts().map(part => ({
                                                value: part.partNumber,
                                                label: `${part.partNumber}`,
                                            }))}
                                            value={part.partNumber ? {
                                                value: part.partNumber,
                                                label: `${part.partNumber}`
                                            } : null}
                                            onChange={(selectedOption) => handlePartChange(selectedOption, rowIndex)}
                                        />
                                    </td>
                                    <td>{part.model}</td>
                                    <td>{part.pc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
    
                <div className="scrollable-table">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {dateStrings.map((date, index) => (
                                    <th key={index}>{date}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedParts.map((part, rowIndex) => (
                                <tr key={rowIndex}>
                                    {part.production.map((prod, dayIndex) => (
                                        <td key={dayIndex}>
                                            <input
                                                type="number"
                                                value={prod}
                                                onChange={(e) => handleProductionInput(rowIndex, dayIndex, e.target.value)}
                                                className="form-control"
                                                min="0"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
    
            <div className="row">
                <div className="col-lg-4">
                    <div className="form-group text-start mt-4">
                        <button
                            className="btn btn-primary"
                            onClick={handleAddRow}
                        >
                            Add Row
                        </button>
                    </div>
                </div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                    <div className="form-group text-end mt-4">
                        <button
                            className="btn btn-primary mx-2"
                            onClick={collectPartsData}
                        >
                            Save Data
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
         <PlannerPageDetails />
    </div>
    
    );
};

export default PlannerPage;

