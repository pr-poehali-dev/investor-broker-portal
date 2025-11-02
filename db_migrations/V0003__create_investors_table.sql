CREATE TABLE IF NOT EXISTS investors (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES brokers(id),
    
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    avatar TEXT,
    
    stage TEXT NOT NULL CHECK (stage IN ('lead', 'consultation', 'analysis', 'offer_sent', 'negotiation', 'deal_preparation', 'active', 'inactive')),
    
    profile_budget NUMERIC NOT NULL,
    profile_strategies JSONB NOT NULL,
    profile_risk_tolerance TEXT NOT NULL CHECK (profile_risk_tolerance IN ('low', 'medium', 'high')),
    profile_preferred_property_types JSONB NOT NULL,
    profile_preferred_locations JSONB NOT NULL,
    
    portfolio_total_invested NUMERIC DEFAULT 0,
    portfolio_active_investments INTEGER DEFAULT 0,
    portfolio_total_return NUMERIC DEFAULT 0,
    portfolio_properties JSONB DEFAULT '[]'::jsonb,
    
    interaction_source TEXT NOT NULL,
    interaction_utm_source TEXT,
    interaction_utm_medium TEXT,
    interaction_utm_campaign TEXT,
    interaction_utm_content TEXT,
    interaction_referral_code TEXT,
    interaction_last_contact TIMESTAMP,
    interaction_notes TEXT,
    
    timeline JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_investors_broker_id ON investors(broker_id);
CREATE INDEX idx_investors_stage ON investors(stage);
CREATE INDEX idx_investors_email ON investors(email);
CREATE INDEX idx_investors_created_at ON investors(created_at DESC);