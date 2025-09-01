import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Login from '../../pages/login/Login';
import Swal from 'sweetalert2';
import { FcPlanner } from "react-icons/fc";
import { FaClipboardCheck, FaFolderPlus,FaPencilRuler } from 'react-icons/fa';


const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  console.log("userData details", userData);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      console.log("storeduser data available here", storedUserData);
    }
  }, []);

  const handleLoginClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      width: '350px',
      customClass: {
        title: 'custom-title',
        popup: 'custom-popup',
        confirmButton: 'custom-button',
        cancelButton: 'custom-button',
      },
      didOpen: () => {
        const title = Swal.getTitle();
        title.style.fontSize = '16px';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout actions
        // Swal.fire('Logged Out!', `${userData.roles[0].Role_Name} Logout successful`, 'success');
        localStorage.removeItem('userData');
        setUserData(null);
        navigate('/');
      } else {
        Swal.fire({
          title: 'Update Cancelled',
          text: 'You have decided not to Logout ?',
          icon: 'info',
          showConfirmButton: true,
          confirmButtonText: 'Okay',
          width: '350px',
          customClass: {
            title: 'custom-title',
            popup: 'custom-popup',
            confirmButton: 'custom-button',
            cancelButton: 'custom-button',
          },
        });
        console.log('Logout Cancelled');
      }
    });
  };

  const handleLoginSuccess = (data) => {
    setUserData(data);
  };

 
  const getNavTabs = () => {
    if (userData && userData.User_code) {  // Check if userData and user_code exist
      const { User_code, roles } = userData;
      console.log("USER_CODE", User_code);
      console.log("ROLES", roles);


      // Check if all roles are inactive
      const allInactive = roles.every(role => role.Role_Status === 'INACTIVE');

      // If all roles are inactive, show the access message
      if (allInactive) {
        return (
          <div className="alert alert-danger">
            You don't have access. Please contact the admin.
          </div>
        );
      }



      // Check if User_code is 'ADMIN11' (case insensitive)
      if (User_code === 'ADMI11') {
        return (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin-dashboard">
                <i className="bi bi-people-fill"></i> Admin Dashboard
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" to="#" id="inspectionDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <FaClipboardCheck className='mb-1' /> (Q A)
              </a>
              <ul className="dropdown-menu" aria-labelledby="inspectionDropdown">
              <li>
                  <NavLink className="dropdown-item" to="/createproject"><FaFolderPlus className="me-2 mb-1" /> Create Project
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/designanddrawing"><FaPencilRuler className="me-2 mb-1" />Design & Drawing</NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/inspectionmodule/"><FaClipboardCheck className='mb-1' />Inspection Module</NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/part-manager">
                <i className="bi bi-wrench-adjustable-circle-fill"></i> Item Master
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/planner-Page">
                <FcPlanner className="mb-1" /> Production Plan
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/serialization">
                <i className="bi bi-list-ol"></i> Serialized Issue
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/print-manager">
                <i className="bi bi-printer-fill"></i> Kanban Issue
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink className="nav-link" to="/inspectionmodule">
               <FaClipboardCheck className='mb-1'/> Inspection(QA)  
              </NavLink>
            </li>  */}
            {/* <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="inspectionDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <FaClipboardCheck className='mb-1' /> (Q A)
              </a>
              <ul className="dropdown-menu" aria-labelledby="inspectionDropdown">
                <li>
                  <NavLink className="dropdown-item" to="/inspectionmodule/"><FaClipboardCheck className='mb-1' />Inspection Module</NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/createproject"><FaFolderPlus className="me-2 mb-1" /> Create Project
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/designanddrawing"><FaPencilRuler className="me-2 mb-1" />Design & Drawing</NavLink>
                </li>
              </ul>
            </li> */}


          </>
        );
      }

      // If user is not 'ADMIN11', render tabs dynamically based on roles
      return roles.map((role) => {
        // Check if the role status is "ACTIVE"
        // if (role.Status === 'ACTIVE') {
        if (role.Role_Name === 'Admin') {
          return (
            <li className="nav-item" key={role.Role_Id}>
              <NavLink className="nav-link" to="/admin-dashboard">
                <i className="bi bi-people-fill"></i> Admin Dashboard
              </NavLink>
            </li>
          );
        }
        if (role.Role_Name === "Part manager") {
          return (
            <li className="nav-item" key={role.Role_Id}>
              <NavLink className="nav-link" to="/part-manager">
                <i className="bi bi-wrench-adjustable-circle-fill"></i> Item Master
              </NavLink>
            </li>
          );
        }
        if (role.Role_Name === "Planner") {
          return (
            <li className="nav-item" key={role.Role_Id}>
              <NavLink className="nav-link" to="/planner-Page">
                <FcPlanner className="mb-1" /> Production Plan
              </NavLink>
            </li>
          );
        }
        if (role.Role_Name === "Serilization") {
          return (
            <li className="nav-item" key={role.Role_Id}>
              <NavLink className="nav-link" to="/serialization">
                <i className="bi bi-list-ol"></i> Serialized Issue
              </NavLink>
            </li>
          );
        }
        if (role.Role_Name === "print manager") {
          return (
            <li className="nav-item" key={role.Role_Id}>
              <NavLink className="nav-link" to="/print-manager">
                <i className="bi bi-printer-fill"></i> Kanban Issue
              </NavLink>
            </li>
          );
        }
        // }
        // return null; // If role status is not "ACTIVE", don't render the tab
      });
    }
    return null; // Return null if no userData or user_code is not available
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="#">
          <img src='../company_logo.png' height={80} width={100} alt="comapnyimage not found" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {getNavTabs()} {/* Render tabs based on the user's roles or ADMIN11 code */}
          </ul>

          <div className="d-flex auth_button">
            {userData ? (
              <div className="user-info">
                <span> <i className="bi bi-box-arrow-in-right"></i> Welcome, ( {userData.User_First_Name + " " + userData.User_Last_Name} )</span>
                {/* ({userData.roles.map(role => role.Role_Name).join(', ')}) */}
                <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            ) : (
              <button className="btn btn-outline-primary me-2" onClick={handleLoginClick}>
                <i className="bi bi-box-arrow-in-right"></i> Login
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && <Login closeModal={closeModal} onLoginSuccess={handleLoginSuccess} />}
    </nav>
  );
};

