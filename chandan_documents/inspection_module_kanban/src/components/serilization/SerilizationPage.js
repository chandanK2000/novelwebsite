// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
// import './SerilizationPage.css';
// import { toast } from 'react-toastify';
// import { MdDateRange } from "react-icons/md";
// import Swal from 'sweetalert2';
// import Multiselect from './Multiselect';

// const SerilizationPage = () => {
//   const [parts, setParts] = useState([]);
//   const [selectedPart, setSelectedPart] = useState(null);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [serialNumbers, setSerialNumbers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [planningData, setPlanningData] = useState([]);
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const [serialdetails, setSerialdetails] = useState([]);

//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const currentUsers = JSON.parse(localStorage.getItem('userData'));
//     // console.log('Current User:', currentUsers);  // Check the current user data to see if role_name is Admin
//     if (currentUsers && currentUsers.role_name === "Admin") {
//       setIsAdmin(true);
//     } else {
//       setIsAdmin(false);
//     }
//   }, []);

//   // Fetch parts list from the API
//   useEffect(() => {
//     const fetchParts = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:5000/parts_active_list');
//         const data = await response.json();

//         if (Array.isArray(data)) {
//           setParts(data); // Set the parts only if it's an array
//         } else {
//           console.error("Invalid data format received:", data);
//           setParts([]); // Fallback to empty array if data is not an array
//         }
//       } catch (error) {
//         console.error('Error fetching parts:', error);
//         setMessage("Error fetching parts, please try again later.");
//         setParts([]); // Ensure parts remains an array even on failure
//       }
//     };

//     fetchParts();
//   }, []);


//   // Define the formatDate function inside the component
//   const formatDate = (date) => {
//     if (!date) return null;
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Two digits for month
//     const day = date.getDate().toString().padStart(2, '0'); // Two digits for day
//     return `${year}-${month}-${day}`;
//   }

//   const handlePartSelect = async (selectedOption) => {
//     if (selectedOption) {
//       const selected = parts.find((part) => part.PARTNO === selectedOption.value);
//       setSelectedPart(selected);
//       setMessage("");

//       // Fetch planning data based on the selected part ID
//       await fetchPlanningData(selected.PART_ID);
//     } else {
//       setSelectedPart(null);
//       setPlanningData([]);  // Reset planning data to an empty array, not null
//     }
//   };

//   const currentUser = JSON.parse(localStorage.getItem('userData'));


//   // Fetch planning data based on the selected part ID
//   const fetchPlanningData = async (partId) => {
//     if (!partId) return;

//     try {
//       const roleName = currentUser.role_name; // Get the role name from currentUser

//       const response = await fetch(`http://127.0.0.1:5000/get_part_planing/${partId}?role_name=${roleName}`);
//       const data = await response.json();
//       // console.log("get part planning date", data);
//       setPlanningData(data); // Store the planning data in state
//     } catch (error) {
//       console.error('Error fetching planning data:', error);
//       setMessage("Error fetching planning data, please try again later.");
//     }
//   };
//   const partOptions = Array.isArray(parts) ? parts.map((part) => ({
//     value: part.PARTNO,
//     label: `${part.PARTNO}`,
//   })) : [];


//   // Calculate the difference between start date and end date in days
//   const calculateDateDifference = (start, end) => {
//     if (start && end) {
//       const timeDiff = end.getTime() - start.getTime();
//       const dayDiff = timeDiff / (1000 * 3600 * 24);
//       return Math.floor(dayDiff) + 1; // Include both start and end dates in the difference
//     }
//     return 0;
//   };





//   const SerilizedNumber = async () => {
//     // Display the confirmation prompt using SweetAlert2
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: "Do you want to serialize this part number?",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes',
//       cancelButtonText: 'No',
//       customClass: {
//         popup: 'small-popup',
//         title: 'small-title',
//         content: 'small-content',
//         confirmButton: 'small-button',
//         cancelButton: 'small-button',
//       },
//     });


//     // If user confirmed, proceed with serialization
//     if (result.isConfirmed) {
//       if (!selectedPart) {
//         alert('Please select a part.');
//         return;
//       }

//       if (!startDate || !endDate) {
//         toast('Please select both start and end dates for Serialized the Number.');
//         return;
//       }

