import React from "react";
import { Row, Col, Typography } from "antd";
// import "./HeroSection.css"; // Custom styles
import RegisterForm from "../components/registerForm/RegisterForm";

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
    return (
        <div className="">
            <Row
                justify="center"
                align="middle"
                className="hero-content"
                style={{ minHeight: "100vh", padding: "2rem 0" }}
            >
                <Col
                    xs={24}
                    md={12}
                    className="hero-text"
                    style={{ padding: "2rem" }}
                >
                    <Title
                        level={1}
                        className=""
                        style={{ color: "black !important" }}
                    >
                        Quick Registration – Register for FREE in less than 30
                        seconds
                    </Title>
                    <Paragraph className="hero-subtitle text-black">
                        <ul style={{ color: "black" }}>
                            <li>✔ Access to over 300,000 Vehicles</li>
                            <li>✔ No Dealer License Required</li>
                            <li>✔ Easy Bidding, Buying and Shipping</li>
                            <li>✔ 96% Customer Satisfaction Rate</li>
                        </ul>
                    </Paragraph>
                </Col>
                <Col
                    xs={24}
                    md={10}
                    className="hero-form"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div style={{ width: "100%", maxWidth: "450px" }}>
                        <RegisterForm />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default HeroSection;
