
-- Update the CHECK constraint on post_showing_actions to include new contact attempt action types
ALTER TABLE post_showing_actions 
DROP CONSTRAINT IF EXISTS post_showing_actions_action_type_check;

ALTER TABLE post_showing_actions 
ADD CONSTRAINT post_showing_actions_action_type_check 
CHECK (action_type IN (
  'favorited',
  'made_offer',
  'request_offer_assistance',
  'hired_agent',
  'work_with_agent',
  'scheduled_more_tours',
  'schedule_same_agent',
  'schedule_different_agent',
  'asked_questions',
  'attempted_contact_sms',
  'attempted_contact_call',
  'attempted_contact_email'
));
