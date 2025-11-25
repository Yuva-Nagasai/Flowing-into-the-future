CREATE TABLE IF NOT EXISTS hero_slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  variant ENUM('default', 'showcase') NOT NULL DEFAULT 'default',
  title VARCHAR(255),
  highlight VARCHAR(255),
  subtitle TEXT,
  button_text VARCHAR(255),
  pre_heading VARCHAR(255),
  heading VARCHAR(255),
  description TEXT,
  categories JSON,
  primary_cta_label VARCHAR(255),
  primary_cta_route VARCHAR(255),
  secondary_cta_label VARCHAR(255),
  secondary_cta_route VARCHAR(255),
  trust_badges JSON,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

