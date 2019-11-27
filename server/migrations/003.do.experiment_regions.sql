CREATE TABLE experiment_regions (
	id SERIAL PRIMARY KEY,
	date_created TIMESTAMP NOT NULL DEFAULT now(),
	date_modified TIMESTAMP,
	experiment INTEGER REFERENCES experiments(id) NOT NULL ON DELETE SET NULL,
	regions JSON
);
