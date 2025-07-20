-- Automated reminder system for showing appointments
-- This creates a scheduled job that runs every hour to send reminder emails

-- Create a function to send showing reminders
CREATE OR REPLACE FUNCTION send_automated_showing_reminders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    showing_record RECORD;
    reminder_24h_time TIMESTAMPTZ;
    reminder_2h_time TIMESTAMPTZ;
    current_time TIMESTAMPTZ := NOW();
BEGIN
    -- Calculate reminder times (24 hours and 2 hours before showing)
    
    -- Process showings for 24-hour reminders
    FOR showing_record IN
        SELECT 
            sr.*,
            bp.first_name as buyer_first_name,
            bp.last_name as buyer_last_name,
            bp.email as buyer_email,
            ap.first_name as agent_first_name,
            ap.last_name as agent_last_name,
            ap.email as agent_email,
            ap.phone as agent_phone
        FROM showing_requests sr
        LEFT JOIN profiles bp ON sr.user_id = bp.id
        LEFT JOIN profiles ap ON sr.assigned_agent_id = ap.id
        WHERE sr.status = 'agent_confirmed'
        AND sr.preferred_date IS NOT NULL
        AND sr.preferred_time IS NOT NULL
        AND (sr.preferred_date || ' ' || sr.preferred_time)::TIMESTAMPTZ > current_time
        AND (sr.preferred_date || ' ' || sr.preferred_time)::TIMESTAMPTZ <= current_time + INTERVAL '25 hours'
        AND (sr.preferred_date || ' ' || sr.preferred_time)::TIMESTAMPTZ > current_time + INTERVAL '23 hours'
        AND (sr.reminder_24h_sent IS NULL OR sr.reminder_24h_sent = false)
    LOOP
        -- Send 24h reminder to buyer
        BEGIN
            PERFORM net.http_post(
                url := 'https://uugchegukcccuqpcsqhl.supabase.co/functions/v1/send-showing-reminder',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
                ),
                body := jsonb_build_object(
                    'recipientName', showing_record.buyer_first_name || ' ' || showing_record.buyer_last_name,
                    'recipientEmail', showing_record.buyer_email,
                    'recipientType', 'buyer',
                    'propertyAddress', showing_record.property_address,
                    'showingDate', showing_record.preferred_date,
                    'showingTime', showing_record.preferred_time,
                    'reminderType', '24h',
                    'agentName', showing_record.agent_first_name || ' ' || showing_record.agent_last_name,
                    'agentPhone', showing_record.agent_phone,
                    'requestId', showing_record.id::text
                )
            );
            
            -- Send 24h reminder to agent
            PERFORM net.http_post(
                url := 'https://uugchegukcccuqpcsqhl.supabase.co/functions/v1/send-showing-reminder',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
                ),
                body := jsonb_build_object(
                    'recipientName', showing_record.agent_first_name || ' ' || showing_record.agent_last_name,
                    'recipientEmail', showing_record.agent_email,
                    'recipientType', 'agent',
                    'propertyAddress', showing_record.property_address,
                    'showingDate', showing_record.preferred_date,
                    'showingTime', showing_record.preferred_time,
                    'reminderType', '24h',
                    'buyerName', showing_record.buyer_first_name || ' ' || showing_record.buyer_last_name,
                    'requestId', showing_record.id::text
                )
            );
            
            -- Mark 24h reminder as sent
            UPDATE showing_requests 
            SET reminder_24h_sent = true, reminder_24h_sent_at = current_time
            WHERE id = showing_record.id;
            
        EXCEPTION WHEN OTHERS THEN
            -- Log error but continue processing other reminders
            RAISE NOTICE 'Failed to send 24h reminder for showing %: %', showing_record.id, SQLERRM;
        END;
    END LOOP;

    -- Process showings for 2-hour reminders
    FOR showing_record IN
        SELECT 
            sr.*,
            bp.first_name as buyer_first_name,
            bp.last_name as buyer_last_name,
            bp.email as buyer_email,
            ap.first_name as agent_first_name,
            ap.last_name as agent_last_name,
            ap.email as agent_email,
            ap.phone as agent_phone
        FROM showing_requests sr
        LEFT JOIN profiles bp ON sr.user_id = bp.id
        LEFT JOIN profiles ap ON sr.assigned_agent_id = ap.id
        WHERE sr.status = 'agent_confirmed'
        AND sr.preferred_date IS NOT NULL
        AND sr.preferred_time IS NOT NULL
        AND (sr.preferred_date || ' ' || sr.preferred_time)::TIMESTAMPTZ > current_time
        AND (sr.preferred_date || ' ' || sr.preferred_time)::TIMESTAMPTZ <= current_time + INTERVAL '3 hours'
        AND (sr.preferred_date || ' ' || sr.preferred_time)::TIMESTAMPTZ > current_time + INTERVAL '1 hour'
        AND (sr.reminder_2h_sent IS NULL OR sr.reminder_2h_sent = false)
    LOOP
        -- Send 2h reminder to buyer
        BEGIN
            PERFORM net.http_post(
                url := 'https://uugchegukcccuqpcsqhl.supabase.co/functions/v1/send-showing-reminder',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
                ),
                body := jsonb_build_object(
                    'recipientName', showing_record.buyer_first_name || ' ' || showing_record.buyer_last_name,
                    'recipientEmail', showing_record.buyer_email,
                    'recipientType', 'buyer',
                    'propertyAddress', showing_record.property_address,
                    'showingDate', showing_record.preferred_date,
                    'showingTime', showing_record.preferred_time,
                    'reminderType', '2h',
                    'agentName', showing_record.agent_first_name || ' ' || showing_record.agent_last_name,
                    'agentPhone', showing_record.agent_phone,
                    'requestId', showing_record.id::text
                )
            );
            
            -- Send 2h reminder to agent
            PERFORM net.http_post(
                url := 'https://uugchegukcccuqpcsqhl.supabase.co/functions/v1/send-showing-reminder',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
                ),
                body := jsonb_build_object(
                    'recipientName', showing_record.agent_first_name || ' ' || showing_record.agent_last_name,
                    'recipientEmail', showing_record.agent_email,
                    'recipientType', 'agent',
                    'propertyAddress', showing_record.property_address,
                    'showingDate', showing_record.preferred_date,
                    'showingTime', showing_record.preferred_time,
                    'reminderType', '2h',
                    'buyerName', showing_record.buyer_first_name || ' ' || showing_record.buyer_last_name,
                    'requestId', showing_record.id::text
                )
            );
            
            -- Mark 2h reminder as sent
            UPDATE showing_requests 
            SET reminder_2h_sent = true, reminder_2h_sent_at = current_time
            WHERE id = showing_record.id;
            
        EXCEPTION WHEN OTHERS THEN
            -- Log error but continue processing other reminders
            RAISE NOTICE 'Failed to send 2h reminder for showing %: %', showing_record.id, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Automated reminder processing completed at %', current_time;
END;
$$;

-- Add reminder tracking columns to showing_requests table
ALTER TABLE showing_requests 
ADD COLUMN IF NOT EXISTS reminder_24h_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reminder_24h_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reminder_2h_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reminder_2h_sent_at TIMESTAMPTZ;

-- Create an index for efficient reminder queries
CREATE INDEX IF NOT EXISTS idx_showing_requests_reminder_lookup 
ON showing_requests (status, preferred_date, preferred_time, reminder_24h_sent, reminder_2h_sent)
WHERE status = 'agent_confirmed';

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION send_automated_showing_reminders() TO service_role;

-- Note: To schedule this function to run every hour, you would typically use pg_cron
-- For now, this function can be called manually or triggered by your application
-- To enable automated scheduling with pg_cron (if available):
-- SELECT cron.schedule('showing-reminders', '0 * * * *', 'SELECT send_automated_showing_reminders();');