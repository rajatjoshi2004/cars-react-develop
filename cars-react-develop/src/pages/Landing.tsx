import React from "react";
import HeroSection from "../components/heroSection/HeroSection";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
    return (
        <div>
            <HeroSection />

            {/* Toggle Button */}
            <div
                style={{
                    textAlign: "center",
                    marginTop: "20px",
                    marginBottom: "20px",
                }}
            >
                <Link to="/search">
                    <Button
                        type="default"
                        // onClick={() => setShowInventory(!showInventory)}
                        style={{
                            border: "2px solid #2962FF",
                            color: "#2962FF",
                            borderRadius: "50px",
                            padding: "25px 45px",
                            fontWeight: "bold",
                            fontSize: "16px",
                            textTransform: "uppercase",
                            background: "white",
                            transition: "all 0.3s ease",
                        }}
                    >
                        View Inventory
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Landing;
