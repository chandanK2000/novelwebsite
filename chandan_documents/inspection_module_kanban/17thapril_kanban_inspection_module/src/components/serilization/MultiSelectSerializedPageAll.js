import React, { useState, useEffect, useRef, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
// import './SerilizationPage.css';
import { MdDateRange } from "react-icons/md";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import './MultiSelectSerializedPageAll.css';

const MultiSelectSerializedPageAll = () => {

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [planningData, setPlanningData] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedParts, setSelectedParts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedPartDetails, setSelectedPartDetails] = useState([]);
    const [totalPlanningQuantity, setTotalPlanningQuantity] = useState(0);

    const [serialNumbers, setSerialNumbers] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [loading, setLoading] = useState(false);
    console.log("selected parts", selectedParts);
    const [showGenerateSerialButton, setShowGenerateSerialButton] = useState(false);
    const [showMessage, setShowMessage] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        let roleName = '';

        if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
            roleName = currentUser.roles[0].Role_Name;

            if (roleName === 'Admin') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        }
    }, []);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const calculateDateDifference = () => {
        if (startDate && endDate) {
            const timeDiff = endDate.getTime() - startDate.getTime();
            const dayDiff = timeDiff / (1000 * 3600 * 24);
            return Math.floor(dayDiff) + 1;
        }
        return 0;
    };


    const toastDisplayed = useRef(false);

   

    const fetchPlanningData = async () => {
        setLoading(true);

        try {
            // 🔹 Fetch all planning data without date filters
            const response = await fetch(`http://localhost:5000/get_all_planning_date`);
            const result = await response.json();

            console.log("Fetched All Planning Data:", result);

            if (result.data && result.data.length > 0) {
                const filteredData = result.data.map((part) => ({
                    ...part,
                    planData: part.planData || {}, // Ensure planData is always an object
                }));

                console.log("filterdata available sir ", filteredData);

                setPlanningData(filteredData);
                setShowGenerateSerialButton(true);
                setShowMessage(false);
                setSelectedParts([]);
                setSelectedPartDetails([]);
                setSelectAll(false);

                if (!toastDisplayed.current) {
                    toast.success("All planning data fetched successfully.");
                    toastDisplayed.current = true;
                }
            } else {
                setPlanningData([]);
                setMessage("No planning data available.");
                toast.error("No planning data available.");
                setSelectedParts([]);
                setSelectedPartDetails([]);
                setSelectAll(false);
            }
        } catch (error) {
            setPlanningData([]);
            setMessage("Error fetching planning data: " + error.message);
            toast.error("Error fetching planning data: " + error.message);
            setSelectedParts([]);
            setSelectedPartDetails([]);
            setSelectAll(false);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Fetch data on component mount
    useEffect(() => {
        fetchPlanningData();
    }, []); // Runs only once on mount



    useEffect(() => {
        // Only fetch data when both dates are selected
        if (startDate && endDate) {
            fetchPlanningData();
            setShowTable();
        }
    }, [startDate, endDate]);

    // const filterDataByDate = (planningData, startDate, endDate) => {
    //     if (!startDate || !endDate) return planningData; // Show all if no filter is applied

    //     return planningData.map((part) => {
    //         if (!part.planData) return part;

    //         const filteredPlanData = Object.keys(part.planData)
    //             .filter((date) => date >= startDate.toISOString().split("T")[0] && date <= endDate.toISOString().split("T")[0])
    //             .reduce((obj, key) => {
    //                 obj[key] = part.planData[key];
    //                 return obj;
    //             }, {});

    //         return { ...part, planData: filteredPlanData };
    //     }).filter((part) => Object.keys(part.planData).length > 0);
    // };
    // const filteredPlanningData = filterDataByDate(planningData, startDate, endDate);



    const calculateTotalPlanningQuantity = () => {
        let totalQuantity = 0;

        selectedParts.forEach(partId => {
            const part = planningData.find(part => part.PART_ID === partId);
            if (part && part.planData) {
                // Sum up all the quantities for this part's planData
                totalQuantity += Object.values(part.planData).reduce(
                    (sum, plan) => sum + (parseInt(plan.quantity) || 0),
                    0
                );
            }
        });

        return totalQuantity;
    };
    const handleCheckAllChange = () => {
        setSelectAll((prevSelectAll) => {
            const newSelectAll = !prevSelectAll;
            const newSelectedParts = newSelectAll ? planningData.map(part => part.PART_ID) : [];
            setSelectedParts(newSelectedParts);

            return newSelectAll;
        });
    };


    const handleCheckboxChange = (partId) => {
        setSelectedParts((prevSelectedParts) => {
            let newSelectedParts;
            if (prevSelectedParts.includes(partId)) {
                // If part is being deselected, remove it from the list
                newSelectedParts = prevSelectedParts.filter(id => id !== partId);
            } else {
                // If part is being selected, add it to the list
                newSelectedParts = [...prevSelectedParts, partId];
            }

            // Update selected part details
            setSelectedPartDetails(planningData.filter(part => newSelectedParts.includes(part.PART_ID)));

            // If there are no selected parts after deselecting one, uncheck the "Select All" checkbox
            if (newSelectedParts.length === 0) {
                setSelectAll(false);
            } else {
                // Check if all parts are selected. If so, set "Select All" to true.
                setSelectAll(newSelectedParts.length === planningData.length);
            }

            return newSelectedParts;
        });
    };


    // UseEffect to recalculate the total quantity whenever selectedParts changes
    useEffect(() => {
        const totalQuantity = calculateTotalPlanningQuantity();
        setTotalPlanningQuantity(totalQuantity);
    }, [selectedParts]); // Recalculate whenever selectedParts change

    const GenerateSerial = async () => {
        // if (selectedParts.length === 0 || !startDate || !endDate) {
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'Missing Information',
        //         text: 'Please select some parts and both start date and end date before generating serial numbers.',
        //     });
        //     return;
        // }

        // 🔴 **Prevent Serial Number Generation if Total Planning Quantity is 0**
        if (totalPlanningQuantity === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Planning Quantity',
                text: 'Serial numbers cannot be generated because the total planning quantity is zero.',
            });
            return;
        }



        // Manually adjust the start date and end date to ensure no time zone issues.
        const adjustedStartDate = new Date(startDate);
        adjustedStartDate.setHours(0, 0, 0, 0);  // Set to midnight of the selected start date

        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);  // Set to the end of the selected end date

        // Convert dates to yyyy-MM-dd format
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const formattedStartDate = formatDate(adjustedStartDate);
        const formattedEndDate = formatDate(adjustedEndDate);

        // SweetAlert confirmation before generating serial numbers
        const { value: confirmed } = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to generate serial numbers for the selected parts?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
            width: '350px',
            customClass: {
                title: 'custom-title',
                popup: 'custom-popup',
                confirmButton: 'custom-button-yes',
                cancelButton: 'custom-button-no',
            },
        });

        if (confirmed) {
            const requestData = {
                // startDate: formattedStartDate,
                // endDate: formattedEndDate,     
                partIds: selectedParts,
            };


            setIsLoading(true); // Start loading

            try {
                const response = await fetch('http://127.0.0.1:5000/generate_serial_numbers_list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("API Response:", data);

                    const newSerialNumbers = []; // To store the new serial numbers

                    data.serialNumbers.forEach(item => {
                        if (item.serialNumbers && item.serialNumbers.length > 0) {
                            item.serialNumbers.forEach(serial => {
                                newSerialNumbers.push(serial);
                            });
                        }
                    });

                    // Set the new serial numbers in state
                    setSerialNumbers(newSerialNumbers);

                    // After serial number generation, show the table
                    setShowTable(true);

                    // Additional data fetching and state updates as necessary
                    fetchPlanningData();
                    setTotalPlanningQuantity();
                    // setSelectedParts()

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Serial numbers generated and displayed successfully!',
                    });
                    // fetchPlanningData();
                    // window.location.reload();
                    setSearchQuery('');

                } else {
                    console.error("API Error:", response.statusText);
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed to Generate',
                        text: 'Failed to generate serial number.',
                    });
                }
            } catch (error) {
                console.error("Error generating serial number:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error generating serial number.',
                });
            } finally {
                setIsLoading(false); // Stop loading

            }

        }
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.trim());
    };

    const filteredPlanningData = useMemo(() => {
        return planningData.filter(part =>
            part.PARTNO.toLowerCase().includes(searchQuery.toLowerCase()) ||
            part.MODEL.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (part.DESTINATION && part.DESTINATION.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [planningData, searchQuery]);

    const getFilteredDates = (planningData, startDate, endDate) => {
        let allDates = new Set();

        planningData.forEach((part) => {
            if (part.planData) {
                Object.keys(part.planData).forEach((date) => {
                    // Include all dates if no filter is applied
                    if (!startDate && !endDate) {
                        allDates.add(date);
                    }
                    // Apply filter only if startDate and/or endDate is selected
                    else if ((!startDate || date >= startDate.toISOString().split("T")[0]) &&
                        (!endDate || date <= endDate.toISOString().split("T")[0])) {
                        allDates.add(date);
                    }
                });
            }
        });

        return Array.from(allDates).sort(); // Convert Set to array and sort
    };
    const filteredDates = getFilteredDates(planningData, startDate, endDate);

  useEffect(() => {
    // Get references to the table containers
    const staticTableContainer = document.querySelector('.custom_static_table_container');
    const scrollableTableContainer = document.querySelector('.custom_scrollable_table_container');

    if (scrollableTableContainer && staticTableContainer) {
      // Add scroll event listener to the scrollable table container
      const handleScroll = () => {
        staticTableContainer.scrollTop = scrollableTableContainer.scrollTop;
      };

      scrollableTableContainer.addEventListener('scroll', handleScroll);

      // Clean up the event listener when the component is unmounted
      return () => {
        scrollableTableContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []); // Empty dependency array ensures this runs only once after the initial render


    return (
        <div style={{ marginTop: '130px' }} className='container'>
            <h2 className='my-5 pagesHeading'> <i className="bi bi-list-ol"></i> Serialized Issue</h2>
            <div className='row'>
                <div className='col-lg-4'>
                    <label htmlFor="startDate" className="form-label"> <MdDateRange color='orange' className='mb-1' size={20} /> Start Date</label>
                    <div className='datepickers'>
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select start date"
                            className="form-control"
                            minDate={isAdmin ? null : new Date()}
                        />
                    </div>
                </div>

                <div className='col-lg-4'>
                    <label htmlFor="date-difference " className="form-label daydifference">Date Difference</label>
                    <div className="w-50 text-center form-control">
                        {startDate && endDate ? (
                            <span>{calculateDateDifference()} days</span>
                        ) : (
                            <span>0 days</span>
                        )}
                    </div>
                </div>

                <div className='col-lg-4'>
                    <label htmlFor="endDate" className="form-label"> <MdDateRange color='orange' className='mb-1' size={20} /> End Date</label>
                    <div className='datepickers'>
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select end date"
                            className="form-control"
                            minDate={startDate ? startDate : new Date()}
                            disabled={!startDate}
                        />
                    </div>
                </div>
                <div>
                    {showMessage && (
                        <p style={{ color: 'blue', textAlign: 'center', margin: '20px auto' }}>Please select both Start Date and End Date to fetch planning data.</p>
                    )}
                </div>

            </div>

            <div className='row m-2 my-3'>
                <div className='col-lg-4'>
                    {/* <div className="my-2">
                        {startDate && endDate && (
                            <button className="btn btn-primary" onClick={handleCheckAllChange}>
                                {selectAll ? 'Uncheck All' : 'Check All'}
                            </button>
                        )}
                    </div> */}
                    <div className='col-lg-4'>
                        <div className="my-2">
                            {/* Only render the button when planningData is available (not empty) */}
                            {planningData.length > 0 && (
                                <button className="btn btn-primary" onClick={handleCheckAllChange}>
                                    {selectAll || selectedParts.length === planningData.length ? 'Uncheck All' : 'Check All'}
                                </button>
                            )}
                        </div>
                    </div>


                </div>


                <div className='col-lg-4'>
                    {selectedParts.length > 0 && (  // Check if there are selected parts
                        <div>
                            <h5 className='text-primary'>
                                Total Planning Quantity: {totalPlanningQuantity}
                            </h5>
                        </div>
                    )}
                </div>


                <div className='col-lg-4'>
                    <div className="my-2 text-end">
                        {/* Show button only if planning data is fetched successfully */}
                        {/* {showGenerateSerialButton && (
                            <button className="btn btn-primary" onClick={GenerateSerial}>
                                Generate Serial Number
                            </button>
                        )} */}

                        {showGenerateSerialButton && (
                            <button
                                className="btn btn-primary"
                                onClick={GenerateSerial}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <button className="spinner-border spinner-border-sm" role="status"></button>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    "Generate Serial Number"
                                )}
                            </button>
                        )}

                    </div>
                </div>

            </div>

            <div className='row'>
                <div className="col-lg-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="search"
                            placeholder="Search by Part Number, Model, Destination..."
                            className="form-control"
                            autoFocus
                            value={searchQuery}
                            onChange={handleSearchChange} 
                            style={{ textAlign: "left" }}
                        />

                    </div>
                </div>
            </div>

            <div className="custom_scroll_container">
  {loading ? (
    <div className="custom_text_center custom_my_3">
      <span className="custom_spinner custom_text_primary"></span> Loading...
    </div>
  ) : (planningData.length === 0 && message.includes("No planning data available")) ||
    planningData.length > 0 ? (
    <div className="custom_row custom_my_3">
      <div className="custom_col_12">
        <div className="custom_table_wrapper">
          {/* Static Table - 40% Width */}
          <div className="custom_static_table_container">
            <table className="custom_table custom_table_bordered custom_shadow custom_static_table">
              <thead>
                <tr>
                  <th>Check</th>
                  <th>Part Number</th>
                  <th>Part Model</th>
                  <th>Part ID</th>
                </tr>
              </thead>
              <tbody>
                {planningData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="custom_text_center">
                      No match found
                    </td>
                  </tr>
                ) : (
                  planningData.map((part, rowIndex) => (
                    <tr key={rowIndex} className="custom_table_row">
                      <td className="custom_checkboxes">
                        <label className="custom_checkbox_label">
                          <input
                            type="checkbox"
                            checked={selectedParts.includes(part.PART_ID) || selectAll}
                            onChange={() => handleCheckboxChange(part.PART_ID)}
                          />
                          <span className="custom_checkbox"></span>
                        </label>
                      </td>
                      <td>{part.PARTNO}</td>
                      <td>{part.MODEL}</td>
                      <td>{part.PART_ID}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Scrollable Table - 60% Width */}
          <div className="custom_scrollable_table_container">
            <table className="custom_table custom_table_bordered custom_shadow custom_scrollable_table">
              <thead>
                <tr>
                  {filteredDates.length > 0 ? (
                    filteredDates.map((date, index) => (
                      <th key={index}>{new Date(date).toLocaleDateString()}</th>
                    ))
                  ) : (
                    <th>No data available</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {planningData.length === 0 ? (
                  <tr>
                    <td colSpan={filteredDates.length || 1} className="custom_text_center">
                      No match found
                    </td>
                  </tr>
                ) : (
                  planningData.map((part, rowIndex) => (
                    <tr key={`planned-${rowIndex}`} className="custom_table_row">
                      {filteredDates.map((date) => (
                        <td key={`planned-${rowIndex}-${date}`}>
                          <input
                            className="custom_form_control custom_align_input"
                            type="number"
                            value={part.planData?.[date]?.quantity || "0"}
                            min="0"
                            disabled
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : null}
</div>

            {showTable && (
                <div className="row my-3">
                    <h6 className='my-1  generatSerailnumbar'>Generated Serial Number Available :-{serialNumbers.length}</h6>

                    <div className="col-lg-12 scroll_table-container">
                        <table className="table table-bordered" id="serialTable">
                            <thead>
                                <tr>
                                    <th>Part Number</th>
                                    <th>Model</th>
                                    <th>PlngDate</th>
                                    <th>Serial Number</th>
                                </tr>
                            </thead>

                            <tbody>
                                {serialNumbers.length > 0 ? (
                                    serialNumbers.map((serial, index) => {
                                        const formattedDate = serial.plngDate
                                            ? new Date(serial.plngDate).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric", // Full 4-digit year
                                            })
                                            : "N/A";

                                        return (
                                            <tr key={index}>
                                                <td>{serial.partNo || "N/A"}</td>
                                                <td>{serial.model || "N/A"}</td>
                                                <td>{formattedDate}</td>
                                                <td>{serial.serialNumber || "N/A"}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4">No serial numbers generated yet.</td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            )}


        </div>
    );
};

export default MultiSelectSerializedPageAll;
