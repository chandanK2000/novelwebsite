import React, { useState, useEffect, useRef } from 'react';
import './AddUserDetails.css'; 
import { toast } from 'react-toastify';
import { FaUserPlus } from "react-icons/fa"; 
import { FaInfoCircle } from "react-icons/fa";

const AddUserDetails = () => {
    const [formData, setFormData] = useState({
        userCode: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        roles: [],
        status: 'ACTIVE',
    });

    console.log("form data valus for the add user data", formData);

    const [roles, setRoles] = useState([]);  // To store roles fetched from API
    const [loading, setLoading] = useState(false);
    const [isRolesOpen, setIsRolesOpen] = useState(false);
    const dropdownRef = useRef(null);  // Reference to the dropdown
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Fetch roles from the API on component mount
        const fetchRoles = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/get_roles');
                const data = await response.json();

                console.log("data fetched roles", data);

                if (response.ok) {
                    if (Array.isArray(data.roles)) {
                        setRoles(data.roles);  // Correctly setting roles from the response
                    } else {
                        console.error('Roles data is not an array:', data);
                    }
                } else {
                    console.error('Failed to fetch roles');
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };


        fetchRoles();
    }, []);  // Empty dependency array ensures this runs once when the component mounts

    useEffect(() => {
        // Close the dropdown if clicking outside of it
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsRolesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value,
    //     });
    // };



    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Regular expression to allow only letters (A-Z, a-z)
        const namePattern = /^[A-Za-z\s]+$/;

        if (name === "firstName" || name === "lastName") {
            if (value === "" || namePattern.test(value)) {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            } else {
                toast.error("Only letters are allowed in the First Name and Last Name fields.");
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // const handleRoleChange = (role) => {
    //     setFormData((prevData) => {
    //         const updatedRoles = prevData.roles.map((r) =>
    //             r.Role_Name === role.Role_Name
    //                 ? { ...r, status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }  // Toggle status
    //                 : r
    //         );

    //         // If the role is not already in the roles array, add it with status ACTIVE
    //         if (!updatedRoles.some((r) => r.Role_Name === role.Role_Name)) {
    //             updatedRoles.push({ ...role, status: 'ACTIVE' });
    //         }


    //         // Log the updated roles
    //         console.log("Updated roles:", updatedRoles);


    //         return { ...prevData, roles: updatedRoles };
    //     });
    // };
    
    const handleRoleChange = (role) => {
        setFormData((prevData) => {
            let updatedRoles = [...prevData.roles]; // Copy existing roles
    
            const roleIndex = updatedRoles.findIndex(r => r.Role_Name === role.Role_Name);
    
            if (roleIndex !== -1) {
                // If the role is already selected, remove it (unchecked)
                updatedRoles.splice(roleIndex, 1);
            } else {
                // If not selected, add it with status 'ACTIVE'
                updatedRoles.push({ ...role, status: 'ACTIVE' });
            }
    
            console.log("Updated roles:", updatedRoles);
            return { ...prevData, roles: updatedRoles };
        });
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        // Retrieve the logged-in user's data from localStorage
        const loginuser = JSON.parse(localStorage.getItem('userData'));  // Assuming 'userData' is stored as a JSON string

        console.log("loginuser here", loginuser);

        const loginUser_code = loginuser.User_code;

        console.log("login user code", loginUser_code);


        // Now use formData.roles directly in the request payload
        const dataToSend = [{
            ...formData,
            roles: formData.roles,  // Use formData.roles here
            login_user_code: loginUser_code
        }];

        try {
            const response = await fetch('http://127.0.0.1:5000/add_new_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend), // Send the data as JSON with role names
            });

            const responseData = await response.json();
            console.log('Response Data:', responseData);

            if (response.ok) {
                toast.success(`${formData.userCode} User added successfully !`);
            } else {
                // alert('Failed to add user');
                toast.error(responseData.error || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        } finally {
            setLoading(false);
        }
    };



    const GoBack = () => {
        window.history.back();
    };

    // Toggle password visibility
    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };


    return (
        <div className="container" style={{ marginTop: '140px' }}>
            <div className='text-center'>
            <button className="btn btn-primary px-3 py-1" onClick={GoBack}>Back</button>
            <h3 className="my-1 pagesHeading"> <FaUserPlus className='mb-2' size={28}/> Add User Details </h3>
            </div>
            <form onSubmit={handleSubmit} className="border p-5 rounded my-3 shadow-sm">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="mb-3">
                            <label htmlFor="userCode" className="form-label">
                                User Code
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-person-badge"></i> {/* Bootstrap icon */}
                                </span>
                                <input
                                    type="text"
                                    className="custom-input form-control"
                                    id="userCode"
                                    name="userCode"
                                    value={formData.userCode}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Please Enter User Code"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">
                                First Name
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-person"></i>
                                </span>
                                <input
                                    type="text"
                                    className="custom-input form-control"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Please Enter First Name"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">
                                Last Name
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-person"></i>
                                </span>
                                <input
                                    type="text"
                                    className="custom-input form-control"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Please Enter Last Name"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    className="custom-input form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Please Enter Email"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-4">
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"} // Toggle between text and password
                                    className="custom-input form-control"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder='Please Enter Password'

                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={togglePassword}
                                >
                                    {/* {showPassword ? "Hide" : "Show"} */}
                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>

                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">
                                Status
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaInfoCircle size={20} color="blue" />
                                </span>
                                <select
                                    className="form-select" // Bootstrap 5 class for select dropdown
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    {/* Roles Dropdown with Multi-Select and Checkboxes */}
                    {/* <div className="col-lg-4">
                        <div className="mb-3">
                            <label htmlFor="roles" className="form-label">
                                Roles
                            </label>
                            <div className="custom-dropdown" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className="custom-dropdown-toggle"
                                    onClick={() => setIsRolesOpen(!isRolesOpen)}
                                >
                                    {formData.roles.length > 0
                                        ? roles
                                            .filter(role => formData.roles.includes(role.Role_Name)) 
                                            .map(role => role.Role_Name)
                                            .join(', ')
                                        : 'Select Roles'}
                                </button>

                                {isRolesOpen && (
                                    <ul className="custom-dropdown-menu">
                                        {Array.isArray(roles) && roles.length > 0 ? (
                                            roles.map((role) => (
                                                <li key={role.Role_Id}>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value={role.Role_Name}  
                                                            checked={formData.roles.some(r => r.Role_Name === role.Role_Name && r.status === 'ACTIVE')} // Check if Role is active
                                                            onChange={() => handleRoleChange(role)} // Handle selecting/unselecting a role
                                                        />
                                                        <label className="form-check-label">{role.Role_Name}</label>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No roles available</li>
                                        )}
                                    </ul>
                                )}

                            </div>
                        </div>
                    </div> */}

                    {/* <div className="col-lg-4">
                        <div className="mb-3">
                            <label htmlFor="roles" className="form-label">Roles</label>

                            <div className="custom-dropdown" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className="custom-dropdown-toggle"
                                    onClick={() => setIsRolesOpen(!isRolesOpen)}
                                >
                                    {formData.roles.length > 0
                                        ? formData.roles.map(role => role.Role_Name).join(', ')
                                        : 'Select Roles'}
                                </button>

                                {isRolesOpen && (
                                    <ul className="custom-dropdown-menu">
                                        {Array.isArray(roles) && roles.length > 0 ? (
                                            roles.map((role) => (
                                                <li key={role.Role_Id}>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value={role.Role_Name}
                                                            checked={formData.roles.some(r => r.Role_Name === role.Role_Name)}
                                                            onChange={() => handleRoleChange(role)}
                                                        />
                                                        <label className="form-check-label">{role.Role_Name}</label>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No roles available</li>
                                        )}
                                    </ul>
                                )}
                            </div>

                            

                            <div className="selected-roles-box">
                                {formData.roles.length > 0 ? (
                                    formData.roles.map((role) => (
                                        <span key={role.Role_Name} className="badge badge-primary m-1">
                                            {role.Role_Name}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-muted"></p>
                                )}
                            </div>
                        </div>
                    </div> */}

<div className="col-lg-4">
  <div className="mb-3">
    <label htmlFor="roles" className="form-label">Roles</label>

    <div className="custom-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="custom-dropdown-toggle"
        onClick={() => setIsRolesOpen(!isRolesOpen)}
      >
        {formData.roles.length > 0
          ? formData.roles.map(role => role.Role_Name).join(', ')
          : 'Select Roles'}
      </button>

      {isRolesOpen && (
      <ul className="custom-dropdown-menu">
      {Array.isArray(roles) && roles.length > 0 ? (
        roles.map((role) => (
          <li key={role.Role_Id} className="d-flex align-items-center">
            <label className="w-100">
              <input
                className="form-check-input"
                type="checkbox"
                value={role.Role_Name}
                checked={formData.roles.some(r => r.Role_Name === role.Role_Name)}
                onChange={() => handleRoleChange(role)}
              />
              <span>{role.Role_Name}</span>
            </label>
          </li>
        ))
      ) : (
        <li>No roles available</li>
      )}
    </ul>
    
      )}
    </div>

    {/* ✅ Box for showing selected roles */}
    <div className="selected-roles-box">
      {formData.roles.length > 0 ? (
        formData.roles.map((role) => (
          <span key={role.Role_Name} className="badge badge-primary m-1">
            {role.Role_Name}
          </span>
        ))
      ) : (
        <p className="text-muted"></p>
      )}
    </div>
  </div>
</div>







                </div>

                <div className="row">
                    <div className="col-lg-5">

                    </div>
                    <div className="col-lg-2">
                        <div className="mb-3">
                            <button type="submit" className="custom-btn btn btn-primary" disabled={loading}>
                            <FaUserPlus className='mb-2' size={24}/> {loading ? 'Adding User...' : 'Add User'}
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-5">

                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddUserDetails;
