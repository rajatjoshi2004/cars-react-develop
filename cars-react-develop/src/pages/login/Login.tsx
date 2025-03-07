import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import {
    GoogleOutlined,
    AppleOutlined,
    FacebookOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';
import { useTranslationApi } from "../../hooks/useTranslationApi";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const navigate = useNavigate();
    const { t } = useTranslationApi()

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
    }, []); // Add an empty dependency array to run this effect only once on mount

    const onFinish = async (values: any) => {
        if (!termsAccepted) {
            toast.error("You must accept the terms and conditions to log in.");
            return;
        }
        try {
            const response = await axios.post(
                "https://cars.asicompany.com/api/login",
                {
                    email: email,
                    password: password,
                },
                {
                    headers: {
                        "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
                    },
                }
            );
            console.log(response);
            localStorage.setItem("token", response.data.access_token);

            if (response.status) {
                localStorage.setItem("email", email);
                navigate("/search");
                toast.success("login successfully");
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-6 bg-gray-100">
            {/* Responsive Container */}
            <div className="flex flex-col md:flex-row items-center w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Left Side - Image */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-4">
                    <img
                        src="https://servedby.auctionbidia.com/getad.img/;libID=3788579"
                        className="w-full h-auto rounded-lg shadow-md"
                        alt="Car Shipping"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        <h2 className="text-lg font-semibold text-center mb-3">
                          {t('header.signInAccount')}
                        </h2>

                        <Form layout="vertical" onFinish={onFinish}>
                            {/* Email Field */}
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: `${t('header.emailLogin')}`,
                                    },
                                ]}
                                className="mb-2"
                            >
                                <Input
                                    placeholder= {t('registerForm.email')}
                                    size="middle"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Item>

                            {/* Password Field */}
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: `${t('header.passwordLogin')}`,
                                    },
                                ]}
                                className="mb-2"
                            >
                                <Input.Password
                                    placeholder={t('registerForm.password')}
                                    size="middle"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Form.Item>

                            {/* Forgot Password */}
                            <div className="flex justify-end mb-2">
                                <Link
                                    to="/verify"
                                    className="text-blue-500 text-xs"
                                >
                                    {t('header.forgot')}
                                </Link>
                            </div>

                            {/* Terms & Conditions */}
                            <Form.Item className="mb-2">
                                <Checkbox
                                    onChange={(e) =>
                                        setTermsAccepted(e.target.checked)
                                    }
                                >
                                   {t('header.agreement')}
                                    <a href="#" className="text-blue-500">
                                        {" "}
                                       {t('registerForm.terms')}
                                    </a>
                                </Checkbox>
                            </Form.Item>

                            {/* Sign In Button */}
                            <Form.Item className="mb-3">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    size="middle"
                                    className="bg-blue-600"
                                >
                                   {t('header.signIn')}
                                </Button>
                            </Form.Item>
                        </Form>

                        {/* OR Continue With */}
                        {/* <div className="text-center text-gray-500 text-sm my-2">
                            OR CONTINUE WITH
                        </div> */}

                        {/* Social Login Buttons */}
                        {/* <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-2">
                            <Button
                                icon={<GoogleOutlined />}
                                block
                                size="middle"
                            >
                                Google
                            </Button>
                            <Button
                                icon={<AppleOutlined />}
                                block
                                size="middle"
                            >
                                Apple
                            </Button>
                            <Button
                                icon={<FacebookOutlined />}
                                block
                                size="middle"
                            >
                                Facebook
                            </Button>
                        </div> */}

                        {/* Register Now */}
                        <p className="text-center text-xs mt-3">
                           
                            <Link
                                to="/register"
                                className="text-blue-500 font-semibold"
                            >{t('header.account')}
                                {" "}
                                {t('registerForm.register')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
