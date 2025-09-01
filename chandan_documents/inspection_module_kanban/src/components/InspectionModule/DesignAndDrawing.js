import React, { useEffect, useState } from 'react';
import './DesignAndDrawing.css';
import { toast } from 'react-toastify';
import { FaPencilRuler } from 'react-icons/fa';
import Select from 'react-select';


const DesignAndDrawing = () => {
    const [selectedProject, setSelectedProject] = useState('');
    const [drawingDoc, setDrawingDoc] = useState(null);
    const [documentNo, setDocumentNo] = useState('');
    const [reviewDate, setReviewDate] = useState('');
    const [versionNo, setVersionNo] = useState('');
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const materialsOptions = [
        { value: 'Material A', label: 'Material A' },
        { value: 'Material B', label: 'Material B' },
        { value: 'Material C', label: 'Material C' },
        { value: 'Material D', label: 'Material D' },
        { value: 'Material E', label: 'Material E' }
    ];

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/get_all_projects');
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const currentUser = JSON.parse(localStorage.getItem("userData"));
        const userCode = currentUser?.User_code || "Unknown User";

        const formData = new FormData();
        formData.append('project_name', selectedProject);
        formData.append('file', drawingDoc);
        formData.append('document_no', documentNo);
        formData.append('review_date', reviewDate);
        formData.append('version_no', versionNo);
        formData.append('created_by', userCode);
        formData.append('modified_by', userCode);
        formData.append('bom', JSON.stringify(selectedMaterials.map(item => item.value)));

        try {
            const response = await fetch('http://127.0.0.1:5000/add_or_update_design', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Design & Drawing Saved Successfully!');
                setSelectedProject('');
                setDrawingDoc(null);
                setDocumentNo('');
                setReviewDate('');
                setVersionNo('');
                setSelectedMaterials([]);
            } else {
                throw new Error(data.message || "Unknown error");
            }
        } catch (error) {
            console.error('Submit Error:', error);
            toast.error('Failed to save design & drawing');
        } finally {
            setLoading(false); // 🔚 end loading
        }
    };

    return (
        <div className='container' style={{ marginTop: '140px' }}>
            <h3 className='text-primary text-center'>
                <FaPencilRuler className="me-2 mb-1" /> Design and Drawing
            </h3>

            <div className='row'>
                <div className='col-lg-2'></div>
                <div className='col-lg-8'>
                    <div className='border p-3 rounded position-relative'>

                        {loading && (
                            <div className="loading-overlay">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-1">
                                <label className="form-label">Project Name</label>
                                <select
                                    className="form-control"
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    required
                                >
                                    <option value="">Select a Project</option>
                                    {projects.map((project) => (
                                        <option key={project.project_id} value={project.project_name}>
                                            {project.project_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="form-label">Drawing Document</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setDrawingDoc(e.target.files[0])}
                                    required
                                />
                            </div>

                            <div className="mb-2">
                                <label className="form-label">Document No</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={documentNo}
                                    onChange={(e) => setDocumentNo(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-2">
                                <label className="form-label">Review Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={reviewDate}
                                    onChange={(e) => setReviewDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-2">
                                <label className="form-label">Version No</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={versionNo}
                                    onChange={(e) => setVersionNo(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-2">
                                <label className="form-label">BOM (Bill of Materials)</label>
                                <Select
                                    options={materialsOptions}
                                    isMulti
                                    value={selectedMaterials}
                                    onChange={setSelectedMaterials}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Select materials..."
                                    menuPlacement="top"
                                />
                            </div>

                            <div className='text-center'>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                                style={{ marginRight: '8px' }}
                                            ></span>
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Design & Drawing"
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
                <div className='col-lg-2'></div>
            </div>
        </div>
    );
};

export default DesignAndDrawing;
