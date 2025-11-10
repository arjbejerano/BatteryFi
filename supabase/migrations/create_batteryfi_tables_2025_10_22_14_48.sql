-- BatteryFi Database Schema
-- Create tables for decentralized energy optimization platform

-- Users table with wallet integration
CREATE TABLE IF NOT EXISTS public.users_2025_10_22_14_48 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    wallet_address VARCHAR(42) UNIQUE,
    full_name VARCHAR(100),
    avatar_url TEXT,
    total_batt_tokens DECIMAL(18,8) DEFAULT 0,
    energy_contribution_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Battery devices table for IoT edge devices
CREATE TABLE IF NOT EXISTS public.battery_devices_2025_10_22_14_48 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users_2025_10_22_14_48(id) ON DELETE CASCADE,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL, -- 'home_battery', 'ev', 'solar_storage', 'microgrid'
    capacity_kwh DECIMAL(10,2) NOT NULL,
    current_soc DECIMAL(5,2) DEFAULT 0, -- State of charge percentage
    health_score INTEGER DEFAULT 100,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    hmac_key VARCHAR(64) NOT NULL, -- For cryptographic signing
    is_active BOOLEAN DEFAULT true,
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Energy transactions table for charging/discharging records
CREATE TABLE IF NOT EXISTS public.energy_transactions_2025_10_22_14_48 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES public.battery_devices_2025_10_22_14_48(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- 'charge', 'discharge', 'share', 'trade'
    energy_amount_kwh DECIMAL(10,4) NOT NULL,
    price_per_kwh DECIMAL(10,6),
    total_value DECIMAL(12,6),
    grid_impact_score INTEGER DEFAULT 0, -- Positive for stabilizing, negative for destabilizing
    ai_confidence DECIMAL(5,4) DEFAULT 0, -- Edge AI model confidence
    signature_hash VARCHAR(128) NOT NULL, -- HMAC signature for verification
    verified BOOLEAN DEFAULT false,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BATT token transactions and rewards
CREATE TABLE IF NOT EXISTS public.batt_token_transactions_2025_10_22_14_48 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users_2025_10_22_14_48(id) ON DELETE CASCADE,
    transaction_type VARCHAR(30) NOT NULL, -- 'reward', 'stake', 'unstake', 'trade', 'transfer'
    amount DECIMAL(18,8) NOT NULL,
    related_energy_tx UUID REFERENCES public.energy_transactions_2025_10_22_14_48(id),
    blockchain_tx_hash VARCHAR(66), -- Ethereum transaction hash
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community energy pools for staking
CREATE TABLE IF NOT EXISTS public.community_pools_2025_10_22_14_48 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pool_name VARCHAR(100) NOT NULL,
    description TEXT,
    location_area VARCHAR(100),
    total_staked_tokens DECIMAL(18,8) DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    apy_rate DECIMAL(5,2) DEFAULT 0, -- Annual percentage yield
    min_stake_amount DECIMAL(18,8) DEFAULT 100,
    pool_type VARCHAR(30) DEFAULT 'community', -- 'community', 'emergency', 'grid_support'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stakes in community pools
CREATE TABLE IF NOT EXISTS public.pool_stakes_2025_10_22_14_48 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users_2025_10_22_14_48(id) ON DELETE CASCADE,
    pool_id UUID REFERENCES public.community_pools_2025_10_22_14_48(id) ON DELETE CASCADE,
    staked_amount DECIMAL(18,8) NOT NULL,
    rewards_earned DECIMAL(18,8) DEFAULT 0,
    stake_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_reward_claim TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Marketplace listings for P2P trading and equipment
CREATE TABLE IF NOT EXISTS public.marketplace_listings_2025_10_22_14_48 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES public.users_2025_10_22_14_48(id) ON DELETE CASCADE,
    listing_type VARCHAR(30) NOT NULL, -- 'energy_trade', 'equipment', 'futures_contract', 'token_swap'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(12,6) NOT NULL,
    quantity DECIMAL(10,4),
    unit VARCHAR(20), -- 'kwh', 'piece', 'contract', 'token'
    energy_delivery_time TIMESTAMP WITH TIME ZONE,
    location_constraint VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'sold', 'expired', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Telemetry data from edge devices (signed summaries)
CREATE TABLE IF NOT EXISTS public.telemetry_summaries_2025_10_22_14_48 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES public.battery_devices_2025_10_22_14_48(id) ON DELETE CASCADE,
    summary_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    summary_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    avg_soc DECIMAL(5,2),
    energy_exported_kwh DECIMAL(10,4) DEFAULT 0,
    energy_imported_kwh DECIMAL(10,4) DEFAULT 0,
    local_demand_kwh DECIMAL(10,4) DEFAULT 0,
    renewable_generation_kwh DECIMAL(10,4) DEFAULT 0,
    ai_optimization_actions INTEGER DEFAULT 0,
    model_confidence_avg DECIMAL(5,4),
    temperature_avg DECIMAL(5,2),
    signature_hash VARCHAR(128) NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users_2025_10_22_14_48 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battery_devices_2025_10_22_14_48 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_transactions_2025_10_22_14_48 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batt_token_transactions_2025_10_22_14_48 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_pools_2025_10_22_14_48 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pool_stakes_2025_10_22_14_48 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings_2025_10_22_14_48 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_summaries_2025_10_22_14_48 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.users_2025_10_22_14_48
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.users_2025_10_22_14_48
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.users_2025_10_22_14_48
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can manage their own devices
CREATE POLICY "Users can manage own devices" ON public.battery_devices_2025_10_22_14_48
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users_2025_10_22_14_48 
            WHERE id = battery_devices_2025_10_22_14_48.user_id 
            AND user_id = auth.uid()
        )
    );

