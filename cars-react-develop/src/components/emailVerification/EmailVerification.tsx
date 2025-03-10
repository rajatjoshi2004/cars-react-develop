import React, { useState } from "react";
import { Card, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useTranslationApi } from "../../hooks/useTranslationApi";


const EmailVerification: React.FC = () => {
    const { t } = useTranslationApi();
    const [email, setEmail] = useState<string>("");
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        try {
            const response = await axios.post(
                "https://cars.asicompany.com/api/forgot-password",
                { email },
                {
                    headers: {
                        "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
                    },
                }
            );

            message.success("Password reset code sent to your email");
            navigate("/otpverify", { state: { email } });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorResponse = error.response.data;
                if (error.response.status === 404) {
                    if (errorResponse.message === "Email not found") {
                        toast.error("Email not found");
                    } else {
                        toast.error("User not found");
                    }
                } else if (error.response.status === 401) {
                    if (
                        errorResponse.message === "Invalid OTP" ||
                        errorResponse.message === "OTP expired"
                    ) {
                        toast.error("Invalid OTP or OTP expired");
                    }
                }
            } else {
                toast.error("An error occurred while sending OTP");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 text-center shadow-lg rounded-2xl">
                <h1 className="text-2xl font-semibold text-blue-600">
                   {t('otp.name')}
                </h1>
                <div className="my-4 flex justify-center">
                    <MailOutlined className="text-5xl text-blue-500" />
                </div>
                <h2 className="text-xl font-medium">
                    {t('otp.verify')}
                </h2>
                <input
                    type= {t('register.email')}
                    placeholder={t('otp.emailenter')}
                    className="border rounded p-2 w-full mt-4 verify-email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    type="primary"
                    size="large"
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 border-none"
                    onClick={handleSendOtp}
                >
                    {t('otp.sendotp')}
                </Button>
                <p className="text-gray-500 text-sm mt-4">
                    {t('otp.note')}
                </p>
            </Card>
        </div>
    );
};

export default EmailVerification;
