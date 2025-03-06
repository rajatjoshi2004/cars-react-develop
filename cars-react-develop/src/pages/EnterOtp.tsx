import React, { useState } from "react";
import { Card, Button, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const EnterOtp: React.FC = () => {
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || ""; // Get email from navigation state

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post(
                "https://cars.asicompany.com/api/reset-password",
                { email, otp, password },
                {
                    headers: {
                        "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Password reset successfully!");
                navigate("/login"); // Redirect to login page
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                if (status === 401) {
                    toast.error(
                        data.message === "OTP expired"
                            ? "OTP expired"
                            : "Invalid OTP"
                    );
                } else if (status === 404) {
                    toast.error(
                        data.message === "Email not found"
                            ? "Email not found"
                            : "User not found"
                    );
                } else {
                    toast.error(
                        "An error occurred while resetting the password"
                    );
                }
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 text-center shadow-lg rounded-2xl">
                <h1 className="text-2xl font-semibold text-blue-600">
                    Atlantic Cars
                </h1>
                <div className="my-4 flex justify-center">
                    <LockOutlined className="text-5xl text-blue-500" />
                </div>
                <h2 className="text-xl font-medium">Reset Your Password</h2>
                <p className="text-gray-600 mt-2">
                    Enter the OTP sent to <strong>{email}</strong> and set a new
                    password.
                </p>
                <Input
                    size="large"
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter OTP"
                    className="mt-4 text-center text-lg tracking-widest"
                />
                <Input.Password
                    size="large"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="mt-4 text-center text-lg"
                />
                <Button
                    type="primary"
                    size="large"
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 border-none"
                    disabled={otp.length !== 6 || password.length < 6}
                    onClick={handleVerifyOtp}
                >
                    Reset Password
                </Button>
                <p className="text-gray-500 text-sm mt-4">
                    Didn't receive the code?{" "}
                    <span className="text-blue-500 cursor-pointer">
                        Resend OTP
                    </span>
                </p>
            </Card>
        </div>
    );
};

export default EnterOtp;
