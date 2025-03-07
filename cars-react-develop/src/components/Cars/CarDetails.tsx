import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { MdOutlineFileCopy } from "react-icons/md";
import { useEffect, useRef, useState, RefObject } from "react";
import apiRequest from "../../ApiRequest/ApiRequest";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import ReactImageMagnify from "react-image-magnify";
import { EasyZoomOnHover } from "easy-magnify";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import copart from "../../assets/images/copart.png";
import aiia from "../../assets/images/aiia.png";
import comingSoonImg from "../../assets/images/1.jpg";
import PriceCalculator from "../Calculator/PriceCalculator";


// Interfaces (keep them as they are)
interface Manufacturer {
    id?: number;
    name?: string;
}

interface Model {
    id?: number;
    name?: string;
    manufacturer_id?: number;
}

interface BodyType {
    name: string;
    id: number;
}

interface Color {
    name?: string;
    id?: number;
}

interface Engine {
    id?: number;
    name?: string;
}

interface Transmission {
    name?: string;
    id?: number;
}

interface DriveWheel {
    name?: string;
    id?: number;
}

interface VehicleType {
    name?: string;
    id?: number;
}

interface Fuel {
    name?: string;
    id?: number;
}

interface OdometerStatus {
    name?: string;
    id?: number;
}

interface Odometer {
    km: number;
    mi: number;
    status?: OdometerStatus;
}

interface Damage {
    id: number;
    name: string;
}

interface Airbags {
    name: string;
    id: number;
}

interface LocationDetails {
    id: number;
    code?: string | null;
    name: string;
}

interface Location {
    country?: string | null;
    state?: LocationDetails;
    city?: { id: number; name: string };
    location?: { id: number; name: string };
    latitude?: number;
    longitude?: number;
    postal_code?: string;
    is_offsite?: boolean | null;
}

interface SellingBranch {
    name?: string;
    link?: string | null;
    number: number | null;
    id?: number | null;
    domain_id: number | null;
}

interface Images {
    id: number;
    small?: string[] | null;
    normal?: string[] | null;
    big?: string[] | null;
    exterior?: string | null;
    interior?: string | null;
    video?: string | null;
    video_youtube_id?: string | null;
    external_panorama_url?: string | null;
}

interface Lot {
    id?: number;
    lot?: string;
    domain?: { name: string; id: number };
    external_id?: string | null;
    odometer: Odometer;
    estimate_repair_price: string | null;
    pre_accident_price: string | null;
    clean_wholesale_price: string | null;
    actual_cash_value: string | null;
    sale_date: string | null;
    bid: string | null;
    buy_now?: string | null;
    status?: string | null;
    seller?: { name?: string } | null;
    title?: { id?: number; code?: string | null; name?: string };
    detailed_title: { id?: number; code?: string | null; name?: string };
    damage: { main: Damage; second?: Damage | null };
    keys_available?: boolean;
    airbags?: Airbags | null;
    condition?: string | null;
    grade_iaai?: string | null;
    images?: Images;
    location?: Location;
    selling_branch: SellingBranch;
    created_at?: string;
    updated_at?: string;
}

interface VehicleData {
    id: number;
    year?: number;
    title?: string;
    vin?: string;
    manufacturer?: Manufacturer;
    model?: Model;
    generation?: string | null;
    body_type?: BodyType;
    color?: Color;
    engine?: Engine;
    transmission?: Transmission;
    drive_wheel?: DriveWheel;
    vehicle_type?: VehicleType;
    fuel?: Fuel;
    cylinders?: number;
    lots?: Lot[];
    // domain?: any;
}

