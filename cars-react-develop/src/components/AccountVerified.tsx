import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";

export default function AccountVerified() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token"); // Ensure 'token' is passed in URL
  const [verificationStatus, setVerificationStatus] = useState("loading");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setVerificationStatus("invalid");
        return;
      }
      
      try {
        const response = await axios.post(
          "https://cars.asicompany.com/api/verify-email",
          { token }, // Send token in the request body
          {
            headers: {
              "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setVerificationStatus("success");
          setTimeout(() => navigate("/login"), 5000);
        } else {
          setVerificationStatus("invalid");
        }
      } catch (error) {
        setVerificationStatus("invalid");
        console.error("Verification Failed:", error.response?.data || error.message);
      }
    };

    fetchData();
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center max-w-md">
        {verificationStatus === "success" ? (
          <>
            <CheckCircleOutlined className="text-green-500 mx-auto" style={{ fontSize: '64px' }} />
            <h1 className="text-2xl font-semibold mt-4">Account Verified Successfully!</h1>
            <p className="text-gray-600 mt-2">You will be redirected to the login page shortly.</p>
          </>
        ) : verificationStatus === "invalid" ? (
          <>
            <CloseCircleOutlined className="text-red-500 mx-auto" style={{ fontSize: '64px' }} />
            <h1 className="text-2xl font-semibold mt-4">Invalid or Already Verified Token</h1>
            <p className="text-gray-600 mt-2">Please check your email for the correct link.</p>
          </>
        ) : (
          <h1 className="text-2xl font-semibold mt-4">Verifying...</h1>
        )}
        {verificationStatus !== "success" && (
          <p className="text-blue-500 mt-4 cursor-pointer" onClick={() => navigate("/register")}>Go to Register</p>
        )}
      </div>
    </div>
  );
}