-- Users can view their own energy transactions
CREATE POLICY "Users can view own energy transactions" ON public.energy_transactions_2025_10_22_14_48
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.battery_devices_2025_10_22_14_48 bd
            JOIN public.users_2025_10_22_14_48 u ON bd.user_id = u.id
            WHERE bd.id = energy_transactions_2025_10_22_14_48.device_id 
            AND u.user_id = auth.uid()
        )
    );

-- Users can view their own token transactions
CREATE POLICY "Users can view own token transactions" ON public.batt_token_transactions_2025_10_22_14_48
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users_2025_10_22_14_48 
            WHERE id = batt_token_transactions_2025_10_22_14_48.user_id 
            AND user_id = auth.uid()
        )
    );

-- Community pools are viewable by all authenticated users
CREATE POLICY "Authenticated users can view community pools" ON public.community_pools_2025_10_22_14_48
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can view their own stakes
CREATE POLICY "Users can view own stakes" ON public.pool_stakes_2025_10_22_14_48
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users_2025_10_22_14_48 
            WHERE id = pool_stakes_2025_10_22_14_48.user_id 
            AND user_id = auth.uid()
        )
    );

-- Marketplace listings are viewable by all authenticated users
CREATE POLICY "Authenticated users can view marketplace" ON public.marketplace_listings_2025_10_22_14_48
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own listings" ON public.marketplace_listings_2025_10_22_14_48
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users_2025_10_22_14_48 
            WHERE id = marketplace_listings_2025_10_22_14_48.seller_id 
            AND user_id = auth.uid()
        )
    );

-- Users can view telemetry for their own devices
CREATE POLICY "Users can view own device telemetry" ON public.telemetry_summaries_2025_10_22_14_48
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.battery_devices_2025_10_22_14_48 bd
            JOIN public.users_2025_10_22_14_48 u ON bd.user_id = u.id
            WHERE bd.id = telemetry_summaries_2025_10_22_14_48.device_id 
            AND u.user_id = auth.uid()
        )
    );