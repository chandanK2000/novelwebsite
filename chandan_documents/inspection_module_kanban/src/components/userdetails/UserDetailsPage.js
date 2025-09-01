import React from 'react';
// import { useNavigate } from 'react-router-dom';
import './UserDetailsPage.css';
import FetchUserDetails from './FetchUserDetails';
// import { IoAddCircle } from 'react-icons/io5';

const UserDetailsPage = () => {
  // const navigate = useNavigate(); // For navigation to AddUserDetailsPage
  

  // const handleAddUserClick = () => {
  //   navigate('/addUser'); // Navigate to AddUserDetailsPage
  // };

  return (
    <div className="container" style={{marginTop:'130px'}}>
      <h2 className="pagesHeading my-4">User Details Page</h2>
      <div className="row mb-4">
        {/* <div className="col-lg-6">
          <input 
            type="search" 
            placeholder="Please search user" 
            className="form-control" 
            value={searchQuery} 
            onChange={handleSearchChange} 
          />
        </div> */}
        {/* <div className="col-lg-6">
          <div className="text-end">
            <button className="btn btn-primary" onClick={handleAddUserClick}> <IoAddCircle size={20} color='orange' className='mb-1' /> Add User</button>
          </div>
        </div> */}
      </div>
      <div className="row">
        <div className="col-lg-12">
          <FetchUserDetails  />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
