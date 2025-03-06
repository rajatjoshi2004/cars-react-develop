import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Row, Col, Select } from "antd";
import "./RegisterForm.css"; // Custom styles
import { countryCodes } from "../../utils/mockData";
import axios from "axios"; // Import Axios
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const RegisterForm: React.FC = () => {
    const [countryCode, setCountryCode] = useState<{
        code: string;
        dial_code: string;
    } | null>(null);
    const [city, setCity] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [ip, setIp] = useState<string>("");
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(
        //         () => {
        fetchCountryCode();
        // },
        // (error) => {
        //     console.log("Error getting location", error);
        // }
        // );
        // } else {
        //     console.log("Geolocation is not supported by this browser.");
        // }
    }, []);

    const fetchCountryCode = async () => {
        try {
            const response = await fetch(
                "https://ipinfo.io?token=a20dfb3a936800"
            );
            const data = await response.json();
            // console.log(data);
            setIp(data?.ip);
            if (data?.country) {
                const selectedCountry = countryCodes.find(
                    (item) => item.code === data.country
                );
                if (selectedCountry) {
                    setCountryCode(selectedCountry);
                    setCity(data.city);
                    setCountry(data.country);
                }
            }
        } catch (error) {
            console.error("Error fetching country data", error);
        }
    };

    const registerHandler = async () => {
        try {
            const values = await form.validateFields();

            const formData = new FormData();
            formData.append("fname", values.firstName);
            formData.append("lname", values.lastName);
            formData.append("email", values.email);
            formData.append("password", values.password);
            formData.append("phone", values.phone);
            formData.append("city", city);
            formData.append("country", country);
            formData.append("ip", ip);

            const response = await axios.post(
                "https://cars.asicompany.com/api/register", // Direct API URL
                formData,
                {
                    headers: {
                        "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
                        // Note: Axios automatically sets the Content-Type for FormData
                    },
                }
            );
            console.log(response);
            if (response.status === 200) {
                navigate("/login");
                toast.success("Get Verified! Please check your email to verify your account.");
            }
        } catch (error: any) {
            // console.error("Error fetching manufacturers:", error.response.data);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="register-form">
            <Title level={3} className="register-title">
                Register a New Account for FREE!
            </Title>

            <Text type="danger" className="required-text">
                * Indicates required fields
            </Text>

            <Form form={form} layout="vertical">
                {/* Name Row */}
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="firstName"
                            rules={[
                                {
                                    required: true,
                                    message: "First Name is required",
                                },
                            ]}
                        >
                            <Input placeholder="First Name *" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="lastName"
                            rules={[
                                {
                                    required: true,
                                    message: "Last Name is required",
                                },
                            ]}
                        >
                            <Input placeholder="Last Name *" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Phone Number */}
                <Form.Item
                    name="phone"
                    rules={[
                        { required: true, message: "Phone number is required" },
                    ]}
                >
                    <Input
                        addonBefore={
                            <Select
                                value={
                                    countryCode
                                        ? countryCode.dial_code
                                        : undefined
                                }
                                onChange={(value) => {
                                    const selectedCountry = countryCodes.find(
                                        (item) => item.dial_code === value
                                    );
                                    if (selectedCountry)
                                        setCountryCode(selectedCountry);
                                }}
                            >
                                {countryCodes.map((item) => (
                                    <Select.Option
                                        key={item.code}
                                        value={item.dial_code}
                                    >
                                        {item.code} {item.dial_code}
                                    </Select.Option>
                                ))}
                            </Select>
                        }
                        placeholder="Phone Number *"
                    />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            type: "email",
                            message: "Enter a valid email",
                        },
                    ]}
                >
                    <Input placeholder="Email *" />
                </Form.Item>

                <Row gutter={16}>
                    {/* Password Field */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Password is required",
                                },
                                {
                                    min: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Password *" />
                        </Form.Item>
                    </Col>

                    {/* Confirm Password Field */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="confirmPassword"
                            dependencies={["password"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your password",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("password") === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Passwords do not match")
                                        );
                                    },
                                }),
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Confirm Password *" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Terms & Conditions */}
                <div className="terms">
                    By clicking <strong>"REGISTER NOW"</strong> you agree to
                    AutoBidMaster's <a href="#">Terms and Conditions</a>
                </div>

                {/* Register Button */}
                <Form.Item>
                    <Button
                        type="primary"
                        block
                        className="register-button"
                        onClick={registerHandler}
                    >
                        REGISTER NOW
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterForm;
