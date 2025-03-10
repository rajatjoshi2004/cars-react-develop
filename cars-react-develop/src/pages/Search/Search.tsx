import { useEffect, useState } from "react";
import {
  Typography,
  Switch,
  Layout,
  Button,
  Pagination,
  Grid,
  Drawer,
  Checkbox,
  Slider,
  Select,
  Collapse,
  Space,
  Input,
} from "antd";

import { FilterOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import "./style/search.css";
import { apiCall } from "../../utils/api/API";
import VehicleTable from "./SearchResults";
import { CarApiResponse } from "../../types/interfaces";
import ResponsiveButton from "./ResponsiveButton";
import { useTranslation } from "react-i18next";
import { useTranslationApi } from "../../hooks/useTranslationApi";
import {
  bodyStyles,
  colorOptions,
  locations,
  manufacturers,
  model,
  primaryDamages,
  sellers,
} from "../../utils/mockData";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { isAuthenticated } from "../../utils/auth";

const { Title, Text } = Typography;

const { Sider } = Layout;

const { useBreakpoint } = Grid;

const { Panel } = Collapse;
const { Option } = Select;

export const initialCarApiResponse: CarApiResponse = {
  data: [],
  links: {
    first: "",
    last: "",
    prev: null,
    next: "",
  },
  meta: {
    current_page: 1,
    from: 0,
    last_page: 1,
    links: [],
    path: "",
    per_page: 0,
    to: 0,
    total: 0,
  },
};

// Modified SearchableCheckboxGroup component to make count optional
const SearchableCheckboxGroup = ({
  options,
  value,
  onChange,
  placeholder = "Search...",
}) => {
  const [searchText, setSearchText] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredOptions = options.filter((opt) => {
    if (React.isValidElement(opt.label)) {
      return opt.label.props.children
        .toLowerCase()
        .includes(searchText.toLowerCase());
    }
    return opt.label.toLowerCase().includes(searchText.toLowerCase());
  });

  const displayOptions = showAll
    ? filteredOptions
    : filteredOptions.slice(0, 5);
  return (
    <div>
      <Input.Search
        placeholder={placeholder}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <div
        style={{
          maxHeight: showAll ? "200px" : "auto",
          overflowY: "auto",
        }}
      >
        {displayOptions.map((option) => (
          <div
            key={option.value}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Checkbox
              checked={value.includes(option.value)}
              onChange={(e) => {
                const newValue = e.target.checked
                  ? [...value, option.value]
                  : value.filter((v) => v !== option.value);
                onChange(newValue);
              }}
            >
              {option.label}
            </Checkbox>
            {option.count !== undefined && (
              <span style={{ color: "#4b5563", fontSize: "small" }}>
                {option.count?.toLocaleString() ?? ""}
              </span>
            )}
          </div>
        ))}
      </div>
      {filteredOptions.length > 5 && (
        <Button
          type="link"
          onClick={() => setShowAll(!showAll)}
          style={{ padding: "4px 0" }}
        >
          {showAll ? "Show Less" : "Show All"}
        </Button>
      )}
    </div>
  );
};

const RangeFilterWithInput = ({ min, max, value, onChange, step = 1 }) => {
  const [inputMin, setInputMin] = useState(value[0]);
  const [inputMax, setInputMax] = useState(value[1]);
  const [tempValue, setTempValue] = useState(value);
  const [error, setError] = useState("");

  // Function to format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString("en-US");
  };

  // Function to parse input value (remove commas)
  const parseNumber = (val) => {
    return Number(val.replace(/,/g, ""));
  };

  const validateAndSetValue = (type, val) => {
    const numVal = parseNumber(val);

    if (isNaN(numVal)) {
      setError("Please enter a valid number");
      return false;
    }

    if (type === "min") {
      if (numVal < min) {
        setError(`Minimum value cannot be less than ${min}`);
        return false;
      }
      if (numVal > tempValue[1]) {
        setError("Minimum value cannot be greater than maximum value");
        return false;
      }
      setInputMin(formatNumber(numVal));
      setTempValue([numVal, tempValue[1]]);
    } else {
      if (numVal > max) {
        setError(`Maximum value cannot be greater than ${max}`);
        return false;
      }
      if (numVal < tempValue[0]) {
        setError("Maximum value cannot be less than minimum value");
        return false;
      }
      setInputMax(formatNumber(numVal));
      setTempValue([tempValue[0], numVal]);
    }
    setError("");
    return true;
  };

  const handleSliderChange = (newValue) => {
    setInputMin(formatNumber(newValue[0]));
    setInputMax(formatNumber(newValue[1]));
    setTempValue(newValue);
    setError("");
  };

  const handleInputChange = (type, val) => {
    if (type === "min") {
      setInputMin(val);
    } else {
      setInputMax(val);
    }
  };

  const handleInputBlur = (type, val) => {
    validateAndSetValue(type, val);
  };

  const handleApplyFilter = () => {
    if (!error) {
      onChange(tempValue);
    }
  };
  const { t } = useTranslationApi();
  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <Input
          type="text"
          value={inputMin}
          onChange={(e) => handleInputChange("min", e.target.value)}
          onBlur={(e) => handleInputBlur("min", e.target.value)}
          style={{ width: "100%" }}
          placeholder="Min"
        />
        <Input
          type="text"
          value={inputMax}
          onChange={(e) => handleInputChange("max", e.target.value)}
          onBlur={(e) => handleInputBlur("max", e.target.value)}
          style={{ width: "100%" }}
          placeholder="Max"
        />
      </div>
      {error && (
        <div
          style={{
            color: "red",
            fontSize: "12px",
            marginBottom: "8px",
          }}
        >
          {error}
        </div>
      )}
      <Slider
        range
        min={min}
        max={max}
        value={tempValue}
        onChange={handleSliderChange}
        step={step}
      />
      <Button
        type="primary"
        onClick={handleApplyFilter}
        disabled={!!error}
        style={{ marginTop: "8px", width: "100%" }}
      >
        {t('search.afilter')}
      </Button>
    </div>
  );
};

