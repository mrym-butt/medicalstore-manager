import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Button } from "@mui/material";
import Modal from "react-modal"; // Remove duplicate import statement
import { useLocation, useNavigate } from "react-router-dom";
import UpdatedMedicineForm from "../UpdatedMedicineForm";
import "./UpdatedMedicineList.css";

// Remove Modal.setAppElement("#root");

function UpdatedMedicineList() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  const [medicines, setMedicines] = useState(state ? state.medicines || [] : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    if (!userInfo || !userInfo._id) {
      setError("User information not found.");
      return;
    }

    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://nearest-pharma-be.vercel.app/pharmacy/medicineByPharmacyId/${userInfo._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch medicines");
        }
        const allMedicines = await response.json();

        const mergedMedicines = await Promise.all(
          allMedicines.data.map(async (medicine) => {
            try {
              const quantityResponse = await fetch(`https://nearest-pharma-be.vercel.app/medicine/${medicine.medicineId}`);
              if (!quantityResponse.ok) {
                throw new Error(`Failed to fetch quantity for medicine ID ${medicine.medicineId}`);
              }

              const quantityData = await quantityResponse.json();
              const quantityInfo = quantityData.data;
              return {
                ...medicine,
                medicineName: quantityInfo.medicineName,
                medicineQuantity: quantityInfo.medicineQuantity,
                medicinePrice: quantityInfo.medicinePrice,
              };
            } catch (error) {
              console.error("Error fetching quantity data for medicine ID", error);
              return medicine; // Keep medicine data even if quantity fetch fails
            }
          })
        );

        setMedicines(mergedMedicines);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [userInfo]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://nearest-pharma-be.vercel.app/medicine/delete/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedMedicines = medicines.filter((medicine) => medicine._id !== id);
        setMedicines(updatedMedicines);
      } else {
        throw new Error("Failed to delete medicine");
      }
    } catch (error) {
      console.error("Error deleting medicine:", error);
      setError("Failed to delete medicine");
    }
  };

  const handleUpdate = (id) => {
    console.log("Update Button Clicked - ID:", id);
    const selected = medicines.find((medicine) => medicine._id === id);
    console.log("Selected Medicine:", selected);
    setSelectedMedicine(selected);
    setShowForm(true);
  };

  const handleSaveChanges = ({ name, quantity, price }) => {
    const updatedMedicines = medicines.map((medicine) =>
      medicine._id === selectedMedicine._id
        ? { ...medicine, medicineName: name, medicineQuantity: quantity, medicinePrice: price }
        : medicine
    );
    setMedicines(updatedMedicines);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedMedicine(null);
  };

  const handleAddMedicine = () => {
    navigate("/medicinelists");
  };

  const handleLogout = () => {
    navigate("/signin");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const name = medicine.medicineName || ''; // Handle undefined or null by assigning a default value
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="medicine-list-container">
      <Modal isOpen={showForm} onRequestClose={handleCancelForm} className="modal">
        <UpdatedMedicineForm
          isOpen={showForm}
          onSave={handleSaveChanges}
          onCancel={handleCancelForm}
          selectedMedicine={selectedMedicine} // Pass selectedMedicine as prop to the form
        />
      </Modal>
      <div className="logout-container">
        <Button className="logout-button" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="medicine-header">
        <h2>Updated Medicine List</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <FaPlus className="plus-sign" onClick={handleAddMedicine} />
      </div>
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <table className="medicine-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine) => (
              <tr key={medicine._id}>
                <td>{medicine.medicineName}</td>
                <td>{medicine.medicineQuantity}</td>
                <td>{medicine.medicinePrice}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(medicine._id)}>
                    <FaTrash />
                  </button>
                  <button className="update-button" onClick={() => handleUpdate(medicine._id)}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UpdatedMedicineList;
