CREATE TABLE visiri_users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  nickname TEXT,
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP
);

ALTER TABLE experiments
  ADD COLUMN IF NOT EXISTS
    user_id INTEGER REFERENCES visiri_users(id)
    ON DELETE CASCADE;
