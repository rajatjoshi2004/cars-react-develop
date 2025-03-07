import React from "react";
import { Row, Col, Typography } from "antd";
// import "./HeroSection.css"; // Custom styles
import RegisterForm from "../components/registerForm/RegisterForm";
import { useTranslation } from 'react-i18next';
import { useTranslationApi } from "../hooks/useTranslationApi";

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
    const { t } = useTranslationApi()
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
                       {t('header.herotitle')}
                    </Title>
                    <Paragraph className="hero-subtitle text-black">
                        <ul style={{ color: "black" }}>
                            <li>✔ {t('register.subtitle')}</li>
                            <li>✔ {t('register.subtitle2')}</li>
                            <li>✔ {t('register.subtitle3')}</li>
                            <li>✔ {t('register.subtitle4')}</li>
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
