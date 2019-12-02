BEGIN;

TRUNCATE
  experiments,
  visiri_users,
  experiment_regions
  RESTART IDENTITY CASCADE;

INSERT INTO visiri_users (user_name, full_name, nickname, password)
VALUES
  ('demo', 'Demo User', null, '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
  ('test', 'Test User', null, '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne');

INSERT INTO experiments (celltype, experiment_type, user_id)
VALUES
	('Test Cells', 'Calibration', 'http://localhost:3000/public/test1.jpeg', 480, 240, 1),
	('Test Cells2', 'Calibration', 'http://localhost:3000/public/test2.jpeg', 324, 240, 1);

INSERT INTO images (image_url, image_width, image_height, experiment_id)
VALUES
  ('testimagepath', 123, 123, 1),
  ('testimagepath2', 234, 234, 2);

INSERT INTO experiment_regions (experiment_id, regions)
VALUES
	(1, '{"data": ["1", "2"], "point": {"x": "2", "y": "2"}, "regionSize": "42"}'),
		(2, '{"point": {"x": "4", "y": "2"}, "regionSize": "42"}');

COMMIT;
