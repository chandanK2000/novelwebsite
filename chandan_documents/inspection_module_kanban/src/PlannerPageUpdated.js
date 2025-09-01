import React, { useEffect, useState, useMemo, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './PlannerPageUpdated.css';
import { toast } from "react-toastify";
import { FaRegPaperPlane } from "react-icons/fa6";
import { FaPencilAlt, FaSave } from 'react-icons/fa';
import { MdDateRange } from "react-icons/md";


const PlannerPageUpdated = () => {
  const [parts, setParts] = useState([]);
  const [startDate, setStartDate] = useState(new Date()); // Default: Today
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 6))); // Default: 7 days from today
  const [showIssuedQty, setShowIssuedQty] = useState(true);
  const [updatedPlans, setUpdatedPlans] = useState({}); // To store updated values
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search input
  const [inputValues, setInputValues] = useState({}); // Store input values dynamically
  const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

  const currentUser = useMemo(() => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }, []);

  if (currentUser) {
    console.log("Current User New:", currentUser);
    console.log("Current User Name:", currentUser.roles[0].Role_Name);

  }

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

  const fetchParts = async () => {
    try {
      setIsLoading(true);
      const roleName = currentUser?.roles[0]?.Role_Name; // Get role name dynamically
      if (!roleName) throw new Error("Role name not found");

      const response = await fetch(`http://127.0.0.1:5000/get_all_part_planing?role_name=${encodeURIComponent(roleName)}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      console.log("new fetch plan data here", data);
      setParts(data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }finally {
      setIsLoading(false); // Stop loading
    }
  };


  useEffect(() => {
    fetchParts();
  }, [])



  const generateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return [];

    const dateArray = [];
    let currentDate = new Date(startDate);
    let finalDate = new Date(endDate);

    // Increase endDate by 1 day to ensure inclusion
    finalDate.setDate(finalDate.getDate() + 1);

    while (currentDate < finalDate) {
      dateArray.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };


  const dateRange = generateDateRange(startDate, endDate);

  // console.log(dateRange);

  const getDateDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate difference in days (including both start and end date)
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;  // +1 to include end date

    return diffDays;
  };




  // const handlePlanChange = (partNo, date, value) => {
  //   // Allow empty input (so the user can delete it)
  //   if (value === '') {
  //     setInputValues((prev) => ({
  //       ...prev,
  //       [`${partNo}-${date}`]: '', // Keep it empty
  //     }));
  //     return;
  //   }

  //   let newValue = Number(value);

  //   // Prevent negative values
  //   if (newValue < 0) {
  //     newValue = 0;
  //   }

  //   // Update the input value
  //   setInputValues((prev) => ({
  //     ...prev,
  //     [`${partNo}-${date}`]: newValue,
  //   }));

  //   // Update the plan values
  //   setUpdatedPlans((prev) => ({
  //     ...prev,
  //     [partNo]: {
  //       ...prev[partNo],
  //       [date]: newValue,
  //     },
  //   }));
  // };


  const handlePlanChange = (partNo, date, value) => {
    // Allow empty input (so the user can delete it)
    if (value === '') {
      setInputValues((prev) => ({
        ...prev,
        [`${partNo}-${date}`]: '', // Keep it empty
      }));
  
      // Also update the updatedPlans state to reflect the empty value
      setUpdatedPlans((prev) => ({
        ...prev,
        [partNo]: {
          ...prev[partNo],
          [date]: '', // Set the value to empty in updatedPlans
        },
      }));
      return;
    }
  
    let newValue = Number(value);
  
    // Prevent negative values
    if (newValue < 0) {
      newValue = 0;
    }
  
    // Update the input value
    setInputValues((prev) => ({
      ...prev,
      [`${partNo}-${date}`]: newValue,
    }));
  
    // Update the plan values
    setUpdatedPlans((prev) => ({
      ...prev,
      [partNo]: {
        ...prev[partNo],
        [date]: newValue,
      },
    }));
  };


  const handleBlur = (partNo, date) => {
    const part = parts.find((p) => p.PARTNO === partNo);
    if (!part) return;

    const plngDetail =
      part.PLNGDETAILS?.find((detail) => detail.PLANDATE === date) || {};
    const issuedQty = plngDetail.ISSUEDQTY || 0;
    const plannedQty = updatedPlans[partNo]?.[date] || 0;

    // Validate if planned quantity is less than issued quantity
    if (plannedQty < issuedQty) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${partNo}-${date}`]: `PLNGQTY (${plannedQty}) cannot be less than ISSUEDQTY (${issuedQty})`,
      }));
    } else {
      // Clear error if validation passes
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[`${partNo}-${date}`];
        return newErrors;
      });
    }
  };


  // const SavePlanDetails = async () => {
  //   try {
  //     // Check if there are any errors
  //     if (Object.keys(errors).length > 0) {
  //       toast.success("Cannot save plan details. Some inputs have invalid values (PLNGQTY < ISSUEDQTY).");
  //       return; // Stop the save process
  //     }
  //     setIsEditing(true);


  //     // Prepare the edited plan details
  //     const editedPlanDetails = Object.entries(updatedPlans).map(([partNo, dates]) => {
  //       const part = parts.find(p => p.PARTNO === partNo);
  //       if (!part) return null; // Skip if part data not found
      
  //       const productionData = Object.entries(dates).map(([date, quantity]) => {
  //         // Format the date as MM/DD/YYYY
  //         const formattedDate = new Date(date);
  //         const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
  //         const day = String(formattedDate.getDate()).padStart(2, '0');
  //         const year = formattedDate.getFullYear();
      
  //         return {
  //           date: `${month}/${day}/${year}`,
  //           quantity: quantity === '' ? 0 : quantity, // Replace empty string with 0
  //         };
  //       });
      
  //       return {
  //         createdBy: currentUser.User_code,
  //         modifiedBy: currentUser.User_code,
  //         partId: part.PART_ID,
  //         partNumber: part.PARTNO || '',
  //         model: part.MODEL || '',
  //         pc: part.PC || '',
  //         productionData // Use 'productionData' key here
  //       };
  //     }).filter(item => item !== null); // Remove null values
  //     console.log("Edited Data being sent:", JSON.stringify(editedPlanDetails, null, 2));

  //     // Send the edited plan details to the backend
  //     const response = await fetch("http://127.0.0.1:5000/add_part_and_save_data", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(editedPlanDetails),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(`Server Error: ${errorData.message}`);
  //     }

  //     toast.success("Data updated successfully!");
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error updating plans:", error);
  //     toast.error(`Error updating plans: ${error.message}`);
  //   }
  // };


  const SavePlanDetails = async () => {
    try {
      // Track invalid cells
      const invalidCells = [];
  
      // Filter out invalid cells (where PLNGQTY < ISSUEDQTY)
      const validEditedPlanDetails = Object.entries(updatedPlans).map(([partNo, dates]) => {
        const part = parts.find(p => p.PARTNO === partNo);
        if (!part) return null; // Skip if part data not found
  
        const productionData = Object.entries(dates).map(([date, quantity]) => {
          const plngDetail = part.PLNGDETAILS?.find((detail) => detail.PLANDATE === date) || {};
          const issuedQty = plngDetail.ISSUEDQTY || 0;
          const plannedQty = quantity === '' ? 0 : quantity; // Replace empty string with 0
  
          // Skip this cell if PLNGQTY < ISSUEDQTY
          if (plannedQty < issuedQty) {
            invalidCells.push({ partNo, date, plannedQty, issuedQty });
            return null;
          }
  
          // Format the date as MM/DD/YYYY
          const formattedDate = new Date(date);
          const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
          const day = String(formattedDate.getDate()).padStart(2, '0');
          const year = formattedDate.getFullYear();
  
          return {
            date: `${month}/${day}/${year}`,
            quantity: plannedQty,
          };
        }).filter(item => item !== null); // Remove null values (invalid cells)
  
        // Skip this part if all its cells are invalid
        if (productionData.length === 0) {
          return null;
        }
  
        return {
          createdBy: currentUser.User_code,
          modifiedBy: currentUser.User_code,
          partId: part.PART_ID,
          partNumber: part.PARTNO || '',
          model: part.MODEL || '',
          pc: part.PC || '',
          productionData, // Use 'productionData' key here
        };
      }).filter(item => item !== null); // Remove null values (invalid parts)
  
      // If there are invalid cells, show a toast error with details
      if (invalidCells.length > 0) {
        const errorMessage = invalidCells
          .map(({ partNo, date, plannedQty, issuedQty }) => 
            `Part ${partNo} on ${date}: PLNGQTY (${plannedQty}) < ISSUEDQTY (${issuedQty})`
          )
          .join('\n');
  
        toast.error(`Some cells have invalid values:\n${errorMessage}`, {
          autoClose: 5000, // Keep the toast visible for 5 seconds
        });
  
        // Highlight invalid cells in the UI
        invalidCells.forEach(({ partNo, date }) => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [`${partNo}-${date}`]: `PLNGQTY cannot be less than ISSUEDQTY`,
          }));
        });
  
        return; // Stop the save process if there are invalid cells
      }
  
      console.log("Valid Edited Data being sent:", JSON.stringify(validEditedPlanDetails, null, 2));
  
      // Send only the valid edited plan details to the backend
      const response = await fetch("http://127.0.0.1:5000/add_part_and_save_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validEditedPlanDetails),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server Error: ${errorData.message}`);
      }
  
      toast.success("Data updated successfully!", {
        autoClose: 3000, // Keep the success toast visible for 3 seconds
      }
    );
    window.location.reload()

    } catch (error) {
      console.error("Error updating plans:", error);
      toast.error(`Error updating plans: ${error.message}`, {
        autoClose: 5000, // Keep the error toast visible for 5 seconds
      });
    }
  };



  const handleSaveClick = () => {
    if (isEditing) {
      // If already in edit mode, save data
      SavePlanDetails();
    }
    // Toggle edit mode
    setIsEditing(!isEditing);
  };

  // const [totals, setTotals] = useState([]);

  // Function to calculate totals (called inside useMemo)
  // const calculatedTotals = useMemo(() => {
  //     return parts.map(part => ({
  //         partNo: part.PARTNO,
  //         model: part.MODEL,
  //         destination: part.DESTINATION || "N/A",
  //         planQtyTotal: part.PLNGDETAILS?.reduce((sum, detail) =>
  //             (detail.PLANDATE && dateRange.includes(detail.PLANDATE) ? sum + (detail.PLNGQTY || 0) : sum), 0),
  //         issuedQtyTotal: part.PLNGDETAILS?.reduce((sum, detail) =>
  //             (detail.PLANDATE && dateRange.includes(detail.PLANDATE) ? sum + (detail.ISSUEDQTY || 0) : sum), 0),
  //     }));
  // }, [parts, dateRange]); // Only recalculate when dependencies change



  const filteredParts = useMemo(() => {
    return parts.filter(part =>
      part.PARTNO.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.MODEL.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [parts, searchQuery]); // Recalculate only when parts or searchQuery changes

  const calculatedTotals = useMemo(() => {
    return filteredParts.map(part => ({
      partNo: part.PARTNO,
      model: part.MODEL,
      destination: part.DESTINATION || "N/A",
      planQtyTotal: part.PLNGDETAILS?.reduce((sum, detail) =>
        (detail.PLANDATE && dateRange.includes(detail.PLANDATE) ? sum + (detail.PLNGQTY || 0) : sum), 0),
      issuedQtyTotal: part.PLNGDETAILS?.reduce((sum, detail) =>
        (detail.PLANDATE && dateRange.includes(detail.PLANDATE) ? sum + (detail.ISSUEDQTY || 0) : sum), 0),
    }));
  }, [filteredParts, dateRange]); // Recalculate only when filtered data or dateRange changes

  const firstTableRef = useRef(null);
  const secondTableRef = useRef(null);

  // Synchronize vertical scrolling
  const syncScroll = (e) => {
    if (firstTableRef.current && secondTableRef.current) {
      firstTableRef.current.scrollTop = e.target.scrollTop;
      secondTableRef.current.scrollTop = e.target.scrollTop;
    }
  };


  return (
    <div className="container planner_page">

      <div className="row">
        <div className="col-12 text-center">
          <h3 className="pagesHeading"><FaRegPaperPlane color='gray' className='mb-1' size={25} /> Production Plan</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <label className="mb-1"><MdDateRange color='orange' className='mb-1' size={20} /> Start Date</label>
          <div>
            <DatePicker 
            selected={startDate}
             onChange={setStartDate} 
            className="form-control" 
            dateFormat="yyyy-MM-dd"
            minDate={isAdmin ? null : new Date()}  // Admin can select any date, others can only select from today onwards

            />

          </div>
        </div>

        <div className="col-lg-4 ">
          <label>Day Difference:</label>
          <div className="border p-2 w-50 text-center">
            <div style={{ border: '1 solid red' }}> {getDateDifference(startDate, endDate)} Days</div>

          </div>
        </div>
        <div className="col-lg-4">
          <label className="mb-1"> <MdDateRange color='orange' className='mb-1' size={20} /> End Date</label>
          <div>
            <DatePicker 
            selected={endDate} 
            onChange={setEndDate} 
            className="form-control" 
            dateFormat="yyyy-MM-dd" 
            minDate={startDate ? startDate : new Date()} // Ensure end date is after start date
            disabled={!startDate} // Disable end date picker until start date is selected
            />

          </div>
        </div>
      </div>
      <div className="row my-3">
        {/* <div className="col-lg-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bi bi-search"></i> 
                        </span>
                        <input
                            type="search"
                            placeholder="Search by Part Number, Model, Destination..."
                            className="form-control"
                            autoFocus
                            style={{ textAlign: "left" }}
                        />
                    </div>
                </div> */}
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
              style={{ textAlign: "left" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.trim())} // Update searchQuery state
            />
          </div>
        </div>

        <div className="col-lg-8 text-end">
          <button onClick={handleSaveClick} className="btn btn-primary">
            {isEditing ? (
              <>
                <FaSave /> Save Updates
              </>
            ) : (
              <>
                <FaPencilAlt /> Edit Plan
              </>
            )}
          </button>
        </div>
      </div>


      <div className="row my-3">
        {/* Checkbox to toggle Issued Qty view */}
        <div className="my-3 viewissuedqty">
          <input
            type="checkbox"
            id="viewIssuedQty"
            checked={showIssuedQty}
            onChange={() => setShowIssuedQty(!showIssuedQty)}
            className=""
            style={{ height: '20px', width: '20px' }}
          />
          <label htmlFor="viewIssuedQty" className="ms-2">
            View Issued Qty
          </label>
        </div >


       {
        isLoading ?(
          <div className="loading-container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        
        ):(
          <div className="plannerpage_containers">
          
          {/* First Table */}
          <div className="col-lg-7 first-table  first-table scroll-sync" ref={firstTableRef} onScroll={syncScroll}>
            <div className="table-container scroll-vertical">
              <table className="table table-bordered table-striped">
                <thead className="fixed-header">
                  <tr>
                    <th>Part No</th>
                    <th>Model</th>
                    <th>Destination</th>
                    <th style={{ width: "50px" }}>Sum</th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedTotals.length > 0 ? (
                    calculatedTotals.map((part, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td className="partnumber">
                            <span className="truncate-text" data-fulltext={part.partNo} title={part.partNo}>
                              {part.partNo}
                            </span>
                          </td>
                          <td>
                            <span className="truncate-text" data-fulltext={part.model} title={part.model}>
                              {part.model}
                            </span>
                          </td>
                          <td>
                            <span className="truncate-text" data-fulltext={part.destination} title={part.destination}>
                              {part.destination}
                            </span>
                          </td>
                          <td className="text-center text-muted">{part.planQtyTotal || 0}</td>
                        </tr>
                        {showIssuedQty && (
                          <tr className="issued-qty-row">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="text-center text-muted">{part.issuedQtyTotal || 0}</td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">No match found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Second Table */}
          <div className="col-lg-5 second-table second-table scroll-sync" ref={secondTableRef} onScroll={syncScroll}>
            <div className="table-container scroll-horizontal">
              <table className="table table-bordered table-striped">
                <thead className="fixed-header">
                  <tr>
                    {dateRange.map((date, index) => (
                      <th key={index} style={{ width: "100px" }}>{date}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredParts.length > 0 ? (
                    filteredParts.map((part, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          {dateRange.map((date, dateIndex) => {
                            const plngDetail = part.PLNGDETAILS?.find(
                              (detail) => detail.PLANDATE === date
                            ) || {};
                            const errorKey = `${part.PARTNO}-${date}`;
                            const hasError = errors[errorKey];

                            return (
                              <td key={dateIndex}>
                                <input
                                  type="number"
                                  className={`no-spinner ${hasError ? 'error-border' : ''}`}
                                  min={0}
                                  value={inputValues[`${part.PARTNO}-${date}`] ?? (plngDetail.PLNGQTY || '')}
                                  onChange={(e) => handlePlanChange(part.PARTNO, date, e.target.value)}
                                  onBlur={() => handleBlur(part.PARTNO, date)}
                                  disabled={!isEditing}
                                />
                              </td>
                            );
                          })}
                        </tr>
                        {showIssuedQty && (
                          <tr className="issued-qty-row">
                            {dateRange.map((date, dateIndex) => {
                              const issuedDetail = part.PLNGDETAILS?.find(
                                (detail) => detail.PLANDATE === date
                              ) || {};
                              return (
                                <td key={dateIndex} className="text-center text-muted">
                                  {issuedDetail.ISSUEDQTY != null ? issuedDetail.ISSUEDQTY : "-"}
                                </td>
                              );
                            })}
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={dateRange.length} className="text-center">No match found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )
       }


      </div>


    </div>
  );
};

export default PlannerPageUpdated;