// Update interfaces to match actual API response
interface Manufacturer {
  id: number;
  name: string;
  cars_qty: number;
  image: string | null;
}

interface Model {
  id: number;
  name: string;
  cars_qty: number;
  manufacturer_id: number;
}

const Search = () => {
  const [filters, setFilters] = useState({
    selectVehiclesOnly: false,
    buyItNow: false,
    cleanTitles: false,
    excludeUpcomingAuctionVehicles: false,
    runAndDrive: false,
    forRepair: false,
    selectedColors: [],
    selectedBrands: [],
    engineSizeRange: [1, 16],
    transmission: [],
    odometerRange: [1, 250000],
    fuelType: [],
    cylinders: [],
    selectedBodyStyles: [],
    selectedLocations: [],
    selectedModel: [],
    selectedPrimaryDamages: [],
    selectedSellers: [],
    yearRange: [1900, new Date().getFullYear()],
    copartAuction: true,
    iaaiAuction: true,
    usacopart: true,
    canadacopart: true,
    usaiaai: true,
    canadaiaai: true,
    to_be_dismantled: false,
    not_run: false,
    used: false,
    unconfirmed: false,
    engine_starts: false,
    enhanced: false,
  });
  const [data, setData] = useState<CarApiResponse>(initialCarApiResponse);
  const [collapsed, setCollapsed] = useState(false); // State to manage sidebar collapse
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  // Add new state for results info
  const [resultsInfo, setResultsInfo] = useState({
    from: 0,
    to: 0,
    total: 0,
  });

  // Add new state variables
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [models, setModels] = useState<Model[]>([]);

  const screens = useBreakpoint(); //

  const navigate = useNavigate();

  // Add initial filters state
  const initialFilters = {
    selectVehiclesOnly: false,
    buyItNow: false,
    cleanTitles: false,
    forRepair: false,
    to_be_dismantled: false,
    not_run: false,
    used: false,
    unconfirmed: false,
    engine_starts: false,
    enhanced: false,
    excludeUpcomingAuctionVehicles: false,
    selectedColors: [],
    selectedBrands: [],
    engineSizeRange: [1, 16],
    transmission: [],
    odometerRange: [1, 250000],
    fuelType: [],
    cylinders: [],
    selectedBodyStyles: [],
    selectedLocations: [],
    selectedModel: [],
    selectedPrimaryDamages: [],
    selectedSellers: [],
    yearRange: [1900, new Date().getFullYear()],
    copartAuction: true,
    iaaiAuction: true,
    usacopart: true,
    canadacopart: true,
    usaiaai: true,
    canadaiaai: true,
    runAndDrive: false,
  };

  const fetchCars = async (page = 1, updatedFilters: any, search?: string) => {
    const queryParams = [];

    if (search) {
      queryParams.push(`search_query=${encodeURIComponent(search)}`);
    }

    queryParams.push(`page=${page}`);

    if (updatedFilters.buyItNow) {
      queryParams.push("buy_now=1");
    }

    if (updatedFilters.selectedBrands.length > 0) {
      queryParams.push(
        `manufacturer_id=${updatedFilters.selectedBrands.join(",")}`
      );
    }

    if (updatedFilters.transmission.length > 0) {
      queryParams.push(`transmission=${updatedFilters.transmission.join(",")}`);
    }

    if (updatedFilters.fuelType.length > 0) {
      queryParams.push(`fuel_type=${updatedFilters.fuelType.join(",")}`);
    }

    if (updatedFilters.cylinders.length > 0) {
      queryParams.push(`cylinders=${updatedFilters.cylinders.join(",")}`);
    }

    if (
      updatedFilters.engineSizeRange[0] !== 1 ||
      updatedFilters.engineSizeRange[1] !== 16
    ) {
      queryParams.push(
        `engine_name=${updatedFilters.engineSizeRange[0]}-${updatedFilters.engineSizeRange[1]}`
      );
    }

    if (
      updatedFilters.odometerRange[0] !== 1 ||
      updatedFilters.odometerRange[1] !== 250000
    ) {
      queryParams.push(`odometer_min=${updatedFilters.odometerRange[0]}`);
      queryParams.push(`odometer_max=${updatedFilters.odometerRange[1]}`);
    }

    if (updatedFilters.cleanTitles) {
      queryParams.push("condition=clean");
    }

    if (updatedFilters.selectVehiclesOnly) {
      queryParams.push("status=vehicle");
    }

    if (updatedFilters.excludeUpcomingAuctionVehicles) {
      queryParams.push("exclude_upcoming=1");
    }

    if (updatedFilters.selectedColors.length > 0) {
      queryParams.push(`color=${updatedFilters.selectedColors.join(",")}`);
    }

    if (updatedFilters.selectedBodyStyles.length > 0) {
      queryParams.push(
        `body_type=${updatedFilters.selectedBodyStyles.join(",")}`
      );
    }

    if (updatedFilters.selectedLocations.length > 0) {
      queryParams.push(
        `location=${updatedFilters.selectedLocations.join(",")}`
      );
    }

    if (updatedFilters.selectedModel.length > 0) {
      queryParams.push(`model_id=${updatedFilters.selectedModel.join(",")}`);
    }

    if (updatedFilters.selectedPrimaryDamages.length > 0) {
      queryParams.push(
        `condition=${updatedFilters.selectedPrimaryDamages.join(",")}`
      );
    }

    if (updatedFilters.selectedSellers.length > 0) {
      queryParams.push(`seller=${updatedFilters.selectedSellers.join(",")}`);
    }

    if (
      updatedFilters.yearRange[0] !== 1900 ||
      updatedFilters.yearRange[1] !== new Date().getFullYear()
    ) {
      queryParams.push(
        `year=${updatedFilters.yearRange[0]}-${updatedFilters.yearRange[1]}`
      );
    }

    // Handle Copart
    if (updatedFilters.usacopart || updatedFilters.canadacopart) {
      queryParams.push("domain_id[]=3");
      if (updatedFilters.usacopart && updatedFilters.canadacopart) {
        queryParams.push("country_id=1,2"); // Both USA and Canada
      } else if (updatedFilters.usacopart) {
        queryParams.push("country_id=1"); // Only USA
      } else if (updatedFilters.canadacopart) {
        queryParams.push("country_id=2"); // Only Canada
      }
    }

    // Handle IAAI
    if (updatedFilters.usaiaai || updatedFilters.canadaiaai) {
      queryParams.push("domain_id[]=1");
      if (updatedFilters.usaiaai && updatedFilters.canadaiaai) {
        queryParams.push("country_id=1,2"); // Both USA and Canada
      } else if (updatedFilters.usaiaai) {
        queryParams.push("country_id=1"); // Only USA
      } else if (updatedFilters.canadaiaai) {
        queryParams.push("country_id=2"); // Only Canada
      }
    }

    if (updatedFilters.runAndDrive) {
      queryParams.push("condition=0");
    } else if (updatedFilters.forRepair) {
      queryParams.push("condition=1");
    } else if (updatedFilters.to_be_dismantled) {
      queryParams.push("condition=2");
    } else if (updatedFilters.not_run) {
      queryParams.push("condition=3");
    } else if (updatedFilters.used) {
      queryParams.push("condition=4");
    } else if (updatedFilters.unconfirmed) {
      queryParams.push("condition=5");
    } else if (updatedFilters.engine_starts) {
      queryParams.push("condition=6");
    } else if (updatedFilters.enhanced) {
      queryParams.push("condition=7");
    }

    const filterQuery = queryParams.join("&");
    const url = `https://cars.asicompany.com/api/cars?${filterQuery}`;

    // Update URL with filters without triggering a page reload
    const newUrl = `${window.location.pathname}?${filterQuery}`;
    navigate(newUrl, { replace: true });

    setLoading(true);

    try {
      const response = await apiCall("GET", url);
      setData(response);
      // Update results info
      setResultsInfo({
        from: response.meta.from || 0,
        to: response.meta.to || 0,
        total: response.meta.total || 0,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Function to fetch manufacturers
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

  // Modified fetchModels to use correct URL format with manufacturer_id
  const fetchModels = async (manufacturerIds?: number[]) => {
    try {
      let url = "https://cars.asicompany.com/api/models";

      // Add manufacturer_id parameter if provided
      if (manufacturerIds && manufacturerIds.length > 0) {
        const idsParam = manufacturerIds.join(",");
        url = `${url}/${idsParam}`;
      }

      const response = await apiCall("GET", url);
      setModels(response.data || []);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  // Modified useEffect to handle initial load and URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const manufacturerParam = params.get("manufacturer_id");

    const initializeData = async () => {
      await fetchManufacturers();
      if (manufacturerParam) {
        // If manufacturer_id exists in URL, fetch specific models
        const manufacturerIds = manufacturerParam.split(",").map(Number);
        await fetchModels(manufacturerIds);
      } else if (filters.selectedBrands.length > 0) {
        // If filters have selected brands, fetch those models
        await fetchModels(filters.selectedBrands);
      } else {
        // Otherwise fetch all models
        await fetchModels();
      }
    };

    initializeData();
  }, [location.search]); // Depend on URL changes

  const handleFilterChange = (filterName: string, value: boolean) => {
    const isAuth = isAuthenticated();
    if (!isAuth) {
      navigate("/login");
      return;
    }

    let updatedFilters = { ...filters, [filterName]: value };

    // Handle Parent-Child Dependency
    if (filterName === "copartAuction") {
      updatedFilters.usacopart = value;
      updatedFilters.canadacopart = value;
    }

    if (filterName === "iaaiAuction") {
      updatedFilters.usaiaai = value;
      updatedFilters.canadaiaai = value;
    }

    // Turn off Copart if both usacopart & canadacopart are off
    if (
      (filterName === "usacopart" || filterName === "canadacopart") &&
      !updatedFilters.usacopart &&
      !updatedFilters.canadacopart
    ) {
      updatedFilters.copartAuction = false;

      // If both Copart & IAAI are off, turn on IAAI
      if (!updatedFilters.iaaiAuction) {
        updatedFilters.iaaiAuction = true;
        updatedFilters.usaiaai = true;
        updatedFilters.canadaiaai = true;
      }
    }

    // Turn off IAAI if both usaiaai & canadaiaai are off
    if (
      (filterName === "usaiaai" || filterName === "canadaiaai") &&
      !updatedFilters.usaiaai &&
      !updatedFilters.canadaiaai
    ) {
      updatedFilters.iaaiAuction = false;

      // If both IAAI & Copart are off, turn on Copart
      if (!updatedFilters.copartAuction) {
        updatedFilters.copartAuction = true;
        updatedFilters.usacopart = true;
        updatedFilters.canadacopart = true;
      }
    }

    // **Ensure at least one filter is always ON**
    if (!updatedFilters.copartAuction && !updatedFilters.iaaiAuction) {
      // If everything is turned off, turn on Copart by default
      updatedFilters.copartAuction = true;
      updatedFilters.usacopart = true;
      updatedFilters.canadacopart = true;
    }

    setFilters(updatedFilters);
    fetchCars(currentPage, updatedFilters, searchQuery);
  };

  // Modified handleReset to be more explicit
  const handleReset = async () => {
    setFilters({
      ...initialFilters,
      copartAuction: true,
      iaaiAuction: true,
      usacopart: true,
      canadacopart: true,
      usaiaai: true,
      canadaiaai: true,
    });
    await fetchManufacturers();
    await fetchModels();
    fetchCars(1, initialFilters, searchQuery);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const isAuth = isAuthenticated();
    if (isAuth) {
      setCurrentPage(page);
      fetchCars(page, filters, searchQuery);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search_query");
    const page = parseInt(params.get("page") || "1");

    // Reconstruct filters from URL params
    const updatedFilters = { ...filters };

    // Example of reconstructing filters (add all your filter parameters)
    if (params.get("buy_now")) updatedFilters.buyItNow = true;
    if (params.get("manufacturer_id")) {
      updatedFilters.selectedBrands = params
        .get("manufacturer_id")
        .split(",")
        .map(Number);
    }
    // Add similar logic for other filters...

    setFilters(updatedFilters);
    setCurrentPage(page);
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    fetchCars(page, updatedFilters, searchParam);
  }, [location.search]); // Watch for changes in URL search params

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const fuelTypes = [
    { id: 1, name: "Diesel" },
    { id: 2, name: "Electric" },
    { id: 3, name: "Hybrid" },
    { id: 4, name: "Gasoline" },
    { id: 5, name: "Gas" },
    { id: 6, name: "Flexible" },
    { id: 7, name: "Hydrogen" },
  ];

  const cylinderOptions = [12, 10, 8, 6, 5, 4, 3, 2, 1];

  const customExpandIcon = ({ isActive }) => {
    return isActive ? (
      <MinusOutlined style={{ fontSize: "12px" }} />
    ) : (
      <PlusOutlined style={{ fontSize: "12px" }} />
    );
  };

  // Add this helper function at the component level
  const getActiveFilters = (filters) => {
    const activeFilters = [];

    if (filters.selectedBrands.length > 0) {
      const brandNames = manufacturers
        .filter((m) => filters.selectedBrands.includes(m.id))
        .map((m) => m.name);
      activeFilters.push(brandNames.join(", "));
    }
    if (filters.selectedModel.length > 0) {
      const modelNames = model
        .filter((m) => filters.selectedModel.includes(m.id))
        .map((m) => m.name);
      activeFilters.push(modelNames.join(", "));
    }
    if (filters.selectedColors.length > 0) {
      const colorNames = colorOptions
        .filter((c) => filters.selectedColors.includes(c.id))
        .map((c) => c.name);
      activeFilters.push(colorNames.join(", "));
    }
    // Add other filters as needed

    return activeFilters;
  };
  const { t } = useTranslationApi();
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Sidebar for Larger Screens */}
        <Sider
          style={{
            position: "sticky",
            height: "100vh",
            overflowY: "auto",
            left: 0,
            top: "60px",
            bottom: 0,
            zIndex: "0",
            paddingTop: "20px",
          }}
          className="slider-filter"
          theme="light"
          breakpoint="md"
          width={300}
          hidden={collapsed}
          onCollapse={(collapsed) => {
            setCollapsed(collapsed);
          }}
        >
          <div style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                {t('search.sFilter')}
              </Title>
              <Button type="link" onClick={handleReset}>
                {t('search.resetAll')}
              </Button>
            </div>

            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              {/* Quick Filters */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ marginRight: 8 }}>{t("search.select")}</span>
                <Switch
                  checked={filters.selectVehiclesOnly}
                  onChange={(checked) =>
                    handleFilterChange("selectVehiclesOnly", checked)
                  }
                  style={{
                    transform: "scale(0.6)",
                  }}
                />{" "}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ marginRight: 8 }}>{t("search.buyIt")}</span>
                <Switch
                  checked={filters.buyItNow}
                  onChange={(checked) =>
                    handleFilterChange("buyItNow", checked)
                  }
                  style={{
                    transform: "scale(0.6)",
                  }}
                />{" "}
              </div>

              {/* <Divider /> */}

              {/* Collapsible Sections */}
              <Collapse
                defaultActiveKey={["auction", "1"]}
                ghost
                expandIcon={customExpandIcon}
                className="custom-collapse"
                style={{
                  "& .ant-collapse-header": {
                    flexDirection: "row-reverse !important",
                  },
                  "& .ant-collapse-expand-icon": {
                    marginLeft: "12px",
                    marginRight: "0 !important",
                  },
                }}
              >
                <Panel header={t("search.auction")} key="auction">
                  {/* <Space direction="vertical" style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                    </div> */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "16px",
                      marginBottom: "10px",
                      // paddingRight: "10px",
                      fontWeight: "bold",
                      color: "#1677ff",

                      // paddingRight: "10px",
                    }}
                  >
                    <span>{t("search.copart")}</span>
                    <Switch
                      checked={filters.copartAuction}
                      onChange={(checked) => {
                        handleFilterChange("copartAuction", checked);
                      }}
                      style={{
                        backgroundColor: filters.copartAuction
                          ? "#1677ff"
                          : undefined,
                        transform: "scale(0.6)",
                        fontSize: "24px",
                      }}
                    />
                  </div>
                  {filters.copartAuction && (
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingLeft: "10px",

                          fontWeight: "bold",
                          // color: "#808080",
                        }}
                      >
                        <span>⸰ {t("search.usa")}</span>
                        <Switch
                          checked={filters.usacopart}
                          onChange={(checked) => {
                            handleFilterChange("usacopart", checked);
                          }}
                          style={{
                            backgroundColor: filters.usacopart
                              ? "#808080"
                              : undefined,
                            transform: "scale(0.6)",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingLeft: "10px",

                          fontWeight: "bold",
                        }}
                      >
                        <span>⸰ {t("search.canada")}</span>
                        <Switch
                          checked={filters.canadacopart}
                          onChange={(checked) => {
                            handleFilterChange("canadacopart", checked);
                          }}
                          style={{
                            backgroundColor: filters.canadacopart
                              ? "#808080"
                              : undefined,
                            transform: "scale(0.6)",
                          }}
                        />
                      </div>
                    </Space>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "16px",
                      marginBottom: "10px",
                      // paddingRight: "10px",
                      fontWeight: "bold",
                      color: "#ff4d4f",
                      marginTop: "10px",
                    }}
                  >
                    <span>{t("search.iaai")}</span>
                    <Switch
                      checked={filters.iaaiAuction}
                      onChange={(checked) => {
                        handleFilterChange("iaaiAuction", checked);
                      }}
                      style={{
                        backgroundColor: filters.iaaiAuction
                          ? "#ff4d4f"
                          : undefined,
                        transform: "scale(0.6)",
                      }}
                    />
                  </div>
                  {filters.iaaiAuction && (
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingLeft: "10px",

                          fontWeight: "bold",
                        }}
                      >
                        <span>⸰ {t("search.usa")}</span>
                        <Switch
                          checked={filters.usaiaai}
                          onChange={(checked) => {
                            handleFilterChange("usaiaai", checked);
                          }}
                          style={{
                            backgroundColor: filters.usaiaai
                              ? "#808080"
                              : undefined,
                            transform: "scale(0.6)",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingLeft: "10px",

                          fontWeight: "bold",
                        }}
                      >
                        <span>⸰ {t("search.canada")}</span>
                        <Switch
                          checked={filters.canadaiaai}
                          onChange={(checked) => {
                            handleFilterChange("canadaiaai", checked);
                          }}
                          style={{
                            backgroundColor: filters.canadaiaai
                              ? "#808080"
                              : undefined,
                            transform: "scale(0.6)",
                          }}
                        />
                      </div>
                    </Space>
                  )}
                  {/* </Space> */}
                </Panel>

                <Panel header={t("search.make")} key="1">
                  <SearchableCheckboxGroup
                    options={manufacturers.map((m) => ({
                      label: (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          {m.name}
                        </div>
                      ),
                      value: m.id,
                      count: m.cars_qty,
                    }))}
                    value={filters.selectedBrands}
                    onChange={(value: any) =>
                      handleFilterChange("selectedBrands", value)
                    }
                    placeholder={t("search.sMakes")}
                  />
                </Panel>

                <Panel header={t("search.model")} key="10">
                  <SearchableCheckboxGroup
                    options={models.map((m) => ({
                      label: (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          {m.name}
                        </div>
                      ),
                      value: m.id,
                      count: m.cars_qty,
                    }))}
                    value={filters.selectedModel}
                    onChange={(value) =>
                      handleFilterChange("selectedModel", value)
                    }
                    placeholder={t("search.sModel")}
                  />
                </Panel>

                <Panel header={t("search.condition")} key="Condition">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <Checkbox
                        style={{ marginBottom: "5px" }}
                        checked={filters.runAndDrive}
                        onClick={() =>
                          handleFilterChange(
                            "runAndDrive",
                            !filters.runAndDrive
                          )
                        }
                      >
                        {t("search.run")}
                      </Checkbox>
                      <br />

                      <Checkbox
                        style={{ marginBottom: "5px" }}
                        checked={filters.forRepair}
                        onClick={() =>
                          handleFilterChange("forRepair", !filters.forRepair)
                        }
                      >
                        {t("search.fRepair")}
                      </Checkbox>
                      <br />
                      <Checkbox
                        style={{ marginBottom: "5px" }}
                        checked={filters.to_be_dismantled}
                        onClick={() =>
                          handleFilterChange(
                            "to_be_dismantled",
                            !filters.to_be_dismantled
                          )
                        }
                      >
                        {t("search.dismantled")}
                      </Checkbox>
                      <br />
                      <Checkbox
                        style={{ marginBottom: "5px" }}
                        checked={filters.not_run}
                        onClick={() =>
                          handleFilterChange("not_run", !filters.not_run)
                        }
                      >
                        {t("search.notRun")}
                      </Checkbox>
                      <br />
                      <Checkbox
                        style={{ marginBottom: "5px" }}
                        checked={filters.used}
                        onClick={() =>
                          handleFilterChange("used", !filters.used)
                        }
                      >
                        {t("search.used")}
                      </Checkbox>
                      <br />
                      <Checkbox
                        style={{ marginBottom: "5px" }}
                        checked={filters.unconfirmed}
                        onClick={() =>
                          handleFilterChange(
                            "unconfirmed",
                            !filters.unconfirmed
                          )
                        }
                      >
                        {t("search.unconfirmed")}
                      </Checkbox>
                      <br />
                      <Checkbox
                        style={{ marginBottom: "5px" }}
                        checked={filters.engine_starts}
                        onClick={() =>
                          handleFilterChange(
                            "engine_starts",
                            !filters.engine_starts
                          )
                        }
                      >
                        {t("search.engineStart")}
                      </Checkbox>
                      <br />
                      <Checkbox
                        style={{ marginBottom: "5px" }}
                        checked={filters.enhanced}
                        onClick={() =>
                          handleFilterChange("enhanced", !filters.enhanced)
                        }
                      >
                        {t("search.enhanced")}
                      </Checkbox>
                    </div>
                  </Space>
                </Panel>

                <Panel header={t("search.yrRange")} key="13">
                  <RangeFilterWithInput
                    min={1900}
                    max={new Date().getFullYear()}
                    value={filters.yearRange}
                    onChange={(value) => handleFilterChange("yearRange", value)}
                  />
                </Panel>

                <Panel header={t("search.odometer")} key="6">
                  <RangeFilterWithInput
                    min={1}
                    max={250000}
                    value={filters.odometerRange}
                    onChange={(value) =>
                      handleFilterChange("odometerRange", value)
                    }
                    step={1000}
                  />
                </Panel>

                <Panel header={t("search.engineSize")} key="2">
                  <RangeFilterWithInput
                    min={0}
                    max={16}
                    value={filters.engineSizeRange}
                    onChange={(value) =>
                      handleFilterChange("engineSizeRange", value)
                    }
                    step={0.1}
                  />
                </Panel>

                <Panel header={t("search.transmission")} key="3">
                  <Checkbox.Group
                    options={[
                      { label: t("search.auto"), value: 2 },
                      { label: t("search.manual"), value: 1 },
                    ]}
                    onChange={(values) =>
                      handleFilterChange("transmission", values)
                    }
                  />
                </Panel>

                <Panel header={t("search.fuelType")} key="4">
                  <SearchableCheckboxGroup
                    options={fuelTypes.map((type) => ({
                      label: type.name,
                      value: type.id,
                    }))}
                    value={filters.fuelType}
                    onChange={(values) =>
                      handleFilterChange("fuelType", values)
                    }
                    placeholder={t("search.SfuelType")}
                  />
                </Panel>

                <Panel header={t("search.cylinders")} key="5">
                  <SearchableCheckboxGroup
                    options={cylinderOptions.map((cyl) => ({
                      label: cyl.toString(),
                      value: cyl,
                    }))}
                    value={filters.cylinders}
                    onChange={(values) =>
                      handleFilterChange("cylinders", values)
                    }
                    placeholder={t("search.sCylinders")}
                  />
                </Panel>

                <Panel header={t("search.colors")} key="7">
                  <SearchableCheckboxGroup
                    options={colorOptions.map((color) => ({
                      label: color.name,
                      value: color.id,
                    }))}
                    value={filters.selectedColors}
                    onChange={(values) =>
                      handleFilterChange("selectedColors", values)
                    }
                    placeholder={t("search.sColors")}
                  />
                </Panel>

                <Panel header={t("search.bodyStyle")} key="8">
                  <SearchableCheckboxGroup
                    options={bodyStyles.map((style) => ({
                      label: style.name,
                      value: style.id,
                    }))}
                    value={filters.selectedBodyStyles}
                    onChange={(values) =>
                      handleFilterChange("selectedBodyStyles", values)
                    }
                    placeholder={t("search.sBodyStyle")}
                  />
                </Panel>

                <Panel header={t("search.location")} key="9">
                  <SearchableCheckboxGroup
                    options={locations.map((loc) => ({
                      label: loc.name,
                      value: loc.id,
                    }))}
                    value={filters.selectedLocations}
                    onChange={(values) =>
                      handleFilterChange("selectedLocations", values)
                    }
                    placeholder={t("search.sLocation")}
                  />
                </Panel>

                <Panel header={t("search.primary")} key="11">
                  <SearchableCheckboxGroup
                    options={primaryDamages.map((damage) => ({
                      label: damage.name,
                      value: damage.id,
                    }))}
                    value={filters.selectedPrimaryDamages}
                    onChange={(values) =>
                      handleFilterChange("selectedPrimaryDamages", values)
                    }
                    placeholder={t("search.sDamages")}
                  />
                </Panel>

                <Panel header={t("search.seller")} key="12">
                  <SearchableCheckboxGroup
                    options={sellers.map((seller) => ({
                      label: seller.name,
                      value: seller.id,
                    }))}
                    value={filters.selectedSellers}
                    onChange={(values) =>
                      handleFilterChange("selectedSellers", values)
                    }
                    placeholder={t("search.sSeller")}
                  />
                </Panel>
              </Collapse>
            </Space>
          </div>
        </Sider>
        {/* Drawer for Mobile Screens */}
        <Drawer
          title={t("search.filters")}
          placement="left"
          onClose={onClose}
          visible={visible}
          width={300}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            {/* Quick Filters Section */}
            <div>
              <Title level={5}>{t("search.qFilters")}</Title>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{t("search.sVehicals")}</span>
                  <Switch
                    checked={filters.selectVehiclesOnly}
                    onChange={(checked) =>
                      handleFilterChange("selectVehiclesOnly", checked)
                    }
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{t("search.buyItNow")}</span>
                  <Switch
                    checked={filters.buyItNow}
                    onChange={(checked) =>
                      handleFilterChange("buyItNow", checked)
                    }
                  />
                </div>
              </Space>
            </div>

            {/* Advanced Filters Section */}
            <Collapse
              defaultActiveKey={["auction", "1"]}
              ghost
              expandIcon={customExpandIcon}
              className="custom-collapse"
              style={{
                "& .ant-collapse-header": {
                  flexDirection: "row-reverse !important",
                },
                "& .ant-collapse-expand-icon": {
                  marginLeft: "12px",
                  marginRight: "0 !important",
                },
              }}
            >
              <Panel header={t("search.auction")} key="auction">
                {/* <Space direction="vertical" style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                    </div> */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "16px",
                    marginBottom: "10px",
                    // paddingRight: "10px",
                    fontWeight: "bold",
                    color: "#1677ff",

                    // paddingRight: "10px",
                  }}
                >
                  <span>{t("search.copart")}</span>
                  <Switch
                    checked={filters.copartAuction}
                    onChange={(checked) => {
                      handleFilterChange("copartAuction", checked);
                    }}
                    style={{
                      backgroundColor: filters.copartAuction
                        ? "#1677ff"
                        : undefined,
                      transform: "scale(0.6)",
                      fontSize: "24px",
                    }}
                  />
                </div>
                {filters.copartAuction && (
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingLeft: "10px",

                        fontWeight: "bold",
                        // color: "#808080",
                      }}
                    >
                      <span>⸰ {t("search.usa")}</span>
                      <Switch
                        checked={filters.usacopart}
                        onChange={(checked) => {
                          handleFilterChange("usacopart", checked);
                        }}
                        style={{
                          backgroundColor: filters.usacopart
                            ? "#808080"
                            : undefined,
                          transform: "scale(0.6)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingLeft: "10px",

                        fontWeight: "bold",
                      }}
                    >
                      <span>⸰ {t("search.canada")}</span>
                      <Switch
                        checked={filters.canadacopart}
                        onChange={(checked) => {
                          handleFilterChange("canadacopart", checked);
                        }}
                        style={{
                          backgroundColor: filters.canadacopart
                            ? "#808080"
                            : undefined,
                          transform: "scale(0.6)",
                        }}
                      />
                    </div>
                  </Space>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "16px",
                    marginBottom: "10px",
                    // paddingRight: "10px",
                    fontWeight: "bold",
                    color: "#ff4d4f",
                    marginTop: "10px",
                  }}
                >
                  <span>{t("search.iaai")}</span>
                  <Switch
                    checked={filters.iaaiAuction}
                    onChange={(checked) => {
                      handleFilterChange("iaaiAuction", checked);
                    }}
                    style={{
                      backgroundColor: filters.iaaiAuction
                        ? "#ff4d4f"
                        : undefined,
                      transform: "scale(0.6)",
                    }}
                  />
                </div>
                {filters.iaaiAuction && (
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingLeft: "10px",

                        fontWeight: "bold",
                      }}
                    >
                      <span>⸰ {t("search.usa")}</span>
                      <Switch
                        checked={filters.usaiaai}
                        onChange={(checked) => {
                          handleFilterChange("usaiaai", checked);
                        }}
                        style={{
                          backgroundColor: filters.usaiaai
                            ? "#808080"
                            : undefined,
                          transform: "scale(0.6)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingLeft: "10px",

                        fontWeight: "bold",
                      }}
                    >
                      <span>⸰ {t("search.canada")}</span>
                      <Switch
                        checked={filters.canadaiaai}
                        onChange={(checked) => {
                          handleFilterChange("canadaiaai", checked);
                        }}
                        style={{
                          backgroundColor: filters.canadaiaai
                            ? "#808080"
                            : undefined,
                          transform: "scale(0.6)",
                        }}
                      />
                    </div>
                  </Space>
                )}
                {/* </Space> */}
              </Panel>

              <Panel header={t("search.make")} key="1">
                <SearchableCheckboxGroup
                  options={manufacturers.map((m) => ({
                    label: (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        {m.name}
                      </div>
                    ),
                    value: m.id,
                    count: m.cars_qty,
                  }))}
                  value={filters.selectedBrands}
                  onChange={(value: any) =>
                    handleFilterChange("selectedBrands", value)
                  }
                  placeholder={t("search.sMakes")}
                />
              </Panel>
              <Panel header={t("search.model")} key="10">
                  <SearchableCheckboxGroup
                    options={models.map((m) => ({
                      label: (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          {m.name}
                        </div>
                      ),
                      value: m.id,
                      count: m.cars_qty,
                    }))}
                    value={filters.selectedModel}
                    onChange={(value) =>
                      handleFilterChange("selectedModel", value)
                    }
                    placeholder={t("search.sModel")}
                  />
                </Panel>
              <Panel header={t("search.condition")} key="Condition">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Checkbox
                      style={{ marginBottom: "5px" }}
                      checked={filters.runAndDrive}
                      onClick={() =>
                        handleFilterChange("runAndDrive", !filters.runAndDrive)
                      }
                    >
                      {t("search.run")}
                    </Checkbox>
                    <br />

                    <Checkbox
                      style={{ marginBottom: "5px" }}
                      checked={filters.forRepair}
                      onClick={() =>
                        handleFilterChange("forRepair", !filters.forRepair)
                      }
                    >
                      {t("search.fRepair")}
                    </Checkbox>
                    <br />
                    <Checkbox
                      style={{ marginBottom: "5px" }}
                      checked={filters.to_be_dismantled}
                      onClick={() =>
                        handleFilterChange(
                          "to_be_dismantled",
                          !filters.to_be_dismantled
                        )
                      }
                    >
                      {t("search.dismantled")}
                    </Checkbox>
                    <br />
                    <Checkbox
                      style={{ marginBottom: "5px" }}
                      checked={filters.not_run}
                      onClick={() =>
                        handleFilterChange("not_run", !filters.not_run)
                      }
                    >
                      {t("search.notRun")}
                    </Checkbox>
                    <br />
                    <Checkbox
                      style={{ marginBottom: "5px" }}
                      checked={filters.used}
                      onClick={() => handleFilterChange("used", !filters.used)}
                    >
                      {t("search.used")}
                    </Checkbox>
                    <br />
                    <Checkbox
                      style={{ marginBottom: "5px" }}
                      checked={filters.unconfirmed}
                      onClick={() =>
                        handleFilterChange("unconfirmed", !filters.unconfirmed)
                      }
                    >
                      {t("search.unconfirmed")}
                    </Checkbox>
                    <br />
                    <Checkbox
                      style={{ marginBottom: "5px" }}
                      checked={filters.engine_starts}
                      onClick={() =>
                        handleFilterChange(
                          "engine_starts",
                          !filters.engine_starts
                        )
                      }
                    >
                      {t("search.engineStart")}
                    </Checkbox>
                    <br />
                    <Checkbox
                      style={{ marginBottom: "5px" }}
                      checked={filters.enhanced}
                      onClick={() =>
                        handleFilterChange("enhanced", !filters.enhanced)
                      }
                    >
                      {t("search.enhanced")}
                    </Checkbox>
                  </div>
                </Space>
              </Panel>

              <Panel header={t("search.yrRange")} key="13">
                <RangeFilterWithInput
                  min={1900}
                  max={new Date().getFullYear()}
                  value={filters.yearRange}
                  onChange={(value) => handleFilterChange("yearRange", value)}
                />
              </Panel>

              <Panel header={t("search.odometer")} key="6">
                <RangeFilterWithInput
                  min={1}
                  max={250000}
                  value={filters.odometerRange}
                  onChange={(value) =>
                    handleFilterChange("odometerRange", value)
                  }
                  step={1000}
                />
              </Panel>

              <Panel header={t("search.engineSize")} key="2">
                <RangeFilterWithInput
                  min={0}
                  max={16}
                  value={filters.engineSizeRange}
                  onChange={(value) =>
                    handleFilterChange("engineSizeRange", value)
                  }
                  step={0.1}
                />
              </Panel>

              <Panel header={t("search.transmission")} key="3">
                <Checkbox.Group
                  options={[
                    { label: t("search.auto"), value: 2 },
                    { label: t("search.manual"), value: 1 },
                  ]}
                  onChange={(values) =>
                    handleFilterChange("transmission", values)
                  }
                />
              </Panel>

              <Panel header={t("search.fuelType")} key="4">
                <SearchableCheckboxGroup
                  options={fuelTypes.map((type) => ({
                    label: type.name,
                    value: type.id,
                  }))}
                  value={filters.fuelType}
                  onChange={(values) => handleFilterChange("fuelType", values)}
                  placeholder={t("search.SfuelType")}
                />
              </Panel>

              <Panel header={t("search.cylinders")} key="5">
                <SearchableCheckboxGroup
                  options={cylinderOptions.map((cyl) => ({
                    label: cyl.toString(),
                    value: cyl,
                  }))}
                  value={filters.cylinders}
                  onChange={(values) => handleFilterChange("cylinders", values)}
                  placeholder={t("search.sCylinders")}
                />
              </Panel>

              <Panel header={t("search.colors")} key="7">
                <SearchableCheckboxGroup
                  options={colorOptions.map((color) => ({
                    label: color.name,
                    value: color.id,
                  }))}
                  value={filters.selectedColors}
                  onChange={(values) =>
                    handleFilterChange("selectedColors", values)
                  }
                  placeholder={t("search.sColors")}
                />
              </Panel>

              <Panel header={t("search.bodyStyle")} key="8">
                <SearchableCheckboxGroup
                  options={bodyStyles.map((style) => ({
                    label: style.name,
                    value: style.id,
                  }))}
                  value={filters.selectedBodyStyles}
                  onChange={(values) =>
                    handleFilterChange("selectedBodyStyles", values)
                  }
                  placeholder={t("search.sBodyStyle")}
                />
              </Panel>

              <Panel header={t("search.location")} key="9">
                <SearchableCheckboxGroup
                  options={locations.map((loc) => ({
                    label: loc.name,
                    value: loc.id,
                  }))}
                  value={filters.selectedLocations}
                  onChange={(values) =>
                    handleFilterChange("selectedLocations", values)
                  }
                  placeholder={t("search.sLocation")}
                />
              </Panel>

              <Panel header={t("search.primary")} key="11">
                <SearchableCheckboxGroup
                  options={primaryDamages.map((damage) => ({
                    label: damage.name,
                    value: damage.id,
                  }))}
                  value={filters.selectedPrimaryDamages}
                  onChange={(values) =>
                    handleFilterChange("selectedPrimaryDamages", values)
                  }
                  placeholder={t("search.sDamages")}
                />
              </Panel>

              <Panel header={t("search.seller")} key="12">
                <SearchableCheckboxGroup
                  options={sellers.map((seller) => ({
                    label: seller.name,
                    value: seller.id,
                  }))}
                  value={filters.selectedSellers}
                  onChange={(values) =>
                    handleFilterChange("selectedSellers", values)
                  }
                  placeholder={t("search.sSeller")}
                />
              </Panel>
            </Collapse>
          </Space>
        </Drawer>
        {/* Header with Burger Icon */}

        <Layout
          style={{
            padding: "30px 10px",
            width: "100%",
            flexGrow: "1",
            marginLeft: screens.md && !collapsed ? "0" : "0",
          }}
        >
          {!screens.md && (
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={showDrawer}
              style={{ margin: "16px" }}
              id="filter-button"
            >
              {t('search.filters')}
            </Button>
          )}

          {filters.buyItNow ? (
            <Title level={2}> Search Results: Buy it now</Title>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: screens.sm ? "row" : "column",
                alignItems: screens.sm ? "center" : "flex-start",
                gap: "8px",
              }}
            >
              <Title level={2}> {t('search.text2')}</Title>
              {resultsInfo.total > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <Text
                    type="secondary"
                    style={{
                      marginTop: screens.sm ? "-10px" : "0",
                    }}
                  >
                    {searchQuery ? (
                      <> {t('search.smsg1')} {searchQuery}: </>
                    ) : (
                      <>{t('search.smsg2')} </>
                    )}
                    {resultsInfo.from} – {resultsInfo.to}
                    {resultsInfo.to >= 30 && (
                      <> {t('search.smsg3')} {resultsInfo.total.toLocaleString()}</>
                    )}{" "}
                  {t('search.smsg4')}
                  </Text>
                  {getActiveFilters(filters).length > 0 && (
                    <Text type="secondary">
                      {t('search.filters')}: {getActiveFilters(filters).join(" • ")}
                    </Text>
                  )}
                </div>
              )}
            </div>
          )}

          <VehicleTable
            carsData={data}
            filter={filters}
            loading={loading}
            handlePageChange={handlePageChange}
          />
          {data.data.length >= 30 && (
            <Pagination
              className="custom-pagination"
              current={currentPage}
              pageSize={data?.meta?.per_page}
              total={data?.meta?.total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          )}
          <br />
        </Layout>
      </Layout>
    </>
  );
};

export default Search;
