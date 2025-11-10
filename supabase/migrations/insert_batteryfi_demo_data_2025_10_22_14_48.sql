-- Insert demo data for BatteryFi platform

-- Insert demo community pools first
INSERT INTO public.community_pools_2025_10_22_14_48 (pool_name, description, location_area, total_staked_tokens, total_participants, apy_rate, min_stake_amount, pool_type) VALUES
('Silicon Valley Grid Stabilizer', 'Community pool focused on stabilizing the Silicon Valley electrical grid during peak hours', 'Silicon Valley, CA', 125000.50, 45, 12.5, 100, 'grid_support'),
('Austin Solar Collective', 'Supporting residential solar battery integration in Austin metro area', 'Austin, TX', 89750.25, 32, 15.2, 50, 'community'),
('Brooklyn Microgrid Network', 'Decentralized energy sharing network for Brooklyn neighborhoods', 'Brooklyn, NY', 156800.75, 67, 11.8, 75, 'community'),
('Emergency Response Pool', 'Emergency energy reserves for disaster response and grid outages', 'Multi-Region', 245600.00, 89, 8.5, 200, 'emergency'),
('Green Campus Initiative', 'University and corporate campus energy optimization pool', 'Multi-Campus', 98450.30, 28, 14.7, 150, 'grid_support');

-- Insert demo marketplace listings
INSERT INTO public.marketplace_listings_2025_10_22_14_48 (seller_id, listing_type, title, description, price, quantity, unit, energy_delivery_time, location_constraint, status, expires_at) VALUES
(NULL, 'energy_trade', 'Excess Solar Energy - Peak Hours', 'Selling 50 kWh of excess solar energy generated during peak sunlight hours', 0.18, 50.0, 'kwh', NOW() + INTERVAL '2 hours', 'Within 10 miles of San Francisco', 'active', NOW() + INTERVAL '1 day'),
(NULL, 'equipment', 'Tesla Powerwall 2 - Excellent Condition', 'Used Tesla Powerwall 2 with 13.5 kWh capacity. Installed 2 years ago, excellent condition with warranty remaining', 8500.00, 1.0, 'piece', NULL, 'California Bay Area', 'active', NOW() + INTERVAL '30 days'),
(NULL, 'token_swap', 'BATT to ETH Swap', 'Looking to swap 5000 BATT tokens for ETH at current market rates', 0.0024, 5000.0, 'token', NULL, 'No location constraint', 'active', NOW() + INTERVAL '7 days'),
(NULL, 'energy_trade', 'EV Charging Station Surplus', 'Commercial EV charging station with excess capacity during off-peak hours', 0.12, 200.0, 'kwh', NOW() + INTERVAL '8 hours', 'Los Angeles Metro', 'active', NOW() + INTERVAL '2 days'),
(NULL, 'futures_contract', 'Summer Peak Energy Contract', 'Energy futures contract for summer peak demand periods (June-August)', 0.35, 1000.0, 'contract', NOW() + INTERVAL '60 days', 'Texas ERCOT Grid', 'active', NOW() + INTERVAL '45 days'),
(NULL, 'equipment', 'LG Chem RESU Battery System', 'LG Chem RESU 10H battery system, 9.8 kWh usable capacity, perfect for home solar integration', 4200.00, 1.0, 'piece', NULL, 'Austin, TX area', 'active', NOW() + INTERVAL '21 days'),
(NULL, 'energy_trade', 'Wind Farm Excess Capacity', 'Excess wind energy available during high wind periods, great rates for bulk purchase', 0.08, 500.0, 'kwh', NOW() + INTERVAL '4 hours', 'Midwest Wind Corridor', 'active', NOW() + INTERVAL '12 hours'),
(NULL, 'token_swap', 'Large BATT Token Sale', 'Selling large quantity of BATT tokens, bulk discount available', 0.0021, 25000.0, 'token', NULL, 'No location constraint', 'active', NOW() + INTERVAL '14 days');

-- Note: We'll create a trigger to automatically create user profiles when auth users sign up
-- This is a common pattern in Supabase applications

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_2025_10_22_14_48()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_2025_10_22_14_48 (user_id, email, username, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created_2025_10_22_14_48
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_2025_10_22_14_48();

-- Create some sample energy transaction data (will be linked to devices when users sign up)
-- For now, we'll create some anonymous sample data for visualization

-- Create a function to generate realistic telemetry data
CREATE OR REPLACE FUNCTION generate_sample_telemetry_data()
RETURNS void AS $$
DECLARE
    i INTEGER;
    base_time TIMESTAMP WITH TIME ZONE;
BEGIN
    base_time := NOW() - INTERVAL '7 days';
    
    -- Generate 168 hours (7 days) of sample telemetry data
    FOR i IN 0..167 LOOP
        INSERT INTO public.telemetry_summaries_2025_10_22_14_48 (
            device_id, 
            summary_period_start, 
            summary_period_end,
            avg_soc,
            energy_exported_kwh,
            energy_imported_kwh,
            local_demand_kwh,
            renewable_generation_kwh,
            ai_optimization_actions,
            model_confidence_avg,
            temperature_avg,
            signature_hash,
            verified
        ) VALUES (
            NULL, -- Will be updated when real devices are created
            base_time + (i * INTERVAL '1 hour'),
            base_time + ((i + 1) * INTERVAL '1 hour'),
            20 + (60 * random()), -- Random SoC between 20-80%
            random() * 15, -- 0-15 kWh exported
            random() * 10, -- 0-10 kWh imported  
            5 + (random() * 20), -- 5-25 kWh local demand
            random() * 25, -- 0-25 kWh renewable generation
            floor(random() * 10)::INTEGER, -- 0-9 AI actions
            0.7 + (random() * 0.3), -- 70-100% model confidence
            15 + (random() * 20), -- 15-35°C temperature
            encode(digest(random()::text, 'sha256'), 'hex'), -- Random signature
            random() > 0.1 -- 90% verified
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to generate sample data
SELECT generate_sample_telemetry_data();

-- Drop the function as it's no longer needed
DROP FUNCTION generate_sample_telemetry_data();