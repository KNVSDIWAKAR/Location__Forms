import React, { useState } from "react";
import axios from "axios";
import "./GrantLocationForm.css";

function GrantLocationForm() {
  const [formData, setFormData] = useState({
    danushId: "",
    wdCode: "",
    raType: "",
    payout: "",
    grantLocation: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetCoordinates = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
          grantLocation: `${lat}, ${lon}`,
        }));
      },
      (err) => {
        alert("Failed to get location");
        console.error(err);
      }
    );
  };
  //    U[]
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://itc-location-forms-server.vercel.app/api/entries",
        formData
      );
      alert("Form submitted!");
      setFormData({
        danushId: "",
        wdCode: "",
        raType: "",
        payout: "",
        grantLocation: "",
        latitude: "",
        longitude: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  return (
    <div className="form-container">
      <h2>Grant Location Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="danushId"
          placeholder="Danush ID"
          value={formData.danushId}
          onChange={handleChange}
          required
        />
        <input
          name="wdCode"
          placeholder="WD Code"
          value={formData.wdCode}
          onChange={handleChange}
          required
        />
        <input
          name="raType"
          placeholder="RA Type"
          value={formData.raType}
          onChange={handleChange}
          required
        />

        <input
          name="payout"
          type="number"
          placeholder="Payout"
          value={formData.payout}
          onChange={handleChange}
          required
        />
        <input
          name="grantLocation"
          placeholder="Grant Location"
          value={formData.grantLocation}
          onChange={handleChange}
          required
        />
        <button type="button" onClick={handleGetCoordinates}>
          Get Coordinates
        </button>
        {/* {formData.latitude && (
          <p>
            Coordinates: {formData.latitude}, {formData.longitude}
          </p>
        )} */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default GrantLocationForm;
