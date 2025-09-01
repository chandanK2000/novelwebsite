import React, { useState, useEffect } from 'react';
import Stepper from 'react-stepper-horizontal';
import Select from 'react-select';
import { toast } from 'react-toastify';
import './Inspecton.css';

const Inspection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [partOptions, setPartOptions] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [inspectionData, setInspectionData] = useState(null);
  const [inspectionAvailable, setInspectionAvailable] = useState(false);
  const [saving, setSaving] = useState(false);


  const steps = [
    { title: 'Mould' },
    { title: 'Assembly' },
    { title: 'Dimension' },
    { title: 'Paint' },
    { title: 'Overall' },
  ];

  const [completedSteps, setCompletedSteps] = useState({
    mould: false,
    assembly: false,
    dimension: false,
    paint: false,
    overall: false
  });


  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/parts_active_list");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const parts = await response.json();
        console.log("parts", parts);
        const formattedParts = parts.map((part) => ({
          value: part.PARTNO,
          label: `${part.PARTNO}`,
        }));

        setPartOptions(formattedParts);
      } catch (error) {
        console.error("Error fetching parts:", error);
      }
    };

    fetchParts();
  }, []);



  const fetchInspectionData = async (partNo) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_inspection_data?part_no=${partNo}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("inspection data", data);

      if (data.records && data.records.length > 0) {
        setInspectionData(data.records[0]);
        setInspectionAvailable(true);
        toast.success("Inspection data fetched successfully!");
      } else {
        setInspectionData(null);
        setInspectionAvailable(false);
        toast.info("No inspection data available for this part.");
      }
    } catch (error) {
      console.error("Error fetching inspection data:", error);
      setInspectionData(null);
      setInspectionAvailable(false);
      toast.error(`Inspection data is not available for part number: ${partNo}`);
    }
  };




  // const handlePartSelect = (selected) => {


  //   setSelectedPart(selected);
  //   setActiveStep(0);

  //   if (!selected) {
  //     setInspectionData(null);
  //     setInspectionAvailable(false);
  //     return;
  //   }

  //   fetchInspectionData(selected.value);

  // };



  const handlePartSelect = (selected) => {
    setSelectedPart(selected);
    setActiveStep(0);

    // Reset completedSteps when a new part is selected
    setCompletedSteps({
      mould: false,
      assembly: false,
      dimension: false,
      paint: false,
      overall: false
    });

    if (!selected) {
      setInspectionData(null);
      setInspectionAvailable(false);
      return;
    }

    fetchInspectionData(selected.value);
  };




  const [formData, setFormData] = useState({
    mould: {
      thermal_test: "",
      strength_test: "",
      text_box: "",
      file: null,
      file_path: "",
    },
    assembly: {
      part_order_test: "",
      part_orientation_test: "",
      text_box: "",
      file: null,
      file_path: "",
    },
    dimension: {
      length_test: "",
      width_test: "",
      height_test: "",
      text_box: "",
      file: null,
      file_path: "",
    },
    paint: {
      color_test: "",
      text_box: "",
      file: null,
      file_path: "",
    },
    overall: {
      text_box: "",
      file: null,
      file_path: "",
      status: "Yes",
    }
  });


  // 👇 Add this second useEffect just after the one above
  useEffect(() => {
    // Reset all file inputs on form change
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = ""; // Clear the actual input field
    });

    // Reset file in state for current section
    const section = ["mould", "assembly", "dimension", "paint", "overall"][activeStep];
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        file: null,
      },
    }));
  }, [activeStep]);




  useEffect(() => {
    if (inspectionData) {
      setFormData({
        mould: {
          thermal_test: inspectionData.mould?.thermal_test || "",
          strength_test: inspectionData.mould?.strength_test || "",
          text_box: inspectionData.mould?.text_box || "",
          file: null,
          file_path: inspectionData.mould?.document_upload_path || "",
        },
        assembly: {
          part_order_test: inspectionData.assembly?.part_order_test || "",
          part_orientation_test: inspectionData.assembly?.part_orientation_test || "",
          text_box: inspectionData.assembly?.text_box || "",
          file: null,
          file_path: inspectionData.assembly?.document_upload_path || "",
        },
        dimension: {
          length_test: inspectionData.dimension?.length_test || "",
          width_test: inspectionData.dimension?.width_test || "",
          height_test: inspectionData.dimension?.height_test || "",
          text_box: inspectionData.dimension?.text_box || "",
          file: null,
          file_path: inspectionData.dimension?.document_upload_path || "",
        },
        paint: {
          color_test: inspectionData.paint?.color_test || "",
          text_box: inspectionData.paint?.text_box || "",
          file: null,
          file_path: inspectionData.paint?.document_upload_path || "",
        },
        overall: {
          text_box: inspectionData.overall?.text_box || "",
          status: inspectionData.overall?.status || "Yes",
          file: null,
          file_path: inspectionData.overall?.document_upload_path || "",
        },
      });
    } else {
      // 🔁 Reset form to empty if no inspection data
      setFormData({
        mould: {
          thermal_test: "",
          strength_test: "",
          text_box: "",
          file: null,
          file_path: "",
        },
        assembly: {
          part_order_test: "",
          part_orientation_test: "",
          text_box: "",
          file: null,
          file_path: "",
        },
        dimension: {
          length_test: "",
          width_test: "",
          height_test: "",
          text_box: "",
          file: null,
          file_path: "",
        },
        paint: {
          color_test: "",
          text_box: "",
          file: null,
          file_path: "",
        },
        overall: {
          text_box: "",
          status: "Yes",
          file: null,
          file_path: "",
        },
      });
    }
  }, [inspectionData]);


  // const handleSave = async (section) => {
  //   const currentUser = JSON.parse(localStorage.getItem("userData"));
  //   const data = formData[section];
  //   const fileInput = data.file;

  //   if (!selectedPart) {
  //     toast.warning("Please select a part number before saving.");
  //     return;
  //   }

  //   const form = new FormData();
  //   form.append("part_no", selectedPart.value);
  //   form.append("created_by", currentUser?.User_code || "Unknown");
  //   form.append("modified_by", currentUser?.User_code || "Unknown");

  //   // Append form data based on the section
  //   switch (section) {
  //     case "mould":
  //       form.append("thermal_test", data.thermal_test);
  //       form.append("strength_test", data.strength_test);
  //       break;
  //     case "assembly":
  //       form.append("part_order_test", data.part_order_test);
  //       form.append("part_orientation_test", data.part_orientation_test);
  //       break;
  //     case "dimension":
  //       form.append("length_test", data.length_test);
  //       form.append("width_test", data.width_test);
  //       form.append("height_test", data.height_test);
  //       break;
  //     case "paint":
  //       form.append("color_test", data.color_test);
  //       break;
  //     case "overall":
  //       form.append("status", data.status);
  //       break;
  //   }

  //   form.append("text_box", data.text_box || "");

  //   if (fileInput && fileInput.name) {
  //     form.append("file", fileInput);
  //   } else if (data.file_path) {
  //     form.append("file_path", data.file_path);
  //   }

  //   const url = `http://127.0.0.1:5000/update_${section}`;

  //   try {
  //     setSaving(true);

  //     const response = await fetch(url, {
  //       method: "POST",
  //       body: form,
  //     });

  //     const text = await response.text();
  //     const result = JSON.parse(text);

  //     if (!response.ok) throw new Error(result.message || "Save failed");

  //     toast.success(`${section[0].toUpperCase() + section.slice(1)} saved!`);

  //     // Update completedSteps after saving the current section
  //     setCompletedSteps((prev) => ({
  //       ...prev,
  //       [section]: true,
  //     }));

  //     await fetchInspectionData(selectedPart.value);
  //   } catch (err) {
  //     console.error("Save error:", err);
  //     toast.error(`Error saving ${section}`);
  //   } finally {
  //     setSaving(false);
  //   }
  // };



  const handleSave = async (section) => {
    const currentUser = JSON.parse(localStorage.getItem("userData"));
    const data = formData[section];
    const fileInput = data.file;

    if (!selectedPart) {
      toast.warning("Please select a part number before saving.");
      return;
    }

    const form = new FormData();
    form.append("part_no", selectedPart.value);
    form.append("created_by", currentUser?.User_code || "Unknown");
    form.append("modified_by", currentUser?.User_code || "Unknown");

    // Append form data based on the section
    switch (section) {
      case "mould":
        form.append("thermal_test", data.thermal_test);
        form.append("strength_test", data.strength_test);
        break;
      case "assembly":
        form.append("part_order_test", data.part_order_test);
        form.append("part_orientation_test", data.part_orientation_test);
        break;
      case "dimension":
        form.append("length_test", data.length_test);
        form.append("width_test", data.width_test);
        form.append("height_test", data.height_test);
        break;
      case "paint":
        form.append("color_test", data.color_test);
        break;
      case "overall":
        form.append("status", data.status);
        break;
    }

    form.append("text_box", data.text_box || "");

    if (fileInput && fileInput.name) {
      form.append("file", fileInput);
    } else if (data.file_path) {
      form.append("file_path", data.file_path);
    }

    const url = `http://127.0.0.1:5000/update_${section}`;

    try {
      setSaving(true);

      const response = await fetch(url, {
        method: "POST",
        body: form,
      });

      const text = await response.text();
      const result = JSON.parse(text);

      if (!response.ok) throw new Error(result.message || "Save failed");

      toast.success(`${section[0].toUpperCase() + section.slice(1)} saved!`);

      // Update completedSteps after saving the current section
      setCompletedSteps((prev) => ({
        ...prev,
        [section]: true,
      }));

      await fetchInspectionData(selectedPart.value);
    } catch (err) {
      console.error("Save error:", err);
      toast.error(`Error saving ${section}`);
    } finally {
      setSaving(false);
    }
  };

  const isLastStep = activeStep === steps.length - 1;


  // const isNextButtonDisabled = !completedSteps[steps[activeStep].title.toLowerCase()];

  const isNextButtonDisabled = isLastStep || !completedSteps[steps[activeStep].title.toLowerCase()];


  // Handle Next button action
  // const handleNext = () => {
  //   const nextStep = activeStep + 1;

  //   // Only allow Next if the current step form is completed
  //   if (nextStep === steps.length) {
  //     if (Object.values(completedSteps).every((completed) => completed)) {
  //       // If all steps are completed, allow page reload
  //       window.location.reload();  // Reload page after all steps completed
  //     }
  //   } else {
  //     setActiveStep(nextStep);
  //   }
  // };
  const handleNext = () => {
    if (isNextButtonDisabled) return; // Prevent going to the next step if button is disabled
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };




  const handleChange = (e, section) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [id]: files ? files[0] : value,
      },
    }));
  };

  useEffect(() => {
    const inspectionContainer = document.getElementById('inspection-container');
    if (inspectionContainer) {
      inspectionContainer.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [activeStep]);





  const renderForm = () => {
    switch (activeStep) {
      case 0: // Mould
        return (
          <div className="form-container">
            <h5 className="text-center text-primary my-2">Mould Form</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // prevent page reload
                handleSave("mould"); // call your custom save logic
              }}
              className="border p-3 rounded my-1"
            >
              <div className="form-group">
                <label>Thermal Test:</label>
                <input
                  type="text"
                  id="thermal_test"
                  className="form-control"
                  value={formData.mould.thermal_test}
                  onChange={(e) => handleChange(e, "mould")}
                  required
                />
              </div>

              <div className="form-group">
                <label>Strength Test:</label>
                <input
                  type="text"
                  id="strength_test"
                  className="form-control"
                  value={formData.mould.strength_test}
                  onChange={(e) => handleChange(e, "mould")}
                  required
                />
              </div>

              <div className="form-group">
                <label>Document Upload:</label>
                {formData.mould.file_path && (
                  <a href={formData.mould.file_path} target="_blank" rel="noreferrer">
                    View Document
                  </a>
                )}
                <input
                  type="file"
                  id="file"
                  className="form-control"
                  onChange={(e) => handleChange(e, "mould")}
                // required // only if you want it to be required
                />
              </div>

              <div className="form-group">
                <label>Comments:</label>
                <textarea
                  id="text_box"
                  className="form-control fixed-height"
                  value={formData.mould.text_box}
                  onChange={(e) => handleChange(e, "mould")}
                  required
                  maxLength={300} // Set the character limit here

                />
                <small className="text-muted">{formData.mould.text_box.length} / 300 characters</small>

              </div>

              <button type="submit" className="btn btn-primary my-2">
                Save
              </button>
            </form>
          </div>
        );

      case 1: // Assembly
        return (
          <div className="form-container">
            <h5 className="text-center text-primary my-2">Assembly Form</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // stop the page from reloading
                handleSave("assembly"); // your custom save logic
              }}
              className="border p-2 rounded"
            >
              <div className="form-group">
                <label>Part Order Test:</label>
                <input
                  type="text"
                  id="part_order_test"
                  className="form-control"
                  value={formData.assembly.part_order_test}
                  onChange={(e) => handleChange(e, "assembly")}
                  required
                />
              </div>

              <div className="form-group">
                <label>Part Orientation Test:</label>
                <input
                  type="text"
                  id="part_orientation_test"
                  className="form-control"
                  value={formData.assembly.part_orientation_test}
                  onChange={(e) => handleChange(e, "assembly")}
                  required
                />
              </div>

              <div className="form-group">
                <label>Document Upload:</label>
                {formData.assembly.file_path && (
                  <a href={formData.assembly.file_path} target="_blank" rel="noreferrer">
                    View Document
                  </a>
                )}
                <input
                  type="file"
                  id="file"
                  className="form-control"
                  onChange={(e) => handleChange(e, "assembly")}
                />
              </div>

              <div className="form-group">
                <label>Comments:</label>
                <textarea
                  id="text_box"
                  className="form-control fixed-height"
                  value={formData.assembly.text_box}
                  onChange={(e) => handleChange(e, "assembly")}
                  required
                  maxLength={300} // Set the character limit here

                />
                <small className="text-muted ">{formData.mould.text_box.length} / 300 characters</small>

              </div>

              <button type="submit" className="btn btn-primary my-2">
                Save
              </button>
            </form>
          </div>
        );

      case 2: // Dimension
        return (
          <div className="form-container">
            <h5 className="text-center text-primary my-2">Dimension Form</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("dimension");
              }}
              className="border rounded p-2"
            >
              <div className="form-group">
                <label>Length Test:</label>
                <input
                  type="text"
                  id="length_test"
                  className="form-control"
                  value={formData.dimension.length_test}
                  onChange={(e) => handleChange(e, "dimension")}
                  required
                />
              </div>

              <div className="form-group">
                <label>Width Test:</label>
                <input
                  type="text"
                  id="width_test"
                  className="form-control"
                  value={formData.dimension.width_test}
                  onChange={(e) => handleChange(e, "dimension")}
                  required
                />
              </div>

              <div className="form-group">
                <label>Height Test:</label>
                <input
                  type="text"
                  id="height_test"
                  className="form-control"
                  value={formData.dimension.height_test}
                  onChange={(e) => handleChange(e, "dimension")}
                  required
                />
              </div>

              <div className="form-group">
                <label>Document Upload:</label>
                {formData.dimension.file_path && (
                  <a href={formData.dimension.file_path} target="_blank" rel="noreferrer">
                    View Document
                  </a>
                )}
                <input
                  type="file"
                  id="file"
                  className="form-control"
                  onChange={(e) => handleChange(e, "dimension")}
                // required
                />
              </div>

              <div className="form-group">
                <label>Comments:</label>
                <textarea
                  id="text_box"
                  className="form-control fixed-height"
                  value={formData.dimension.text_box}
                  onChange={(e) => handleChange(e, "dimension")}
                  maxLength={300} // Set the character limit here

                />
                <small className="text-muted">{formData.mould.text_box.length} / 300 characters</small>

              </div>

              <button type="submit" className="btn btn-primary my-2">
                Save
              </button>
            </form>
          </div>
        );

      case 3: // Paint
        return (
          <div className="form-container">
            <h5 className="text-center text-primary my-2">Painting Form</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("paint");
              }}
              className="border p-2 rounded"
            >
              <div className="form-group">
                <label>Color Test:</label>
                <input
                  type="text"
                  id="color_test"
                  className="form-control"
                  value={formData.paint.color_test}
                  onChange={(e) => handleChange(e, "paint")}
                  required
                />
              </div>

              <div className="form-group">
                <label>Document Upload:</label>
                {formData.paint.file_path && (
                  <a href={formData.paint.file_path} target="_blank" rel="noreferrer">
                    View Document
                  </a>
                )}
                <input
                  type="file"
                  id="file"
                  className="form-control"
                  onChange={(e) => handleChange(e, "paint")}
                // required
                />
              </div>

              <div className="form-group">
                <label>Comments:</label>
                <textarea
                  id="text_box"
                  className="form-control fixed-height"
                  value={formData.paint.text_box}
                  onChange={(e) => handleChange(e, "paint")}
                  maxLength={300} // Set the character limit here

                />
                <small className="text-muted">{formData.mould.text_box.length} / 300 characters</small>

              </div>

              <button type="submit" className="btn btn-primary my-2">
                Save
              </button>
            </form>
          </div>
        );

      case 4: // Overall
        return (
          <div className="form-container">
            <h5 className="text-center text-primary my-2">Overall Form</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("overall");
              }}
              className="p-2 rounded border"
            >
              <div className="form-group">
                <label>Document Upload:</label>
                {formData.overall.file_path && (
                  <a href={formData.overall.file_path} target="_blank" rel="noreferrer">
                    View Document
                  </a>
                )}
                <input
                  type="file"
                  id="file"
                  className="form-control"
                  onChange={(e) => handleChange(e, "overall")}
                // required
                />
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select
                  className="form-select"
                  value={formData.overall.status}
                  onChange={(e) => handleChange(e, "overall")}
                  id="status"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comments:</label>
                <textarea
                  id="text_box"
                  className="form-control fixed-height"
                  value={formData.overall.text_box}
                  onChange={(e) => handleChange(e, "overall")}
                  maxLength={300} // Set the character limit here
                />
                <small className="text-muted text-end">{formData.mould.text_box.length} / 300 characters</small>

              </div>

              <button type="submit" className="btn btn-primary my-2">
                Save
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };





  return (
    <div className="container" style={{ marginTop: '130px' }}>
      <h3 className="pagesHeading">Inspection</h3>
      <div className="row">
        <div className="col-lg-4">
          {/* Part Selection Dropdown */}
          <Select
            id="part-select"
            options={partOptions}
            onChange={handlePartSelect}
            value={selectedPart}
            placeholder="🔍 Search by Part Number..."
            isClearable
            noOptionsMessage={() => "No parts found"}

            styles={{
              singleValue: (base) => ({
                ...base,
                userSelect: 'text', // 💡 Make value copyable
              }),
              clearIndicator: (base) => ({
                ...base,
                color: 'white',
                cursor: 'pointer',
                height: '20px',
                width: '20px',
                background: 'red',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                lineHeight: '20px',
                padding: '0',
                ':hover': {
                  background: 'orange',
                  transform: 'scale(1.2)',
                  transition: 'transform 0.2s, background 0.2s',
                },
              }),
              control: (base) => ({
                ...base,
                minHeight: '40px',
              }),
            }}
          />
          <div className=' p-1 my-1'>
            {!selectedPart && (
              <p className='text-primary my-3'>
                Please Select a Part Number to Fetch or Save the Inspection Data
              </p>
            )}
          </div>
        </div>

        <div className="col-lg-8 rounded" id="inspection-container" style={{ height: '400px', overflowY: 'auto' }}>

          <div className="row">
            <div className='col-lg-1'></div>
            <div className='col-lg-10 shadow-sm py-2'>
              <div className="stepper-container">
                <Stepper steps={steps} activeStep={activeStep} />
              </div>
            </div>
            <div className="col-lg-1 mb-2">

            </div>
          </div>
          <div className='row'>
            <div className='col-lg-1'></div>
            <div className='col-lg-10 shadow-sm p-3 position-relative'>
              {saving && (
                <div className="section-overlay-loader">
                  <div className="spinner-border text-primary" role="status">
                    {/* <span className="visually-hidden">Saving...</span> */}
                  </div>
                  <div className="overlay-text">Saving...</div>
                </div>
              )}


              {/* Render form based on active step */}
              {renderForm()}

              {/* Previous and Next Buttons */}
              {selectedPart && (
                <div className="text-center my-3">


                  <button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(activeStep - 1)}
                    style={{ marginRight: '8px' }}
                    className="btn btn-primary"
                  >
                    Previous
                  </button>



                  <button
                    onClick={handleNext}
                    disabled={isNextButtonDisabled}
                    className='btn btn-primary'
                  >
                    Next
                  </button>

                </div>
              )}
            </div>
            <div className='col-lg-1'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inspection;
