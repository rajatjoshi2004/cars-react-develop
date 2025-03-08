import { ClockCircleOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useTranslationApi } from "../hooks/useTranslationApi";

const { Text, Title } = Typography;

const RenderAuctionStatus: React.FC = ({ lot }) => {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    useEffect(() => {
        const updateCountdown = () => {
            const saleDate = new Date(lot.sale_date).getTime();
            const now = new Date().getTime();
            const difference = saleDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(
                        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    ),
                    minutes: Math.floor(
                        (difference % (1000 * 60 * 60)) / (1000 * 60)
                    ),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        // Update countdown immediately and then every second
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [lot.sale_date]);

    const currentBid = lot.bid || 0;
    const buyNowPrice = lot.buy_now;

    // Format the time left as a string
    const formattedTimeLeft = `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
    const { t } = useTranslationApi();
    return (
        <div className="auction-status">
            <div
                className="time-remaining"
                style={{ textAlign: "center", margin: "10px 0" }}
            >
                {timeLeft && (
                    <Space>
                        <ClockCircleOutlined
                            style={{ color: lot.sale_date ? "#4CAF50" : "red" }}
                        />
                        <Text
                            style={{ color: lot.sale_date ? "#4CAF50" : "red" }}
                        >
                            {lot.sale_date ? formattedTimeLeft : "Not Ready For Sale"}
                        </Text>
                    </Space>
                )}
            </div>

            <div
                style={{
                    background: "#f5f5f5",
                    padding: "15px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                }}
            >
                <Row justify="space-around" align="middle">
                    <Col>
                        <Text style={{ color: "#64748B" }}>{t(t('header.currentBid'))}:</Text>
                        <br />
                        <Text
                            className="flex justify-center"
                            strong
                            style={{ fontSize: "18px" }}
                        >
                            ${currentBid}
                        </Text>
                    </Col>
                    {buyNowPrice > 0 && (
                        <Col>
                            <Text style={{ color: "#64748B" }}>{t('carDetails.buyNow')}:</Text>
                            <br />
                            <Text
                                className="flex justify-center"
                                strong
                                style={{
                                    fontSize: "18px",
                                    color: "#4CAF50",
                                }}
                            >
                                ${buyNowPrice}
                            </Text>
                        </Col>
                    )}
                </Row>
            </div>

            {/* <Button
                type="primary"
                block
                style={{
                    background: lot.sale_date ? "#4CAF50" : "#ffcdcd",
                    marginBottom: "10px",
                    height: "40px",
                    color: lot.sale_date ? "white" : "red",
                }}
            >
                {lot.sale_date  ? "Opened auction" : "Ended"}
            </Button> */}
        </div>
    );
};

export default RenderAuctionStatus;
