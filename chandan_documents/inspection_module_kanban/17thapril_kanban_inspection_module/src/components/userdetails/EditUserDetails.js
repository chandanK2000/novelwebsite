import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './AddUserDetails.css'; // Custom CSS file for extra styling
import { toast } from 'react-toastify';
import { FaUserEdit } from "react-icons/fa";
import './EditUserDetails.css';
import { BiEdit } from "react-icons/bi"; // Import Edit Icon
import { FaInfoCircle } from "react-icons/fa";

const EditUserDetails = () => {
    const { userId } = useParams();  // Get the userId from URL parameter
    const [formData, setFormData] = useState({
        userCode: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        Role_Description: '',
        roles: [],
        status: 'ACTIVE',
    });


    // const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isRolesOpen, setIsRolesOpen] = useState(false);
    const dropdownRef = useRef(null);  // Reference to the dropdown
    const [roles, setRoles] = useState([]);  // To store roles fetched from API
    useEffect(() => {
        // Fetch the user data from API using the userId
        fetch(`http://127.0.0.1:5000/get_user_by_id/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched user data here:", data);
                // console.log(data.user.email)
                // Console log the user data

                // Ensure that the user data is valid and roles exist as an array
                // const roles = Array.isArray(data.roles) ? data.roles : [];  // Default to empty array if not an array

                setFormData({
                    userCode: data.user.userCode || '',  // Ensure default value if undefined
                    firstName: data.user.firstName || '',
                    lastName: data.user.lastName || '',
                    email: data.user.email || '',
                    password: data.user.password || '',
                    // Role_Description: data.user.Role_Description || '',
                    roles: data.user.roles.map(role => ({
                        Role_Name: role.Role_Name,
                        status: role.Status || 'ACTIVE', // Ensure status is provided, default to 'ACTIVE'
                    })),
                    status: data.user.status || 'ACTIVE',  // Default to 'ACTIVE' if undefined
                });

                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                setLoading(false);
            });
    }, [userId]);

    useEffect(() => {
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


    const handleRoleChange = (role) => {
        setFormData((prevData) => {
            const updatedRoles = prevData.roles.map((r) =>
                r.Role_Name === role.Role_Name
                    ? { ...r, status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }  // Toggle status
                    : r
            );

            // If the role is not already in the roles array, add it with status ACTIVE
            if (!updatedRoles.some((r) => r.Role_Name === role.Role_Name)) {
                updatedRoles.push({ ...role, status: 'ACTIVE' });
            }

            // Log the updated roles for debugging
            console.log("Updated roles:", updatedRoles);

            return { ...prevData, roles: updatedRoles };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Ensure the roles array has the correct structure with Role_Id and status
        const updatedRoles = formData.roles.map((role) => {
            const matchedRole = roles.find(r => r.Role_Name === role.Role_Name);  // Find the matching role from the fetched roles
            return {
                Role_Id: matchedRole ? matchedRole.Role_Id : null,
                Role_Name: role.Role_Name,
                status: role.status,
            };
        });

        // Log to check updatedRoles before sending the request
        console.log("Updated Roles:", updatedRoles);

        // Retrieve the logged-in user's data from localStorage
        const loginuser = JSON.parse(localStorage.getItem('userData'));  // Assuming 'userData' is stored as a JSON string

        console.log("loginuser here", loginuser);

        const loginUser_code = loginuser.User_code;

        console.log("login user code", loginUser_code);

        const response = await fetch(`http://127.0.0.1:5000/update_user_data/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                roles: updatedRoles,  // Send roles with Role_Id and status
                login_user_code: loginUser_code

            }),
        });

        if (response.ok) {
            // alert('User details updated successfully');
            toast.success(`${formData.userCode} User details updated successfully !`)
            window.history.back();
        } else {
            const errorData = await response.json();
            console.error('Failed to update user:', errorData);  // Log response error
            // alert(`Failed to update user: ${errorData.message || 'Unknown error'}`);
        }
        setLoading(false);
    };

    const GoBack = () => {
        window.location.href = "/admin-dashboard"
    };


    if (loading) {
        return <p>Loading...</p>;
    }




    return (
        <div className="container" style={{ marginTop: '140px' }}>
            <div className='text-center my-2'>
                <button className="btn btn-primary px-3 py-1" onClick={GoBack}>
                    Back
                </button>
            </div>
            <h3 className="my-1 pagesHeading">
            <BiEdit className="text-primary mb-1" style={{ cursor: "pointer", fontSize: "2.2rem" }} /> Edit User Details
</h3>
            <form onSubmit={handleSubmit} className="border p-4 rounded my-3 shadow-sm">
                <div className="row">
                        {/* User Code (Disabled) */}
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <label htmlFor="userCode" className="form-label">User Code</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-person-badge"></i> {/* Bootstrap icon */}
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="userCode"
                                        name="userCode"
                                        value={formData.userCode}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* First Name */}
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-person"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-person"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status Dropdown */}
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                    <FaInfoCircle size={20} color="blue" />
                                    </span>
                                    <select
                                        className="form-select"
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
                    <div className="col-lg-4">
    <div className="mb-3">
        <label htmlFor="roles" className="form-label">Roles</label>
        <div className="custom-dropdown" ref={dropdownRef}>
            <div className="input-group">
                <button
                    type="button"
                    className="custom-dropdown-toggle py-2" // Reduced height
                    onClick={() => setIsRolesOpen(!isRolesOpen)}
                >
                    {/* Input Field (For Displaying Selected Roles) */}
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Select Roles"
                        value={
                            formData.roles.length > 0
                                ? formData.roles
                                    .filter(role => role.status === 'ACTIVE')
                                    .map(role => role.Role_Name)
                                    .join(', ')
                                : ''
                        }
                        readOnly
                    />

                    {/* Dropdown Caret */}
                    <span className="dropdown-caret">▼</span>
                </button>
            </div>

            {isRolesOpen && (
                <ul className="custom-dropdown-menu custom-dropdown-height">
                    {Array.isArray(roles) && roles.length > 0 ? (
                        roles.map((role) => (
                            <li
                                key={role.Role_Id}
                                className="dropdown-item"
                                onClick={() => handleRoleChange(role)}
                            >
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={role.Role_Name}
                                        checked={formData.roles.some(
                                            (r) => r.Role_Name === role.Role_Name && r.status === 'ACTIVE'
                                        )}
                                        readOnly
                                    />
                                    <label className="form-check-label">{role.Role_Name}</label>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="text-muted text-center">No roles available</li>
                    )}
                </ul>
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
                                <FaUserEdit size={20} className='mb-1' /> {loading ? 'Updating User...' : 'Update User'}
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

export default EditUserDetails;