//       const formatDate = (date) => {
//         if (!date) return null;
//         const year = date.getFullYear();
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const day = date.getDate().toString().padStart(2, '0');
//         return `${year}-${month}-${day}`;
//       };

//       const formattedStartDate = formatDate(startDate);
//       const formattedEndDate = formatDate(endDate);

//       console.time('filterData');

//       const filteredPlanningDetails = planningData
//         .filter((plan) => {
//           const plngDate = formatDate(new Date(plan.PLNG_DATE));
//           return (
//             plngDate >= formattedStartDate &&
//             plngDate <= formattedEndDate &&
//             (currentUser.role_name === 'Admin' ? plan.SERIALIZE_FLG === 'N' : currentUser.role_name === 'Serilization' ? plan.SERIALIZE_FLG !== 'Y' : true)
//           );
//         })
//         .map((plan) => ({
//           plngDate: plan.PLNG_DATE,
//           plngQty: parseInt(plan.PLNG_QTY, 10),
//         }));

//       if (filteredPlanningDetails.length === 0) {
//         toast('Serial Number already generated for the selected date range.');
//         return;
//       }
//       console.timeEnd('filterData');

//       const payload = {
//         partId: selectedPart.PART_ID,
//         partNo: selectedPart.PARTNO,
//         model: selectedPart.MODEL,
//         plngMonth: "202512", // Hardcoded value
//         startDate: formattedStartDate,
//         endDate: formattedEndDate,
//         planningDetails: filteredPlanningDetails,
//       };

//       setLoading(true);

//       try {
//         const startTime = performance.now(); // Start time

//         const response = await fetch('http://127.0.0.1:5000/generate_serial_numbers_list', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         });

//         const endTime = performance.now(); // End time
//         const responseTime = endTime - startTime; // Calculate response time
//         console.log(`API Response Time: ${responseTime.toFixed(2)} ms`);

//         const data = await response.json();
//         console.log("serial data", data);

//         if (data && data.serialNumbers) {
//           setSerialdetails(data.serialNumbers);
//           console.log("Serial details updated:", data.serialNumbers);
//           fetchPlanningData(selectedPart.PART_ID);

//         }

//         if (data && data.message === "Serial numbers generated and inserted successfully.") {
//           toast('Serialized numbers generated successfully!');

//         } else if (data && data.error === "Serial numbers already exist") {
//           toast('Serial Number Already generated for this part number with the selected date.');
//         } else {
//           toast('Planning Quantity is 0. Cannot Generate Serial Numbers!');
//         }
//       } catch (error) {
//         console.error('Error generating serialized numbers:', error);
//         toast('An error occurred while generating serialized numbers.');
//       } finally {
//         setLoading(false);
//       }

//     };





//   }


//   // Button JSX
//   <td className='text-center'>
//     <button
//       className='btn btn-primary'
//       disabled={!selectedPart || loading}
//       onClick={SerilizedNumber}
//     >
//       {loading ? 'Generating...' : 'Serialize'}
//     </button>
//   </td>



//   useEffect(() => {
//     if (startDate && endDate && Array.isArray(planningData) && planningData.length > 0) {
//       const formattedStartDate = formatDate(startDate);
//       const formattedEndDate = formatDate(endDate);

//       // Filter planning data based on the selected date range and SERIALIZE_FLG
//       const filteredPlanningDetails = planningData
//         .filter(plan => {
//           const plngDate = formatDate(new Date(plan.PLNG_DATE)); // Format planning date
//           return (
//             plngDate >= formattedStartDate &&
//             plngDate <= formattedEndDate &&
//             plan.SERIALIZE_FLG === "N" // Exclude serialized entries
//           );
//         })
//         .map(plan => ({
//           plngDate: plan.PLNG_DATE, // Planning Date
//           plngQty: parseInt(plan.PLNG_QTY, 10), // Convert PLNG_QTY to a number
//         }));

//       // Calculate the total quantity sum from the filtered planning data
//       const totalQuantity = filteredPlanningDetails.reduce((acc, plan) => acc + plan.plngQty, 0);
//       setTotalQuantity(totalQuantity);

//       // console.log('Filtered Planning Details:', filteredPlanningDetails);
//       // console.log('Total Quantity:', totalQuantity);
//     }
//   }, [startDate, endDate, planningData]);

