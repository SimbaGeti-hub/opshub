-- Ensure available quantity never exceeds total, and neither goes negative.
ALTER TABLE "resources"
  ADD CONSTRAINT "resources_quantity_check"
  CHECK ("quantityAvailable" >= 0 AND "quantityAvailable" <= "quantityTotal");
