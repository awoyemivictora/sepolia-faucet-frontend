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
    <div className="flex items-center justify-center p-20">
      <div className="p-6 rounded-lg flex-grow max-w-full">
        <h1 className="text-5xl font-bold text-center mb-4 text-black">Sepolia ETH Faucet</h1>
        <p className="text-center text-lg m-4">Test coins can be obtained by entering account address

</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="address"
              className="block text-gray-700 font-medium mb-2"
            >
              Account Address:
            </label>

            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your Sepolia address"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="justify-items-center p-4">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={onCaptchaChange}
          />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-4 text-xl rounded-lg hover:bg-blue-600 transition"
          >
            Request ETH
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 text-center">{error}</p>
        )}

        {transactionHash && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
            <h3 className="font-bold text-center">Transaction Successful!</h3>
            <p className="text-center break-all">
              Transaction Hash: {transactionHash}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
