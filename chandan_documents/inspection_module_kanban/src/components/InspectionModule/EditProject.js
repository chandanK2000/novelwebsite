import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditProject = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [projectname, setProjectName] = useState('');
    const [customername, setCustomerName] = useState('');
    const [customerpo, setCustomerPO] = useState('');
    const [deliverydate, setDeliveryDate] = useState('');

    useEffect(() => {
        const fetchProjectById = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:5000/get_project/${id}`);
                const data = await res.json();

                // Set the state values with fetched data
                setProjectName(data.project_name);
                setCustomerName(data.customer);  // Make sure this matches the `customername` dropdown options
                setCustomerPO(data.customer_po); // Make sure this matches the `customerpo` dropdown options
                setDeliveryDate(data.delivery_date);
            } catch (err) {
                console.error('Error fetching project:', err);
                toast.error('Failed to fetch project data');
            }
        };

        fetchProjectById();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const currentUser = JSON.parse(localStorage.getItem("userData"));
        const userCode = currentUser?.User_code || "Unknown User";
    
        const updatedProject = {
            project_name: projectname,
            customer: customername,
            customer_po: customerpo,
            delivery_date: deliverydate,
            modified_by: userCode,
        };
    
        try {
            const res = await fetch('http://127.0.0.1:5000/add_project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProject),
            });
    
            const data = await res.json();
    
            if (res.ok) {
                toast.success('Project added/updated successfully!');
                navigate('/createproject');
            } else {
                throw new Error(data.message || 'Failed to add/update');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error adding/updating project');
        }
    };

    return (
        <div className="container" style={{ marginTop: '140px' }}>
            <h3 className="text-primary text-center mb-4">Edit Project</h3>
            <div className='row'>
                <div className='col-lg-2'></div>
                <div className='col-lg-8'>
                  <div className='border rounded p-4'>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Project Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={projectname}
                                onChange={(e) => setProjectName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Customer Name</label>
                            <select
                                className="form-control"
                                value={customername}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                            >
                                <option value="">Select a Customer</option>
                                <option value="Customer 1">Customer 1</option>
                                <option value="Customer 2">Customer 2</option>
                                <option value="Customer 3">Customer 3</option>
                                <option value="Customer 4">Customer 4</option>
                                <option value="Customer 5">Customer 5</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Customer PO</label>
                            <select
                                className="form-control"
                                value={customerpo}
                                onChange={(e) => setCustomerPO(e.target.value)}
                                required
                            >
                                <option value="">Select a PO</option>
                                <option value="PO12345">PO12345</option>
                                <option value="PO67890">PO67890</option>
                                <option value="PO11223">PO11223</option>
                                <option value="PO44556">PO44556</option>
                                <option value="PO78901">PO78901</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Delivery Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={deliverydate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Update Project</button>
                        </div>
                    </form>
                  </div>
                </div>
                <div className='col-lg-2'></div>
            </div>
        </div>
    );
};

export default EditProject;
