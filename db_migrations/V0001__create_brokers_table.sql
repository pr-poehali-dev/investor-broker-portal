CREATE TABLE IF NOT EXISTS brokers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    avatar TEXT,
    company TEXT,
    referral_code TEXT UNIQUE NOT NULL,
    stats_total_properties INTEGER DEFAULT 0,
    stats_active_properties INTEGER DEFAULT 0,
    stats_total_investors INTEGER DEFAULT 0,
    stats_total_deals INTEGER DEFAULT 0,
    stats_total_revenue NUMERIC DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brokers_email ON brokers(email);
CREATE INDEX idx_brokers_referral_code ON brokers(referral_code);