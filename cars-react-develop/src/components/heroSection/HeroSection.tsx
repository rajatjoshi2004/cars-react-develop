import React from "react";
import { Row, Col, Typography } from "antd";
import RegisterForm from "../registerForm/RegisterForm";
import "./HeroSection.css"; // Custom styles
import { isAuthenticated } from "../../utils/auth";
import CarFinderForm from "../CarFinderForm";
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useTranslationApi } from '../../hooks/useTranslationApi';
import { CheckCircle } from 'lucide-react';

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
    const { t } = useTranslationApi();
    const auth = isAuthenticated();

    return (
        <div className="hero-section">
            <Row justify="center" align="middle" className="hero-content">
                <Col xs={24} md={12} className="hero-text">
                    <Title level={1} className="hero-title">
                        {t('header.herotitle')}
                    {/* Smart AI technology helps you find the best auction cars at the right price—shipped from the USA & Canada. */}
                    </Title>
                    <Paragraph className="hero-subtitle">
                        {/* Choose from over 300,000+ Used, Wholesale and Repairable
                        Cars, Trucks, and SUVs for Sale at Copart & IAAI Auto
                        Auctions */}
                        {t('header.subtitle')}
                    </Paragraph>
                    {/* <div className="steps">
                        <div className="step">
                            <span className="step-icon">📝</span>
                            <span>
                                <strong>STEP 1: REGISTER</strong> - Register for
                                FREE and start your search
                            </span>
                        </div>
                        <div className="step">
                            <span className="step-icon">💰</span>
                            <span>
                                <strong>STEP 2: BUY</strong> - Bid and buy at a
                                great price
                            </span>
                        </div>
                        <div className="step">
                            <span className="step-icon">🚚</span>
                            <span>
                                <strong>STEP 3: SHIP</strong> - We make shipping
                                and custom clearance easy
                            </span>
                        </div>
                    </div> */}
                </Col>
                
            </Row>
        </div>
    );
};

export default HeroSection;
