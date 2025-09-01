import React, { useEffect, useState } from 'react';
import './FetchUserDetails.css';
import { MdEditSquare } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { IoAddCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { FaKey } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";



const FetchUserDetails = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    // const [currentPassword, setCurrentPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // console.log("new password here: ", newPassword);

    // Fetch user data from API
    // useEffect(() => {
    //     fetch('http://127.0.0.1:5000/get_user_lists')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             // console.log("user details data fetch here", data);
    //             setUserData(Array.isArray(data) ? data : []);
    //             setFilteredData(Array.isArray(data) ? data : []); // Set filteredData initially to all users
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching user data:', error);
    //             setUserData([]);
    //             setFilteredData([]); // Set filteredData to empty on error
    //             setLoading(false);
    //         });
    // }, []);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/get_user_lists')
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const reversedData = data.reverse(); // Reverse the array to show latest users first
                    setUserData(reversedData);
                    setFilteredData(reversedData);
                } else {
                    setUserData([]);
                    setFilteredData([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                setUserData([]);
                setFilteredData([]);
                setLoading(false);
            });
    }, []);


    // Handle search query change
    // const handleSearchChange = (e) => {
    //     setSearchQuery(e.target.value);
    //     filterUsers(e.target.value.trim()); // Filter users as search query changes
    // };

    const handleSearchChange = (e) => {
        const trimmedValue = e.target.value.replace(/\s+/g, " ").trim(); // ✅ Replace multiple spaces with a single space
        setSearchQuery(trimmedValue);
        filterUsers(trimmedValue); // ✅ Filter users with cleaned query
    };
    

    // Filter users based on usercode and name & email
    const filterUsers = (query) => {
        if (!query) {
            setFilteredData(userData); // If no search query, show all users
        } else {
            const filtered = userData.filter((user) =>
                user.User_Code.toLowerCase().includes(query.toLowerCase()) ||
                `${user.User_First_Name} ${user.User_Last_Name}`.toLowerCase().includes(query.toLowerCase()) ||
                user.User_Email.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const handleAction = (userId, action) => {
        if (action === 'Edit') {
            navigate(`/edit/${userId}`);
        }
    };

    const handleView = (userId, action) => {
        if (action === 'View') {
            navigate(`/view/${userId}`);
        }
    };

    const handleAddUserClick = () => {
        navigate('/addUser'); // Navigate to AddUserDetailsPage
    };

    // Open modal to change password and fetch the current password if necessary
    const changePassword = (userId) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
        // fetchUserDetailsById(userId);
    };

    // Fetch the user's current password when changing it (for validation or to show in the modal)
    // const fetchUserDetailsById = (userId) => {
    //     fetch(`http://127.0.0.1:5000/get_user_by_id/${userId}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log("User data fetched for password change: ", data);
    //             if (data && data.User_Password) {
    //                 setCurrentPassword(data.User_Password); // Set current password (for validation or to show as placeholder)
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error fetching user details by ID:', error);
    //         });
    // };

    // Handle password change request
    // const handlePasswordChange = () => {
    //     const payload = {
    //         User_Id: selectedUserId,
    //         New_Password: newPassword
    //     };

    //     // console.log("payload", payload);

    //     // Make an API call to update the password
    //     fetch('http://127.0.0.1:5000/change_user_password', {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(payload)
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             // console.log('Password updated successfully here:', data);

    //             // Check if message indicates success
    //             if (data.message === "Password updated successfully") {
    //                 // alert(`Password for user ${selectedUserId} has been updated.`);
    //                 toast.success(`Password for user ${selectedUserId} has been updated.`);
    //                 setIsModalOpen(false); // Close the modal
    //             } else {
    //                 // alert('Failed to update the password.');
    //                 toast.success("Failed to update the password.");

    //             }
    //         })
    //         .catch(error => {
    //             // console.error('Error updating password:', error);
    //             // alert('Error updating password.');
    //             toast.success("Error updating password !");
    //         });
    // };

    const handlePasswordChange = () => {
        if (!newPassword.trim()) {
            toast.error("Please enter a new password before updating.");
            return;
        }
    
        const payload = {
            User_Id: selectedUserId,
            New_Password: newPassword
        };
    
        fetch('http://127.0.0.1:5000/change_user_password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Password updated successfully") {
                toast.success(`Password for user ${selectedUserId} has been updated.`);
                setIsModalOpen(false); // Close modal
                setNewPassword(""); // Clear input after success
            } else {
                toast.error("Failed to update the password.");
            }
        })
        .catch(error => {
            toast.error("Error updating password!");
        });
    };
    

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close modal without changing password
    };

    return (
        <div className="container mt-0">
            <div className='row my-2'>
                <div className='col-lg-6'>

                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <input
                            type="search"
                            placeholder=" &#128269; Please Search user by User_Code, Name  & Email ...."
                            className="form-control"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="text-end">
                        <button className="btn btn-primary" onClick={handleAddUserClick}>
                            <IoAddCircle size={20} color='orange' className='mb-1' /> Add User
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <p>Loading user details...</p>
            ) : (
                <div className="row mt-0">
                    <div className="col-lg-12">
                        <table className="table table-bordered shadow">
                            <thead>
                                <tr>
                                    <th> Full Name</th>
                                    <th>User Code</th>

                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>Roles</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((user) => (
                                        <tr key={user.User_Id} className='fetchuser_details'>
                                            <td>
                                                {user.User_First_Name.charAt(0).toUpperCase() + user.User_First_Name.slice(1).toLowerCase()}
                                                {" "}
                                                {user.User_Last_Name.charAt(0).toUpperCase() + user.User_Last_Name.slice(1).toLowerCase()}
                                            </td>
                                            <td>{user.User_Code}</td>
                                            <td>{user.User_Email}</td>
                                            <td>{user.User_Password ? '**********' : 'No Password'}</td>
                                            <td>
                                                <div className="dropdown">
                                                    <span className="dropdown-toggle" type="button" id={`roleDropdown${user.User_Id}`} data-bs-toggle="dropdown" aria-expanded="false">
                                                        {user.roles.length > 1 ? `Multiple Roles (${user.roles.length})` : user.roles[0].Role_Name}
                                                    </span>
                                                    <ul className="dropdown-menu" aria-labelledby={`roleDropdown${user.User_Id}`}>
                                                        {user.roles.map((role, index) => (
                                                            <li key={index}>
                                                                <a className="dropdown-item" href="#!">
                                                                    {role.Role_Name} - ( {role.Status} )
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </td>
                                            <td>{user.User_Status}</td>
                                            <td style={{ width: '200px' }} className='text-center'>
                                                <div className="dropdown">
                                                    <button className="btn btn-primary dropdown-toggle" type="button" id={`actionDropdown${user.User_Id}`} data-bs-toggle="dropdown" aria-expanded="false">
                                                        Actions
                                                    </button>
                                                    <ul className="dropdown-menu" aria-labelledby={`actionDropdown${user.User_Id}`}>
                                                        <li>
                                                            <a className="dropdown-item" href="#!" onClick={() => handleAction(user.User_Id, 'Edit')}>
                                                                <MdEditSquare size={20} color="orange" className="mb-1" /> Edit
                                                            </a>
                                                        </li>

                                                        <li>
                                                            <a className="dropdown-item" href="#!" onClick={() => handleView(user.User_Id, 'View')}>
                                                                <FaEye size={20} color="orange" className="mb-1" /> View
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a className="dropdown-item" href="#!" onClick={() => changePassword(user.User_Id)}>
                                                                <FaKey size={20} color="orange" className="mb-1" /> Change Password
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            <h5 className='text-primary'>
                                                <span role="img" aria-label="search" >&#128269; No data found &#128577;</span>
                                            </h5>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal for Change Password */}
            {isModalOpen && (
         
                <div className="modal" tabIndex="-1" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-primary">
                                    <FaLock className="mb-2" /> Change Password
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">

                                <div className="input-group">
                                    {/* Lock Icon at the Beginning */}
                                    <span className="input-group-text">
                                        <FaLock />
                                    </span>

                                    {/* Password Input Field */}
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />

                                    {/* Eye Icon Button to Toggle Visibility */}
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>

                            </div>
                            <div className="modal-footer">
                                {/* Close Button with Icon */}
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    <FaTimes className="me-1" /> Close
                                </button>

                                {/* Save Password Button with Icon */}
                                {/* <button type="button" className="btn btn-primary" onClick={handlePasswordChange}>
                                    <FaSave className="me-1" /> Save Password
                                </button> */}
                                <button 
    className="btn btn-primary"
    onClick={handlePasswordChange}
    // disabled={!newPassword.trim()} // Disable if empty
>
    Update Password
</button>

                            </div>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
};

export default FetchUserDetails;
