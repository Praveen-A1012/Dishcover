-- Enable pg_trgm for fuzzy trigram similarity search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create trigram GIN indexes to accelerate fuzzy matching on recipe titles and favourite names
CREATE INDEX IF NOT EXISTS idx_recipe_title_trgm ON "Recipe" USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_favorite_recipeName_trgm ON "Favorite" USING GIN ("recipeName" gin_trgm_ops);
