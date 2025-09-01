import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const IssuedandNonIssuedDataFetch = () => {
    const defaultStartDate = new Date();
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 7);

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [issueData, setIssueData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("unissued");
    const [noDataMessage, setNoDataMessage] = useState("");

    const formatDate = (date) => date ? date.toISOString().split("T")[0] : null;

    const fetchIssuedandNonIssuedData = async (status) => {
        try {
            setActiveTab(status);
            setNoDataMessage("");

            const start = formatDate(startDate);
            const end = formatDate(endDate);

            // console.log(`Fetching ${status} data from: Start Date: ${start}, End Date: ${end}`);

            const url = `http://127.0.0.1:5000/get_kanban_details?status=${status}&start_date=${start}&end_date=${end}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch data");

            const result = await response.json();
            console.log(`Fetched ${status} data:`, result);

            if (!Array.isArray(result) || result.length === 0) {
                setNoDataMessage("No data available for the selected date range.");
                setIssueData([]);
                setFilteredData([]);
                return;
            }

            setIssueData(result);
            setFilteredData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
            setIssueData([]);
            setFilteredData([]);
            setNoDataMessage("Error fetching data.");
        }
    };

    useEffect(() => {
        fetchIssuedandNonIssuedData("unissued");
    }, [startDate, endDate]);

    useEffect(() => {
        const filtered = issueData.filter(item =>
            item.SERIAL_NO.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, issueData]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <button
                className={`btn m-1 ${activeTab === 'issued' ? 'btn-success' : 'btn-primary'}`}
                onClick={() => fetchIssuedandNonIssuedData("issued")}
            >
                Issued
            </button>
            <button
                className={`btn m-1 ${activeTab === 'unissued' ? 'btn-success' : 'btn-primary'}`}
                onClick={() => fetchIssuedandNonIssuedData("unissued")}
            >
                Non Issued
            </button>
            {/* 
            <div className='row my-3'>
                <div className='col-lg-3'>
                    <input
                        type='search'
                        placeholder='Enter serial number'
                        className='form-control'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='col-lg-3'>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        placeholderText="Select start date"
                        className='form-control'
                    />
                </div>
                <div className='col-lg-3 '>
                    <span className="daydifferencesandlength">Day Difference: {Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} days ( {filteredData.length} )</span>
                    
                </div>
                <div className='col-lg-3'>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="Select end date"
                        className='form-control'
                    />
                </div>
            </div> */}

            <div className='row my-3'>
                <div className='col-lg-3'>
                    <input
                        type='search'
                        placeholder='Enter serial number'
                        className='form-control'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='col-lg-3'>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Select start date"
                        className='form-control'
                    />
                </div>
                <div className='col-lg-3'>
                    Day Difference: {Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} days ({filteredData.length})
                </div>
                <div className='col-lg-3'>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Select end date"
                        className='form-control'
                    />
                </div>
            </div>


            <div className="col-lg-12">
                <div className="table-container" style={{ height: '300px', overflowY: 'auto' }}>
                    {noDataMessage ? (
                        <h3>{noDataMessage}</h3>
                    ) : filteredData.length === 0 ? (
                        <h5 className='text-primary my-3'>No Matching Records Found !</h5>
                    ) : (
                        <>
                            <table className="table table-bordered my-3">
                                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                    <tr>
                                        <th>Part Id</th>
                                        <th>Part Number</th>
                                        <th>Model</th>
                                        <th>Used Name</th>
                                        <th>Planning Date</th>
                                        <th>Plng-Month</th>
                                        <th>Serial No</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.PART_ID}</td>
                                            <td>{item.PART_NO}</td>
                                            <td>{item.MODEL}</td>
                                            <td>{item.USEDNAME}</td>
                                            <td>{item.PLNG_DATE}</td>
                                            <td>{item.PLNG_MONTH}</td>
                                            <td>{item.SERIAL_NO}</td>
                                            <td>{item.PRINT_FLG === "Y" ? "Printed" : "Unprinted"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IssuedandNonIssuedDataFetch;
