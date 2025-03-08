import React, { useEffect, useState } from "react";
import { Row, Col, Input, Select, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../utils/api/API";
import { Manufacturer } from "../types/interfaces";
import { Model } from "../pages/Search/Search";
import { useTranslation } from 'react-i18next';
import { useTranslationApi } from "../hooks/useTranslationApi";

const { Option } = Select;

const CarFinderForm = () => {
    const navigate = useNavigate();
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [formState, setFormState] = useState({
        manufacturerId: undefined,
        modelId: undefined,
        fromYear: undefined,
        toYear: undefined,
        location: "All locations",
    });

    // Generate years from current year down to 1976
    const currentYear = new Date().getFullYear();
    const years = Array.from(
        { length: currentYear - 1975 },
        (_, i) => currentYear - i
    );

    const locations = [
        "All locations",
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
    ];

    const fetchManufacturers = async () => {
        try {
            const response = await apiCall(
                "GET",
                "https://cars.asicompany.com/api/manufacturers"
            );
            setManufacturers(response.data || []);
        } catch (error) {
            console.error("Error fetching manufacturers:", error);
        }
    };

    const fetchModels = async (manufacturerId:any) => {
        if (!manufacturerId) return;
        try {
            const url = `https://cars.asicompany.com/api/model/${manufacturerId}`;
            const response = await apiCall("GET", url);
            setModels(response.data || []);
        } catch (error) {
            console.error("Error fetching models:", error);
            // Set empty models array if API fails
            setModels([]);
        }
    };

    useEffect(() => {
        fetchManufacturers();
    }, []);

    useEffect(() => {
        if (formState.manufacturerId) {
            fetchModels(formState.manufacturerId);
        }
    }, [formState.manufacturerId]);

    const handleMakeChange = (value, option) => {
        console.log(option);
        setFormState({
            ...formState,
            manufacturerId: option.key,
            modelId: undefined, // Reset model when make changes
        });
    };

    const handleModelChange = (value, option) => {
        setFormState({
            ...formState,
            modelId: option.key,
        });
    };

    const handleFromYearChange = (value) => {
        setFormState({
            ...formState,
            fromYear: value,
        });
    };

    const handleToYearChange = (value) => {
        setFormState({
            ...formState,
            toYear: value,
        });
    };

    const handleLocationChange = (value) => {
        setFormState({
            ...formState,
            location: value,
        });
    };

    const handleSearch = () => {
        const queryParams = new URLSearchParams();

        if (formState.manufacturerId) {
            queryParams.append("manufacturer_id", formState.manufacturerId);
        }

        if (formState.modelId) {
            queryParams.append("model_id", formState.modelId);
        }

        if (formState.fromYear && formState.toYear) {
            queryParams.append(
                "year",
                `${formState.fromYear}-${formState.toYear}`
            );
        } else if (formState.fromYear) {
            queryParams.append("year", `${formState.fromYear}-${currentYear}`);
        } else if (formState.toYear) {
            queryParams.append("year", `1976-${formState.toYear}`);
        }

        if (formState.location && formState.location !== "All locations") {
            queryParams.append("location", formState.location);
        }

        navigate(`/search?${queryParams.toString()}`);
    };
    const { t } = useTranslationApi();
    return (
        <div
            className="car-finder-form"
            style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                maxWidth: "800px",
                margin: "0 auto",
            }}
        >
            <h2
                style={{
                    fontSize: "28px",
                    textAlign: "center",
                    marginBottom: "24px",
                    fontWeight: "bold",
                    color: "black",
                }}
            >
                {t('otp.auctionfind')}
            </h2>

            <Row gutter={[16, 24]}>
                <Col xs={24} sm={12}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "500",
                        }}
                    >
                        {t('search.make')}
                    </label>
                    <Select
                        placeholder="Select Make"
                        style={{ width: "100%", height: "46px" }}
                        onChange={handleMakeChange}
                        value={
                            formState.manufacturerId
                                ? manufacturers.find(
                                      (m) =>
                                          m.manufacturer_id ===
                                          formState.manufacturerId
                                  )?.name
                                : undefined
                        }
                    >
                        {manufacturers.map((manufacturer) => (
                            <Option
                                key={manufacturer.manufacturer_id}
                                value={manufacturer.name}
                            >
                                {manufacturer.name}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} sm={12}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "500",
                        }}
                    >
                        {t('search.model')}
                    </label>
                    <Select
                        placeholder={t('otp.smodel')}
                        style={{ width: "100%", height: "46px" }}
                        disabled={!formState.manufacturerId}
                        onChange={handleModelChange}
                        value={
                            formState.modelId
                                ? models.find((m) => m.id === formState.modelId)
                                      ?.name
                                : undefined
                        }
                    >
                        {models.map((model) => (
                            <Option key={model.id} value={model.name}>
                                {model.name}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} sm={12}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "500",
                        }}
                    >
                        {t('otp.fyr')}
                    </label>
                    <Select
                        placeholder={t('otp.sfyr')}
                        style={{ width: "100%", height: "46px" }}
                        onChange={handleFromYearChange}
                        value={formState.fromYear}
                    >
                        {years.map((year) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} sm={12}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "500",
                        }}
                    >
                        {t('otp.tyr')}
                    </label>
                    <Select
                        placeholder={t('otp.styr')}
                        style={{ width: "100%", height: "46px" }}
                        onChange={handleToYearChange}
                        value={formState.toYear}
                    >
                        {years.map((year) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "500",
                        }}
                    >
                        {t('search.location')}
                    </label>
                    <Select
                        defaultValue="All locations"
                        style={{ width: "100%", height: "46px" }}
                        onChange={handleLocationChange}
                        value={formState.location}
                    >
                        {locations.map((location) => (
                            <Option key={location} value={location}>
                                {location}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24}>
                    <Button
                        type="primary"
                        onClick={handleSearch}
                        style={{
                            width: "100%",
                            height: "50px",
                            marginTop: "8px",
                            backgroundColor: "#FF9F1C",
                            borderColor: "#FF9F1C",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                    >
                        SEARCH
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default CarFinderForm;
