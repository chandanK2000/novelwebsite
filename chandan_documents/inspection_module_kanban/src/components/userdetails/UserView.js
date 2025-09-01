import React, { useState, useEffect } from 'react';
import {useParams } from 'react-router-dom';
import './UserView.css'; // Ensure you import the CSS file
import { FaUsers } from "react-icons/fa"; // Import Users Icon

const UserView = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userId } = useParams();
    useEffect(() => {
        // console.log('Fetching user data for userId:', userId); 
    
        // Fetch user data based on userId
        fetch(`http://127.0.0.1:5000/get_user_by_id/${userId}`)
            .then((response) => {
                if (!response.ok) {
                    console.error('Failed to fetch user data, status:', response.status); // Log error status
                    throw new Error('Failed to fetch user data');
                }
                console.log('Response received:', response); // Log the raw response
                return response.json(); // Parse the JSON response
            })
            .then((data) => {
                // console.log('Fetched user data:', data); 
                setUser(data);
                setLoading(false);
            })
            .catch((error) => {
                // console.error('Error fetching user data:', error);
                setError(error.message);
                setLoading(false);
            });
    }, [userId]);
    
    const handleGoBack = () => {
        window.location.href="/admin-dashboard"
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container user-view-container" style={{ marginTop: '120px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <h3 className="text-center mb-4 pagesHeading">
                        <button onClick={handleGoBack} className="btn btn-primary mb-3 d-block mx-auto">
                            Back
                        </button>
                        <FaUsers className="text-primary mb-2" size={24}/> User Details Available
                    </h3>

                    {user && user.user && (
                        <div className="user-details-card">
                            <div className="d-flex justify-content-between">
                                <div className="user-details">
                                    <p><strong>User Code:</strong> {user.user.userCode}</p>
                                    <p><strong>Full Name:</strong> {user.user.firstName} {user.user.lastName}</p>
                                    <p><strong>Email:</strong> {user.user.email}</p>
                                    <p><strong>Status:</strong> {user.user.status}</p>
                                </div>

                                <div className="roles-section">
                                    <strong>Roles:</strong>
                                    <ul className="list-unstyled">
                                        {user.user.roles && user.user.roles.length > 0 ? (
                                            user.user.roles.map((role, index) => (
                                                <li key={index} className="role-item">
                                                    <strong>{role.Role_Name}</strong> - <span className='text-primary'>({role.Status})</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No roles assigned</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserView;
