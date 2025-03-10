import React, { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Typography,
    Button,
    Image,
    Spin,
    Badge,
    Space,
    Carousel,
    Tag,
} from "antd";
import {
    HeartOutlined,
    HeartFilled,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { formatSaleDate } from "../../utils/helpers/formatdate";
import copart from "../../assets/images/copart.png";
import aiia from "../../assets/images/aiia.png";
import RenderAuctionStatus from "../renderAuctionStatus";
import { useTranslation } from 'react-i18next';
import { useTranslationApi } from "../../hooks/useTranslationApi";
import comingSoonImg from "../../assets/images/1.jpg";



const { Text, Title } = Typography;

interface CarListProps {
    cars: any[];
    loading: boolean;
    renderWishlistButton: (vin: string) => JSX.Element;
    isInWishlist: (vin: string) => boolean;
}

const CarList: React.FC<CarListProps> = ({
    cars,
    loading,
    renderWishlistButton,
    isInWishlist,
}) => {
    const [watchlist, setWatchlist] = useState<number[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const toggleWatchlist = (carId: number) => {
        if (watchlist.includes(carId)) {
            setWatchlist(watchlist.filter((id) => id !== carId));
        } else {
            setWatchlist([...watchlist, carId]);
        }
    };

    // Helper function to safely get string values
    const safeString = (value: any): string => {
        if (value === null || value === undefined) return "N/A";
        if (typeof value === "string") return value;
        if (typeof value === "number") return value.toString();
        if (typeof value === "object") {
            // If it's an object with a name property, use that
            if (value.name) return value.name;
            // Otherwise return a placeholder
            return "Object";
        }
        return "N/A";
    };

    const renderCarouselItem = (images: string[]) => {
        if (!images || !images.length) {
            return (
                <div className="carousel-item-container">
                    <img
                        src={comingSoonImg}
                        alt="Vehicle"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />
                </div>
            );
        }

        return images.map((imageUrl, index) => (
            <div key={index} className="carousel-item-container">
                <img
                    src={imageUrl || "https://via.placeholder.com/400/320"}
                    alt="Vehicle"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                    }}
                />
            </div>
        ));
    };

    // const renderAuctionStatus = (lot: any) => {
    //     const [timeLeft, setTimeLeft] = useState<{
    //         days: number;
    //         hours: number;
    //         minutes: number;
    //         seconds: number;
    //     }>({
    //         days: 0,
    //         hours: 0,
    //         minutes: 0,
    //         seconds: 0,
    //     });
    //     useEffect(() => {
    //         const updateCountdown = () => {
    //             const saleDate = new Date(lot.sale_date).getTime();
    //             const now = new Date().getTime();
    //             const difference = saleDate - now;

    //             if (difference > 0) {
    //                 setTimeLeft({
    //                     days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    //                     hours: Math.floor(
    //                         (difference % (1000 * 60 * 60 * 24)) /
    //                             (1000 * 60 * 60)
    //                     ),
    //                     minutes: Math.floor(
    //                         (difference % (1000 * 60 * 60)) / (1000 * 60)
    //                     ),
    //                     seconds: Math.floor((difference % (1000 * 60)) / 1000),
    //                 });
    //             } else {
    //                 setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    //             }
    //         };

    //         // Update countdown immediately and then every second
    //         updateCountdown();
    //         const interval = setInterval(updateCountdown, 1000);

    //         return () => clearInterval(interval);
    //     }, [lot.sale_date]);

    //     const currentBid = lot.bid || 0;
    //     const buyNowPrice = lot.buy_now;

    //     return (
    //         <div className="auction-status">
    //             <div
    //                 className="time-remaining"
    //                 style={{ textAlign: "center", margin: "10px 0" }}
    //             >
    //                 {timeLeft && (
    //                     <Space>
    //                         <ClockCircleOutlined style={{ color: "#4CAF50" }} />
    //                         <Text style={{ color: "#4CAF50" }}>{timeLeft}</Text>
    //                     </Space>
    //                 )}
    //             </div>

    //             <div
    //                 style={{
    //                     background: "#f5f5f5",
    //                     padding: "15px",
    //                     borderRadius: "5px",
    //                     marginBottom: "10px",
    //                 }}
    //             >
    //                 <Row justify="space-around" align="middle">
    //                     <Col>
    //                         <Text style={{ color: "#64748B" }}>
    //                             Current Bid:
    //                         </Text>
    //                         <br />
    //                         <Text
    //                             className="flex justify-center"
    //                             strong
    //                             style={{ fontSize: "18px" }}
    //                         >
    //                             ${currentBid}
    //                         </Text>
    //                     </Col>
    //                     {buyNowPrice &&
    //                         buyNowPrice > 0 &&
    //                         (console.log(buyNowPrice),
    //                         (
    //                             <Col>
    //                                 <Text style={{ color: "#64748B" }}>
    //                                     Buy Now:
    //                                 </Text>
    //                                 <br />
    //                                 <Text
    //                                     className="flex justify-center"
    //                                     strong
    //                                     style={{
    //                                         fontSize: "18px",
    //                                         color: "#4CAF50",
    //                                     }}
    //                                 >
    //                                     ${buyNowPrice}
    //                                 </Text>
    //                             </Col>
    //                         ))}
    //                 </Row>
    //             </div>

    //             <Button
    //                 type="primary"
    //                 block
    //                 style={{
    //                     background: "#4CAF50",
    //                     marginBottom: "10px",
    //                     height: "40px",
    //                 }}
    //             >
    //                 Opened auction
    //             </Button>
    //         </div>
    //     );
    // };

    if (loading) {
        return (
            <div
                className="heading-md loader"
                style={{ textAlign: "center", padding: "50px" }}
            >
                <Spin size="large" />
            </div>
        );
    }


     // Helper function to format status text and color
     const formatStatus = (status: string) => {

        const statusMap: { [key: string]: { text: string; color: string } } = {
            "0": { text: "Run and Drive", color: "green" },
            "1": { text: "For Repair", color: "orange" },
            "2": { text: "To Be Dismantled", color: "red" },
            "3": { text: "Not Run", color: "volcano" },
            "4": { text: "Used", color: "geekblue" },
            "5": { text: "Unconfirmed", color: "purple" },
            "6": { text: "Engine Starts", color: "cyan" },
            "7": { text: "Enhanced", color: "gold" },
        };

        return statusMap[status] || { text: "Unknown", color: "default" };
    };
    const { t } = useTranslationApi();
    return (
        <>
            {/* Add this CSS to your component or in a separate stylesheet */}
            <style>
                {`
                .carousel-container {
                    position: relative;
                    width: 100%;
                    padding-top: 75%; /* 4:3 Aspect Ratio */
                    overflow: hidden;
                }

                /* For smaller screens */
                @media (max-width: 576px) {
                    .carousel-container {
                        padding-top: 66.67%; /* 3:2 Aspect Ratio for mobile */
                    }
                }

                .carousel-wrapper {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                }

                .carousel-item-container {
                    height: 100%;
                    display: flex !important;
                    justify-content: center;
                    align-items: center;
                }

                /* Style Ant Design's carousel dots for better visibility */
                .ant-carousel .slick-dots li button {
                    background: #1890ff;
                    opacity: 0.3;
                }

                .ant-carousel .slick-dots li.slick-active button {
                    opacity: 1;
                }
                `}
            </style>

            <Row gutter={[16, 24]}>
                {cars?.map((car: any) => {
                    // Extract and process car data
                    const lot = car.lots?.[0] ?? {};
                    const images = lot?.images?.normal || [];

                    // Handle complex objects with safe string extraction
                    const manufacturerName =
                        safeString(car.manufacturer) || "N/A";
                    const modelName = safeString(car.model) || "N/A";
                    const year = car.year || "N/A";
                    // const domain = car?.lots?.[0]?.domain.name;
                    const vehicleTitle =
                        `${year} ${manufacturerName} ${modelName}` || "N/A";
                    const vin = car.vin || "N/A";

                    // Handle location object
                    const city = lot.location?.city?.name || "N/A";
                    const state = lot.location?.state?.code
                        ? lot.location.state.code.toUpperCase()
                        : "N/A";
                    const location =
                        city && state
                            ? `${city} (${state})`
                            : "Location not available";

                    // Handle odometer
                    const miles = lot?.odometer?.mi || "N/A";
                    const kilometers = lot?.odometer?.km || "N/A";
                    const mileage =
                        typeof miles === "number"
                            ? `${miles.toLocaleString()} miles (${kilometers.toLocaleString()} km)`
                            : "N/A";

                    // Handle damage
                    const damage = lot?.damage?.main?.name || "N/A";
                    const secondaryDamage = lot?.damage?.second?.name;

                    // Handle other properties
                    const engineInfo = safeString(car?.engine?.name) || "N/A";
                    const transmission = safeString(car.transmission) || "N/A";
                    const driveType = safeString(car.drive_wheel) || "N/A";
                    const status = lot?.condition?.id || "N/A";

                    // Handle seller
                    const sellerName = safeString(lot.seller?.name) || "N/A";
                    const titleDocument = lot.title?.name || "N/A";
                    const estPrice = lot.estimate_repair_price || "N/A";

                    return (
                        <Col xs={24} key={car.id}>
                            <Card
                                bordered={false}
                                style={{
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                }}
                            >
                                <Row gutter={[16, 16]}>
                                    {/* Car Image Column - Using responsive aspect ratio */}
                                    <Col xs={24} md={8}>
                                        <div className="carousel-container">
                                            <div className="carousel-wrapper">
                                                <Carousel
                                                    autoplay={false}
                                                    dots={true}
                                                >
                                                    {renderCarouselItem(images)}
                                                </Carousel>
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Car Details Column */}
                                    <Col xs={24} md={16}>
                                        <Row>
                                            <Col xs={24} md={16}>
                                                <Title
                                                    level={4}
                                                    style={{
                                                        color: "#1890ff",
                                                        marginBottom: "5px",
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Link
                                                        to={`/cars/${vin}`}
                                                        className="flex items-center"
                                                    >
                                                        {vehicleTitle} {" "}
                                                        <img style={{ marginLeft: "10px" }}
                                                            src={
                                                                lot.domain
                                                                    ?.name ===
                                                                "copart_com"
                                                                    ? copart
                                                                    : aiia
                                                            }
                                                            alt={`${
                                                                lot.domain
                                                                    ?.name ===
                                                                "copart_com"
                                                                    ? "copart"
                                                                    : "aiia"
                                                            }`}
                                                            width={
                                                                lot.domain
                                                                    ?.name ===
                                                                "copart_com"
                                                                    ? 20
                                                                    : 30
                                                            }
                                                        />
                                                    </Link>
                                                    {renderWishlistButton(
                                                        car.vin
                                                    )}
                                                </Title>

                                                {/* <div className="flex justify-between items-center">
                                                    <Text
                                                        style={{
                                                            color: "#64748B",
                                                            display: "block",
                                                            marginBottom: "5px",
                                                        }}
                                                    >
                                                        {engineInfo} •{" "}
                                                        {lot?.engine?.name || "N/A"}
                                                    </Text>
                                                </div>  */}
                                                <div className="flex justify-between items-center">
                                                    <Text
                                                        style={{
                                                            color: "#64748B",
                                                            display: "block",
                                                            marginBottom: "5px",
                                                        }}
                                                    >
                                                        {vin} •{" "}
                                                        {lot.lot || "N/A"}
                                                    </Text>
                                                </div>

                                                <Row
                                                    gutter={[16, 8]}
                                                    style={{
                                                        marginTop: "15px",
                                                    }}
                                                >
                                                     <Col xs={24}>
                                                        <Tag >
                                                        {t('search.engine')}:{" "}
                                                        </Tag>
                                                        <Text>{engineInfo}</Text>
                                                        
                                                    </Col>
                                                    <Col xs={12}>
                                                        <Text type="secondary">
                                                        {t('search.seller')}:
                                                        </Text>
                                                        <br />
                                                        <Badge
                                                            status="processing"
                                                            color="#1890ff"
                                                            text={sellerName}
                                                        />
                                                    </Col>
                                                    <Col xs={12}>
                                                        <Text type="secondary">
                                                        {t('search.saledoc')}:
                                                        </Text>
                                                        <br />
                                                        <Badge
                                                            status="processing"
                                                            color="#1890ff"
                                                            text={titleDocument}
                                                        />
                                                    </Col>

                                                    <Col xs={12}>
                                                        <Text type="secondary">
                                                        {t('search.milage')}:
                                                        </Text>
                                                        <br />
                                                        <Text>{mileage}</Text>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <Text type="secondary">
                                                        {t('search.location')}:
                                                        </Text>
                                                        <br />
                                                        <Text>{location}</Text>
                                                    </Col>

                                                    <Col xs={12}>
                                                        <Text type="secondary">
                                                        {t('search.damage')}:
                                                        </Text>
                                                        <br />
                                                        <Text>
                                                            {damage}{" "}
                                                            {secondaryDamage
                                                                ? `| ${secondaryDamage}`
                                                                : ""}
                                                        </Text>
                                                    </Col>
                                                    <Col xs={12}>
                                                 
                              <Text className="text-gray-600">{t('search.status')}: </Text>
                              <Text strong>
                                <Tag color={formatStatus(status).color}>
                                  {formatStatus(status).text}
                                </Tag>
                              </Text>
                            
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Row>
                                                    <Col xs={24}>
                                                        <div
                                                            style={{
                                                                marginBottom:
                                                                    "10px",
                                                            }}
                                                        >
                                                            <Text type="secondary">
                                                            {t('search.estprice')}:
                                                            </Text>
                                                            <Text
                                                                strong
                                                                style={{
                                                                    marginLeft:
                                                                        "5px",
                                                                }}
                                                            >
                                                                {estPrice}
                                                            </Text>
                                                        </div>

                                                        <RenderAuctionStatus
                                                            lot={lot}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

export default CarList;
