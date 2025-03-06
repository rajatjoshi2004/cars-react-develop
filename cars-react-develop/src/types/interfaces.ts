export interface CarApiResponse {
    data: Car[]; // Array of car objects (define `Car` interface based on actual data structure)
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

// interface Manufacturer {
//     id: number;
//     name: string;
// }

interface Model {
    id: number;
    name: string;
    manufacturer_id: number;
}

interface BodyType {
    id: number;
    name: string;
}

interface Color {
    id: number;
    name: string;
}

interface Engine {
    id: number;
    name: string;
}

interface Transmission {
    id: number;
    name: string;
}

interface DriveWheel {
    id: number;
    name: string;
}

interface VehicleType {
    id: number;
    name: string;
}

interface Fuel {
    id: number;
    name: string;
}

interface OdometerStatus {
    id: number;
    name: string;
}

interface Odometer {
    km: number;
    mi: number;
    status: OdometerStatus;
}

interface Domain {
    id: number;
    name: string;
}

interface Damage {
    id: number;
    name: string;
}

interface DamageDetails {
    main: Damage;
    second: Damage;
}

interface Airbag {
    id: number;
    name: string;
}

interface ImageUrls {
    id: number;
    small: string | null;
    normal: string[];
    big: string[];
    exterior: string | null;
    interior: string | null;
    video: string;
    video_youtube_id: string;
    external_panorama_url: string | null;
}

interface State {
    id: number;
    code: string;
    name: string;
}

interface City {
    id: number;
    name: string;
}

interface LocationDetail {
    id: number;
    name: string;
}

interface Location {
    country: string | null;
    state: State;
    city: City;
    location: LocationDetail;
    latitude: number;
    longitude: number;
    postal_code: string;
    is_offsite: boolean;
}

interface SellingBranch {
    id: number;
    name: string;
    number: number;
    link: string;
    domain_id: number;
}

interface Lot {
    id: number;
    lot: string;
    domain: Domain;
    external_id: string;
    odometer: Odometer;
    estimate_repair_price: number | null;
    pre_accident_price: number | null;
    clean_wholesale_price: number | null;
    actual_cash_value: number | null;
    sale_date: string | null;
    bid: number | null;
    buy_now: number | null;
    status: string | null;
    seller: string | null;
    title: string | null;
    detailed_title: string | null;
    damage: DamageDetails;
    keys_available: boolean;
    airbags: Airbag;
    condition: string | null;
    grade_iaai: string | null;
    images: ImageUrls;
    location: Location;
    selling_branch: SellingBranch;
    created_at: string;
    updated_at: string;
}

export interface Car {
    id: number;
    year: number;
    title: string;
    vin: string;
    manufacturer: Manufacturer;
    model: Model;
    generation: string | null;
    body_type: BodyType;
    color: Color;
    engine: Engine;
    transmission: Transmission;
    drive_wheel: DriveWheel;
    vehicle_type: VehicleType;
    fuel: Fuel;
    cylinders: number;
    lots: Lot[];
}

export interface FilterOption {
    id: string;
    name: string;
}

export interface Manufacturer {
    id: string;
    brand: string;
}

export interface bodyStyle {
    id: number;
    name: string;
}

export interface manufacturer {
    id: number;
    brand: string;
}

export interface dial_codes {
    name: string;
    code: string;
    dial_code: string;
}
