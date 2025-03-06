import React, { useEffect, useState } from "react";
import { Layout, Table, Button, Typography, Avatar, Card, Grid } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";
import copart from "../assets/images/copart.png";
import aiia from "../assets/images/aiia.png";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface WishlistItem {
    id: number;
    year: number;
    title: string;
    vin: string;
    manufacturer: {
        id: number;
        name: string;
    };
    model: {
        id: number;
        name: string;
    };
    lots: Array<{
        id: number;
        lot: string;
        bid: string;
        odometer: {
            km: number;
            mi: number;
            status: string | null;
        };
        damage: {
            main: {
                id: number;
                name: string;
            };
            second: any;
        };
        images: {
            small: string[];
            normal: string[];
            big: string[];
        };
        sale_date?: string;
    }>;
    color?: {
        id: number;
        name: string;
    };
}

interface FormattedWishlistItem {
    key: string;
    image: string;
    vehicle: string;
    vin: string;
    lot: string;
    damage: string;
    odometer: string;
    bid: string;
    saleDate: string;
    color: string;
    originalItem: WishlistItem; // Store original item for reference if needed
}

const Dashboard: React.FC = () => {
    const screens = useBreakpoint();
    const [wishlist, setWishlist] = useState<FormattedWishlistItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found in local storage");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `https://cars.asicompany.com/api/wishlist?token=${token}`,
                {
                    headers: {
                        "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
                    },
                }
            );

            // Format the API data to match table structure
            const formattedData = formatWishlistData(response.data.wishlist);
            setWishlist(formattedData);
            console.log("Wishlist data:", response.data.wishlist);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatWishlistData = (
        data: WishlistItem[]
    ): FormattedWishlistItem[] => {
        return data.map((item) => {
            // Get the first lot if available
            const lot = item.lots && item.lots.length > 0 ? item.lots[0] : null;

            // Get the sale date if available
            const saleDate = lot && lot.sale_date ? lot.sale_date : "N/A";

            // Get the first image if available
            const imageUrl =
                lot && lot.images && lot.images.normal.length > 0
                    ? lot.images.normal[0]
                    : "https://via.placeholder.com/150";

            // Get the color if available
            const colorName = item.color ? item.color.name : "N/A";

            // Get odometer values
            const odometerMi =
                lot && lot.odometer
                    ? lot.odometer?.mi?.toLocaleString()
                    : "N/A";
            const odometerKm =
                lot && lot.odometer
                    ? lot.odometer?.km?.toLocaleString()
                    : "N/A";

            return {
                key: item.id.toString(),
                image: imageUrl,
                vehicle: `${item.year} ${item.manufacturer?.name} ${item.model?.name}`,
                vin: item.vin,
                lot: lot ? lot.lot : "N/A",
                damage: lot && lot.damage?.main ? lot.damage.main.name : "N/A",
                odometer:
                    odometerMi !== "N/A"
                        ? `${odometerMi} mi (${odometerKm} km)`
                        : "N/A",
                bid: lot ? lot.bid : "N/A",
                saleDate: saleDate,
                color: colorName,
                originalItem: item,
            };
        });
    };

    const removeFromWishList = async (vin: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await axios.post(
                "https://cars.asicompany.com/api/remove-from-wishlist",
                { vin: vin, token: token },
                {
                    headers: {
                        "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
                    },
                }
            );
            console.log("Removed from wishlist:", response.data);

            // Update the wishlist after removing
            fetchWishlist();
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    // Columns for Table (Desktop View)
    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (text: string, record: any) => (
                <Link to={`/cars/${record.vin}`}>
                    <img
                        src={text}
                        alt="car"
                        className="w-[150px] h-full object-cover"
                    />
                </Link>
            ),
        },
        {
            title: "Vehicle",
            dataIndex: "vehicle",
            key: "vehicle",
            render: (text: string, record: FormattedWishlistItem) => (
                <div>
                    <div className="flex items-center">
                        <Text className="text-blue-600" strong>
                            
                        <Link to={`/cars/${record.vin}`}>{text}</Link>
                           </Text>
                        <img
                            src={
                                record?.lots?.[0].domain?.name === "copart_com"
                                    ? copart
                                    : aiia
                            }
                            alt={`${
                                record?.lots?.[0].domain === "copart_com"
                                    ? "copart"
                                    : "aiia"
                            }`}
                            width={
                                record?.lots?.[0].domain === "copart_com"
                                    ? 20
                                    : 30
                            }
                        />
                    </div>
                    <br />
                    <Text type="secondary">{record.vin}</Text>
                </div>
            ),
        },
        // {
        //     title: "Lot #",
        //     dataIndex: "lot",
        //     key: "lot",
        //     render: (text: string, record: any) => (
        //         <Link to={`/cars/${record.vin}`}>{text}</Link>
        //     ),
        // },
        {
            title: "Damage",
            dataIndex: "damage",
            key: "damage",
        },
        {
            title: "Odometer",
            dataIndex: "odometer",
            key: "odometer",
        },
        {
            title: "Current Bid",
            dataIndex: "bid",
            key: "bid",
            render: (text: string) => <Text strong>${text || 0} USD</Text>,
        },
        {
            title: "Sale Date",
            dataIndex: "saleDate",
            key: "saleDate",
            render: (text: string) => {
                const date = new Date(text);
                const options: Intl.DateTimeFormatOptions = {
                    weekday: "short",
                    year: "numeric",
                    month: "long", // Changed to 'long' to show the full name of the month
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    timeZoneName: "short",
                };
                if (
                    date.toLocaleString("en-IN", options).replace(",", " -") !==
                    "Invalid Date"
                ) {
                    return date
                        .toLocaleString("en-IN", options)
                        .replace(",", " -");
                } else {
                    return "N/A";
                }
                // return (
                //     date.toLocaleString("en-IN", options).replace(",", " -") !== "Invalid Date"  ||
                //     "N/A"
                // ); // Formats the date and time
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: FormattedWishlistItem) => (
                <Button
                    type="primary"
                    danger
                    icon={<HeartOutlined />}
                    onClick={() => removeFromWishList(record.vin)}
                >
                    Remove
                </Button>
            ),
        },
    ];

    return (
        <Layout>
            {/* Dashboard Header */}
            <Header
                style={{
                    background: "#fff",
                    padding: 16,
                    fontSize: 20,
                    fontWeight: "bold",
                }}
            >
                Dashboard
            </Header>

            <Content style={{ padding: 24 }}>
                {/* Watchlist Section */}
                <div
                    style={{
                        background: "#f5f5f5",
                        padding: 16,
                        borderRadius: 8,
                    }}
                >
                    <Title level={3} style={{ marginBottom: 16 }}>
                        Watchlist ({wishlist.length})
                    </Title>

                    {/* Show Table for Larger Screens */}
                    {!screens.xs ? (
                        <Table
                            columns={columns}
                            dataSource={wishlist}
                            pagination={false}
                            loading={loading}
                        />
                    ) : (
                        // Show List for Mobile Screens
                        wishlist.map((item) => (
                            <Card key={item.key} style={{ marginBottom: 16 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <Avatar
                                        shape="square"
                                        size={64}
                                        src={item.image}
                                    />
                                    <div>
                                        <Link
                                            to={`/cars/${item.vin}`}
                                            className="flex items-center"
                                        >
                                            <Text
                                                className="text-blue-600"
                                                strong
                                            >
                                                {item.vehicle}
                                            </Text>
                                            <img
                                                src={
                                                    item?.lots?.[0].domain
                                                        ?.name === "copart_com"
                                                        ? copart
                                                        : aiia
                                                }
                                                alt={`${
                                                    item?.lots?.[0].domain ===
                                                    "copart_com"
                                                        ? "copart"
                                                        : "aiia"
                                                }`}
                                                width={
                                                    item?.lots?.[0].domain ===
                                                    "copart_com"
                                                        ? 20
                                                        : 30
                                                }
                                            />
                                        </Link>
                                        <br />
                                        <Text type="secondary">{item.vin}</Text>
                                    </div>
                                </div>
                                {/* <div style={{ marginTop: 12 }}>
                                    <Text strong>Lot #: </Text>
                                    <a href="#">{item.lot}</a>
                                </div> */}
                                <div>
                                    <Text strong>Damage: </Text>
                                    {item.damage}
                                </div>
                                <div>
                                    <Text strong>Odometer: </Text>
                                    {item.odometer ?item.odometer : "N/A"}
                                </div>
                                <div>
                                    <Text strong>Current Bid:</Text>${item.bid}{" "}
                                    USD
                                    
                                </div>
                                
                                <div>
                                    <Text strong>Sale Date: </Text>
                                    {item.saleDate}
                                </div>
                                <div>
                                    <Text strong>Color: </Text>
                                    {item.color}
                                </div>
                                <Button
                                    type="primary"
                                    danger
                                    icon={<HeartOutlined />}
                                    style={{ marginTop: 12 }}
                                    onClick={() => removeFromWishList(item.vin)}
                                >
                                    Remove
                                </Button>
                            </Card>
                        ))
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default Dashboard;
