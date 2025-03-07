import React, { FC, useEffect, useState, useRef } from "react";
import {
  Table,
  Button,
  Typography,
  Space,
  Row,
  Grid,
  Spin,
  Divider,
  Tag,
} from "antd";
import { formatSaleDate } from "../../utils/helpers/formatdate";
import { Car, CarApiResponse } from "../../types/interfaces";
import { initialCarApiResponse } from "./Search";
import CarList from "../../components/Cars/CarsList";
import { apiCall } from "../../utils/api/API";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import copart from "../../assets/images/copart.png";
import aiia from "../../assets/images/aiia.png";
import comingSoonImg from "../../assets/images/1.jpg";
import { useTranslation } from "react-i18next";
import { useTranslationApi } from "../../hooks/useTranslationApi";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const VehicleTable: FC<{
  carsData: CarApiResponse;
  filter: any;
  loading: boolean;
  handlePageChange: (page: number) => void;
}> = ({ loading, carsData = initialCarApiResponse, filter }) => {
  const [dataSource, setDataSource] = useState<Car[]>([]);
  const [wishlist, setWishlist] = useState<{ [key: string]: boolean }>({});
  const [wishlistLoading, setWishlistLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const screens = useBreakpoint();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslationApi();
  const scrollToTop = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({
        top: 0,
      });
    }

    window.scrollTo({
      top: 0,
    });
  };

  useEffect(() => {
    setDataSource(carsData.data || []);
    scrollToTop();
    fetchWishlist();
  }, [carsData]);

  const handleImageError = (carId: number) => {
    setDataSource((prevData) => prevData.filter((car) => car.id !== carId));
  };

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in local storage");
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

      // Convert wishlist data to a map of VIN -> boolean for easy lookup
      const wishlistMap: { [key: string]: boolean } = {};
      if (Array.isArray(response.data.wishlist)) {
        response.data.wishlist.forEach((item: any) => {
          wishlistMap[item.vin] = true;
        });
      } else if (typeof response.data.wishlist === "object") {
        // If it's already in the format we need
        setWishlist(response.data.wishlist);
        return;
      }

      setWishlist(wishlistMap);
      // console.log("Formatted wishlist data:", wishlistMap);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const toggleWishlist = async (vin: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Set loading state for this specific car
    setWishlistLoading((prev) => ({ ...prev, [vin]: true }));

    try {
      // Determine if we're adding or removing
      const isCurrentlyInWishlist = wishlist[vin];
      const endpoint = isCurrentlyInWishlist
        ? "https://cars.asicompany.com/api/remove-from-wishlist"
        : "https://cars.asicompany.com/api/add-to-wishlist";

      const response = await axios.post(
        endpoint,
        { vin: vin, token: token },
        {
          headers: {
            "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
          },
        }
      );

      // Update local wishlist state to reflect the change
      setWishlist((prev) => ({
        ...prev,
        [vin]: !isCurrentlyInWishlist,
      }));

      // console.log(
      //     isCurrentlyInWishlist
      //         ? "Removed from wishlist:"
      //         : "Added to wishlist:",
      //     response.data
      // );
    } catch (error) {
      console.error("Error updating wishlist:", error);
      // Optionally show an error message to the user
    } finally {
      // Clear loading state for this car
      setWishlistLoading((prev) => ({ ...prev, [vin]: false }));
    }
  };

  // Helper function to determine if a car is in the wishlist
  const isInWishlist = (vin: string) => {
    return !!wishlist[vin];
  };

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

  // WishlistButton component for reuse
  const WishlistButton = ({ vin }: { vin: string }) => {
    const inWishlist = isInWishlist(vin);
    const isLoading = wishlistLoading[vin];

    return (
      <Button
        type="text"
        icon={inWishlist ? <HeartFilled /> : <HeartOutlined />}
        loading={isLoading}
        style={{
          padding: "15px",
          borderRadius: "50px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          border: "1px solid #1677ff",
          backgroundColor: inWishlist ? "#1677ff" : "transparent",
          color: inWishlist ? "#fff" : "#1677ff",
        }}
        onClick={() => toggleWishlist(vin)}
      >
        {inWishlist ? t("header.remove") : t("serach.watch")}
      </Button>
    );
  };

  const columns = [
    {
      title: t("serach.image"),
      dataIndex: "image",
      key: "image",
      className: "image-result",
      render: (_: any, record: Car) => (
        <img
          src={record?.lots?.[0]?.images?.normal?.[0] || comingSoonImg}
          alt="vehicle"
          style={{
            width: "200px",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ),
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
    },
    {
      title: t("serach.lotInfo"),
      dataIndex: "title",
      key: "lotInfo",
      render: (_: any, record: Car) => (
        <Space direction="vertical">
          <Text>
            <Link
              to={`/cars/${record.vin}`}
              className="blue-text"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={
                  record?.lots?.[0]?.domain.name === "copart_com"
                    ? copart
                    : aiia
                }
                alt={`${
                  record?.lots?.[0]?.domain.name === "copart_com"
                    ? "copart"
                    : "aiia"
                }`}
                width={
                  record?.lots?.[0]?.domain.name === "copart_com" ? 20 : 30
                }
              />
              {record.title}
            </Link>
          </Text>
          <Text>
            {t("serach.lot")} {record?.lots?.[0]?.lot}
          </Text>
          <WishlistButton vin={record.vin} />
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
    },
    {
      title: t("serach.vehicleInfo"),
      dataIndex: "vehicleInfo",
      key: "vehicleInfo",
      render: (_: any, record: Car) => (
        <Space direction="vertical">
          <Text className="text-gray-600">{t("serach.odometer")}: </Text>
          <Text strong>
            {record?.lots?.[0]?.odometer
              ? record?.lots?.[0]?.odometer?.km !== null
                ? `${record?.lots?.[0]?.odometer?.km} km`
                : "N/A"
              : "N/A"}
          </Text>
          <Text className="text-gray-600" style={{ whiteSpace: "nowrap" }}>
            {t("serach.value")}
          </Text>
          <Text strong>${record?.lots?.[0]?.actual_cash_value || "N/A"}</Text>
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
    },
    {
      title: t("serach.condition"),
      dataIndex: "condition",
      key: "condition",
      render: (_: any, record: Car) => (
        <Space direction="vertical">
          <div>
            <Text className="text-gray-600">{t("serach.title")}: </Text>
            <Text strong>
              {record?.lots?.[0]?.detailed_title?.name ||
                record?.lots?.[0]?.title?.name ||
                "N/A"}
            </Text>
          </div>
          <div>
            <Text className="text-gray-600">{t("serach.damage")}: </Text>
            <Text strong>
              {record?.lots?.[0]?.damage?.main?.name || "None"}
            </Text>
          </div>
          <div>
            <Text className="text-gray-600">{t("serach.sDamage")}: </Text>
            <Text strong>
              {record?.lots?.[0]?.damage?.second?.name || "None"}
            </Text>
          </div>
          <div>
            <Text className="text-gray-600">{t("serach.status")}: </Text>
            <Text strong>
              <Tag color={formatStatus(record?.lots?.[0]?.condition?.id).color}>
                {formatStatus(record?.lots?.[0]?.condition?.id).text}
              </Tag>
            </Text>
          </div>
        </Space>
      ),
      responsive: ["lg"],
    },
    {
      title: t("serach.saleInfo"),
      dataIndex: "saleInfo",
      key: "saleInfo",
      render: (_: any, record: Car) => (
        <Space direction="vertical">
          <div>
            <Text className="text-gray-600">{t("serach.location")}: </Text>
            <Text strong>{record?.lots?.[0]?.selling_branch?.name}</Text>
          </div>
          <div>
            <Text className="text-gray-600">{t("serach.date")}: </Text>
            <Text strong>{formatSaleDate(record?.lots?.[0]?.sale_date)}</Text>
          </div>
          <div>
            <Text className="text-gray-600">{t("serach.seller")}: </Text>
            <Text strong>{record?.lots?.[0]?.seller?.name || "Unknown"}</Text>
          </div>
        </Space>
      ),
      responsive: ["lg"],
    },
    {
      title: t("serach.moreInfo"),
      dataIndex: "moreInfo",
      key: "moreInfo",
      render: (_: any, record: Car) => (
        <Space direction="vertical">
          <div className="text-nowrap">
            <Text className="text-gray-600">Drive: </Text>
            <Text strong>{record?.drive_wheel?.name || "N/A"}</Text>
          </div>
          <div>
            <Text className="text-gray-600">Cylinders: </Text>
            <Text strong>{record?.cylinders || "N/A"}</Text>
          </div>
          <div>
            <Text className="text-gray-600">Fuel: </Text>
            <Text strong>{record?.fuel?.name || "N/A"}</Text>
          </div>
          <div>
            <Text className="text-gray-600 text-xs">Color: </Text>
            <Text strong>{record?.color?.name || "N/A"}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Bids",
      dataIndex: "bids",
      key: "bids",
      render: (_: any, record: Car) => (
        <Space direction="vertical">
          {filter?.buyItNow ? (
            <>
              <Text>
                Current Bid:{" "}
                <Text strong> ${record?.lots?.[0]?.bid || "0"}</Text>
              </Text>
              <Divider className="m-0" />
              <Text className="text-green-900">
                {" "}
                Buy It Now:{" "}
                <Text strong className="text-green-900">
                  {" "}
                  ${record?.lots?.[0]?.buy_now || "0"}
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Text>Current Bid ${record?.lots?.[0]?.bid || "0"}</Text>
            </>
          )}
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
    },
  ];

  // Update CarList component to include the wishlist toggle functionality
  const renderCarList = () => {
    return (
      <CarList
        cars={dataSource}
        loading={false}
        onImageError={handleImageError}
        renderWishlistButton={(vin) => <WishlistButton vin={vin} />}
        isInWishlist={isInWishlist}
      />
    );
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Spin size="large" style={{ transform: "scale(1.5)" }} />
        </div>
      )}
      <div className="search-results-container">
        <div className="table-container" ref={tableContainerRef}>
          {screens.md ? (
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              bordered
              loading={false}
              rowKey={(record) => record.id}
            />
          ) : (
            renderCarList()
          )}
        </div>
      </div>
    </>
  );
};

export default VehicleTable;
