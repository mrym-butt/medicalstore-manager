import React, { useState, useEffect } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import "./MedicineLists.css";
import { useNavigate } from "react-router-dom";

function MedicineLists() {
  const [medicineName, setMedicineName] = useState("");
  const [medicineQuantity, setMedicineQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [newmedicineQuantity, setNewMedicineQuantity] = useState("");
  const [newprice, setNewPrice] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [existingMedicines, setExistingMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [showNewMedicineForm, setShowNewMedicineForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExistingMedicines = async () => {
      try {
        const response = await fetch(
          "https://nearest-pharma-be.vercel.app/medicine/"
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Medicines retrieved successfully:", data.data);
          setExistingMedicines(data.data);
        } else {
          throw new Error("Failed to fetch existing medicines");
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchExistingMedicines();
  }, []);

  const handleAddMedicine = async () => {
    try {
      const response = await fetch(
        "https://nearest-pharma-be.vercel.app/medicine/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            medicineName,
            quantity: medicineQuantity,
            price,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Medicine added successfully:", data);
        // setExistingMedicines([...existingMedicines, medicineName]);
        setExistingMedicines([
          ...existingMedicines,
          { medicineName, quantity: medicineQuantity, price },
        ]);
        setUpdateMessage("Medicine added successfully!");
        setMedicineName("");
        setMedicineQuantity("");
        setPrice("");
        setNewMedicineQuantity("");
        setNewPrice("");
      } else {
        console.error("Failed to add medicine:", response.statusText);
        setUpdateMessage("Failed to add medicine");
      }
    } catch (error) {
      console.error("Error:", error);
      setUpdateMessage("Failed to add medicine");
    }
  };

  const handleSelectMedicine = (event) => {
    setSelectedMedicine(event.target.value);
  };

  const handleCreateNewMedicine = () => {
    setShowNewMedicineForm(true);
  };

  const handleLogout = () => {
    navigate("/signin");
  };

  // const handleSubmit = () => {
  //   console.log("Selected Medicine:", selectedMedicine);
  //   // Logic to handle submission, including selected medicine
  // };

  const handleSubmit = () => {
    navigate("/updatedmedicinelist");
  };

  return (
    <div className="app-container">
      <header className="header">MediStore Manager</header>
      <div className="view-medicine-container">
        <Button className="view-medicine-button" onClick={handleSubmit}>
          View List
        </Button>
      </div>
      <div className="logout-container">
        <Button className="logout-button" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="form-container">
        <div className="input-field">
          <label htmlFor="medicineName">Medicine Name:</label>
          <TextField
            select
            id="medicineName"
            value={selectedMedicine}
            onChange={(event) => {
              handleSelectMedicine(event);
              setMedicineName(event.target.value);
            }}
            variant="outlined"
            fullWidth
          >
            {Array.isArray(existingMedicines) &&
              existingMedicines.map((medicine, index) => (
                <MenuItem key={index} value={medicine.medicineName}>
                  {medicine.medicineName}
                </MenuItem>
              ))}
          </TextField>
        </div>
        <div className="form-group">
          <label htmlFor="medicineQuantity">Quantity:</label>
          <input
            type="number"
            id="medicineQuantity"
            value={medicineQuantity}
            onChange={(e) => setMedicineQuantity(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="button-container">
          <Button
            className="add-button"
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              marginBottom: "10px",
              // marginBottom: "10px",
              width: "200px", // Set width to 50%
            }}
            onClick={handleAddMedicine}
          >
            Add Medicine
          </Button>
          <Button
            className="add-button"
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              marginBottom: "10px",
              width: "200px",
            }}
            onClick={handleCreateNewMedicine}
          >
            Create New Medicine
          </Button>
        </div>
      </div>
      {showNewMedicineForm && (
        <div className="form-container">
          <h3>Create New Medicine</h3>
          <div className="form-group">
            <label htmlFor="newMedicineName">Medicine Name:</label>
            <input
              type="text"
              id="newMedicineName"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newMedicineQuantity">Quantity:</label>
            <input
              type="number"
              id="newMedicineQuantity"
              value={newmedicineQuantity}
              onChange={(e) => setNewMedicineQuantity(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newMedicinePrice">Price:</label>
            <input
              type="text"
              id="newMedicinePrice"
              value={newprice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
          </div>
          <div className="form-buttons">
            <Button
              className="add-button"
              onClick={handleAddMedicine}
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                marginBottom: "10px",
                marginRight: "10px",
              }}
            >
              Save
            </Button>
            <Button
              className="add-button"
              onClick={() => setShowNewMedicineForm(false)}
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                marginBottom: "10px",
                left: "12px",
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {updateMessage && (
        <div className="update-message-box">
          <div className="update-message">{updateMessage}</div>
        </div>
      )}
    </div>
  );
}

export default MedicineLists;

// import React, { useState, useEffect } from "react";
// import { Button, MenuItem, TextField } from "@mui/material";
// import "./MedicineLists.css";
// import { useNavigate } from "react-router-dom";

// function MedicineLists() {
//   const [medicineName, setMedicineName] = useState("");
//   const [medicineQuantity, setMedicineQuantity] = useState("");
//   const [price, setPrice] = useState("");
//   const [newmedicineQuantity, setNewMedicineQuantity] = useState("");
//   const [newprice, setNewPrice] = useState("");
//   const [updateMessage, setUpdateMessage] = useState("");
//   const [existingMedicines, setExistingMedicines] = useState([]);
//   const [selectedMedicine, setSelectedMedicine] = useState("");
//   const [showNewMedicineForm, setShowNewMedicineForm] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchExistingMedicines = async () => {
//       try {
//         const response = await fetch(
//           "https://nearest-pharma-be.vercel.app/medicine/"
//         );
//         if (response.ok) {
//           const data = await response.json();
//           console.log("Medicines retrieved successfully:", data.data);
//           setExistingMedicines(data.data);
//         } else {
//           throw new Error("Failed to fetch existing medicines");
//         }
//       } catch (error) {
//         console.error("Error fetching medicines:", error);
//       }
//     };

//     fetchExistingMedicines();
//   }, []);

//   const handleAddMedicine = async () => {
//     try {
//       const response = await fetch(
//         "https://nearest-pharma-be.vercel.app/medicine/new",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             medicineName,
//             quantity: medicineQuantity,
//             price,
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Medicine added successfully:", data);
//         // setExistingMedicines([...existingMedicines, medicineName]);
//         setExistingMedicines([
//           ...existingMedicines,
//           { medicineName, quantity: medicineQuantity, price },
//         ]);
//         setUpdateMessage("Medicine added successfully!");
//         setMedicineName("");
//         setMedicineQuantity("");
//         setPrice("");
//         setNewMedicineQuantity("");
//         setNewPrice("");
//       } else {
//         console.error("Failed to add medicine:", response.statusText);
//         setUpdateMessage("Failed to add medicine");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setUpdateMessage("Failed to add medicine");
//     }
//   };

//   const handleSelectMedicine = (event) => {
//     setSelectedMedicine(event.target.value);
//   };

//   const handleCreateNewMedicine = () => {
//     setShowNewMedicineForm(true);
//   };

//   const handleLogout = () => {
//     navigate("/signin");
//   };
//   const handleUpdateMedicineQuantity = async () => {
//     try {
//       const response = await fetch(
//         "https://nearest-pharma-be.vercel.app/medicine/update",
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             pharmacyId: "65f8c6aa05dbd4129a257f10",
//             medicineId: "65f98fde5b41e43553f9d987",
//             medicineQuantity: newmedicineQuantity,
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Medicine quantity updated successfully:", data);
//         setUpdateMessage("Medicine quantity updated successfully!");
//         setNewMedicineQuantity("");
//       } else {
//         console.error("Failed to update medicine quantity:", response.statusText);
//         setUpdateMessage("Failed to update medicine quantity");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setUpdateMessage("Failed to update medicine quantity");
//     }
//   };

//   const handleSubmit = () => {
//     navigate("/updatedmedicinelist");
//   };

//   return (
//     <div className="app-container">
//       <header className="header">MediStore Manager</header>
//       <div className="view-medicine-container">
//         <Button className="view-medicine-button" onClick={handleSubmit}>
//           View List
//         </Button>
//       </div>
//       <div className="logout-container">
//         <Button className="logout-button" onClick={handleLogout}>
//           Logout
//         </Button>
//       </div>
//       <div className="form-container">
//         <div className="input-field">
//           <label htmlFor="medicineName">Medicine Name:</label>
//           <TextField
//             select
//             id="medicineName"
//             value={selectedMedicine}
//             onChange={(event) => {
//               handleSelectMedicine(event);
//               setMedicineName(event.target.value);
//             }}
//             variant="outlined"
//             fullWidth
//           >
//             {Array.isArray(existingMedicines) &&
//               existingMedicines.map((medicine, index) => (
//                 <MenuItem key={index} value={medicine.medicineName}>
//                   {medicine.medicineName}
//                 </MenuItem>
//               ))}
//           </TextField>
//         </div>
//         <div className="form-group">
//           <label htmlFor="medicineQuantity">Quantity:</label>
//           <input
//             type="number"
//             id="medicineQuantity"
//             value={medicineQuantity}
//             onChange={(e) => setMedicineQuantity(e.target.value)}
//             className="input-field"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="price">Price:</label>
//           <input
//             type="text"
//             id="price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="input-field"
//           />
//         </div>
//         <div className="button-container">
//           <Button
//             className="add-button"
//             style={{
//               backgroundColor: "#4caf50",
//               color: "white",
//               marginBottom: "10px",
//               width: "200px",
//             }}
//             // onClick={handleAddMedicine}
//             onClick={() => {
//               handleAddMedicine();
//               handleUpdateMedicineQuantity();
//             }}
//           >
//             Add Medicine
//           </Button>
//           <Button
//             className="add-button"
//             style={{
//               backgroundColor: "#4caf50",
//               color: "white",
//               marginBottom: "10px",
//               width: "200px",
//             }}
//             onClick={handleCreateNewMedicine}
//           >
//             Create New Medicine
//           </Button>
//         </div>
//       </div>
//       {showNewMedicineForm && (
//         <div className="form-container">
//           <h3>Create New Medicine</h3>
//           <div className="form-group">
//             <label htmlFor="newMedicineName">Medicine Name:</label>
//             <input
//               type="text"
//               id="newMedicineName"
//               value={medicineName}
//               onChange={(e) => setMedicineName(e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="newMedicineQuantity">Quantity:</label>
//             <input
//               type="number"
//               id="newMedicineQuantity"
//               value={newmedicineQuantity}
//               onChange={(e) => setNewMedicineQuantity(e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="newMedicinePrice">Price:</label>
//             <input
//               type="text"
//               id="newMedicinePrice"
//               value={newprice}
//               onChange={(e) => setNewPrice(e.target.value)}
//             />
//           </div>
//           <div className="form-buttons">
//             <Button
//               className="add-button"
//               // onClick={handleAddMedicine}
//               onClick={() => {
//                 handleAddMedicine();
//                 handleUpdateMedicineQuantity();
//               }}
//               style={{
//                 backgroundColor: "#4caf50",
//                 color: "white",
//                 marginBottom: "10px",
//                 marginRight: "10px",
//               }}
//             >
//               Save
//             </Button>
//             <Button
//               className="add-button"
//               onClick={() => setShowNewMedicineForm(false)}
//               style={{
//                 backgroundColor: "#4caf50",
//                 color: "white",
//                 marginBottom: "10px",
//                 left: "12px",
//               }}
//             >
//               Cancel
//             </Button>
//           </div>
//         </div>
//       )}

//       {updateMessage && (
//         <div className="update-message-box">
//           <div className="update-message">{updateMessage}</div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MedicineLists;
