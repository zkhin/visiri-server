CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  image_url TEXT DEFAULT '/public/no-image-found.jpg',
  image_width INTEGER DEFAULT 0,
  image_height INTEGER DEFAULT 0,
  experiment_id INTEGER REFERENCES experiments(id) ON DELETE CASCADE
);