export default Navbar;



// import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { BsFillPrinterFill } from "react-icons/bs";
// import { AiOutlinePrinter } from "react-icons/ai";

// const IssuedandNonIssuedDataFetch = () => {
//     const defaultStartDate = new Date();
//     const defaultEndDate = new Date();
//     defaultEndDate.setDate(defaultEndDate.getDate() + 7);

//     const [startDate, setStartDate] = useState(defaultStartDate);
//     const [endDate, setEndDate] = useState(defaultEndDate);
//     const [issueData, setIssueData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [activeTab, setActiveTab] = useState("unissued");
//     const [noDataMessage, setNoDataMessage] = useState("");
//     const [checkedItems, setCheckedItems] = useState({});


//     const formatDate = (date) => date ? date.toISOString().split("T")[0] : null;

//     const fetchIssuedandNonIssuedData = async (status) => {
//         try {
//             setActiveTab(status);
//             setNoDataMessage("");

//             const start = formatDate(startDate);
//             const end = formatDate(endDate);

//             // console.log(`Fetching ${status} data from: Start Date: ${start}, End Date: ${end}`);

//             const url = `http://127.0.0.1:5000/get_kanban_details?status=${status}&start_date=${start}&end_date=${end}`;
//             const response = await fetch(url);
//             if (!response.ok) throw new Error("Failed to fetch data");

//             const result = await response.json();
//             console.log(`Fetched ${status} data:`, result);

//             if (!Array.isArray(result) || result.length === 0) {
//                 setNoDataMessage("No data available for the selected date range.");
//                 setIssueData([]);
//                 setFilteredData([]);
//                 return;
//             }

//             setIssueData(result);
//             setFilteredData(result);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setIssueData([]);
//             setFilteredData([]);
//             setNoDataMessage("Error fetching data.");
//         }
//     };

//     useEffect(() => {
//         fetchIssuedandNonIssuedData("unissued");
//     }, [startDate, endDate]);

//     useEffect(() => {
//         const filtered = issueData.filter(item =>
//             item.SERIAL_NO.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setFilteredData(filtered);
//     }, [searchTerm, issueData]);




//     // Handle row click to toggle checkbox selection
//     const handleRowClick = (itemId) => {
//         setCheckedItems((prevCheckedItems) => ({
//             ...prevCheckedItems,
//             [itemId]: !prevCheckedItems[itemId], // Toggle checkbox selection
//         }));
//     };

