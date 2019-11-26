CREATE TABLE experiment (
	id SERIAL PRIMARY KEY,
	image TEXT,
	celltype TEXT NOT NULL,
	date_created TIMESTAMP DEFAULT now() NOT NULL
);
