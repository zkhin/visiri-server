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
	('Test Cells', 'Calibration', 1),
  ('Test Cells2', 'Calibration', 1),
	('Test Cells2', 'Calibration', 2);

INSERT INTO images (image_url, image_width, image_height, experiment_id)
VALUES
  ('http://localhost:8000/api/images/image-1575343884666.jpeg', 123, 123, 1),
  ('http://localhost:8000/api/images/image-1575346548427.jpeg', 234, 234, 1),
  ('http://localhost:8000/api/images/image-1575346548427.jpeg', 234, 234, 2);

INSERT INTO experiment_regions (experiment_id, regions)
VALUES
	(1,
      '{
        "data": [
          {
            "color": "black",
            "point": {
              "x": "3",
              "y": "5"
            },
            "regionSize": "65"
          },
          {
            "color": "red",
            "point": {
              "x": "5",
              "y": "2"
            },
            "regionSize": "24"
          }
        ]
      }'
      ),
		(2,
      '{
        "data": [
          {
            "color": "black",
            "point": {
              "x": "3",
              "y": "5"
            },
            "regionSize": "65"
          },
          {
            "color": "red",
            "point": {
              "x": "5",
              "y": "2"
            },
            "regionSize": "24"
          }
        ]
      }'
    );

COMMIT;
