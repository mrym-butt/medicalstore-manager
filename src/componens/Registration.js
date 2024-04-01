import React, { useState } from "react";
import { Grid, Paper, Avatar, Typography } from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Registration = () => {
  const paperStyle = {
    padding: 20,
    height: "fit-content",
    width: 400,
    margin: "50px auto",
  };
  const avatarStyle = { backgroundColor: "#4CAF50" };
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [mapUrl, setMapUrl] = useState("");

  const HandleSubmit = async (values,props) => {
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
        navigate("/signin");
        localStorage.setItem("areaId", "65f8c337701d44c75ec1c9d7");
      

      setTimeout(() => {
        props.resetForm();
        props.setSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Username Alreadys Exists");
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
        setMapUrl(`https://www.google.com/maps?q=${latitude},${longitude}`);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
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
              <label>Days Open</label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <label>
                    <input type="checkbox" name="Monday" />
                    Monday
                  </label>
                  <label>
                    <input type="checkbox" name="Tuesday" />
                    Tuesday
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox" name="Wednesday" />
                    Wednesday
                  </label>
                  <label>
                    <input type="checkbox" name="Thursday" />
                    Thursday
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox" name="Friday" />
                    Friday
                  </label>
                  <label>
                    <input type="checkbox" name="Saturday" />
                    Saturday
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox" name="Sunday" />
                    Sunday
                  </label>
                </div>
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
                  name="rating"
                  placeholder="Enter rating"
                  step="0.1"
                  min="1"
                  max="5"
                  required
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex" }}>
                  <div style={{ marginRight: "10px" }}>
                    <label>Latitude</label>
                    <input
                      type="text"
                      value={center.lat}
                      required
                      readOnly
                      style={{
                        width: "94%",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                  <div>
                    <label>Longitude</label>
                    <input
                      type="text"
                      value={center.lng}
                      required
                      readOnly
                      style={{
                        width: "96%",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                </div>
                <label>Map URL</label>
                <div>
                  <input
                    label="Map URL"
                    variant="outlined"
                    fullWidth
                    required
                    placeholder="Enter map url"
                    value={mapUrl}
                    style={{
                      width: "94%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <button
                  variant="contained"
                  color="primary"
                  onClick={handleGetLocation}
                  style={{
                    marginBottom: "10px",
                    width:"50%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    background: "#4CAF50",
                    color: "white",
                  }}
                >
                  Get Location
                </button>
                <LoadScript googleMapsApiKey="AIzaSyDtTeKzLdvEensF5z-LUodFfRDTv-WMnkA">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "150px" }}
                    center={center}
                    zoom={13}
                  >
                    <Marker position={center} />
                  </GoogleMap>
                </LoadScript>
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
              <button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                onClick={HandleSubmit}
                style={{
                  width: "94%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  background: "#4CAF50",
                  color: "white",
                }}
              >
                Register
              </button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Registration;
