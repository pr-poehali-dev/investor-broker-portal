CREATE TABLE IF NOT EXISTS interactions (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES brokers(id),
    investor_id TEXT NOT NULL REFERENCES investors(id),
    property_id TEXT REFERENCES properties(id),
    
    type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'property_view', 'offer_sent', 'contract_signed', 'payment_received', 'note')),
    direction TEXT CHECK (direction IN ('inbound', 'outbound')),
    
    subject TEXT,
    description TEXT NOT NULL,
    
    outcome TEXT CHECK (outcome IN ('positive', 'neutral', 'negative')),
    next_action TEXT,
    next_action_date TIMESTAMP,
    
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interactions_broker_id ON interactions(broker_id);
CREATE INDEX idx_interactions_investor_id ON interactions(investor_id);
CREATE INDEX idx_interactions_property_id ON interactions(property_id);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_created_at ON interactions(created_at DESC);