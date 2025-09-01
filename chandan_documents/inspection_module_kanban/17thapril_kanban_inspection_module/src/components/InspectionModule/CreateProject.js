import React, { useState, useEffect } from 'react';
import './CreateProject.css';
import { FaFolderPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CreateProject = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTable, setShowTable] = useState(false);

    const [projectname, setprojectname] = useState('');
    const [customername, setcustomername] = useState('');
    const [customerpo, setcustomerpo] = useState('');
    const [deliverydate, setdeliverydate] = useState('');

    const [searchQuery, setSearchQuery] = useState('');

    const fetchProejct = () => {
        fetch('http://127.0.0.1:5000/get_all_projects')
            .then(response => response.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProejct();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem("userData"));
        const userCode = currentUser?.User_code || "Unknown User";

        const newProject = {
            project_name: projectname,
            customer: customername,
            customer_po: customerpo,
            delivery_date: deliverydate,
            created_by: userCode,
            modified_by: userCode,
        };

        console.log("New Project Data:", newProject);

        fetch('http://127.0.0.1:5000/add_project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProject),
        })
            .then(response => response.json())
            .then(data => {
                setProjects([...projects, data]);
                toast.success(`Project Created Successfully`);
                fetchProejct();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

                setprojectname('');
                setcustomername('');
                setcustomerpo('');
                setdeliverydate('');
            })
            .catch(error => {
                console.error('Error creating project:', error);
                alert('Error creating project');
            });
    };

    const filteredProjects = projects.filter(project => {
        const projectName = typeof project?.project_name === 'string' ? project.project_name.toLowerCase() : '';
        const customerName = typeof project?.customer === 'string' ? project.customer.toLowerCase() : '';
        const query = searchQuery?.toLowerCase() || '';

        return projectName.includes(query) || customerName.includes(query);
    });



    return (
        <div className="container" style={{ marginTop: '140px' }}>
            <h3 className="text-primary text-center"><FaFolderPlus className="me-2 mb-1" /> Create Project</h3>

            {/* Toggle Button + Search */}
            <div className="row mb-3">
                <div className="col-lg-7">
                    {showTable ? (
                        <button className="btn btn-danger" onClick={() => setShowTable(false)}>
                            ❌ Close Projects
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={() => setShowTable(true)}>
                            View Projects
                        </button>
                    )}
                </div>
                {showTable && (
                    <div className='col-lg-5'>
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="search"
                                className="form-control"
                                placeholder="🔍 Search by Project or Customer name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                )}

            </div>

            {/* Table */}
            {showTable && (
                <>
                    {loading ? (
                        <div>Loading projects...</div>
                    ) : (
                        <div className="row my-3">
                            <div className="col-lg-12">
                                <div className="table-scroll-container">
                                    <table className="table table-bordered table-hovered">
                                        <thead>
                                            <tr>
                                                <th>Project_id</th>
                                                <th>Project_name</th>
                                                <th>Customer Name</th>
                                                <th>Customer_po</th>
                                                <th>Delivery_date</th>
                                                <th>Created_by</th>
                                                <th>Created_Date</th>
                                                <th>Modified_by</th>
                                                <th>Modified_Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProjects.map(project => (
                                                <tr key={project.project_id}>
                                                    <td>{project.project_id}</td>
                                                    <td>{project.project_name}</td>
                                                    <td>{project.customer}</td>
                                                    <td>{project.customer_po}</td>
                                                    <td>{project.delivery_date}</td>
                                                    <td>{project.created_by}</td>
                                                    <td>{project.created_date}</td>
                                                    <td>{project.modified_by || '-------------'}</td>
                                                    <td>{project.modified_date || '-------------'}</td>
                                                </tr>
                                            ))}
                                            {filteredProjects.length === 0 && (
                                                <tr>
                                                    <td colSpan="9" className="text-center text-muted">
                                                        No projects found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Form */}
            {!showTable && (
                <div className="row">
                    <div className='col-lg-2'></div>
                    <div className='col-lg-8'>
                        <div className='border p-3 rounded'>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="project_name" className="form-label">Project Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={projectname}
                                        onChange={(e) => setprojectname(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="customer" className="form-label">Customer Name</label>
                                    <select
                                        className="form-control"
                                        value={customername}
                                        onChange={(e) => setcustomername(e.target.value)}
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
                                    <label htmlFor="customer_po" className="form-label">Customer PO</label>
                                    <select
                                        className="form-control"
                                        value={customerpo}
                                        onChange={(e) => setcustomerpo(e.target.value)}
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
                                    <label htmlFor="delivery_date" className="form-label">Delivery Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={deliverydate}
                                        onChange={(e) => setdeliverydate(e.target.value)}
                                        min={new Date().toISOString().split("T")[0]} 

                                        required
                                    />
                                </div>
                                <div className='text-center'>
                                    <button type="submit" className="btn btn-primary">Create Project</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='col-lg-2'></div>
                </div>
            )}
        </div>
    );
};

export default CreateProject;
