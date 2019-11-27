CREATE TABLE experiments (
	id SERIAL PRIMARY KEY,
	celltype TEXT NOT NULL,
	experiment_type TEXT NOT NULL DEFAULT "Calibration",
	date_created TIMESTAMP DEFAULT now() NOT NULL,
	image_url TEXT,
	image_width INTEGER,
	image_height INTEGER
);