//     // Handle checkbox change event
//     const handleCheckboxChange = (itemId) => {
//         setCheckedItems((prevCheckedItems) => ({
//             ...prevCheckedItems,
//             [itemId]: !prevCheckedItems[itemId], // Toggle checkbox selection
//         }));
//     };


//     return (
//         <div style={{ padding: '20px' }}>

//             <div className='row'>
//                 <div className="col-lg-3">
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                         <input
//                             type="checkbox"
//                             style={{
//                                 height: '25px',
//                                 width: '25px',
//                                 borderRadius: '5px',
//                                 cursor: 'pointer',
//                             }}
//                             id='checkall'
//                         //   checked={isChecked}
//                         //   onChange={handleCheckAllChange}
//                         />
//                         <label
//                             style={{
//                                 fontSize: '16px',
//                                 fontWeight: 'bold',
//                                 color: '#333',
//                                 cursor: 'pointer',
//                             }}
//                             for="checkall"
//                         >
//                             Check All
//                         </label>
//                     </div>
//                 </div>
//                 <div className='col-lg-3'>
//                     <p>Selected items:</p>
//                 </div>
//                 <div className='col-lg-3'>
//                     <button
//                         className={`btn m-1 ${activeTab === 'issued' ? 'btn-success' : 'btn-primary'}`}
//                         onClick={() => fetchIssuedandNonIssuedData("issued")}
//                     >
//                         Issued
//                     </button>
//                     <button
//                         className={`btn m-1 ${activeTab === 'unissued' ? 'btn-success' : 'btn-primary'}`}
//                         onClick={() => fetchIssuedandNonIssuedData("unissued")}
//                     >
//                         Non Issued
//                     </button>
//                 </div>
//                 <div className='col-lg-3 text-end'>
//                     <button className='btn btn-primary mx-1'>
//                         <BsFillPrinterFill size={20} color="white" className="mb-1" /> Printpdf </button>
//                     <button className='btn btn-primary'>
//                         <AiOutlinePrinter /> RePrintpdf
//                     </button>

//                 </div>
//             </div>

//             <div className='row my-3'>
//                 <div className='col-lg-3'>
//                     <input
//                         type='search'
//                         placeholder='Enter serial number'
//                         className='form-control'
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>
//                 <div className='col-lg-3'>
//                     <DatePicker
//                         selected={startDate}
//                         onChange={(date) => setStartDate(date)}
//                         selectsStart
//                         startDate={startDate}
//                         endDate={endDate}
//                         placeholderText="Select start date"
//                         className='form-control'
//                     />
//                 </div>
//                 <div className='col-lg-3'>
//                     Day Difference: {Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} days ({filteredData.length})
//                 </div>
//                 <div className='col-lg-3'>
//                     <DatePicker
//                         selected={endDate}
//                         onChange={(date) => setEndDate(date)}
//                         selectsEnd
//                         startDate={startDate}
//                         endDate={endDate}
//                         placeholderText="Select end date"
//                         className='form-control'
//                     />
//                 </div>
//             </div>


//             <div className="col-lg-12">
//                 <div className="table-container" style={{ height: '300px', overflowY: 'auto' }}>
//                     {noDataMessage ? (
//                         <h3>{noDataMessage}</h3>
//                     ) : filteredData.length === 0 ? (
//                         <h5 className='text-primary my-3'>No Matching Records Found !</h5>
//                     ) : (
//                         <>
//                             <table className="table table-bordered my-3">
//                                 <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
//                                     <tr>
//                                         <th>check</th>
//                                         <th>Part Id</th>
//                                         <th>Part Number</th>
//                                         <th>Model</th>
//                                         <th>Used Name</th>
//                                         <th>Planning Date</th>
//                                         <th>Plng-Month</th>
//                                         <th>Serial No</th>
//                                         <th>Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredData.map((item, index) => (
//                                         <tr key={index}>
//                                             <td className='text-center'>
//                                                 <input
//                                                     type="checkbox"
//                                                     className="checkboxSelect"
//                                                 />
//                                             </td>
//                                             <td>{item.PART_ID}</td>
//                                             <td>{item.PART_NO}</td>
//                                             <td>{item.MODEL}</td>
//                                             <td>{item.USEDNAME}</td>
//                                             <td>{item.PLNG_DATE}</td>
//                                             <td>{item.PLNG_MONTH}</td>
//                                             <td>{item.SERIAL_NO}</td>
//                                             <td>{item.PRINT_FLG === "Y" ? "Printed" : "Unprinted"}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default IssuedandNonIssuedDataFetch;

