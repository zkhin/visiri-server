BEGIN;

TRUNCATE
  experiment,
  visiri_users,
  experiment_images
  RESTART IDENTITY CASCADE;

INSERT INTO visiri_users (user_name, full_name, nickname, password)
VALUES
  ('demo', 'Demo User', null, '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
