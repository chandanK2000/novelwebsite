import React, { useState, useEffect } from 'react';
import './EditPartManagerPage.css';
import { useNavigate } from 'react-router-dom';

const EditPartManagerPage = () => {
  const [partData, setPartData] = useState({
    partno: '',
    model: '',
    pc: '',
    borekind: '',
    markmodel1: '',
    markmodel2: '',
    userfor: '',
    chgmark: '',
    sizefig: '',
    sectionfig: '',
    remark: '',
    operationpoint: '',
    destination: '',
    usepartnumber: '',
    usedname: '',
    sort1: '',
    sort2: '',
    leadtime: '',
    costprice: '',
    color: '',
    is_enable: '',
    reserves: Array(10).fill(''),
    pickings: Array(10).fill('')
  });
  const partId = 1; // Replace this with the actual part ID you want to edit

  useEffect(() => {
    // Fetch part data when the component loads
    const fetchPartData = async () => {
      try {
        const response = await fetch(`http://localhost:4001/api/parts/${partId}`);
        const result = await response.json();
        if (result.success) {
          // Assuming result contains the part data, you might need to adjust based on the response structure
          setPartData(prevData => ({
            ...prevData,
            ...result.part
          }));
        } else {
          alert('Failed to fetch part data');
        }
      } catch (error) {
        console.error('Error fetching part data:', error);
        alert('Error fetching part data');
      }
    };

    fetchPartData();
  }, [partId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:4001/api/parts/update/${partId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(partData)
      });

      const result = await response.json();
      if (result.success) {
        alert('Part updated successfully');
      } else {
        alert('Failed to update part');
      }
    } catch (error) {
      console.error('Error updating part:', error);
      alert('Error updating part');
    }
  };

  return (
    <div className='container p-3' style={{ marginTop: '150px' }}>
      <button className='btn btn-primary'>
        <i className="bi bi-arrow-left-short"></i>
      </button>
      <h4 className='text-primary text-center'>
        <i className="bi bi-floppy-fill"></i>
        Edit Parts Manager
      </h4>
      <form onSubmit={handleSubmit}>
        <div className='row border p-3 rounded shadow-sm'>
          {/* PARTNO */}
          <div className="col-lg-4 mb-3">
            <label htmlFor="partno" className="form-label">PARTNO <span>*</span></label>
            <input
              type="number"
              className="form-control"
              id="partno"
              name="partno"
              value={partData.partno}
              onChange={handleChange}
              placeholder="Please enter Part Number"
              required
            />
          </div>

          {/* MODEL */}
          <div className="col-lg-4 mb-3">
            <label htmlFor="model" className="form-label">MODEL <span>*</span></label>
            <input
              type="text"
              className="form-control"
              id="model"
              name="model"
              value={partData.model}
              onChange={handleChange}
              placeholder="Please enter MODEL"
              required
            />
          </div>

          {/* PC */}
          <div className="col-lg-4 mb-3">
            <label htmlFor="pc" className="form-label">PC <span>*</span></label>
            <input
              type="number"
              className="form-control"
              id="pc"
              name="pc"
              value={partData.pc}
              onChange={handleChange}
              placeholder="Please Enter PC"
              required
            />
          </div>

          {/* Additional Fields */}
          {['borekind', 'markmodel1', 'markmodel2', 'userfor', 'chgmark', 'sizefig', 'sectionfig', 'remark', 'operationpoint', 'destination', 'usepartnumber', 'usedname', 'sort1', 'sort2', 'leadtime', 'costprice', 'color', 'is_enable'].map((field, index) => (
            <div className="col-lg-4 mb-3" key={field}>
              <label htmlFor={field} className="form-label">{field.toUpperCase()}</label>
              <input
                type="text"
                className="form-control"
                id={field}
                name={field}
                value={partData[field]}
                onChange={handleChange}
                placeholder={`Please Enter ${field}`}
              />
            </div>
          ))}

          {/* Reserve Fields */}
          {partData.reserves.map((_, index) => (
            <div className="col-lg-4 mb-3" key={`reserve${index + 1}`}>
              <label htmlFor={`reserve${index + 1}`} className="form-label">RESERVE{index + 1}</label>
              <input
                type="text"
                className="form-control"
                id={`reserve${index + 1}`}
                name={`reserve${index + 1}`}
                value={partData.reserves[index]}
                onChange={(e) => {
                  const updatedReserves = [...partData.reserves];
                  updatedReserves[index] = e.target.value;
                  setPartData(prevData => ({ ...prevData, reserves: updatedReserves }));
                }}
                placeholder={`Please Enter RESERVE${index + 1}`}
              />
            </div>
          ))}

          {/* Picking Fields */}
          {partData.pickings.map((_, index) => (
            <div className="col-lg-4 mb-3" key={`picking${index + 1}`}>
              <label htmlFor={`picking${index + 1}`} className="form-label">PICKING{index + 1}</label>
              <input
                type="text"
                className="form-control"
                id={`picking${index + 1}`}
                name={`picking${index + 1}`}
                value={partData.pickings[index]}
                onChange={(e) => {
                  const updatedPickings = [...partData.pickings];
                  updatedPickings[index] = e.target.value;
                  setPartData(prevData => ({ ...prevData, pickings: updatedPickings }));
                }}
                placeholder={`Please Enter PICKING${index + 1}`}
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="col-lg-4 mb-3">
            <label htmlFor="submit" className="form-label">&nbsp;</label>
            <button type="submit" className="btn btn-primary btn-block">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPartManagerPage;
