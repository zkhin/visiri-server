CREATE TABLE experiments (
	id SERIAL PRIMARY KEY,
	celltype TEXT NOT NULL,
	experiment_type TEXT DEFAULT 'Calibration' NOT NULL,
	date_created TIMESTAMP DEFAULT now() NOT NULL
);
