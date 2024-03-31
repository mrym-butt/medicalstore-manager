import React, { useState, useEffect } from "react";
import { Button, TextField, Grid } from "@mui/material";
import "./UpdatedMedicineForm.css"; // Import your CSS file

const UpdatedMedicineForm = ({ isOpen, onSave, onCancel, selectedMedicine, pharmacyId }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (selectedMedicine) {
      setFormData({
        name: selectedMedicine.medicineName || '',
        quantity: (selectedMedicine.medicineQuantity || '').toString(),
        price: (selectedMedicine.medicinePrice || '').toString(),
      });
    }
  }, [selectedMedicine]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://nearest-pharma-be.vercel.app/pharmacy/updateMedicineQuantity/${pharmacyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pharmacyId: pharmacyId,
          medicineId: selectedMedicine.medicineId,
          medicineQuantity: formData.quantity,
          price: formData.price,
          medicineName: formData.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update medicine quantity");
      }

      // Optionally handle successful response
      console.log("Medicine quantity updated successfully");

      // Call onSave to update the form data in the parent component
      onSave(formData);

      // Call onCancel to close the form
      onCancel();
    } catch (error) {
      console.error("Error updating medicine quantity:", error);
      // Optionally handle error
    }
  };

  return (
    <div className={`form-container ${isOpen ? 'open' : 'closed'}`}>
      {isOpen && (
        <div className="form-wrapper">
          <h2>Update Medicine</h2>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                className="input-field"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="input-field"
              />
            </Grid>
            <Grid item xs={12} className="button-container">
              <Button fullWidth variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button fullWidth variant="contained" color="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default UpdatedMedicineForm;
