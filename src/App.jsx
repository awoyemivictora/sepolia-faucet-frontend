import React, { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "./App.css";

function App() {
  const [address, setAddress] = useState(""); // Store Ethereum address
  const [transactionHash, setTransactionHash] = useState(""); // Store trannsaction hash
  const [error, setError] = useState(null); // Store error message if request fails
  const [captchaValue, setCaptchaValue] = useState(null); // Store reCAPTCHA

  // Handle reCAPTCHA response
  const onCaptchaChange = (value) => {
    setCaptchaValue(value); // Set the value when user completes reCAPTCHA
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the input address is valid
    if (!address) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    // Check if the captcha is filled
    if (!captchaValue) {
      setError("Please complete the reCAPTCHA");
      return;
    }

    try {
      // Send a POST request to your FastAPI backend
      const response = await axios.post("https://sepolia-faucet-backend.onrender.com/faucet", {
        address: address,
        captcha_response: captchaValue, // Send the captcha response to the backend
      });

      if (response.data.success) {
        setTransactionHash(response.data.transaction_hash); // Display the transasction hash
        setError(null); // Clear any previous errors
      } else {
        setError("Failed to verify CAPTCHA. Please try again.");
      }
    } catch (error) {
      // Handle error specifically for the 429 status (rate limit exceeded)
      if (error.response && error.response.status === 429) {
        setError("You can only request once every 24 hours.");
      } else {
        setError("Failed to request faucet. Please try again.");
      }
      setTransactionHash(""); // Clear transaction hash in case of error
    }
  };

  return (
    <div className="App">
      <h1>Sepolia ETH Faucet</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="address">Ethereum Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your Sepolia address"
          />
        </div>

        {/* Google reCAPTCHA */}
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={onCaptchaChange}
        />

        <button type="submit">Request ETH</button>
      </form>

      {/* Display error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display transaction hash if successful */}
      {transactionHash && (
        <div>
          <h3>Transaction Successful!</h3>
          <p>Transaction Hash: {transactionHash}</p>
        </div>
      )}
    </div>
  );
}

export default App;
