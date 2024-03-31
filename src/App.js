import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./componens/Signin";
import Registration from "./componens/Registration";
import UpdatedMedicineList from "./componens/UpdatedMedicineList/UpdatedMedicineList";
import MedicineLists from "./componens/MedicineLists/MedicineLists";
import UpdatedMedicineForm from "./componens/UpdatedMedicineForm";
function App() {
  return (
    <Router>
      <Routes path="/">
        <Route index element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="Registration" element={<Registration />} />
        
        <Route path="updatedmedicineform" element={<UpdatedMedicineForm />} />
        <Route path="medicinelists" element={<MedicineLists />} />
        <Route path="updatedmedicinelist" element={<UpdatedMedicineList />} />

      </Routes>
    </Router>
  );
}

export default App;
