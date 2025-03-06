import React, { useEffect, useState } from "react";
import { Layout, Typography, Input, Button, Form, Card, message } from "antd";
import {
    EyeOutlined,
    EyeInvisibleOutlined,
    LockOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Content } = Layout;
const { Title, Text } = Typography;

const UserProfileUpdate: React.FC = () => {
    const [emailForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");

    // Mock user data - in a real app, you would fetch this from your API
    const [userData, setUserData] = useState({
        email: localStorage.getItem("email") || "", // Initialize email from localStorage
    });

    const validateEmails = (_: any, value: string) => {
        const newEmail = emailForm.getFieldValue("newEmail");
        const confirmEmail = emailForm.getFieldValue("confirmEmail");

        if (newEmail && confirmEmail && newEmail !== confirmEmail) {
            return Promise.reject("The two emails do not match!");
        }
        return Promise.resolve();
    };

    const handleEmailUpdate = async (values: any) => {
        setLoading(true);
        setEmailError("");

        try {
            // Replace with your actual API endpoint
            const response = await axios.post(
                "https://cars.asicompany.com/api/edit-profile",
                {
                    currentPassword: values.currentPasswordForEmail,
                    newEmail: values.newEmail,
                    token: localStorage.getItem("token"),
                },
                {
                    headers: {
                        "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (response.data.success) {
                message.success("Email updated successfully");
                setUserData({ ...userData, email: values.newEmail });
                emailForm.resetFields();
            } else {
                setEmailError(
                    response.data.message || "Failed to update email"
                );
            }
        } catch (error) {
            console.error("Error updating email:", error);
            setEmailError("An error occurred while updating your email");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (values: any) => {
        setLoading(true);

        try {
            // Replace with your actual API endpoint
            const response = await axios.post(
                "https://cars.asicompany.com/api/update-password",
                {
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword,
                },
                {
                    headers: {
                        "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (response.data.success) {
                message.success("Password updated successfully");
                passwordForm.resetFields([
                    "currentPassword",
                    "newPassword",
                    "confirmPassword",
                ]);
            } else {
                message.error(
                    response.data.message || "Failed to update password"
                );
            }
        } catch (error) {
            console.error("Error updating password:", error);
            message.error("An error occurred while updating your password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Content
                style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}
            >
                {/* Email Change Section */}
                <div style={{ marginBottom: "40px" }}>
                    <Title level={3} style={{ marginBottom: "24px" }}>
                        Change Email
                    </Title>

                    <div
                        style={{
                            display: "flex",
                            gap: "24px",
                            flexWrap: "wrap",
                        }}
                    >
                        <div style={{ flex: "1", minWidth: "300px" }}>
                            <Form
                                form={emailForm}
                                layout="vertical"
                                onFinish={handleEmailUpdate}
                                requiredMark={false}
                                style={{ maxWidth: "450px" }}
                            >
                                <Form.Item label="Current Email">
                                    <Input
                                        value={userData.email}
                                        disabled
                                        style={{ backgroundColor: "#f9f9f9" }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="newEmail"
                                    label="New Email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "This field is required",
                                        },
                                        {
                                            type: "email",
                                            message:
                                                "Please enter a valid email address",
                                        },
                                        { validator: validateEmails },
                                    ]}
                                    validateStatus={emailError ? "error" : ""}
                                    help={emailError}
                                >
                                    <Input placeholder="New Email" />
                                </Form.Item>

                                <Form.Item
                                    name="confirmEmail"
                                    label="Confirm New Email"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please confirm your email",
                                        },
                                        { validator: validateEmails },
                                    ]}
                                >
                                    <Input placeholder="Confirm New Email" />
                                </Form.Item>

                                <Form.Item
                                    name="currentPasswordForEmail"
                                    label="Current Password"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter your current password",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Current Password"
                                        type={
                                            currentPasswordVisible
                                                ? "text"
                                                : "password"
                                        }
                                        suffix={
                                            <span
                                                onClick={() =>
                                                    setCurrentPasswordVisible(
                                                        !currentPasswordVisible
                                                    )
                                                }
                                                style={{ cursor: "pointer" }}
                                            >
                                                {currentPasswordVisible ? (
                                                    <EyeInvisibleOutlined />
                                                ) : (
                                                    <EyeOutlined />
                                                )}
                                            </span>
                                        }
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        loading={loading}
                                        style={{
                                            height: "48px",
                                            fontSize: "16px",
                                            backgroundColor: "#3366ff",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        CHANGE EMAIL
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>

                        <div style={{ flex: "1", minWidth: "300px" }}>
                            <Card
                                style={{
                                    backgroundColor: "#f7f9ff",
                                    borderColor: "#e6e9f2",
                                }}
                                bodyStyle={{ padding: "24px" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "12px",
                                    }}
                                >
                                    <LockOutlined
                                        style={{
                                            color: "#3366ff",
                                            fontSize: "24px",
                                            marginTop: "3px",
                                        }}
                                    />
                                    <div>
                                        <Text
                                            strong
                                            style={{
                                                fontSize: "16px",
                                                display: "block",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            Your account is secure
                                        </Text>
                                        <Text style={{ color: "#666" }}>
                                            We use maximum encryption so that
                                            your payment and personal
                                            information are safe and secure.
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Password Change Section */}
                <div>
                    <Title level={3} style={{ marginBottom: "24px" }}>
                        Change Password
                    </Title>

                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handlePasswordUpdate}
                        requiredMark={false}
                        style={{ maxWidth: "450px" }}
                    >
                        <Form.Item
                            name="currentPassword"
                            label="Current Password"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please enter your current password",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Current Password"
                                type={passwordVisible ? "text" : "password"}
                                suffix={
                                    <span
                                        onClick={() =>
                                            setPasswordVisible(!passwordVisible)
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        {passwordVisible ? (
                                            <EyeInvisibleOutlined />
                                        ) : (
                                            <EyeOutlined />
                                        )}
                                    </span>
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your new password",
                                },
                                {
                                    min: 8,
                                    message:
                                        "Password must be at least 8 characters",
                                },
                            ]}
                        >
                            <Input placeholder="New Password" type="password" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm New Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your new password",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("newPassword") ===
                                                value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            "The two passwords do not match!"
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input
                                placeholder="Confirm New Password"
                                type={
                                    confirmPasswordVisible ? "text" : "password"
                                }
                                suffix={
                                    <span
                                        onClick={() =>
                                            setConfirmPasswordVisible(
                                                !confirmPasswordVisible
                                            )
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        {confirmPasswordVisible ? (
                                            <EyeInvisibleOutlined />
                                        ) : (
                                            <EyeOutlined />
                                        )}
                                    </span>
                                }
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                style={{
                                    height: "48px",
                                    fontSize: "16px",
                                    backgroundColor: "#3366ff",
                                    borderRadius: "4px",
                                }}
                            >
                                CHANGE PASSWORD
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
};

export default UserProfileUpdate;
