CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES brokers(id),
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'commercial', 'land', 'hotel', 'garage', 'parking', 'storage')),
    status TEXT NOT NULL CHECK (status IN ('draft', 'moderation', 'active', 'reserved', 'sold', 'archived')),
    
    location_city TEXT NOT NULL,
    location_district TEXT,
    location_address TEXT NOT NULL,
    location_metro TEXT,
    location_metro_distance INTEGER,
    location_lat NUMERIC,
    location_lng NUMERIC,
    
    pricing_total_price NUMERIC NOT NULL,
    pricing_price_per_meter NUMERIC,
    pricing_min_investment NUMERIC NOT NULL,
    pricing_currency TEXT DEFAULT 'RUB',
    
    financing_method TEXT NOT NULL CHECK (financing_method IN ('cash', 'mortgage', 'installment', 'developer_installment', 'mixed')),
    financing_mortgage_rate NUMERIC,
    financing_installment_months INTEGER,
    financing_down_payment NUMERIC,
    financing_developer_installment_months INTEGER,
    financing_developer_installment_rate NUMERIC,
    
    investment_strategies JSONB NOT NULL,
    investment_expected_return NUMERIC NOT NULL,
    investment_term INTEGER NOT NULL,
    investment_risk_level TEXT NOT NULL CHECK (investment_risk_level IN ('low', 'medium', 'high')),
    investment_current_investment NUMERIC DEFAULT 0,
    investment_target_investment NUMERIC NOT NULL,
    investment_investors_count INTEGER DEFAULT 0,
    
    rental_monthly_income NUMERIC,
    rental_occupancy_rate NUMERIC,
    rental_yield NUMERIC,
    
    resale_expected_price NUMERIC,
    resale_expected_profit NUMERIC,
    resale_market_growth NUMERIC,
    
    details_area NUMERIC,
    details_rooms INTEGER,
    details_floor INTEGER,
    details_total_floors INTEGER,
    details_build_year INTEGER,
    details_condition TEXT,
    details_parking BOOLEAN,
    details_furnishing TEXT,
    
    media_images JSONB,
    media_videos JSONB,
    media_virtual_tour TEXT,
    media_floor_plan TEXT,
    
    documents JSONB,
    
    metadata_views INTEGER DEFAULT 0,
    metadata_favorites INTEGER DEFAULT 0,
    metadata_source TEXT,
    metadata_external_id TEXT,
    
    sharing_telegram_published BOOLEAN DEFAULT false,
    sharing_telegram_url TEXT,
    sharing_vk_published BOOLEAN DEFAULT false,
    sharing_vk_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_properties_broker_id ON properties(broker_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_location_city ON properties(location_city);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);