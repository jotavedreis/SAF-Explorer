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

type NutrientInteractionRow = {
  id: number;
  source_nutrient_id: number;
  target_nutrient_id: number;
  relation_type: string;
  mechanism: string;
  description: string | null;
  source_nutrient?: NutrientRow;
  target_nutrient?: NutrientRow;
};

type SoilDashboardProps = {
  availability: PhAvailabilityRow[];
  nutrients: NutrientRow[];
  phPoints: PhPointRow[];
  symptoms: VisualSymptomRow[];
  interactions: NutrientInteractionRow[];
};

export function SoilDashboard({ availability, nutrients, phPoints, symptoms, interactions }: SoilDashboardProps) {
  const minPh = phPoints[0]?.ph_valor ?? 4.5;
  const maxPh = phPoints[phPoints.length - 1]?.ph_valor ?? 6;
  const [selectedPh, setSelectedPh] = useState(minPh);
  const [selectedSymptomId, setSelectedSymptomId] = useState(symptoms[0]?.id ? String(symptoms[0].id) : "");
  const [selectedInteractionSourceId, setSelectedInteractionSourceId] = useState(
    interactions[0]?.source_nutrient_id ? String(interactions[0].source_nutrient_id) : ""
  );

  const nutrientMap = useMemo(() => new Map(nutrients.map((nutrient) => [nutrient.id, nutrient])), [nutrients]);
  const selectedSymptom = symptoms.find((symptom) => String(symptom.id) === selectedSymptomId) ?? null;
  const likelyNutrient = selectedSymptom ? nutrientMap.get(selectedSymptom.nutriente_id) : null;
  const currentPhContext = interpolatePhContext(phPoints, selectedPh);
  const phMarkerPosition = getPhMarkerPosition(minPh, maxPh, selectedPh);
  const interactionSources = nutrients.filter((nutrient) =>
    interactions.some((interaction) => interaction.source_nutrient_id === nutrient.id)
  );
  const selectedInteractionSource = interactionSources.find(
    (nutrient) => String(nutrient.id) === selectedInteractionSourceId
  );
  const selectedInteractions = interactions.filter(
    (interaction) => interaction.source_nutrient_id === selectedInteractionSource?.id
  );

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
          <div className="theme-readable-surface grid grid-cols-3 items-stretch gap-2 bg-white/70 p-3">
            <VisualMetric label="Nutrientes" value={String(nutrients.length)} />
            <VisualMetric label="Pontos pH" value={String(phPoints.length)} />
            <VisualMetric label="Sintomas" value={String(symptoms.length)} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
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

      <EducationalCard />

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

        <div className="theme-readable-surface mt-3 bg-white/75 p-3 sm:mt-6 sm:p-4">
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
          <div className="theme-readable-surface condition-panel bg-[#f8faf5] p-3 sm:p-4">
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
                      className="availability-level-badge rounded-full px-3 py-1 text-xs font-bold"
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
                    <span className="availability-percent w-9 text-right text-sm font-bold text-[#1f3127] sm:w-10">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTCCard />

      <NutrientCycleCard />

      <NutrientInteractionsCard
        interactions={selectedInteractions}
        interactionSources={interactionSources}
        selectedSourceId={selectedInteractionSourceId}
        onSourceChange={setSelectedInteractionSourceId}
      />

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

          <div className="theme-readable-surface bg-[#f8faf5] p-4">
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

function NutrientInteractionsCard({
  interactionSources,
  interactions,
  onSourceChange,
  selectedSourceId,
}: {
  interactionSources: NutrientRow[];
  interactions: NutrientInteractionRow[];
  onSourceChange: (sourceId: string) => void;
  selectedSourceId: string;
}) {
  return (
    <section className="diagnosis-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#738072]">Antagonismo nutricional</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#1f3127] sm:text-3xl">Relações de competição e bloqueio</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#657268]">
            Selecione um nutriente em excesso para visualizar os nutrientes afetados e o mecanismo registrado.
          </p>
        </div>
        <label className="w-full space-y-2 text-sm font-medium text-[#405046] sm:max-w-xs">
          <span>Nutriente em excesso</span>
          <select
            value={selectedSourceId}
            onChange={(event) => onSourceChange(event.target.value)}
            disabled={interactionSources.length === 0}
            className="w-full rounded-2xl border border-[#d4dcc8] bg-[#f9fbf6] px-4 py-3 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {interactionSources.length === 0 ? <option value="">Nenhuma relação cadastrada</option> : null}
            {interactionSources.map((nutrient) => (
              <option key={nutrient.id} value={nutrient.id}>
                {nutrient.nome} ({nutrient.simbolo})
              </option>
            ))}
          </select>
        </label>
      </div>

      {interactions.length === 0 ? (
        <EmptyState text="Nenhuma relação nutricional cadastrada ainda." />
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {interactions.map((interaction) => (
            <article key={interaction.id} className="theme-readable-surface bg-[#f8faf5] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#738072]">Nutriente afetado</p>
                  <h3 className="mt-1 text-lg font-semibold text-[#1f3127]">
                    {interaction.target_nutrient?.nome ?? `Nutriente ${interaction.target_nutrient_id}`}
                    {interaction.target_nutrient?.simbolo ? ` (${interaction.target_nutrient.simbolo})` : ""}
                  </h3>
                </div>
                <span className="nutrient-interaction-badge rounded-full bg-[#e5efd4] px-3 py-1 text-xs font-semibold text-[#45601e]">
                  {interaction.relation_type}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-[#405046]">{interaction.mechanism}</p>
              {interaction.description ? <p className="mt-2 text-sm leading-7 text-[#536158]">{interaction.description}</p> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function EducationalCard() {
  return (
    <section className="educational-banner p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-3 sm:mb-4 text-center">
          <h2 className="text-lg sm:text-2xl font-bold text-[#1f3127]">
            Presença ≠ Disponibilidade ≠ Absorção
          </h2>
          <p className="mt-1 text-sm sm:text-base text-[#657268]">
            Etapas químicas e biológicas envolvidas na disponibilidade e absorção de nutrientes no sistema solo-planta.
          </p>
        </div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          <div className="educational-column theme-readable-surface bg-[#f8faf5] p-3 sm:p-4 rounded-2xl border border-[#d4dcc8]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5d7b1f] mb-2">PRESENÇA</p>
            <h3 className="text-base sm:text-lg font-bold text-[#1f3127] mb-2">No solo</h3>
            <p className="text-sm leading-6 text-[#22342a]">
              O elemento está presente no solo, associado às frações mineral ou orgânica. Para que possa ser aproveitado pelas plantas, é necessário que passe por processos que favoreçam sua disponibilização.
            </p>
          </div>
          <div className="educational-column theme-readable-surface bg-[#f8faf5] p-3 sm:p-4 rounded-2xl border border-[#d4dcc8]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5d7b1f] mb-2">DISPONIBILIDADE</p>
            <h3 className="text-base sm:text-lg font-bold text-[#1f3127] mb-2">No solo e na solução</h3>
            <p className="text-sm leading-6 text-[#22342a]">
              O nutriente está em uma forma que pode ser acessada pelas raízes. Fatores como pH, capacidade de troca catiônica (CTC), matéria orgânica e interações entre nutrientes influenciam sua disponibilidade.
            </p>
          </div>
          <div className="educational-column theme-readable-surface bg-[#f8faf5] p-3 sm:p-4 rounded-2xl border border-[#d4dcc8]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5d7b1f] mb-2">ABSORÇÃO</p>
            <h3 className="text-base sm:text-lg font-bold text-[#1f3127] mb-2">Na planta</h3>
            <p className="text-sm leading-6 text-[#22342a]">
              O nutriente disponível pode ser absorvido pelo sistema radicular e, posteriormente, transportado e utilizado pela planta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTCCard() {
  return (
    <section className="ctc-card p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1f3127]">
            Capacidade de Troca Catiônica (CTC)
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#657268]">
            O reservatório de nutrientes do solo.
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="ctc-section theme-readable-surface bg-[#f8faf5] p-4 rounded-2xl border border-[#d4dcc8]">
            <h3 className="text-lg font-bold text-[#1f3127] mb-3">
              O que é a CTC?
            </h3>
            <p className="text-sm leading-6 text-[#22342a]">
              É a capacidade do solo de reter e trocar íons de carga positiva, chamados cátions. A argila e a matéria orgânica possuem sítios de troca que podem reter nutrientes como Potássio (K⁺), Cálcio (Ca²⁺) e Magnésio (Mg²⁺), contribuindo para sua permanência no solo e reduzindo perdas por lixiviação (perda de nutrientes pela água).
            </p>
          </div>
          <div className="ctc-section theme-readable-surface bg-[#f8faf5] p-4 rounded-2xl border border-[#d4dcc8]">
            <h3 className="text-lg font-bold text-[#1f3127] mb-3">
              O que influencia a CTC?
            </h3>
            <p className="text-sm leading-6 text-[#22342a]">
              A CTC está relacionada principalmente à quantidade e ao tipo de argila, ao teor de matéria orgânica e, em alguns solos, ao pH. Solos com maior quantidade de argila de alta atividade e matéria orgânica tendem a apresentar maior capacidade de retenção e troca de cátions.
            </p>
          </div>
          <div className="ctc-section theme-readable-surface bg-[#f8faf5] p-4 rounded-2xl border border-[#d4dcc8]">
            <h3 className="text-lg font-bold text-[#1f3127] mb-3">
              Qual a relação com a acidez?
            </h3>
            <p className="text-sm leading-6 text-[#22342a]">
              Em solos muito ácidos, o aumento da presença de H⁺ e Al³⁺ nos sítios de troca altera o equilíbrio entre os cátions do solo. A acidez elevada também pode aumentar a presença de alumínio em formas tóxicas para as plantas, prejudicando o desenvolvimento das raízes e a absorção de nutrientes.
            </p>
          </div>
          <div className="ctc-section theme-readable-surface bg-[#f8faf5] p-4 rounded-2xl border border-[#d4dcc8]">
            <h3 className="text-lg font-bold text-[#1f3127] mb-3">
              Por que isso é importante para as plantas?
            </h3>
            <p className="text-sm leading-6 text-[#22342a]">
              Uma CTC mais elevada pode contribuir para a retenção de cátions nutrientes no solo e para sua disponibilidade às plantas. Porém, CTC alta não significa, por si só, que todos os nutrientes estarão disponíveis, pois a disponibilidade também depende de fatores como pH, umidade, forma química do nutriente e interações entre os elementos.
            </p>
          </div>
          <div className="ctc-section theme-readable-surface bg-[#f8faf5] p-4 rounded-2xl border border-[#d4dcc8] md:col-span-2">
            <h3 className="text-lg font-bold text-[#1f3127] mb-3">
              Como aumentar a CTC?
            </h3>
            <p className="text-sm leading-6 text-[#22342a]">
              O aumento da matéria orgânica pode contribuir para elevar a capacidade de retenção e troca de cátions do solo. Práticas como adubação verde, manutenção de resíduos vegetais, cobertura do solo e uso adequado de compostos orgânicos favorecem a conservação e o aumento da matéria orgânica, especialmente em solos tropicais.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const CYCLE_STEPS: { number: string; title: string; description: string; icon: string }[] = [
  {
    number: "1",
    icon: "🌿",
    title: "Aporte de Biomassa",
    description: "Folhas, galhos, raízes e resíduos orgânicos depositam-se sobre o solo, servindo de alimento e proteção para a vida do solo.",
  },
  {
    number: "2",
    icon: "🐛",
    title: "Decomposição",
    description: "Insetos, minhocas e fungos fragmentam a matéria orgânica bruta, reduzindo seu tamanho e iniciando a quebra das moléculas complexas.",
  },
  {
    number: "3",
    icon: "🦠",
    title: "Mineralização",
    description: "As bactérias convertem nutrientes presentes na matéria orgânica em formas minerais, que podem passar para a solução do solo e ficar disponíveis para as plantas.",
  },
  {
    number: "4",
    icon: "⚗️",
    title: "Nitrificação",
    description: "Bactérias especializadas, incluindo grupos como Nitrosomonas e Nitrobacter, participam da transformação de compostos nitrogenados, levando à formação de nitrito e posteriormente nitrato.",
  },
  {
    number: "5",
    icon: "🌱",
    title: "Absorção e Nova Biomassa",
    description: "As raízes absorvem nutrientes presentes na solução do solo e os incorporam à planta, contribuindo para a formação de nova biomassa e a continuidade do ciclo.",
  },
];

function NutrientCycleCard() {
  return (
    <section className="nutrient-cycle p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--theme-ink)]">
            Ciclagem de Nutrientes e Transformações Biológicas
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[var(--theme-muted)]">
            Como os microrganismos convertem a biomassa vegetal em nutrientes disponíveis para as raízes.
          </p>
        </div>

        {/* Desktop: fluxo horizontal com setas entre cards */}
        <div className="hidden md:flex items-stretch gap-0">
          {CYCLE_STEPS.map((step, i) => (
            <div key={step.number} className="flex items-stretch flex-1 min-w-0">
              <div className="cycle-step h-full flex-1 flex flex-col items-center p-4 rounded-2xl border border-[var(--theme-line)]">
                <div className="cycle-step-icon w-11 h-11 rounded-full flex items-center justify-center text-xl mb-3 flex-shrink-0">
                  {step.icon}
                </div>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#3f5f18] text-white font-bold text-xs mb-3 flex-shrink-0">
                  {step.number}
                </span>
                <h3 className="text-sm font-bold text-[var(--theme-ink)] mb-2 text-center leading-snug">{step.title}</h3>
                <p className="text-xs leading-5 text-[var(--theme-muted)] text-center flex-1">{step.description}</p>
              </div>
              {i < CYCLE_STEPS.length - 1 && (
                <div className="flex items-center flex-shrink-0">
                  <svg
                    aria-hidden="true"
                    className="cycle-arrow mx-1"
                    width="18" height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: fluxo vertical com seta apontando para baixo */}
        <div className="md:hidden flex flex-col gap-0">
          {CYCLE_STEPS.map((step, i) => (
            <div key={step.number} className="flex flex-col items-stretch">
              <div className="cycle-step flex flex-row items-start gap-4 p-4 rounded-2xl border border-[var(--theme-line)]">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="cycle-step-icon w-11 h-11 rounded-full flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#3f5f18] text-white font-bold text-xs">
                    {step.number}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[var(--theme-ink)] mb-1 leading-snug">{step.title}</h3>
                  <p className="text-sm leading-6 text-[var(--theme-muted)]">{step.description}</p>
                </div>
              </div>
              {i < CYCLE_STEPS.length - 1 && (
                <div className="flex justify-center py-1">
                  <svg
                    aria-hidden="true"
                    className="cycle-arrow"
                    width="18" height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 4v10M5 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SoilTextBlock({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="soil-chip">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#22342a] text-justify">{value || "Ainda não cadastrado."}</p>
    </div>
  );
}

function VisualMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="theme-readable-surface flex min-h-24 min-w-0 flex-col items-center justify-center bg-[#f8faf5] px-2 py-3 text-center sm:px-3 sm:py-4">
      <p className="text-2xl font-bold leading-none text-[#1f3127]">{value}</p>
      <p className="mt-2 text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.12em] text-[#738072] sm:text-[0.65rem] sm:tracking-[0.16em]">{label}</p>
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
    <div className="theme-readable-surface col-span-full border border-dashed border-[#d5ddcd] bg-white/80 p-8 text-center">
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
