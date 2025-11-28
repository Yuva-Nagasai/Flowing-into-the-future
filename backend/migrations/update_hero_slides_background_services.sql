ALTER TABLE hero_slides
  MODIFY variant ENUM('default', 'showcase', 'services') NOT NULL DEFAULT 'default';

ALTER TABLE hero_slides
  ADD COLUMN IF NOT EXISTS background_image VARCHAR(512) NULL AFTER trust_badges;

ALTER TABLE hero_slides
  ADD COLUMN IF NOT EXISTS background_overlay VARCHAR(128) NULL AFTER background_image;

ALTER TABLE hero_slides
  ADD COLUMN IF NOT EXISTS services JSON NULL AFTER background_overlay;

