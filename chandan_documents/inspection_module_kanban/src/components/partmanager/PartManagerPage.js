import React, { useState, useEffect } from 'react';
import './PartManagerPage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { MdEditSquare } from "react-icons/md";
import { RiRecordCircleFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import SpinnerLoader from '../../pages/loaderspinner/SpinnerLoader';
import { FaSearch } from "react-icons/fa";


const PartManagerPage = () => {
    const [partsData, setPartsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [collapseEmpty, setCollapseEmpty] = useState(false);
    const [emptyColumns, setEmptyColumns] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [disabledActions, setDisabledActions] = useState([]);
    const [editedPartsData, setEditedPartsData] = useState({});
    const [isTableVisible, setTableVisible] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const navigate = useNavigate();

    const fetchPartsData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/parts_list');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log("Fetched data here:", data); // Add this to debug
            // Ensure partsData is always an array
            const validData = Array.isArray(data) ? data : [];
            setPartsData(validData);

            // Identifying columns with empty data
            const emptyCols = new Set();
            if (validData.length > 0) {
                Object.keys(validData[0]).forEach((key) => {
                    // Check if the entire column for this key is empty
                    if (validData.every((row) => !row[key])) {
                        emptyCols.add(key);
                    }
                });
            }
            setEmptyColumns(emptyCols);

            // Add parts with ACTIVE = "NO" to disabledActions
            const disabledParts = validData
                .filter(part => part.ACTIVE === "NO")
                .map(part => part.PART_ID);
            setDisabledActions(disabledParts);

        } catch (error) {
            setError(error.message); // Set error message in case of failure
        } finally {
            setLoading(false); // Ensure loading is set to false whether fetch succeeds or fails
        }
    };

    useEffect(() => {
        fetchPartsData();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [filteredPartsData, setFilteredPartsData] = useState([]);

    // Function to escape special characters in search query for regex matching
    const escapeRegex = (str) => {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };

    useEffect(() => {
        if (Array.isArray(partsData)) {
            const escapedQuery = escapeRegex(searchQuery.trim());
            const regex = new RegExp(escapedQuery, 'i');

            const filteredData = partsData.filter(part => {
                const partNumber = part.PARTNO || '';
                const modelNumber = part.MODEL || '';
                return regex.test(partNumber) || regex.test(modelNumber);
            });

            setFilteredPartsData(filteredData); // Update filtered data state
        }
    }, [partsData, searchQuery]); // Re-run when partsData or searchQuery changes

    // Update pagination logic when filteredPartsData or currentPage changes
    useEffect(() => {
        // Calculate total pages based on filtered data
        const totalPages = Math.ceil(filteredPartsData.length / itemsPerPage);

        // If the current page exceeds the total pages, reset to the last valid page
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [filteredPartsData, currentPage]);

    // Calculate current items for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPartsData.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total pages
    const totalPages = Math.ceil(filteredPartsData.length / itemsPerPage);

    // Define page limits and calculate page numbers
    const pageLimit = 5;
    let pages = [];

    if (totalPages <= pageLimit) {
        pages = [...Array(totalPages)].map((_, index) => index + 1);
    } else {
        const start = Math.max(1, currentPage - Math.floor(pageLimit / 2));
        const end = Math.min(totalPages, start + pageLimit - 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (start > 2) {
            pages = [1, '...'].concat(pages);
        }

        if (end < totalPages - 1) {
            pages.push('...');
            pages.push(totalPages);
        }
    }

    // Paginate to a specific page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);



    // if (error) {
    //     return <div>Error: {error}</div>;
    // }


    const handleAction = (action, part) => {
        const currentUser = JSON.parse(localStorage.getItem('userData'));

        if (action === 'edit') {
            setEditedPartsData((prev) => ({
                ...prev,
                [part.PART_ID]: {
                    ...part,
                    STATUS: part.STATUS === 'YES' ? 'ACTIVE' : 'INACTIVE',
                },
            }));
        } else if (action === 'delete') {
            Swal.fire({
                title: 'Are you sure you want to Inactivate this part?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Inactivate it!',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                width: '350px',
                customClass: {
                    title: 'custom-title',
                    popup: 'custom-popup',
                    confirmButton: 'custom-button',
                    cancelButton: 'custom-button',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`http://127.0.0.1:5000/delete_parts/${part.PART_ID}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            MODIFIED_BY: currentUser?.User_code || 'Unknown',
                        }),
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Failed to Inactivate the part');
                            }

                            Swal.fire('The part has been Inactivated successfully.', 'success');
                            window.location.reload();
                            setPartsData((prevData) => {
                                return prevData.map((p) =>
                                    p.PART_ID === part.PART_ID
                                        ? { ...p, STATUS: 'NO', ACTIVE: 'NO' }
                                        : p
                                );
                            });
                        })
                        .catch((error) => {
                            Swal.fire('Error!', 'There was an error inactivating the part.', 'error');
                        });
                } else {
                    Swal.fire('Cancelled', 'The Inactivate action was cancelled.', 'info');
                }
            });
        }
    };


    const handleSave = (partId) => {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        const updatedPart = editedPartsData[partId];


        // Trim and validate PARTNO to ensure it's not empty or only whitespace
        const trimmedPartNo = updatedPart.PARTNO.trim();

        if (!trimmedPartNo) {
            toast.error('Part number cannot be empty!', 'error');
            return; // Prevent saving if PARTNO is empty after trimming
        }


        const isDuplicatePartNo = partsData.some(
            (part) =>
                part.PARTNO === updatedPart.PARTNO && part.PART_ID !== partId // Ensure that the current part is excluded from the check
        );

        // If a duplicate PARTNO is found, show an error message and return
        if (isDuplicatePartNo) {
            toast.error('Duplicate PARTNO found!', 'error');
            return; // Prevent the API call if the PARTNO is duplicate
        }
        // API call for saving the updated part
        fetch(`http://127.0.0.1:5000/update_parts/${partId}`, {
            method: 'PUT', // Use PUT method for update
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...updatedPart,
                MODIFIED_BY: currentUser?.User_code || 'Unknown',
            }),
        })
            .then((response) => {
                // Show a confirmation dialog before updating the part
                Swal.fire({
                    title: 'Are you sure you want to update this part?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, update it!',
                    cancelButtonText: 'Cancel',
                    reverseButtons: true,
                    width: '350px',
                    customClass: {
                        title: 'custom-title',
                        popup: 'custom-popup',
                        confirmButton: 'custom-button',
                        cancelButton: 'custom-button',
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        // If "Yes, update it!" is clicked
                        if (!response.ok) {
                            throw new Error('Failed to update the part');
                        }
                        Swal.fire('Part updated successfully!', 'The part details have been updated.', 'success');
                        // After saving, update the local state to reflect changes
                        window.location.reload(); // You may want to remove this if you prefer to update the UI without reload
                        setPartsData(partsData.map((part) => (part.PART_ID === partId ? updatedPart : part)));
                        setEditedPartsData((prev) => {
                            const newEditedData = { ...prev };
                            delete newEditedData[partId];
                            return newEditedData;
                        });
                    } else {
                        // If "Cancel" is clicked, apply custom styling or action
                        Swal.fire({
                            title: 'Update Cancelled',
                            text: 'You have decided not to update the part.',
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
                        // Additional actions if needed, such as resetting any state or UI elements
                        console.log('Update process has been canceled.');
                    }

                });
            })
            .catch((error) => {
                Swal.fire('Error!', 'There was an error updating the part.', 'error');
            });

    };


    const handleAddPartClick = () => {
        navigate('/add-part-manager');
    };

    // Handle input change for editable fields
    const handleInputChange = (e, key, partId) => {
        setEditedPartsData((prev) => ({
            ...prev,
            [partId]: {
                ...prev[partId],
                [key]: e.target.value,
            },
        }));
    };



    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(partsData); // Convert JSON data to sheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, "Parts Data"); // Append sheet to workbook

        // Write Excel file and trigger download
        XLSX.writeFile(wb, "parts_data.xlsx");
    };

    const DeleteRow = (partId) => {
        const currentUser = JSON.parse(localStorage.getItem('userData')); // Get the current user from local storage

        let roleName = '';
        // First check if the currentUser exists and has roles
        if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
            // Accessing the role name from the first role element
            roleName = currentUser.roles[0].Role_Name;

            // Check if the user has the "Admin" role
            if (roleName !== 'Admin') {
                // If the user is not an Admin, show an error and prevent the delete action
                Swal.fire('Permission Denied', 'You do not have permission to delete this record.', 'error');
                return;
            }

            // Proceed with the delete action if the user is an admin
            console.log("Role name is:", roleName);
            // Perform the delete action here

        } else {
            // Handle case where the user doesn't have roles or is not properly authenticated
            Swal.fire('Error', 'User role not found. Unable to proceed with the action.', 'error');
        }


        // Proceed with the delete if the user is an admin
        Swal.fire({
            title: 'Are you sure you want to Delete this part?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            width: '350px',
            customClass: {
                title: 'custom-title',
                popup: 'custom-popup',
                confirmButton: 'custom-button',
                cancelButton: 'custom-button',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://127.0.0.1:5000/delete_parts_mst_record/${partId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        role_name: roleName,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.message === "Data deleted successfully") {
                            Swal.fire('Deleted!', 'The part has been deleted.', 'success');
                            // Update your state to remove the deleted part from the table
                            setPartsData((prevData) => prevData.filter(part => part.PART_ID !== partId));
                        } else {
                            Swal.fire('Error', data.message || 'An error occurred while deleting.', 'error');
                        }
                    })
                    .catch((error) => {
                        Swal.fire('Error', 'There was an issue with the delete request.', 'error');
                    });
            }
        });
    };


    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };


    return (
        <div className="container-fluid parts">
            <h3 className="pagesHeading">
                <i className="bi bi-wrench-adjustable-circle-fill"></i> Item Master ({filteredPartsData.length} Items)
            </h3>

            <div className="row">
                <div className="col-lg-4">


                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <input
                            type="search"
                            placeholder="Search Part By Model Number and Part Number !"
                            className="form-control"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value.trim());
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                </div>
                <div className="col-lg-4">
                    <button className="btn btn-success my-1 float-end" onClick={exportToExcel}>
                        <i className="bi bi-file-earmark-excel"></i> Export to Excel
                    </button>
                </div>
                <div className="col-lg-4">
                    <button className="btn btn-primary float-end" onClick={handleAddPartClick}>
                        <IoAddCircle size={20} color='orange' className='mb-1' /> Add Parts
                    </button>
                </div>
            </div>


            <div className='row'>
                <div className='col-lg-12'>
                    <button
                        className="btn btn-info mb-3"
                        onClick={handleToggleCollapse}
                    >
                        {isCollapsed ? 'Expand' : 'Collapse'} Table
                    </button>
                </div>
            </div>


            {isTableVisible && (
                <div className="table-responsive" style={{ minHeight: '190px', maxHeight: '400px', overflowY: 'auto', textAlign: 'center' }}>
                    {loading ? (
                        // <div className='spinnerloadercenter'>
                        //     <SpinnerLoader />
                        // </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>

                    ) : (
                        <>
                            {filteredPartsData.length === 0 ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px', width: '100%', textAlign: 'center' }}>
                                    <p className="text-primary">No parts available</p>
                                </div>

                            ) : (
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            {/* Always show these columns */}
                                            <th>Action</th>
                                            <th>PARTNO</th>
                                            <th>MODEL</th>
                                            <th>STATUS</th>
                                            <th>DESTINATION</th>
                                            <th>USEFOR</th>
                                            <th>USEDNAME</th>
                                            <th>ENGRAVINGNO</th>
                                            <th>CREATED_BY</th>
                                            <th>CREATED_DATE</th>
                                            <th>MODIFIED_BY</th>
                                            <th>MODIFIED_DATE</th>
                                            <th>PART_ID</th>

                                            {/* Render dynamic columns only if not collapsed */}
                                            {!isCollapsed && filteredPartsData.length > 0 &&
                                                Object.keys(filteredPartsData[0]).map((key) => {
                                                    if (
                                                        key !== 'id' &&
                                                        key !== 'PART_ID' &&
                                                        !['PARTNO', 'MODEL', 'STATUS', 'USEFOR', 'USEDNAME', 'DESTINATION', 'USERPARTNO', 'CREATED_BY', 'CREATED_DATE', 'MODIFIED_BY', 'MODIFIED_DATE'].includes(key) &&
                                                        (collapseEmpty ? !emptyColumns.has(key) : true)
                                                    ) {
                                                        return <th key={key}>{key}</th>;
                                                    }
                                                    return null;
                                                })
                                            }
                                            <th>Delete</th>

                                        </tr>
                                    </thead>

                                    <tbody>
                                        {currentItems.map((part, index) => {
                                            // const currentUser = JSON.parse(localStorage.getItem('userData'));

                                            return (
                                                <tr key={part.PART_ID} >

                                                    {/* Action button */}
                                                    <td>
                                                        {editedPartsData[part.PART_ID] ? (
                                                            <button className="btn btn-primary warnings" onClick={() => handleSave(part.PART_ID)}>
                                                                <RiRecordCircleFill color="orange" size={15} /> Update Records
                                                            </button>
                                                        ) : (
                                                            <div className="dropdown {part.STATUS === 'NO' ? 'table-disabled' : ''}">
                                                                <button
                                                                    className={`btn dropdown-toggle ${part.STATUS === 'NO' ? 'btn-secondary' : 'btn-success'}`}
                                                                    type="button"
                                                                    id={`dropdown-${index}`}
                                                                    data-bs-toggle="dropdown"
                                                                    aria-expanded="false"
                                                                    disabled={part.STATUS === 'NO'}
                                                                >
                                                                    <FaPlus color="orange" size={15} /> Actions
                                                                </button>
                                                                <ul className="dropdown-menu" aria-labelledby={`dropdown-${index}`}>
                                                                    <li>
                                                                        <button
                                                                            className="dropdown-item"
                                                                            onClick={() => handleAction('edit', part)}
                                                                            disabled={disabledActions.includes(part.PART_ID)}
                                                                        >
                                                                            <MdEditSquare size={20} color="orange" className="mb-1" /> Edit
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            className="dropdown-item"
                                                                            onClick={() => handleAction('delete', part)}
                                                                            disabled={disabledActions.includes(part.PART_ID)}
                                                                        >
                                                                            <MdEditSquare size={20} color="orange" className="mb-1" /> STATUS
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Editable fields */}
                                                    <td>
                                                        {editedPartsData[part.PART_ID] ? (
                                                            <input
                                                                type="text"
                                                                className='editedinputbox'
                                                                disabled

                                                                value={editedPartsData[part.PART_ID].PARTNO || ''}
                                                                onChange={(e) => handleInputChange(e, 'PARTNO', part.PART_ID)}
                                                            />
                                                        ) : (
                                                            part.PARTNO
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editedPartsData[part.PART_ID] ? (
                                                            <input
                                                                type="text"
                                                                className='editedinputbox'

                                                                value={editedPartsData[part.PART_ID].MODEL || ''}
                                                                onChange={(e) => handleInputChange(e, 'MODEL', part.PART_ID)}
                                                            />
                                                        ) : (
                                                            part.MODEL
                                                        )}
                                                    </td>
                                                    <td>{part.STATUS === 'YES' ? 'ACTIVE' : 'INACTIVE'}</td>
                                                    <td>
                                                        {editedPartsData[part.PART_ID] ? (
                                                            <input
                                                                type="text"
                                                                className='editedinputbox'

                                                                value={editedPartsData[part.PART_ID].DESTINATION || ''}
                                                                onChange={(e) => handleInputChange(e, 'DESTINATION', part.PART_ID)}
                                                            />
                                                        ) : (
                                                            part.DESTINATION || ''
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editedPartsData[part.PART_ID] ? (
                                                            <input
                                                                type="text"
                                                                className='editedinputbox'
                                                                value={editedPartsData[part.PART_ID].USEFOR || ''}
                                                                onChange={(e) => handleInputChange(e, 'USEFOR', part.PART_ID)}
                                                            />
                                                        ) : (
                                                            part.USEFOR || ''
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editedPartsData[part.PART_ID] ? (
                                                            <input
                                                                type="text"
                                                                className='editedinputbox'
                                                                value={editedPartsData[part.PART_ID].USEDNAME || ''}
                                                                onChange={(e) => handleInputChange(e, 'USEDNAME', part.PART_ID)}
                                                            />
                                                        ) : (
                                                            part.USEDNAME || ''
                                                        )}
                                                    </td>

                                                    <td>
                                                        {editedPartsData[part.PART_ID] ? (
                                                            <input
                                                                type="text"
                                                                className='editedinputbox'
                                                                value={editedPartsData[part.PART_ID].ENGRAVINGNO || ''}
                                                                onChange={(e) => handleInputChange(e, 'ENGRAVINGNO', part.PART_ID)}
                                                            />
                                                        ) : (
                                                            part.ENGRAVINGNO || ''
                                                        )}
                                                    </td>


                                                    

                                                    {/* Always show these columns */}
                                                    <td>{part.CREATED_BY || ''}</td>
                                                    <td>{part.CREATED_DATE || ''}</td>
                                                    <td>{part.MODIFIED_BY || ''}</td>
                                                    <td>{part.MODIFIED_DATE || ''}</td>
                                                    <td>{part.PART_ID}</td>

                                                    {/* Render dynamic columns only if not collapsed */}
                                                    {!isCollapsed &&
                                                        Object.keys(part).map((key) => {
                                                            if (
                                                                key !== 'id' &&
                                                                key !== 'PART_ID' &&
                                                                !['PARTNO', 'MODEL', 'STATUS', 'USEFOR', 'USEDNAME', 'DESTINATION', 'USERPARTNO', 'CREATED_BY', 'CREATED_DATE', 'MODIFIED_BY', 'MODIFIED_DATE'].includes(key)
                                                            ) {
                                                                return (
                                                                    <td key={key}>
                                                                        {editedPartsData[part.PART_ID] ? (
                                                                            <input
                                                                                className='editedinputbox'
                                                                                type="text"
                                                                                value={editedPartsData[part.PART_ID][key] || ''}
                                                                                onChange={(e) => handleInputChange(e, key, part.PART_ID)}
                                                                            />
                                                                        ) : (
                                                                            part[key] || ''
                                                                        )}
                                                                    </td>
                                                                );
                                                            }
                                                            return null;
                                                        })
                                                    }

                                                    <td>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => DeleteRow(part.PART_ID)}
                                                        >
                                                            <i className="bi bi-trash3-fill"></i>

                                                        </button>
                                                    </td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>
            )}



            {/* <div className='row'>
                <div className='col-lg-12'>
                    <div className="pagination-container my-4">
                        <button
                            className="paginate_button"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        {pages.map((page, index) =>
                            page === '...' ? (
                                <span key={index} className="paginate_button ellipsis">...</span>
                            ) : (
                                <button
                                    key={index}
                                    className={`paginate_button ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => paginate(page)}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            className="paginate_button"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div> */}

            <div className='row'>
                <div className='col-lg-12'>
                    {/* Show pagination only if there are items to paginate */}
                    {filteredPartsData.length > 0 ? (
                        <>
                            <div className="pagination-container my-4">
                                <button
                                    className="paginate_button"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>

                                {pages.map((page, index) =>
                                    page === '...' ? (
                                        <span key={index} className="paginate_button ellipsis">...</span>
                                    ) : (
                                        <button
                                            key={index}
                                            className={`paginate_button ${currentPage === page ? 'active' : ''}`}
                                            onClick={() => paginate(page)}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    className="paginate_button"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-data-message" style={{ height: '50px', width: '100%', textAlign: 'center' }}>
                            <p className="text-primary">...........</p>
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
};

export default PartManagerPage;
