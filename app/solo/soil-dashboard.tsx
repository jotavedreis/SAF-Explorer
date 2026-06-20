"use client";

import { useMemo, useState } from "react";

type NutrientRow = {
  id: number;
  simbolo: string;
  nome: string;
  funcao_na_planta: string | null;
  sintomas_deficiencia: string | null;
  fontes_naturais: string | null;
};

type PhPointRow = {
  id: number;
  ph_valor: number;
  descricao_acidez: string | null;
  atividade_biologica: string | null;
  presenca_aluminio: string | null;
};

type PhAvailabilityRow = {
  ph_ponto_id: number;
  nutriente_id: number;
  disponibilidade_pct: number;
  descricao: string | null;
};

type VisualSymptomRow = {
  id: number;
  descricao: string;
  nutriente_id: number;
};

type SoilDashboardProps = {
  availability: PhAvailabilityRow[];
  nutrients: NutrientRow[];
  phPoints: PhPointRow[];
  symptoms: VisualSymptomRow[];
};

export function SoilDashboard({ availability, nutrients, phPoints, symptoms }: SoilDashboardProps) {
  const minPh = phPoints[0]?.ph_valor ?? 4.5;
  const maxPh = phPoints[phPoints.length - 1]?.ph_valor ?? 6;
  const [selectedPh, setSelectedPh] = useState(minPh);
  const [selectedSymptomId, setSelectedSymptomId] = useState(symptoms[0]?.id ? String(symptoms[0].id) : "");

  const nutrientMap = useMemo(() => new Map(nutrients.map((nutrient) => [nutrient.id, nutrient])), [nutrients]);
  const selectedSymptom = symptoms.find((symptom) => String(symptom.id) === selectedSymptomId) ?? null;
  const likelyNutrient = selectedSymptom ? nutrientMap.get(selectedSymptom.nutriente_id) : null;
  const currentPhContext = interpolatePhContext(phPoints, selectedPh);
  const phMarkerPosition = getPhMarkerPosition(minPh, maxPh, selectedPh);

  return (
    <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6">
      <section className="soil-hero-card p-4 sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#738072]">Painel visual</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#1f3127] sm:text-3xl">Como o solo conversa com a planta</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#657268]">
              Nutrientes, acidez e sintomas aparecem juntos para facilitar a leitura: primeiro você entende o papel
              de cada nutriente, depois compara a disponibilidade no pH escolhido.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 rounded-3xl bg-white/70 p-3 min-[380px]:grid-cols-3">
            <VisualMetric label="Nutrientes" value={String(nutrients.length)} />
            <VisualMetric label="Pontos pH" value={String(phPoints.length)} />
            <VisualMetric label="Sintomas" value={String(symptoms.length)} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {nutrients.length === 0 ? (
          <EmptyState text="Nenhum nutriente cadastrado ainda." />
        ) : (
          nutrients.map((nutrient) => (
            <article key={nutrient.id} className="nutrient-card p-4 sm:p-5">
              <div className="relative">
                <div className="flex items-start gap-4">
                  <span className="nutrient-symbol">{nutrient.simbolo}</span>
                  <div className="min-w-0 pt-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#738072]">Nutriente</p>
                    <h2 className="text-xl font-semibold text-[#1f3127] sm:text-2xl">{nutrient.nome}</h2>
                    <p className="mt-1 text-sm text-[#657268]">Elemento essencial para acompanhar no manejo do solo.</p>
                  </div>
                </div>
                <div className="mt-5 soil-chip-grid">
                  <SoilTextBlock label="Função" value={nutrient.funcao_na_planta} />
                  <SoilTextBlock label="Deficiência" value={nutrient.sintomas_deficiencia} />
                  <SoilTextBlock label="Fontes" value={nutrient.fontes_naturais} />
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="ph-stage ph-stage--compact p-3 sm:p-5">
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#738072] sm:text-xs sm:tracking-[0.24em]">pH e fertilidade</p>
            <h2 className="mt-1 text-xl font-semibold leading-tight text-[#1f3127] sm:mt-2 sm:text-3xl">Disponibilidade por pH</h2>
            <p className="mt-2 hidden max-w-3xl text-sm leading-7 text-[#657268] sm:block">
              A escala mostra a passagem de um solo mais ácido para uma faixa mais favorável. As barras abaixo mudam
              conforme o pH selecionado.
            </p>
          </div>
          <div className="rounded-2xl bg-[#27412f] px-4 py-2 text-center text-white shadow-lg shadow-emerald-950/15 sm:rounded-3xl sm:px-5 sm:py-3 lg:min-w-32">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-lime-100 sm:text-xs sm:tracking-[0.2em]">pH atual</p>
            <p className="text-2xl font-bold leading-none sm:text-3xl sm:leading-normal">{selectedPh.toFixed(2).replace(".", ",")}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-white/75 p-3 sm:mt-6 sm:rounded-3xl sm:p-4">
          <div className="ph-gradient">
            <span className="ph-marker" style={{ left: `${phMarkerPosition}%` }} />
          </div>
          <div className="mt-2 flex justify-between gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.05em] text-[#657268] sm:mt-3 sm:text-xs sm:tracking-[0.16em]">
            <span>Mais ácido</span>
            <span>Faixa favorável</span>
            <span>Menos ácido</span>
          </div>
          <input
            min={minPh}
            max={maxPh}
            step="0.05"
            type="range"
            value={selectedPh}
            onChange={(event) => setSelectedPh(Number(event.target.value))}
            className="mt-3 w-full accent-[#5d7b1f] sm:mt-5"
          />
          <div className="mt-1 flex justify-between text-xs text-[#657268] sm:mt-2 sm:text-sm">
            <span>pH {minPh.toFixed(1).replace(".", ",")}</span>
            <span>pH {maxPh.toFixed(1).replace(".", ",")}</span>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-[320px_1fr]">
          <div className="condition-panel rounded-2xl bg-[#f8faf5] p-3 sm:rounded-3xl sm:p-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#758178] sm:text-xs sm:tracking-[0.18em]">Condição estimada</p>
            <ConditionLine label="Acidez" value={currentPhContext.descricao_acidez} />
            <ConditionLine label="Biologia" value={currentPhContext.atividade_biologica} />
            <ConditionLine label="Alumínio" value={currentPhContext.presenca_aluminio} />
          </div>

          <div className="grid gap-2 sm:gap-3 md:grid-cols-2">
            {nutrients.map((nutrient) => {
              const percentage = interpolateAvailability(availability, phPoints, nutrient.id, selectedPh);
              const level = getAvailabilityLevel(percentage);

              return (
                <div key={nutrient.id} className="availability-card">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#758178]">
                        {nutrient.simbolo}
                      </p>
                      <p className="font-semibold text-[#22342a]">{nutrient.nome}</p>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{ background: level.bg, color: level.fg }}
                    >
                      {level.label}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 sm:mt-4 sm:gap-3">
                    <div className="availability-meter flex-1">
                      <div
                        className="availability-fill"
                        style={{ width: `${percentage}%`, background: level.color }}
                      />
                    </div>
                    <span className="w-9 text-right text-sm font-bold text-[#1f3127] sm:w-10">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="diagnosis-card p-4 sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#738072]">Diagnóstico visual</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#1f3127] sm:text-3xl">O sintoma aponta para qual nutriente?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#657268]">
              Escolha o que está vendo na planta. O painel destaca a deficiência nutricional mais provável.
            </p>
          </div>

          <label className="space-y-2 text-sm font-medium text-[#405046]">
            <span>Sintoma observado</span>
            <select
              value={selectedSymptomId}
              onChange={(event) => setSelectedSymptomId(event.target.value)}
              className="w-full rounded-2xl border border-[#d4dcc8] bg-[#f9fbf6] px-4 py-3 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
            >
              {symptoms.length === 0 ? <option value="">Nenhum sintoma cadastrado</option> : null}
              {symptoms.map((symptom) => (
                <option key={symptom.id} value={symptom.id}>
                  {symptom.descricao}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[240px_1fr]">
          <div className="diagnosis-result">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-100">Resultado</p>
            <p className="mt-3 text-4xl font-black">{likelyNutrient?.simbolo ?? "--"}</p>
            <p className="mt-2 text-lg font-semibold">{likelyNutrient ? likelyNutrient.nome : "Sem diagnóstico"}</p>
          </div>

          <div className="rounded-3xl bg-[#f8faf5] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">Leitura sugerida</p>
            <p className="mt-2 text-xl font-semibold text-[#1f3127]">
              {selectedSymptom ? selectedSymptom.descricao : "Selecione um sintoma"}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#536158]">
              {likelyNutrient?.sintomas_deficiencia ||
                "Quando houver dados completos no painel admin, este espaço mostra a explicação do sintoma e a relação com o nutriente."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SoilTextBlock({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="soil-chip">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#22342a]">{value || "Ainda não cadastrado."}</p>
    </div>
  );
}

function VisualMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f8faf5] px-3 py-4 text-center">
      <p className="text-2xl font-bold text-[#1f3127]">{value}</p>
      <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#738072]">{label}</p>
    </div>
  );
}

function ConditionLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="condition-line">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#758178] sm:text-xs sm:tracking-[0.16em]">{label}</p>
      <p className="mt-0.5 text-sm leading-5 text-[#22342a] sm:mt-1 sm:leading-6">{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="col-span-full rounded-[28px] border border-dashed border-[#d5ddcd] bg-white/80 p-8 text-center">
      <p className="text-sm font-medium text-[#526255]">{text}</p>
    </div>
  );
}

function getPhMarkerPosition(minPh: number, maxPh: number, selectedPh: number) {
  if (minPh === maxPh) {
    return 50;
  }

  return Math.min(100, Math.max(0, ((selectedPh - minPh) / (maxPh - minPh)) * 100));
}

function getAvailabilityLevel(percentage: number) {
  if (percentage >= 75) {
    return {
      bg: "#e4f2d4",
      color: "#5d7b1f",
      fg: "#3f5f18",
      label: "Alta",
    };
  }

  if (percentage >= 45) {
    return {
      bg: "#fff0cf",
      color: "#d89b3a",
      fg: "#7a5416",
      label: "Media",
    };
  }

  return {
    bg: "#f6dddd",
    color: "#c75846",
    fg: "#7a2a2a",
    label: "Baixa",
  };
}

function interpolateAvailability(
  availability: PhAvailabilityRow[],
  phPoints: PhPointRow[],
  nutrientId: number,
  selectedPh: number
) {
  const points = phPoints
    .map((point) => ({
      ph: point.ph_valor,
      value:
        availability.find((item) => item.ph_ponto_id === point.id && item.nutriente_id === nutrientId)
          ?.disponibilidade_pct ?? 0,
    }))
    .sort((a, b) => a.ph - b.ph);

  if (points.length === 0) {
    return 0;
  }

  const lower = [...points].reverse().find((point) => point.ph <= selectedPh) ?? points[0];
  const upper = points.find((point) => point.ph >= selectedPh) ?? points[points.length - 1];

  if (lower.ph === upper.ph) {
    return lower.value;
  }

  const ratio = (selectedPh - lower.ph) / (upper.ph - lower.ph);
  return lower.value + (upper.value - lower.value) * ratio;
}

function interpolatePhContext(phPoints: PhPointRow[], selectedPh: number) {
  const closestPoint =
    phPoints.reduce<PhPointRow | null>((closest, point) => {
      if (!closest) {
        return point;
      }

      return Math.abs(point.ph_valor - selectedPh) < Math.abs(closest.ph_valor - selectedPh) ? point : closest;
    }, null) ?? null;

  return {
    descricao_acidez: closestPoint?.descricao_acidez ?? "Sem descrição de acidez cadastrada.",
    atividade_biologica: closestPoint?.atividade_biologica ?? "Sem descrição de atividade biológica cadastrada.",
    presenca_aluminio: closestPoint?.presenca_aluminio ?? "Sem informação de alumínio cadastrada.",
  };
}
