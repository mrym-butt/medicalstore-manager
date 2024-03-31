import React, { useState } from "react";
import {
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Avatar,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Field, Form, Formik, ErrorMessage } from "formik";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useNavigate } from "react-router-dom";
const Registration = () => {
  const paperStyle = {
    padding: 20,
    height: "fit-content",
    width: 400,
    margin: "50px auto",
  };
  const avatarStyle = { backgroundColor: "#4CAF50" };
  const initialValues = {
    branchName: "",
    address: "",
    username: "",
    password: "",
    daysOpen: [],
    openTime: "",
    location: {
      coordinates: ["", ""],
    },
    rating: "",
    services: {
      inStorePicking: false,
      inStoreShopping: true,
      inStoreDelivery: true,
      paymentCash: false,
    },
    areaId: "",
    mapUrl: "",
  };
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const HandleSubmit = async (values, props) => {
    try {
      console.log("Form Values:", values);
      const response = await fetch(
        "https://nearest-pharma-be.vercel.app/pharmacy/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: values.username,
            password: values.password,
            branchName: values.branchName,
            location: {
              type: "Point",
              coordinates: [
                values.location.coordinates[0],
                values.location.coordinates[1],
              ],
            },
            rating: values.rating,
            daysOpen: values.daysOpen.split(",").map((day) => day.trim()),
            openTime: values.openTime,
            services: values.services,
            areaId: "65f8c337701d44c75ec1c9d7",
            mapUrl: values.mapUrl,
            address: values.address,
          }),
        }
      );
      console.log("Form Values:", values);

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log(data);

      localStorage.setItem("areaId", "65f8c337701d44c75ec1c9d7");

      // navigate("/signin");

      setTimeout(() => {
        props.resetForm();
        props.setSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Username Alreadys Exists");
    }
  };

  const handleNavigateToSignin = () => {
    navigate("/signin");
  };

  return (
    <Grid container justifyContent="center">
      <Paper elevation={3} style={paperStyle}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Avatar style={avatarStyle}>
              <AppRegistrationIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h5" align="center">
              Pharmacy Registration Form
            </Typography>
          </Grid>
          {errorMessage && (
            <Grid item>
              <Typography color="error" align="center">
                {errorMessage}
              </Typography>
            </Grid>
          )}
          <Grid item>
            <form onSubmit={HandleSubmit} style={{ width: "100%" }}>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="text"
                  name="branchName"
                  placeholder="Enter branch name"
                  required
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  required
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  style={{ width: "100%" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  style={{
                    width: "93%",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}

                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>Days Open</label>
                <select
                  name="daysOpen"
                  style={{
                    width: "100%",
                    height: "90px",
                    padding: "10px",
                    borderRadius: "4px",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                  }}
                  multiple
                  required
                >
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="openTime">Open Time</label>
                <input
                  type="time"
                  name="openTime"
                  placeholder="Open time"
                  style={{
                    width: "94%",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="number"
                  name="location.coordinates.0"
                  placeholder="Latitude"
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="number"
                  name="location.coordinates.1"
                  placeholder="Longitude"
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <input type="text" name="mapUrl" placeholder="Enter map URL" />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="number"
                  name="rating"
                  placeholder="Enter rating"
                  step="0.1"
                  min="1"
                  max="5"
                  required
                />
              </div>

              <label>Services</label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <label>
                    <input type="checkbox" name="services.inStorePicking" />
                    In-Store Picking
                  </label>
                  <label>
                    <input type="checkbox" name="services.inStoreDelivery" />
                    In-Store Delivery
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox" name="services.inStoreShopping" />
                    In-Store Shopping
                  </label>
                  <label>
                    <input type="checkbox" name="services.paymentCash" />
                    Payment in Cash
                  </label>
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}></div>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                style={{ background: "#4CAF50" }}
                onClick={handleNavigateToSignin}
              >
                Register
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Registration;