//   return (
//     <div style={{ marginTop: '80px' }} className='container'>
//       <h2 className='my-5 pagesHeading'> <i className="bi bi-list-ol"></i> Serialized Issue</h2>
//       <div className='row'>
//         {/* Start Date Picker */}
//         <div className='col-lg-4'>
//           <label htmlFor="startDate" className="form-label"> <MdDateRange color='orange' className='mb-1' size={20} /> Start Date</label>
//           <div className='datepickers'>
//             <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date)}
//               dateFormat="yyyy-MM-dd"
//               placeholderText="Select start date"
//               className="form-control"
//               // minDate={new Date()} // Disable past dates for start date
//               minDate={isAdmin ? null : new Date()}  // Admin can select any date, others can only select from today onwards

//             />
//           </div>
//         </div>

//         {/* Date Difference Section */}
//         <div className='col-lg-4'>
//           <label htmlFor="date-difference" className="form-label">Date Difference</label>
//           <div className="form-control">
//             {startDate && endDate ? (
//               <p>{calculateDateDifference(startDate, endDate)} days</p>
//             ) : (
//               <p>0 days</p>
//             )}
//           </div>
//         </div>

//         {/* End Date Picker */}
//         <div className='col-lg-4'>
//           <label htmlFor="endDate" className="form-label"> <MdDateRange color='orange' className='mb-1' size={20} /> End Date</label>
//           <div className='datepickers'>
//             <DatePicker
//               selected={endDate}
//               onChange={(date) => setEndDate(date)}
//               dateFormat="yyyy-MM-dd"
//               placeholderText="Select end date"
//               className="form-control datepickers"
//               minDate={startDate ? startDate : new Date()} // Ensure end date is after start date
//               disabled={!startDate} // Disable end date picker until start date is selected
//             />
//           </div>
//         </div>
//       </div>

//       <div className='row'>
//         <div className='col-lg-12'>
//           {/* Table for parts selection and action */}
//           <table className='table table-bordered shadow-sm'>
//             <thead>
//               <tr>
//                 <th>Part Number</th>
//                 <th>Part Model</th>
//                 <th>Sum of Quantity</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>
//                   <Select
//                     id="part-select"
//                     options={partOptions}
//                     onChange={handlePartSelect}
//                     value={selectedPart ? { value: selectedPart.PARTNO, label: `${selectedPart.PARTNO}` } : null}
//                     placeholder="Search by part Number or Model......."
//                     isClearable
//                     noOptionsMessage={() => 'No parts found'}
//                   />
//                 </td>
//                 <td>{selectedPart ? selectedPart.MODEL : 'N/A'}</td>
//                 {/* <td>{selectedPart ? selectedPart.PC : 'N/A'}</td> */}
//                 <td className='text-center'>{totalQuantity}</td>
//                 <td className='text-center'>
//                   <button
//                     className='btn btn-primary'
//                     disabled={!selectedPart || loading}
//                     onClick={SerilizedNumber}
//                   >
//                     {loading ? 'Generating...' : 'Serialize'}
//                   </button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>

//           {/* Displaying messages */}
//           {message && <div className="alert alert-info">{message}</div>}

//           {/* Displaying serialized numbers */}
//           {serialNumbers && serialNumbers.length > 0 && (
//             <div className="serialized-numbers">
//               <h4>Generated Serialized Numbers:</h4>
//               <ul>
//                 {serialNumbers.map((serial, index) => (
//                   <li key={index}>{serial}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <div className="row my-3">
//             <div className="col-lg-12">
//               {/* Default message or fetched data */}
//               {!selectedPart ? (
//                 <div className="">Please select the part number to get the planning data.</div>
//               ) : planningData && Array.isArray(planningData) && planningData.length > 0 ? (
//                 <div className="planning-table">
//                   <h4 className='text-warning'>Planning Data</h4>
//                   <div className="table-container">
//                     <table className="table table-bordered  shadow-sm">
//                       <tbody>
//                         {/* First Row: Display all the Planning Dates */}
//                         <tr key="dates-row">
//                           {planningData.map((plan, index) => (
//                             <td key={index}>{plan.PLNG_DATE}</td>
//                           ))}
//                         </tr>

//                         {/* Second Row: Display all the Quantities */}
//                         {/* <tr key="qty-row">
//                           {planningData.map((plan, index) => (
//                             <td
//                               key={index}
//                               style={{ backgroundColor: plan.SERIALIZE_FLG === 'Y' ? 'gray' : 'transparent' }}
//                             >
//                               {plan.PLNG_QTY}
//                             </td>
//                           ))}
//                         </tr> */}

