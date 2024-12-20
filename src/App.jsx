// import React, { useState } from "react";
// import axios from "axios";
// import ReCAPTCHA from "react-google-recaptcha";
// import "./App.css";

// function App() {
//   const [address, setAddress] = useState(""); // Store Ethereum address
//   const [transactionHash, setTransactionHash] = useState(""); // Store trannsaction hash
//   const [error, setError] = useState(null); // Store error message if request fails
//   const [captchaValue, setCaptchaValue] = useState(null); // Store reCAPTCHA

//   // Handle reCAPTCHA response
//   const onCaptchaChange = (value) => {
//     setCaptchaValue(value); // Set the value when user completes reCAPTCHA
//   };

//   // Handle form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Check if the input address is valid
//     if (!address) {
//       setError("Please enter a valid Ethereum address");
//       return;
//     }

//     // Check if the captcha is filled
//     if (!captchaValue) {
//       setError("Please complete the reCAPTCHA");
//       return;
//     }

//     try {
//       // Send a POST request to your FastAPI backend 
//       const response = await axios.post("https://sepolia-faucet-backend.onrender.com/faucet", {
//         address: address,
//         captcha_response: captchaValue, // Send the captcha response to the backend
//       });

//       if (response.data.success) {
//         setTransactionHash(response.data.transaction_hash); // Display the transasction hash
//         setError(null); // Clear any previous errors
//       } else {
//         setError("Failed to verify CAPTCHA. Please try again.");
//       }
//     } catch (error) {
//       // Handle error specifically for the 429 status (rate limit exceeded)
//       if (error.response && error.response.status === 429) {
//         setError("You can only request once every 24 hours.");
//       } else {
//         setError("Failed to request faucet. Please try again.");
//       }
//       setTransactionHash(""); // Clear transaction hash in case of error 
//     }
//   };


//   return (
//     <div className="flex items-center justify-center p-20">
//       <div className="p-6 rounded-lg flex-grow max-w-full">
//         <h1 className="text-3xl font-bold text-center mb-4 text-black">Sepolia ETH Faucet</h1>
//         <p className="text-center lg:text-lg m-4">Test coins can be obtained by entering account address

// </p>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label
//               htmlFor="address"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Account Address:
//             </label>

//             <input
//               type="text"
//               id="address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               placeholder="Enter your Sepolia address"
//               className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           </div>

//           <div className="justify-items-center p-4">
//           <ReCAPTCHA
//             sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
//             onChange={onCaptchaChange}
//           />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-4 text-xl rounded-lg hover:bg-blue-600 transition"
//           >
//             Request ETH
//           </button>
//         </form>

//         {error && (
//           <p className="mt-4 text-red-500 text-center">{error}</p>
//         )}

//         {transactionHash && (
//           <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
//             <h3 className="font-bold text-center">Transaction Successful!</h3>
//             <p className="text-center break-all">
//               Transaction Hash: {transactionHash}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;




import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "./App.css";

const TextFormatter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const applyBold = () => {
    const boldText = `<b>${inputText}</b>`;
    setOutputText(boldText);
  };

  const applyItalic = () => {
    const italicText = `<i>${inputText}</i>`;
    setOutputText(italicText);
  };

  const applyUnderline = () => {
    const underlineText = `<u>${inputText}</u>`;
    setOutputText(underlineText);
  };

  const convertToUnicode = () => {
    const unicodeText = inputText.replace(/([a-zA-Z])/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0x1D400));
    setOutputText(unicodeText);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-2/3">
        <h1 className="text-2xl font-semibold text-center mb-4">Text Formatter Tool</h1>

        <div className="flex gap-8">
          {/* Input Text Area */}
          <div className="w-1/2">
            <textarea
              id="inputText"
              placeholder="Enter text here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-80 p-4 border border-gray-300 rounded-md mb-4"
            ></textarea>

            <div className="flex justify-center gap-2 mb-4 text-lg">
              <button onClick={applyBold} className="btn">Bold</button>
              <button onClick={applyItalic} className="btn">Italic</button>
              <button onClick={applyUnderline} className="btn">Underline</button>
              <button onClick={convertToUnicode} className="btn">Unicode</button>
            </div>
          </div>

          {/* Output Text Area */}
          <div className="w-1/2">
            <textarea
              id="outputText"
              placeholder="Formatted text will appear here"
              value={outputText}
              readOnly
              className="w-full h-80 p-4 border border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};


const FaucetForm = () => {
  const [address, setAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState(null);
  const [captchaValue, setCaptchaValue] = useState(null);

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!address) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    if (!captchaValue) {
      setError("Please complete the reCAPTCHA");
      return;
    }

    try {
      const response = await axios.post("https://sepolia-faucet-backend.onrender.com/faucet", {
        address: address,
        captcha_response: captchaValue,
      });

      if (response.data.success) {
        setTransactionHash(response.data.transaction_hash);
        setError(null);
      } else {
        setError("Failed to verify CAPTCHA. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setError("You can only request once every 24 hours.");
      } else {
        setError("Failed to request faucet. Please try again.");
      }
      setTransactionHash("");
    }
  };

  return (
    <div className="flex items-center justify-center p-20">
      <div className="p-6 rounded-lg flex-grow max-w-full">
        <h1 className="text-3xl font-bold text-center mb-4 text-black">Sepolia ETH Faucet</h1>
        <p className="text-center lg:text-lg m-4">Test coins can be obtained by entering account address</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
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

          <button type="submit" className="w-full bg-blue-500 text-white py-4 text-xl rounded-lg hover:bg-blue-600 transition">
            Request ETH
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

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
};

function App() {
  return (
    <Router>
      <div className="flex justify-between bg-blue-500 p-4 text-white">
        <Link to="/" className="font-semibold">Faucet Form</Link>
        <Link to="/text-formatter" className="font-semibold">Text Formatter</Link>
      </div>
      <Routes>
        <Route path="/" element={<FaucetForm />} />
        <Route path="/text-formatter" element={<TextFormatter />} />
      </Routes>
    </Router>
  );
}

export default App;
