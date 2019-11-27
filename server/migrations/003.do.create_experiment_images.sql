CREATE TABLE experiment_images (
	id SERIAL PRIMARY KEY,
	date_created TIMESTAMP NOT NULL DEFAULT now(),
	date_modified TIMESTAMP,
	image_width INTEGER NOT NULL,
	image_height INTEGER NOT NULL,
	experiment_id INTEGER REFERENCES experiments NOT NULL ON DELETE SET NULL
);

ALTER TABLE experiments
	ADD COLUMN
		image_id INTEGER REFERENCES experiment_images(id)
		ON DELETE SET NULL;
