-- Tabela de interações nutricionais (antagonismo/competição)
-- Permite cadastrar relações onde um nutriente em excesso inibe a absorção de outros

CREATE TABLE IF NOT EXISTS nutrient_interactions (
  id BIGSERIAL PRIMARY KEY,
  source_nutrient_id BIGINT NOT NULL REFERENCES nutriente(id) ON DELETE CASCADE,
  target_nutrient_id BIGINT NOT NULL REFERENCES nutriente(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL,
  mechanism TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_nutrient_id, target_nutrient_id, mechanism)
);

-- Índice para busca por nutriente de origem
CREATE INDEX IF NOT EXISTS idx_nutrient_interactions_source ON nutrient_interactions(source_nutrient_id);

-- Índice para busca por nutriente de destino
CREATE INDEX IF NOT EXISTS idx_nutrient_interactions_target ON nutrient_interactions(target_nutrient_id);

ALTER TABLE nutrient_interactions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'nutrient_interactions'
      AND policyname = 'Public can read nutrient interactions'
  ) THEN
    CREATE POLICY "Public can read nutrient interactions"
      ON nutrient_interactions
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END
$$;

-- Comentários para documentação
COMMENT ON TABLE nutrient_interactions IS 'Relações de antagonismo/competição entre nutrientes';
COMMENT ON COLUMN nutrient_interactions.source_nutrient_id IS 'Nutriente em excesso que causa a interação';
COMMENT ON COLUMN nutrient_interactions.target_nutrient_id IS 'Nutriente afetado pela interação';
COMMENT ON COLUMN nutrient_interactions.relation_type IS 'Tipo de relação (ex: Competição Catiônica, Precipitação Química)';
COMMENT ON COLUMN nutrient_interactions.mechanism IS 'Mecanismo da interação';
COMMENT ON COLUMN nutrient_interactions.description IS 'Descrição pedagógica do mecanismo';