//                         <tr key="qty-row">
//                           {planningData.map((plan, index) => {
//                             // Convert PLNG_DATE from the plan to a Date object
//                             const planDate = new Date(plan.PLNG_DATE);
//                             const currentDate = new Date();
//                             const isToday = planDate.toDateString() === currentDate.toDateString();
//                             const isPastDate = planDate < currentDate;
//                             const isFutureDate = planDate > currentDate;
//                             const isSerialized = plan.SERIALIZE_FLG === 'Y';

//                             // Define background color based on conditions
//                             let backgroundColor = 'transparent';  // Default background

//                             if (isSerialized && isPastDate) {
//                               // Serialized and Past Date
//                               backgroundColor = 'lightcoral'; // Light gray for past serialized entries
//                             } else if (isSerialized && (isToday || isFutureDate)) {
//                               // Serialized and Present/Future Date
//                               backgroundColor = 'gray'; // Gray for serialized entries for today or future dates
//                             } else if (!isSerialized && isPastDate) {
//                               // Non-Serialized and Past Date
//                               backgroundColor = 'lightyellow'; // Light yellow for non-serialized past dates
//                             } else if (!isSerialized && (isToday || isFutureDate)) {
//                               // Non-Serialized and Present/Future Date
//                               backgroundColor = ''; // Light green for non-serialized future/today dates
//                             }

//                             return (
//                               <td
//                                 key={index}
//                                 style={{ backgroundColor }}
//                               >
//                                 {plan.PLNG_QTY}
//                               </td>
//                             );
//                           })}
//                         </tr>

//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="">Sorry, no planning data found.</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>


//       <div className='row'>


//       <div className='col-lg-12'>
//         {loading ? (
//           // Show loading spinner until data is loaded
//           <div className='text-center'>
//             <div className='spinner-border text-primary' role='status'>
//               <span className='sr-only'>Loading...</span>
//             </div>
//           </div>
//         ) : serialdetails.length > 0 ? (
//           <div style={{ maxHeight: '300px', overflowY: 'auto', width: '70%', margin: '0 auto' }}>
//              <h5 className='my-2 text-primary text-center'>
//         Serialization details <span className='text-success'>({serialdetails.length})</span>
//       </h5>
//             <table className='table table-bordered' style={{ width: '100%', textAlign: 'center' }}>
//               <thead>
//                 <tr>
//                   <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Part No</th>
//                   <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Model</th>
//                   <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Planned Date</th>
//                   <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Serial Number</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {serialdetails.map((item, index) => (
//                   <tr key={index}>
//                     <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.partNo}</td>
//                     <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.model}</td>
//                     <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.plngDate}</td>
//                     <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.serialNumber}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className='text-center my-2'>....</p>
//         )}
//       </div>
//     </div>


// <Multiselect/>

//     </div>
//   );
// };


//  <tbody>
// <tr key="partnumber-row">
//   <td>Part Number</td> {/* Label as "Part Number" */}
//   {planningData.map((plan, index) => (
//     <td key={index}>{plan.PLNG_DATE}</td>
//   ))}
// </tr>

// {/* Second Row: Display Part Number and Quantities */}
// <tr key="partno-qty-row">
//   <td>{planningData[0].PARTNO}</td> {/* Part Number displayed here */}
//   {planningData.map((plan, index) => (
//     <td
//       key={index}
//       style={{ backgroundColor: plan.SERIALIZE_FLG === 'Y' ? 'gray' : 'transparent' }}
//     >
//       {plan.PLNG_QTY}
//     </td>
//   ))}
// </tr>
// </tbody> 


// export default SerilizationPage;

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './SerilizationPage.css';
import { toast } from 'react-toastify';
import { MdDateRange } from "react-icons/md";
import Swal from 'sweetalert2';
import MultiSelectSerializedPage from './MultiSelectSerializedPage';