const CarDetails = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [carData, setCarData] = useState<VehicleData | null>(null);
    const [activeLot, setActiveLot] = useState<Lot | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imgList, setImgList] = useState<
        {
            original: string;
            thumbnail: string;
            originalAlt: string;
            thumbnailAlt: string;
        }[]
    >([]);

    const { id } = useParams();
    const inputRef = useRef<HTMLInputElement>(null);

    // Function to fetch car data
    const fetchCarData = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await apiRequest.get(`/car/${id}`, {
                headers: {
                    "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
                },
            });

            if (res.data && res.data?.data) {
                setCarData(res?.data?.data);
                // Set the first lot as active if available
                if (
                    res?.data?.data?.lots &&
                    res?.data?.data?.lots?.length > 0
                ) {
                    setActiveLot(res?.data?.data?.lots[0]);
                    formatImageGallery(res?.data?.data?.lots[0]);
                    console.log(activeLot);
                }
            } else {
                throw new Error("No data received from the API");
            }
        } catch (error: any) {
            console.error("Error fetching car data:", error);
            setError(error.message || "Failed to fetch car data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (id) {
            fetchCarData();
        }
    }, [id]);

    // Function to handle copying text
    const handleCopy = async (textToCopy: string) => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            alert("Copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    // Function to format an image gallery from API data
    const formatImageGallery = (activeLot: any) => {
        let data: { original: string; thumbnail: string }[] = [];
        if (!activeLot || !activeLot.images || !activeLot.images.normal) {
            data = [
                {
                    original: comingSoonImg,
                    thumbnail: comingSoonImg,
                },
                activeLot,
            ];
        } else {
            data = activeLot.images.normal.map(
                (imgUrl: any, index: number) => ({
                    original: imgUrl,
                    thumbnail: activeLot.images?.small?.[index] || imgUrl  ,
                    originalAlt: `${carData?.title || "Vehicle"} image ${
                        index + 1
                    }`,
                    thumbnailAlt: `${carData?.title || "Vehicle"} thumbnail ${
                        index + 1
                    }`,
                })
            );
        }
        setImgList(data);
    };

    // Helper function to calculate time left until sale date
    const calculateTimeLeft = (saleDate: string | null): string => {
        if (!saleDate) return "Not Ready For Sale";

        const now = new Date();
        const sale = new Date(saleDate);
        const diffInMs = sale.getTime() - now.getTime();

        if (diffInMs <= 0) return "Not Ready For Sale";

        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor(
            (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const diffInSeconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

        return `${diffInDays}d ${diffInHours}h ${diffInSeconds}s`;
    };

    const useCountdown: any = (targetDate: any) => {
        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

        useEffect(() => {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft(targetDate));
            }, 1000); // Update every second

            return () => clearInterval(timer); // Cleanup on unmount
        }, [targetDate]);

        return timeLeft;
    };

    if (loading) {
        return (
            <div className="heading-md loader flex justify-center items-center h-[100vh]">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[100vh]">
                Error: {error}
            </div>
        );
    }

    if (!carData || !activeLot) {
        return (
            <div className="flex justify-center items-center h-[100vh]">
                No car data found.
            </div>
        );
    }

    return (
        <div className="w-11/12 mx-auto md:mt-10">
            <h3 className="text-[1.2rem] md:text-[1.4rem] lg:text-[1.8rem] font-bold pt-6 pb-2">
                {carData?.title}
            </h3>

            <div className="w-full flex sm:flex-row flex-col gap-2">
                {/*------------------------- Image Gallery -------------------------*/}
                <div className="w-full sm:w-3/5 lg:w-2/5 h-auto">
                    {typeof window !== "undefined" &&
                        window.innerWidth > 600 && (
                            <EasyZoomOnHover
                                zoomLensScale={4}
                                mainImage={{
                                    src: imgList[currentImageIndex].original,
                                    alt: imgList[currentImageIndex].originalAlt,
                                }}
                                zoomImage={{
                                    src: imgList[currentImageIndex].original,
                                    alt: imgList[currentImageIndex].thumbnail,
                                }}
                                loadingIndicator={<LoadingOutlined />}
                            />
                        )}

                    <ImageGallery
                        infinite={false}
                        items={imgList}
                        showFullscreenButton={false}
                        showPlayButton={false}
                        showThumbnails={
                            typeof window !== "undefined" &&
                            window.innerWidth > 600
                        }
                        showBullets={
                            typeof window !== "undefined" &&
                            window.innerWidth < 600
                        }
                        onBeforeSlide={(v) => setCurrentImageIndex(v)}
                        renderThumbInner={(item: any) => (
                            <img
                                src={item.thumbnail}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    borderRadius: 4,
                                }}
                            />
                        )}
                    />

                    {/*---------- Vehicle details for tablet view ----------*/}
                    <div className="hidden sm:block lg:hidden w-full border rounded-lg p-3 border-slate-300">
                        <h3 className="text-center font-bold mb-4">
                            Auction Vehicle Details{"   "} 
                            <img 
                                src={
                                    activeLot.domain.name === "copart_com"
                                        ? copart
                                        : aiia
                                }
                                alt={`${
                                    activeLot.domain.name === "copart_com"
                                        ? "copart"
                                        : "aiia"
                                }`}
                                width={
                                    activeLot.domain.name === "copart_com"
                                        ? 20
                                        : 30
                                }
                                style={{marginLeft:"5px"}}
                            />
                        </h3>
                        <VehicleDetails
                            carData={carData}
                            activeLot={activeLot}
                            handleCopy={handleCopy}
                            inputRef={inputRef}
                        />
                    </div>
                </div>

                {/*------------------------- Details Section -------------------------*/}
                <div className="w-full sm:w-2/5 lg:w-3/5 flex lg:flex-row flex-col gap-2">
                    {/* Left: Vehicle Details */}
                    <div className="w-full lg:w-1/2 border rounded-lg p-3 border-slate-300">
                        <div className="flex items-center">
                            <h3 className="mb-0">Auction Vehicle Details</h3>
                            <img
                                src={
                                    activeLot.domain.name === "copart_com"
                                        ? copart
                                        : aiia
                                }
                                alt={`${
                                    activeLot.domain.name === "copart_com"
                                        ? "copart"
                                        : "aiia"
                                }`}
                                width={
                                    activeLot.domain.name === "copart_com"
                                        ? 20
                                        : 30
                                }
                                // style={{ marginBottom: "15px" }}
                            />
                        </div>
                        <VehicleDetails
                            carData={carData}
                            activeLot={activeLot}
                            handleCopy={handleCopy}
                            inputRef={inputRef}
                        />
                    </div>

                    {/* Right: Bid & Sale Info stacked */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-0">
                        {/* Bid Information */}
                        <div className="border h-fit rounded-lg p-3 border-slate-300">
                            <h3>Bid Information</h3>
                            <BidInformation
                                activeLot={activeLot}
                                useCountdown={useCountdown}
                            />
                        </div>

                        {/* Sale Information (Exactly below Bid Info, no extra space) */}
                        <div className="border mt-2 h-fit rounded-lg p-3 border-slate-300">
                            <h3>Sale Information</h3>
                            <SaleInformation activeLot={activeLot} />
                        </div>
                        {/* <div className="border mt-2 h-fit rounded-lg p-3 border-slate-300">
                            <h3>PriceCalculator</h3>
                        < PriceCalculator/>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable VehicleDetails Component
const VehicleDetails = ({
    carData,
    activeLot,
    handleCopy,
    inputRef,
}: {
    carData: VehicleData;
    activeLot: Lot;
    handleCopy: (textToCopy: string) => Promise<void>;
    inputRef: RefObject<HTMLInputElement>;
}) => {
    // console.log(carData, "activeLot");
    return (
        <>
            {carData ? (
                <div>
                    {/* Lot Number */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Lot Number:</span>
                        <span className="w-2/3 font-bold flex items-center hover:cursor-pointer gap-2">
                            <input
                                type="text"
                                value={activeLot.lot || "N/A"}
                                readOnly
                                ref={inputRef}
                                className="outline-none w-full bg-transparent bg-white "
                            />
                            <button
                                onClick={() => handleCopy(activeLot.lot || "")}
                                className="bg-transparent"
                                style={{ padding: "0 !important" }}
                            >

                                <MdOutlineFileCopy />
                            </button>
                        </span>
                    </p>
                    <hr />

                    {/* Vin Number */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Vin:</span>
                        <span className="font-bold w-2/3">
                            {carData.vin || "N/A"}
                        </span>
                    </p>
                    <hr />

                    {/* Title Code */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Title Code:</span>
                        <span className="font-bold w-2/3">
                            {activeLot.detailed_title?.name ||
                                activeLot.title?.name ||
                                "N/A"}
                        </span>
                    </p>
                    <hr />

                    {/* Odometer */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Odometer:</span>
                        <span className="font-bold w-2/3">
                            {activeLot.odometer
                                ? `${activeLot.odometer.mi} mi / ${
                                      activeLot.odometer.km
                                  } km${
                                      activeLot.odometer.status?.name
                                          ? ` (${activeLot.odometer.status.name})`
                                          : ""
                                  }`
                                : "N/A"}
                        </span>
                    </p>
                    <hr />

                    {/* Primary Damage */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">
                            Primary Damage:
                        </span>
                        <span className="font-bold w-2/3">
                            {activeLot.damage?.main?.name || "N/A"}
                        </span>
                    </p>
                    <hr />
                    {/* Secondary Damage */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">
                            Secondary Damage:
                        </span>
                        <span className="font-bold w-2/3">
                            {activeLot.damage?.second?.name || "N/A"}
                        </span>
                    </p>
                    <hr />
                    {/* Model name */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Model Name:</span>
                        <span className="font-bold w-2/3">
                            {carData.model?.name || "N/A"}
                        </span>
                    </p>
                    <hr />

                    {/* Drive Wheel */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Drive wheel: </span>
                        <span className="font-bold w-2/3">
                            {carData.drive_wheel?.name || "N/A"}
                        </span>
                    </p>
                    <hr />
                    {/* Fuel */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Fuel: </span>
                        <span className="font-bold w-2/3">
                            {carData.fuel?.name || "N/A"}
                        </span>
                    </p>
                    <hr />

                    {/* Cylinders */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Cylinders:</span>
                        <span className="font-bold w-2/3">
                            {carData?.cylinders || "N/A"}
                        </span>
                    </p>
                    <hr />

                    {/* Engine */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Engine: </span>
                        <span className="font-bold w-2/3">
                            {carData.engine?.name || "N/A"}
                        </span>
                    </p>
                    <hr />

                    {/* Vehicle Type */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Vehicle Type:</span>
                        <span className="font-bold w-2/3">
                            {carData?.vehicle_type?.name || "N/A"}
                        </span>
                    </p>
                    <hr />

                    {/* Color */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Color:</span>
                        <span className="font-bold w-2/3">
                            {carData?.color?.name || "N/A"}
                        </span>
                    </p>
                    <hr />

                    {/* Transmission */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Transmission:</span>
                        <span className="font-bold w-2/3">
                            {carData?.transmission?.name || "N/A"}
                        </span>
                    </p>
                    <hr />

                    {/* Keys */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Keys:</span>
                        <span className="font-bold w-2/3">
                            {activeLot?.keys_available
                                ? "Available"
                                : "Not Available"}
                        </span>
                    </p>
                    <hr />

                    {/* Condition */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Condition:</span>
                        <span className="font-bold w-2/3">
                            {activeLot?.condition
                                ? ` ${(activeLot?.condition?.name).replaceAll(
                                      "_",
                                      " "
                                  )}`
                                : "Unknown"}
                        </span>
                    </p>
                    <hr />

                    {/* Seller */}
                    {/* <p className="flex items-baseline py-2">
            <span className="font-light w-1/3">Seller:</span>
            <span className="font-bold w-2/3">
              {activeLot?.seller ? activeLot?.seller?.name : "N/A"}
            </span>
          </p>
          <hr /> */}

                    {/* Year of Production */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">
                            Year of Production:{" "}
                        </span>
                        <span className="font-bold w-2/3">
                            {carData?.year || "N/A"}
                        </span>
                    </p>
                    <hr />

                    {/* Special Note */}
                    <p className="flex items-baseline py-2 mb-0">
                        <span className="font-light w-1/3">Special Note:</span>
                        <span className="font-bold w-2/3">
                            {activeLot?.grade_iaai || "None"}
                        </span>
                    </p>
                </div>
            ) : (
                <div>
                    <p>Car Data is not available </p>
                </div>
            )}

           
        </>
    );
};

// Reusable BidInformation Component
const BidInformation = ({
    activeLot,
    useCountdown,
}: {
    activeLot: Lot;
    useCountdown: (saleDate: string | null) => string;
}) => {
    console.log(activeLot);
    return (
        <div>
            {/*------ current bid ----- */}
            <div className="flex gap-2 items-baseline py-1">
                <span className="font-light w-1/3">Current Bid:</span>
                <div className="leading-5 w-2/3">
                    <span className="font-bold text-[1rem] sm:text-[1.2rem] lg:text-[1.4rem]">
                        {activeLot.bid ? `$${activeLot.bid}` : "$0" }
                        
                    </span>
                    <p className="text-[0.8rem]">
                        {activeLot.status || "Seller Reserve Not Yet Met"}
                    </p>
                </div>
            </div>
            <hr />
            {/*------ current bid ----- */}
        {activeLot.buy_now !==null || activeLot.buy_now === 0  && (
            <>
                <div className="flex gap-2 items-baseline py-1">
                    <span className="font-light w-1/3">Buy Now:</span>
                    <div className="leading-5 w-2/3">
                        <span
                            className={`font-bold text-[1rem] sm:text-[1.2rem] lg:text-[1.4rem] ${
                                activeLot.buy_now ? "text-green-900" : "text-black"
                            }`}
                        >
                            {`$${activeLot.buy_now || "N/A"}`}
                        </span>
                    </div>
                </div>
                <hr />
            </>
        )}

            {/*-------- time left ------- */}
            <div className="py-1 gap-2 items-baseline flex">
                <span className="font-light w-1/3">Time left:</span>
                <span className="text-red-500 w-2/3">
                    {useCountdown(activeLot?.sale_date)}
                </span>
            </div>
        </div>
    );
};
// Reusable SaleInformation Component
const SaleInformation = ({ activeLot }: { activeLot: Lot }) => {
    return (
        <div>
            {/* Vehicle Location */}
            <p
                className="flex items-baseline py-2 mb-0"
                style={{ marginBottom: "0px" }}
            >
                <span className="font-light w-1/3">Vehicle Location:</span>
                <span className="font-bold w-2/3">
                    {`${activeLot?.selling_branch?.name}
                    ` || "N/A"}
                </span>
            </p>
            <hr />
            {/* Auction Date */}
            <p className="flex items-baseline py-2 mb-0">
                <span className="font-light w-1/3">Auction Date:</span>
                <span className="font-bold w-2/3">
                    {activeLot?.sale_date
                        ? moment(activeLot?.sale_date)?.format(
                              "DD-MM-YYYY, HH:mmA"
                          )
                        : "N/A"}
                </span>
            </p>
            <hr />
            {/* Actual Cash Value */}
            <p className="flex items-baseline py-2 mb-0">
                <span className="font-light w-1/3">Actual Cash Value:</span>
                <span className="font-bold w-2/3">
                    $
                    {activeLot?.actual_cash_value
                        ? activeLot?.actual_cash_value.toLocaleString()
                        : "N/A"}
                </span>
            </p>
            <hr />

            {/* Est. Repair Cost */}
            <p className="flex items-baseline py-2 mb-0">
                <span className="font-light w-1/3">Est. Repair Cost:</span>
                <span className="font-bold w-2/3">
                    $
                    {activeLot?.estimate_repair_price
                        ? activeLot.estimate_repair_price.toLocaleString()
                        : "N/A"}
                </span>
            </p>
            <hr />
            {/* Seller */}
            <p className="flex items-baseline py-2 mb-0">
                <span className="font-light w-1/3">Seller:</span>
                <span className="font-bold w-2/3">
                    {activeLot?.seller ? activeLot?.seller?.name : "N/A"}
                </span>
            </p>
                      
        
        <div className="border mt-2 h-fit rounded-lg p-3 border-slate-300">
            <h3 className="font-semibold">Price Calculator</h3>
            <PriceCalculator currentBid={activeLot.bid || null} />
        </div>
      </div>
    );
};
// const PriceCalculator = () => {
//     return(
//         <div className="border mt-2 h-fit rounded-lg p-3 border-slate-300">
//         <h3>PriceCalculator</h3>
//     < PriceCalculator/> 
//     </div>
//     )
// }


export default CarDetails;
