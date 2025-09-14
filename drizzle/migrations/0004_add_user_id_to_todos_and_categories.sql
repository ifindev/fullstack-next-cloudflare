-- Add user_id columns to existing tables
-- Since we're adding NOT NULL columns to potentially existing data,
-- we need to handle this carefully

-- First, add the columns as nullable
ALTER TABLE `categories` ADD `user_id` text REFERENCES user(id);
ALTER TABLE `todos` ADD `user_id` text REFERENCES user(id);

-- Note: In a production environment, you would need to:
-- 1. Populate these columns with appropriate user IDs for existing data
-- 2. Then make them NOT NULL in a separate migration
-- For development, you might want to clear existing data or assign a default user

-- For now, we'll leave them nullable and handle the constraint in application code
-- until existing data is properly migrated