const SerilizationPage = () => {
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [planningData, setPlanningData] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [serialdetails, setSerialdetails] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const currentUsers = JSON.parse(localStorage.getItem('userData'));
    // console.log('Current User:', currentUsers);  // Check the current user data to see if role_name is Admin
    if (currentUsers && currentUsers.role_name === "Admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  // Fetch parts list from the API
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/parts_active_list');
        const data = await response.json();

        if (Array.isArray(data)) {
          setParts(data); // Set the parts only if it's an array
        } else {
          console.error("Invalid data format received:", data);
          setParts([]); // Fallback to empty array if data is not an array
        }
      } catch (error) {
        console.error('Error fetching parts:', error);
        setMessage("Error fetching parts, please try again later.");
        setParts([]); // Ensure parts remains an array even on failure
      }
    };

    fetchParts();
  }, []);


  // Define the formatDate function inside the component
  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Two digits for month
    const day = date.getDate().toString().padStart(2, '0'); // Two digits for day
    return `${year}-${month}-${day}`;
  }

  const handlePartSelect = async (selectedOption) => {
    if (selectedOption) {
      const selected = parts.find((part) => part.PARTNO === selectedOption.value);
      setSelectedPart(selected);
      setMessage("");

      // Fetch planning data based on the selected part ID
      await fetchPlanningData(selected.PART_ID);
    } else {
      setSelectedPart(null);
      setPlanningData([]);  // Reset planning data to an empty array, not null
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('userData'));


  // Fetch planning data based on the selected part ID
  const fetchPlanningData = async (partId) => {
    if (!partId) return;

    try {
      const roleName = currentUser.role_name; // Get the role name from currentUser

      const response = await fetch(`http://127.0.0.1:5000/get_part_planing/${partId}?role_name=${roleName}`);
      const data = await response.json();
      // console.log("get part planning date", data);
      setPlanningData(data); // Store the planning data in state
    } catch (error) {
      console.error('Error fetching planning data:', error);
      setMessage("Error fetching planning data, please try again later.");
    }
  };
  const partOptions = Array.isArray(parts) ? parts.map((part) => ({
    value: part.PARTNO,
    label: `${part.PARTNO}`,
  })) : [];


  // Calculate the difference between start date and end date in days
  const calculateDateDifference = (start, end) => {
    if (start && end) {
      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = timeDiff / (1000 * 3600 * 24);
      return Math.floor(dayDiff) + 1; // Include both start and end dates in the difference
    }
    return 0;
  };





  // const SerilizedNumber = async () => {
  //   // Display the confirmation prompt using SweetAlert2
  //   const result = await Swal.fire({
  //     title: 'Are you sure?',
  //     text: "Do you want to serialize this part number?",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No',
  //     customClass: {
  //       popup: 'small-popup',
  //       title: 'small-title',
  //       content: 'small-content',
  //       confirmButton: 'small-button',
  //       cancelButton: 'small-button',
  //     },
  //   });


  //   // If user confirmed, proceed with serialization
  //   if (result.isConfirmed) {
  //     if (!selectedPart) {
  //       alert('Please select a part.');
  //       return;
  //     }

  //     if (!startDate || !endDate) {
  //       toast('Please select both start and end dates for Serialized the Number.');
  //       return;
  //     }

  //     const formatDate = (date) => {
  //       if (!date) return null;
  //       const year = date.getFullYear();
  //       const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //       const day = date.getDate().toString().padStart(2, '0');
  //       return `${year}-${month}-${day}`;
  //     };

  //     const formattedStartDate = formatDate(startDate);
  //     const formattedEndDate = formatDate(endDate);
  //     console.log("formatted stard date",formattedStartDate);
  //     console.log("formatted end date",formattedEndDate)

  //     // console.time('filterData');

  //     // const filteredPlanningDetails = planningData
  //     //   .filter((plan) => {
  //     //     const plngDate = formatDate(new Date(plan.PLNG_DATE));
  //     //     return (
  //     //       plngDate >= formattedStartDate &&
  //     //       plngDate <= formattedEndDate &&
  //     //       (currentUser.role_name === 'Admin' ? plan.SERIALIZE_FLG === 'N' : currentUser.role_name === 'Serilization' ? plan.SERIALIZE_FLG !== 'Y' : true)
  //     //     );
  //     //   })
  //     //   .map((plan) => ({
  //     //     plngDate: plan.PLNG_DATE,
  //     //     plngQty: parseInt(plan.PLNG_QTY, 10),
  //     //   }));

  //     // if (filteredPlanningDetails.length === 0) {
  //     //   toast('Serial Number already generated for the selected date range.');
  //     //   return;
  //     // }
  //     // console.log("filtered planningdetails data",filteredPlanningDetails);
  //     // console.timeEnd('filterData');





  // const filteredPlanningDetails = planningData
  // .filter(plan => {
  //   const plngDate = formatDate(new Date(plan.PLNG_DATE)); // Format planning date
  //   return (
  //     plngDate >= formattedStartDate &&
  //     plngDate <= formattedEndDate &&
  //     plan.SERIALIZE_FLG === "N" // Exclude serialized entries
  //   );
  // })
  // .map(plan => ({
  //   plngDate: plan.PLNG_DATE, // Planning Date
  //   plngQty: parseInt(plan.PLNG_QTY, 10), // Convert PLNG_QTY to a number
  // }));

  //     const payload = {
  //       partId: selectedPart.PART_ID,
  //       partNo: selectedPart.PARTNO,
  //       model: selectedPart.MODEL,
  //       plngMonth: "202512", // Hardcoded value
  //       startDate: formattedStartDate,
  //       endDate: formattedEndDate,
  //       planningDetails: filteredPlanningDetails,
  //     };

  //     console.log("payload here",payload);

  //     setLoading(true);

  //     try {
  //       const startTime = performance.now(); // Start time

  //       const response = await fetch('http://127.0.0.1:5000/generate_serial_numbers_list', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(payload),
  //       });

  //       const endTime = performance.now(); // End time
  //       const responseTime = endTime - startTime; // Calculate response time
  //       console.log(`API Response Time: ${responseTime.toFixed(2)} ms`);

  //       const data = await response.json();
  //       console.log("serial data", data);

  //       if (data && data.serialNumbers) {
  //         setSerialdetails(data.serialNumbers);
  //         console.log("Serial details updated:", data.serialNumbers);
  //         fetchPlanningData(selectedPart.PART_ID);

  //       }

  //       if (data && data.message === "Serial numbers generated and inserted successfully.") {
  //         toast('Serialized numbers generated successfully!');

  //       } else if (data && data.error === "Serial numbers already exist") {
  //         toast('Serial Number Already generated for this part number with the selected date.');
  //       } else {
  //         toast('Planning Quantity is 0. Cannot Generate Serial Numbers!');
  //       }
  //     } catch (error) {
  //       console.error('Error generating serialized numbers:', error);
  //       toast('An error occurred while generating serialized numbers.');
  //     } finally {
  //       setLoading(false);
  //     }

  //   };


  // }

  const SerilizedNumber = async () => {
    // Display the confirmation prompt using SweetAlert2
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to serialize this part number?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        popup: 'small-popup',
        title: 'small-title',
        content: 'small-content',
        confirmButton: 'small-button',
        cancelButton: 'small-button',
      },
    });

    // If user confirmed, proceed with serialization
    if (result.isConfirmed) {
      if (!selectedPart) {
        alert('Please select a part.');
        return;
      }

      if (!startDate || !endDate) {
        toast('Please select both start and end dates for serialized the number.');
        return;
      }

      const formatDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      // Check if planningData is an array and has data before applying .filter()
      if (Array.isArray(planningData) && planningData.length > 0) {
        const filteredPlanningDetails = planningData
          .filter(plan => {
            const plngDate = formatDate(new Date(plan.PLNG_DATE)); // Format planning date
            return (
              plngDate >= formattedStartDate &&
              plngDate <= formattedEndDate &&
              plan.SERIALIZE_FLG === "N" // Exclude serialized entries
            );
          })
          .map(plan => ({
            plngDate: plan.PLNG_DATE, // Planning Date
            plngQty: parseInt(plan.PLNG_QTY, 10), // Convert PLNG_QTY to a number
          }));

        const payload = {
          partId: selectedPart.PART_ID,
          partNo: selectedPart.PARTNO,
          model: selectedPart.MODEL,
          plngMonth: "202512", // Hardcoded value
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          planningDetails: filteredPlanningDetails,
        };

        console.log("payload here", payload);

        setLoading(true);

        try {
          const startTime = performance.now(); // Start time

          const response = await fetch('http://127.0.0.1:5000/generate_serial_numbers_list', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const endTime = performance.now(); // End time
          const responseTime = endTime - startTime; // Calculate response time
          console.log(`API Response Time: ${responseTime.toFixed(2)} ms`);

          const data = await response.json();
          console.log("serial data", data);

          if (data && data.serialNumbers) {
            setSerialdetails(data.serialNumbers);
            console.log("Serial details updated:", data.serialNumbers);
            fetchPlanningData(selectedPart.PART_ID);
          }

          if (data && data.message === "Serial numbers generated and inserted successfully.") {
            toast('Serialized numbers generated successfully!');
          } else if (data && data.error === "Serial numbers already exist") {
            toast('Serial Number Already generated for this part number with the selected date.');
          } else {
            toast('Planning Quantity is 0. Cannot Generate Serial Numbers!');
          }
        } catch (error) {
          console.error('Error generating serialized numbers:', error);
          toast('An error occurred while generating serialized numbers.');
        } finally {
          setLoading(false);
        }
      } else {
        toast('No planning data available for the selected part number.');
      }
    }
  };



  // Button JSX
  <td className='text-center'>
    <button
      className='btn btn-primary'
      disabled={!selectedPart || loading}
      onClick={SerilizedNumber}
    >
      {loading ? 'Generating...' : 'Serialize'}
    </button>
  </td>

  useEffect(() => {
    if (startDate && endDate) {
      // Check if planningData is an array and has data
      if (Array.isArray(planningData) && planningData.length > 0) {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        // Filter planning data based on the selected date range and SERIALIZE_FLG
        const filteredPlanningDetails = planningData
          .filter(plan => {
            const plngDate = formatDate(new Date(plan.PLNG_DATE)); // Format planning date
            return (
              plngDate >= formattedStartDate &&
              plngDate <= formattedEndDate &&
              plan.SERIALIZE_FLG === "N" // Exclude serialized entries
            );
          })
          .map(plan => ({
            plngDate: plan.PLNG_DATE, // Planning Date
            plngQty: parseInt(plan.PLNG_QTY, 10), // Convert PLNG_QTY to a number
          }));

        // Calculate the total quantity sum from the filtered planning data
        const totalQuantity = filteredPlanningDetails.reduce((acc, plan) => acc + plan.plngQty, 0);
        setTotalQuantity(totalQuantity);

        console.log('Filtered Planning Details:', filteredPlanningDetails);
        console.log('Total Quantity:', totalQuantity);
      } else {
        console.error('No planning data available or invalid planningData:', planningData);
      }
    }
  }, [startDate, endDate, planningData]);


  return (
    <div style={{ marginTop: '130px' }} className='container'>
      <h2 className='my-5 pagesHeading'> <i className="bi bi-list-ol"></i> Serialized Issue</h2>
      <div className='row'>
        {/* Start Date Picker */}
        <div className='col-lg-4'>
          <label htmlFor="startDate" className="form-label"> <MdDateRange color='orange' className='mb-1' size={20} /> Start Date</label>
          <div className='datepickers'>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
              className="form-control"
              // minDate={new Date()} // Disable past dates for start date
              minDate={isAdmin ? null : new Date()}  // Admin can select any date, others can only select from today onwards

            />
          </div>
        </div>

        {/* Date Difference Section */}
        <div className='col-lg-4'>
          <label htmlFor="date-difference" className="form-label">Date Difference</label>
          <div className="form-control">
            {startDate && endDate ? (
              <p>{calculateDateDifference(startDate, endDate)} days</p>
            ) : (
              <p>0 days</p>
            )}
          </div>
        </div>

        {/* End Date Picker */}
        <div className='col-lg-4'>
          <label htmlFor="endDate" className="form-label"> <MdDateRange color='orange' className='mb-1' size={20} /> End Date</label>
          <div className='datepickers'>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
              className="form-control datepickers"
              minDate={startDate ? startDate : new Date()} // Ensure end date is after start date
              disabled={!startDate} // Disable end date picker until start date is selected
            />
          </div>
        </div>
      </div>

      <div className='row my-3'>
        <div className='col-lg-12'>
          {/* Table for parts selection and action */}
          <table className='table table-bordered shadow-sm'>
            <thead>
              <tr>
                <th>Part Number</th>
                <th>Part Model</th>
                <th>Sum of Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Select
                    id="part-select"
                    options={partOptions}
                    onChange={handlePartSelect}
                    value={selectedPart ? { value: selectedPart.PARTNO, label: `${selectedPart.PARTNO}` } : null}
                    placeholder="Search by part Number or Model......."
                    isClearable
                    noOptionsMessage={() => 'No parts found'}
                  />
                </td>
                <td>{selectedPart ? selectedPart.MODEL : 'N/A'}</td>
                {/* <td>{selectedPart ? selectedPart.PC : 'N/A'}</td> */}
                <td className='text-center'>{totalQuantity}</td>
                <td className='text-center'>
                  <button
                    className='btn btn-primary'
                    disabled={!selectedPart || loading}
                    onClick={SerilizedNumber}
                  >
                    {loading ? 'Generating...' : 'Serialize'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Displaying messages */}
          {message && <div className="alert alert-info">{message}</div>}

          {/* Displaying serialized numbers */}
          {serialNumbers && serialNumbers.length > 0 && (
            <div className="serialized-numbers">
              <h4>Generated Serialized Numbers:</h4>
              <ul>
                {serialNumbers.map((serial, index) => (
                  <li key={index}>{serial}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="row my-3">
            <div className="col-lg-12">
              {/* Default message or fetched data */}
              {!selectedPart ? (
                <div className="">Please select the part number to get the planning data.</div>
              ) : planningData && Array.isArray(planningData) && planningData.length > 0 ? (
                <div className="planning-table">
                  <h4>Planning Data</h4>
                  <div className="table-container">
                    <table className="table table-bordered  shadow-sm">
                      <tbody>
                        {/* First Row: Display all the Planning Dates */}
                        <tr key="dates-row">
                          {planningData.map((plan, index) => (
                            <td key={index}>{plan.PLNG_DATE}</td>
                          ))}
                        </tr>

                        {/* Second Row: Display all the Quantities */}
                        <tr key="qty-row">
                          {planningData.map((plan, index) => (
                            <td
                              key={index}
                              style={{ backgroundColor: plan.SERIALIZE_FLG === 'Y' ? 'gray' : 'transparent' }}
                            >
                              {plan.PLNG_QTY}
                            </td>
                          ))}
                        </tr>

                        {/* <tr key="qty-row">
                          {planningData.map((plan, index) => {
                            // Convert PLNG_DATE from the plan to a Date object
                            const planDate = new Date(plan.PLNG_DATE);
                            const currentDate = new Date();
                            const isToday = planDate.toDateString() === currentDate.toDateString();
                            const isPastDate = planDate < currentDate;
                            const isFutureDate = planDate > currentDate;
                            const isSerialized = plan.SERIALIZE_FLG === 'Y';
 
                            // Define background color based on conditions
                            let backgroundColor = 'transparent';  // Default background
 
                            if (isSerialized && isPastDate) {
                              // Serialized and Past Date
                              backgroundColor = 'lightcoral'; // Light gray for past serialized entries
                            } else if (isSerialized && (isToday || isFutureDate)) {
                              // Serialized and Present/Future Date
                              backgroundColor = 'gray'; // Gray for serialized entries for today or future dates
                            } else if (!isSerialized && isPastDate) {
                              // Non-Serialized and Past Date
                              backgroundColor = 'lightyellow'; // Light yellow for non-serialized past dates
                            } else if (!isSerialized && (isToday || isFutureDate)) {
                              // Non-Serialized and Present/Future Date
                              backgroundColor = ''; // Light green for non-serialized future/today dates
                            }
 
                            return (
                              <td
                                key={index}
                                style={{ backgroundColor }}
                              >
                                {plan.PLNG_QTY}
                              </td>
                            );
                          })}
                        </tr> */}

                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="">Sorry, no planning data found.</div>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className='row'>


        <div className='col-lg-12'>
          {loading ? (
            // Show loading spinner until data is loaded
            <div className='text-center'>
              <div className='spinner-border text-primary' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          ) : serialdetails.length > 0 ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto', width: '70%', margin: '0 auto' }}>
              <h5 className='my-2 text-primary text-center'>
                Serialization details <span className='text-success'>({serialdetails.length})</span>
              </h5>
              <table className='table table-bordered' style={{ width: '100%', textAlign: 'center' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Part No</th>
                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Model</th>
                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Planned Date</th>
                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Serial Number</th>
                  </tr>
                </thead>
                <tbody>
                  {serialdetails.map((item, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.partNo}</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.model}</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.plngDate}</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.serialNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-center my-2'>....</p>
          )}
        </div>
      </div>
      <hr />


      <MultiSelectSerializedPage />
    </div>
  );
};

export default SerilizationPage;


