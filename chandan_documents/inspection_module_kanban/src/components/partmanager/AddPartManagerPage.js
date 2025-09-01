import React, { useState } from 'react';
import './AddPartManagerPage.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import xlsx library
import ExcelButton from '../../ExcelButton';
import { IoSave } from "react-icons/io5";


const AddPartManagerPage = () => {
    const currentUser = JSON.parse(localStorage.getItem('userData'));

    const initialFormData = {
        PARTNO: '',
        MODEL: '',
        BORDKIND: '',
        MARKMODEL1: '',
        MARKMODEL2: '',
        USEFOR: '',
        CHGMARK: '',
        SIZEFIG: '',
        SECTIONFIG: '',
        REMARK: '',
        OPERATEPOINT: '',
        DESTINATION: '',
        USERPARTNO: '',
        USEDNAME: '',
        SORT1: '',
        SORT2: '',
        LEADTIME: '',
        COSTPRICE: '',
        RESERVE01: '',
        RESERVE02: '',
        RESERVE03: '',
        RESERVE04: '',
        RESERVE05: '',
        RESERVE06: '',
        RESERVE07: '',
        RESERVE08: '',
        RESERVE09: '',
        RESERVE10: '',
        PICKING01: '',
        PICKING02: '',
        PICKING03: '',
        PICKING04: '',
        PICKING05: '',
        PICKING06: '',
        PICKING07: '',
        PICKING08: '',
        PICKING09: '',
        PICKING10: '',
        PC: '',
        ENGRAVINGNO:'',
        COLOR: '',
        IS_ENABLE: '',
        ACTIVE: 'YES',
        CREATED_BY: currentUser ? currentUser.User_code : '',
        MODIFIED_BY: currentUser ? currentUser.User_code : '',
    };
    console.log("INITIAL FORM DATA", initialFormData);

    const [formData, setFormData] = useState(initialFormData);
    const [selectedFile, setSelectedFile] = useState(null);  // To store the selected file
    const [partsData, setPartsData] = useState([]);  // To store file data after processing

    const navigate = useNavigate();

    console.log("form data", formData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     // Create a sanitized version of the form data
    //     const sanitizedFormData = Object.keys(formData).reduce((acc, key) => {
    //         const value = formData[key];

    //         // Check if the value is an empty string or empty number (0 or '')
    //         if (value === '' || value === 0 || value === '0') {
    //             acc[key] = null; // Set empty values to null
    //         } else {
    //             acc[key] = value;
    //         }

    //         return acc;
    //     }, {});

    //     // Perform validation
    //     if (!sanitizedFormData.PARTNO) {
    //         toast('Part Number is required');
    //         return; // Prevent form submission
    //     }

    //     if (!sanitizedFormData.MODEL) {
    //         toast('Model Number is required');
    //         return; // Prevent form submission
    //     }

    //     if (!sanitizedFormData.PC) {
    //         toast('PC is required');
    //         return; // Prevent form submission
    //     }

    //     // Submit the data if all required fields are filled
    //     fetch('http://127.0.0.1:5000/add_parts', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(sanitizedFormData),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             toast(`Part Number ${formData.PARTNO} Data Saved Successfully`);
    //             setFormData(initialFormData); // Clear the form after successful save
    //             // window.history.back();
    //             navigate(-1);
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //             toast("Error saving data.");
    //         });
    // };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a sanitized version of the form data
        const sanitizedFormData = Object.keys(formData).reduce((acc, key) => {
            const value = formData[key];

            // Check if the value is an empty string or empty number (0 or '')
            if (value === '' || value === 0 || value === '0') {
                acc[key] = null; // Set empty values to null
            } else {
                acc[key] = value;
            }

            return acc;
        }, {});

        // Perform validation
        if (!sanitizedFormData.PARTNO) {
            toast.error('Part Number is required');
            return; // Prevent form submission
        }

        if (!sanitizedFormData.MODEL) {
            toast.error('Model Number is required');
            return; // Prevent form submission
        }

        if (!sanitizedFormData.PC) {
            toast.error('PC is required');
            return; // Prevent form submission
        }

        console.log("sanitized_form_data", sanitizedFormData);

        // Submit the data if all required fields are filled
        fetch('http://127.0.0.1:5000/add_parts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedFormData),
        })
            .then((response) => {
                if (response.status === 400) {
                    // Handle case when part number already exists
                    return response.json().then((errorData) => {
                        throw new Error(errorData.error);
                    });
                }
                if (!response.ok) {
                    throw new Error('Failed to save data');
                }
                return response.json();
            })
            .then((data) => {
                toast.success(`Part Number ${formData.PARTNO} Data Saved Successfully`);
                setFormData(initialFormData); // Clear the form after successful save
                navigate(-1); // Navigate back to the previous page
            })
            .catch((error) => {
                console.error('Error:', error.message);
                toast.error(error.message); // Display the error message
            });
    };

    const GoBack = () => {
        window.history.back();
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);  // Store the selected file in state
    };

    const handleSave = () => {
        if (!selectedFile) {
            toast('Please select a file first');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const ab = event.target.result;
            const wb = XLSX.read(ab, { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws);
            setPartsData(data);  // Update state with file data

            // Check if required columns exist in the uploaded file
            if (!validateColumns(data)) {
                toast('Missing required columns in the file!');
                return; // Prevent further processing if columns are missing
            }

            // Send data to API for batch upload
            batchUploadPartsData(selectedFile); // Pass selected file to upload function
            setSelectedFile(null); // Reset state
            document.getElementById("fileUpload").value = null; // Clear the file input field

        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const validateColumns = (data) => {
        const requiredColumns = ['PC']; // Add other required columns if needed
        for (let column of requiredColumns) {
            if (!data[0].hasOwnProperty(column)) {
                toast(`Missing required column: ${column}`);
                return false;
            }
        }
        return true;
    };

    const batchUploadPartsData = (file) => {
        const formData = new FormData();
        formData.append('file', file);


        formData.append('created_by', currentUser ? currentUser.User_code : '');
        formData.append('modified_by', currentUser ? currentUser.User_code : '');

        fetch('http://127.0.0.1:5000/upload_parts_data_excel', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Data imported successfully") {
                    toast('Imported Parts Data Upload Successful!');
                } else if (data.message === "Data imported successfully, but duplicates records skipped") {
                    toast("Data Imported Scucessfully ! But Duplicate Records Terminated");
                }
                else {
                    toast("Please Check Parts Number,Model & Pc Fields!")
                }
            })
            .catch((error) => {
                console.error('Error Uploading Imported Parts Data:', error);
                toast('Error Uploading Parts Data');
            });
    };



    return (
        <div className='container p-3' style={{ marginTop: '110px' }}>
            {/* <button className='btn btn-primary' onClick={GoBack}></button> */}
            <div className='text-center my-0'>
            <button className='btn  btn-primary' onClick={GoBack}>Back</button> 
            </div>
            <h4 className='pagesHeading my-2'>Add Parts </h4>
            {/* <i className="bi bi-arrow-left-short" ></i> */}
            <div className='row'>
                <div className='col-lg-4'>
                    <div className="form-group">
                        <label htmlFor="fileUpload">Upload Excel File:</label>
                        <input
                            type="file"
                            id="fileUpload"
                            className="form-control"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>
                <div className='col-lg-4'>
                    <div className='my-4 d-flex justify-content-center'>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                        >
                            <IoSave color='orange' size={20} className='mb-1' /> Update Records
                        </button>
                    </div>
                </div>

                <div className='col-lg-4'>
                    <div className='my-4'>
                        <ExcelButton />
                    </div>
                </div>
            </div>



            {/* Optionally, you can display the parts data that was read from the file */}
            {/* <div>
                <h3>Uploaded Parts Data:</h3>
                <pre>{JSON.stringify(partsData, null, 2)}</pre>
            </div> */}


            <form onSubmit={handleSubmit}>
                <div className='row border p-3 rounded shadow-sm addDetailsParts'>
                    {/* PARTNO */}
                    <div className="col-lg-4 ">
                        <div className="form-group">
                            <label htmlFor="partno">PARTNO  <span>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="partno"
                                name="PARTNO"
                                value={formData.PARTNO}
                                onChange={handleInputChange}
                                placeholder="Please enter Part Number"

                            />
                        </div>
                    </div>

                    {/* MODEL */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="model">MODEL <span>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="model"
                                name="MODEL"
                                value={formData.MODEL}
                                onChange={handleInputChange}
                                placeholder="Please enter MODEL"

                            />
                        </div>
                    </div>

                    {/* PC */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="pc">PC  <span>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="pc"
                                name="PC"
                                value={formData.PC}
                                onChange={handleInputChange}
                                placeholder="Please Enter PC"

                            />
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="ENGRAVINGNO">ENGRAVINGNO <span>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="ENGRAVINGNO"
                                name="ENGRAVINGNO"
                                value={formData.ENGRAVINGNO}
                                onChange={handleInputChange}
                                placeholder="Please Enter ENGRAVINGNO"

                            />
                        </div>
                    </div>
                    {/* BORDKIND */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="borekind">BORDKIND</label>
                            <input
                                type="text"
                                className="form-control"
                                id="borekind"
                                name="BORDKIND"
                                value={formData.BORDKIND}
                                onChange={handleInputChange}
                                placeholder="Please Enter BORDKIND"
                            />
                        </div>
                    </div>

                    {/* MARKMODEL1 */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="markmodel1">MARKMODEL1</label>
                            <input
                                type="text"
                                className="form-control"
                                id="markmodel1"
                                name="MARKMODEL1"
                                value={formData.MARKMODEL1}
                                onChange={handleInputChange}
                                placeholder="Please Enter MARKMODEL1"
                            />
                        </div>
                    </div>

                    {/* MARKMODEL2 */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="markmodel2">MARKMODEL2</label>
                            <input
                                type="text"
                                className="form-control"
                                id="markmodel2"
                                name="MARKMODEL2"
                                value={formData.MARKMODEL2}
                                onChange={handleInputChange}
                                placeholder="Please Enter MARKMODEL2"
                            />
                        </div>
                    </div>

                    {/* USERFOR */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="userfor">USER FOR</label>
                            <input
                                type="text"
                                className="form-control"
                                id="userfor"
                                name="USEFOR"
                                value={formData.USEFOR}
                                onChange={handleInputChange}
                                placeholder="Please Enter USER FOR"
                            />
                        </div>
                    </div>

                    {/* CHGMARK */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="chgmark">CHGMARK</label>
                            <input
                                type="text"
                                className="form-control"
                                id="chgmark"
                                name="CHGMARK"
                                value={formData.CHGMARK}
                                onChange={handleInputChange}
                                placeholder="Please Enter CHGMARK"
                            />
                        </div>
                    </div>

                    {/* SIZEFIG */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="sizefig">SIZEFIG</label>
                            <input
                                type="text"
                                className="form-control"
                                id="sizefig"
                                name="SIZEFIG"
                                value={formData.SIZEFIG}
                                onChange={handleInputChange}
                                placeholder="Please Enter SIZEFIG"
                            />
                        </div>
                    </div>

                    {/* SECTIONFIG */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="sectionfig">SECTIONFIG</label>
                            <input
                                type="text"
                                className="form-control"
                                id="sectionfig"
                                name="SECTIONFIG"
                                value={formData.SECTIONFIG}
                                onChange={handleInputChange}
                                placeholder="Please Enter SECTIONFIG"
                            />
                        </div>
                    </div>

                    {/* REMARK */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="remark">REMARK</label>
                            <input
                                type="text"
                                className="form-control"
                                id="remark"
                                name="REMARK"
                                value={formData.REMARK}
                                onChange={handleInputChange}
                                placeholder="Please Enter REMARK"
                            />
                        </div>
                    </div>

                    {/* OPERATIONPOINT */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="opertaionpoint">OPERATIONPOINT</label>
                            <input
                                type="text"
                                className="form-control"
                                id="opertaionpoint"
                                name="OPERATEPOINT"
                                value={formData.OPERATEPOINT}
                                onChange={handleInputChange}
                                placeholder="Please Enter OPERATIONPOINT"
                            />
                        </div>
                    </div>

                    {/* DESTINATION */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="destination">DESTINATION</label>
                            <input
                                type="text"
                                className="form-control"
                                id="destination"
                                name="DESTINATION"
                                value={formData.DESTINATION}
                                onChange={handleInputChange}
                                placeholder="Please Enter DESTINATION"
                            />
                        </div>
                    </div>

                    {/* USEPARTNUMBER */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="usepartnumber">USE PART NUMBER</label>
                            <input
                                type="text"
                                className="form-control"
                                id="usepartnumber"
                                name="USERPARTNO"
                                value={formData.USERPARTNO}
                                onChange={handleInputChange}
                                placeholder="Please Enter USE PART NUMBER"
                            />
                        </div>
                    </div>

                    {/* USEDNAME */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="usedname">USED NAME</label>
                            <input
                                type="text"
                                className="form-control"
                                id="usedname"
                                name="USEDNAME"
                                value={formData.USEDNAME}
                                onChange={handleInputChange}
                                placeholder="Please Enter USED NAME"
                            />
                        </div>
                    </div>

                    {/* SORT1 */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="sort1">SORT1</label>
                            <input
                                type="text"
                                className="form-control"
                                id="sort1"
                                name="SORT1"
                                value={formData.SORT1}
                                onChange={handleInputChange}
                                placeholder="Please Enter SORT1"
                            />
                        </div>
                    </div>

                    {/* SORT2 */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="sort2">SORT2</label>
                            <input
                                type="text"
                                className="form-control"
                                id="sort2"
                                name="SORT2"
                                value={formData.SORT2}
                                onChange={handleInputChange}
                                placeholder="Please Enter SORT2"
                            />
                        </div>
                    </div>

                    {/* LEADTIME */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="leadtime">LEADTIME</label>
                            <input
                                type="text"
                                className="form-control"
                                id="leadtime"
                                name="LEADTIME"
                                value={formData.LEADTIME}
                                onChange={handleInputChange}
                                placeholder="Please Enter LEADTIME"
                            />
                        </div>
                    </div>

                    {/* COSTPRICE */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="costprice">COSTPRICE</label>
                            <input
                                type="text"
                                className="form-control"
                                id="costprice"
                                name="COSTPRICE"
                                value={formData.COSTPRICE}
                                onChange={handleInputChange}
                                placeholder="Please Enter COSTPRICE"
                                step="0.01" min="0"
                            />
                        </div>
                    </div>

                    {/* RESERVES */}
                    {[...Array(10).keys()].map(index => (
                        <div key={`reserve${index + 1}`} className="col-lg-4">
                            <div className="form-group">
                                <label htmlFor={index + 1 === 10 ? `reserve10` : `reserve0${index + 1}`}>
                                    RESERVE{index + 1}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={index + 1 === 10 ? `reserve10` : `reserve0${index + 1}`}
                                    name={index + 1 === 10 ? `RESERVE10` : `RESERVE0${index + 1}`}
                                    value={formData[index + 1 === 10 ? `RESERVE10` : `RESERVE0${index + 1}`]}
                                    onChange={handleInputChange}
                                    placeholder={`Please Enter RESERVE${index + 1}`}
                                />
                            </div>
                        </div>
                    ))}


                    {/* PICKING */}
                    {[...Array(10).keys()].map(index => (
                        <div key={`picking${index + 1}`} className="col-lg-4">
                            <div className="form-group">
                                <label htmlFor={index + 1 === 10 ? `picking10` : `picking0${index + 1}`}>
                                    PICKING{index + 1}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={index + 1 === 10 ? `picking10` : `picking0${index + 1}`}
                                    name={index + 1 === 10 ? `PICKING10` : `PICKING0${index + 1}`}
                                    value={formData[index + 1 === 10 ? `PICKING10` : `PICKING0${index + 1}`]}
                                    onChange={handleInputChange}
                                    placeholder={`Please Enter PICKING${index + 1}`}
                                />
                            </div>
                        </div>
                    ))}




                    {/* COLOR */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="color">COLOR</label>
                            <input
                                type="text"
                                className="form-control"
                                id="color"
                                name="COLOR"
                                value={formData.COLOR}
                                onChange={handleInputChange}
                                placeholder="Please Enter COLOR"
                            />
                        </div>
                    </div>

                    {/* IS_ENABLE */}
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="is_enable">IS_ENABLE</label>
                            <input
                                type="text"
                                className="form-control"
                                id="is_enable"
                                name="IS_ENABLE"
                                value={formData.IS_ENABLE}
                                onChange={handleInputChange}
                                placeholder="Please Enter IS_ENABLE"
                            />
                        </div>
                    </div>


                    {/* <div className="col-lg-4">
                        <div className="form-group">
                            <label htmlFor="active">ACTIVE</label>
                            <input
                                type="text"
                                className="form-control"
                                id="active"
                                name="ACTIVE"
                                value={formData.ACTIVE}
                                onChange={handleInputChange}
                                placeholder="Please Enter ACTIVE"
                            />
                        </div>
                    </div> */}

                    <div className="col-lg-12 text-center">
                        <button type="submit" className="btn btn-primary"><i className="bi bi-floppy-fill"></i> Submit</button>
                    </div>
                </div>
            </form>
            {/* <ExcelButton/> */}
        </div>
    );
};

export default AddPartManagerPage;
