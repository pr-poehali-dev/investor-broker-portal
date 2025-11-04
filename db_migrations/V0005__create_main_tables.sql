CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('investor', 'broker')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS investment_objects (
    id SERIAL PRIMARY KEY,
    broker_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('flats', 'apartments', 'commercial', 'country')),
    area NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    yield_percent NUMERIC NOT NULL,
    payback_years NUMERIC NOT NULL,
    description TEXT,
    images TEXT[],
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_objects_broker ON investment_objects(broker_id);
CREATE INDEX IF NOT EXISTS idx_objects_city ON investment_objects(city);
CREATE INDEX IF NOT EXISTS idx_objects_type ON investment_objects(property_type);
CREATE INDEX IF NOT EXISTS idx_objects_status ON investment_objects(status);
CREATE INDEX IF NOT EXISTS idx_objects_price ON investment_objects(price);
CREATE INDEX IF NOT EXISTS idx_objects_yield ON investment_objects(yield_percent);

CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    object_id INTEGER REFERENCES investment_objects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, object_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_object ON favorites(object_id);

CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    object_id INTEGER REFERENCES investment_objects(id),
    user_id INTEGER REFERENCES users(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiries_object ON inquiries(object_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_user ON inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);
