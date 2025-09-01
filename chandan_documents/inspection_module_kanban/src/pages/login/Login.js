import React, { useState, useEffect } from 'react';
import './Login.css';
import { toast } from 'react-toastify';
import { FaKey, FaTimes } from "react-icons/fa"; // Import icons

const Login = ({ closeModal, onLoginSuccess }) => {
  const [usercode, setUsercode] = useState('');
  const [userpass, setUserPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldusercode, setOldUserCode] = useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(false); // Add state for new password visibility


  console.log("user password here", userpass);
  console.log("user usercode here", usercode);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const modalContent = document.querySelector('.modal-content');
      if (modalContent && !modalContent.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [closeModal]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible); // Toggle visibility for new password
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');

  //   if (!usercode || !userpass) {
  //     setError('All fields are required!');
  //     return;
  //   }

  //   const loginData = {
  //     User_code: usercode,
  //     password: userpass,
  //   };

  //   console.log(loginData);

  //   try {
  //     const response = await fetch('http://127.0.0.1:5000/user', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(loginData),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log('Login successful:', data);

  //       // Check if user status is active
  //       if (data.user_data.User_Status === "INACTIVE") {
  //         setError('The user is InActive. Please contact Admin!');
  //         return; // Prevent further actions
  //       }

  //       // Log the user data to confirm
  //       // console.log('User First Name:', data.user_data.User_First_Name);
  //       // console.log('User Last Name:', data.user_data.User_Last_Name);

  //       // Display the name in the toast notification
  //       toast.success(`${data.user_data.User_First_Name} ${data.user_data.User_Last_Name} Login successful`);

  //       // Store the user data in localStorage
  //       localStorage.setItem('userData', JSON.stringify(data.user_data));

  //       // Handle login success
  //       onLoginSuccess(data.user_data);
  //       closeModal();

  //     } else {
  //       const data = await response.json();
  //       setError(data.error || "Login failed. Please check your credentials.");
  //     }
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //     setError('An error occurred. Please try again.');
  //   }
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error message

    // Check if both fields are filled
    // if (!usercode || !userpass) {
    //   setError('All fields are required!');
    //   return;
    // }

    const loginData = {
      User_code: usercode,
      password: userpass,
    };

    console.log(loginData);

    try {
      const response = await fetch('http://127.0.0.1:5000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      // If the response is successful (status code 2xx)
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        // Check if user status is active
        if (data.user_data.User_Status === "INACTIVE") {
          setError('The user is Inactive. Please contact Admin!');
          return; // Prevent further actions
        }

        // Display success message with user's first and last name
        toast.success(`${data.user_data.User_First_Name} ${data.user_data.User_Last_Name} Login successful`);

        // Store the user data in localStorage
        localStorage.setItem('userData', JSON.stringify(data.user_data));

        // Handle login success
        onLoginSuccess(data.user_data);
        closeModal();

      } else {
        // If the response is not successful, handle the backend error
        const data = await response.json();

        // Display the backend error message (e.g., "Invalid User_Code or Password")
        setError(data.error || "Login failed. Please check your credentials.");
        // setUsercode('');
        // setUserPassword('');
        setTimeout(() => {
          setError('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    }
  };


  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();

    // Ensure old password, new password, and user code are available
    if (!oldPassword || !newPassword || !oldusercode) {
      setError('All fields are required!');
      return;
    }

    // Create data for the password change request
    const changePasswordData = {
      User_code: oldusercode,
      Old_Password: oldPassword,
      New_Password: newPassword,
    };

    console.log('Change Password Data:', changePasswordData);

    try {
      const response = await fetch('http://127.0.0.1:5000/Change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changePasswordData),
      });

      // Check if the response was successful
      const data = await response.json(); // Wait for the response to be parsed

      console.log('Password change response:', data);

      // If backend returns an error field, display the error message
      if (data.error) {
        setError(data.error); // Show the error from the backend
      } else if (data.message === 'Password updated successfully') {
        // Password change successful
        setError('Password updated successfully'); // Show success message
        setShowChangePasswordForm(false); // Hide the change password form
        // Clear the fields after successful password update
        setOldPassword('');
        setNewPassword('');
        setOldUserCode('');
        setTimeout(() => {
          setError(''); // Clear the success message
        }, 5000); // 5000ms = 5 seconds
      } else {
        // Fallback in case the response structure doesn't match
        setError('Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Error during password change:', error);
      setError('An error occurred while changing the password.');
    }
  };


  //forgot password functionality

  const forgotPassword = () => {
    setError('Please Contact to The Admin for Recover Your Password');
  
    setTimeout(() => {
      setError('');
    }, 2000);  
  }
  



  return (
    <div className="loginpage">
      <div className="modal show w-100" style={{ display: 'block' }} data-bs-backdrop="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"> <i className="bi bi-box-arrow-in-right"></i> Login</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body ">
              {error && <div className="alert alert-success">{error}</div>}

              {!showChangePasswordForm ? (
                <form onSubmit={handleSubmit} autoComplete="off">
               <div className="mb-3">
    <label htmlFor="usercode" className="form-label">
        <i className="bi bi-person-circle"></i> User Code
    </label>
    <div className="input-group">
        <span className="input-group-text">
            <i className="bi bi-person-circle"></i> {/* Bootstrap icon */}
        </span>
        <input
            type="text"
            className="form-control"
            id="usercode"
            value={usercode}
            onChange={(e) => setUsercode(e.target.value)}
        />
    </div>
</div>

{/* <div className="mb-3">
  <label htmlFor="password" className="form-label">
    <i className="bi bi-person-fill-lock"></i> Password
  </label>
  <div className="input-group">
    <input
      type={passwordVisible ? 'text' : 'password'}
      className="form-control"
      id="password"
      value={userpass}
      onChange={(e) => setUserPassword(e.target.value)}
    />
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={togglePasswordVisibility}
    >
      <i className={`bi ${passwordVisible ? 'bi-eye-slash' : 'bi-eye'}`}></i>
    </button>
  </div>
</div> */}

<div className="mb-3">
  <label htmlFor="password" className="form-label">
    <i className="bi bi-person-fill-lock"></i> Password
  </label>
  <div className="input-group">
    {/* Lock Icon at the Beginning */}
    <span className="input-group-text">
      <i className="bi bi-lock-fill"></i>
    </span>
    <input
      type={passwordVisible ? 'text' : 'password'}
      className="form-control"
      id="password"
      value={userpass}
      onChange={(e) => setUserPassword(e.target.value)}
    />
    {/* Eye Toggle Button */}
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={togglePasswordVisibility}
    >
      <i className={`bi ${passwordVisible ? 'bi-eye-slash' : 'bi-eye'}`}></i>
    </button>
  </div>
</div>



                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-box-arrow-in-right"></i> Login
                    </button>

                    <button type="button" className="btn btn-link" onClick={forgotPassword}>
                      Forgot Password
                    </button>
                    <button type="button" className="btn btn-link" onClick={() => setShowChangePasswordForm(true)}>
                      Change Password
                    </button>

               
                  </div>

                </form>
              ) : (
                <form onSubmit={handleChangePasswordSubmit} autoComplete="off">

<div className="mb-3">
  <label htmlFor="usercode" className="form-label">User Code</label>
  <div className="input-group">
    <span className="input-group-text">
      <i className="bi bi-person-circle"></i>
    </span>
    <input
      type="text"
      className="form-control"
      id="usercode"
      value={oldusercode}
      onChange={(e) => setOldUserCode(e.target.value)}
    />
  </div>
</div>

<div className="mb-3">
  <label htmlFor="oldPassword" className="form-label">Old Password</label>
  <div className="input-group">
    {/* Lock Icon */}
    <span className="input-group-text">
      <i className="bi bi-lock-fill"></i>
    </span>
    <input
      type="password"
      className="form-control"
      id="oldPassword"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
    />
  </div>
</div>

<div className="mb-3">
  <label htmlFor="newPassword" className="form-label">
    <i className="bi bi-person-fill-lock"></i> New Password
  </label>
  <div className="input-group">
    {/* Lock Icon */}
    <span className="input-group-text">
      <i className="bi bi-lock-fill"></i>
    </span>
    <input
      type={newPasswordVisible ? 'text' : 'password'}
      className="form-control"
      id="newPassword"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
    {/* Eye Toggle Button */}
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={toggleNewPasswordVisibility}
    >
      <i className={`bi ${newPasswordVisible ? 'bi-eye-slash' : 'bi-eye'}`}></i>
    </button>
  </div>
</div>


<div className="d-flex justify-content-between">
  <button type="submit" className="btn btn-primary">
    <FaKey className="me-2" />Change Password
  </button>
  <button
    type="button"
    className="btn btn-primary"
    onClick={() => setShowChangePasswordForm(false)}
  >
    <FaTimes className="me-2" /> Cancel
  </button>
</div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
