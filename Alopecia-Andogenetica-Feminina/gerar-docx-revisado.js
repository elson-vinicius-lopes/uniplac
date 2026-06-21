/* Gerador do Word REVISADO — Estudo de Caso AAF x H. pylori (protocolo PHD)
 * Fonte da verdade: par em "resultados finais". Protocolo: microcorrentes + Mescla PHD.
 * Correções: sem PDRN/dutasterida; citações (AUTOR, ano); seção-ponte da conexão;
 * ancorado à paciente Salete (B12/Vit D); ABNT (Times 12, 1,5, margens 3/3/2/2 cm).
 */
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableRow, TableCell, WidthType,
  ShadingType, PageBreak, convertInchesToTwip
} = require("docx");
const fs = require("fs");
const path = require("path");

const FONT = "Times New Roman";
const SZ = 24;        // 12pt
const SZ_SMALL = 20;  // 10pt
const LINE = 360;     // 1,5

function p(text, o = {}) {
  const runs = [];
  if (typeof text === "string") {
    runs.push(new TextRun({ text, font: FONT, size: o.size || SZ, bold: o.bold, italics: o.italics }));
  } else {
    text.forEach(t => runs.push(typeof t === "string"
      ? new TextRun({ text: t, font: FONT, size: o.size || SZ })
      : new TextRun({ text: t.text, font: FONT, size: t.size || o.size || SZ, bold: t.bold, italics: t.italics })));
  }
  return new Paragraph({
    children: runs,
    spacing: { line: o.line || LINE, after: o.after != null ? o.after : 120 },
    alignment: o.alignment || AlignmentType.JUSTIFIED,
    indent: o.firstLine ? { firstLine: convertInchesToTwip(0.5) } : o.indent,
    heading: o.heading,
  });
}
function h(text, level) {
  const sz = level === 1 ? 26 : 24;
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: sz, bold: true })],
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120, line: LINE },
    alignment: AlignmentType.LEFT,
  });
}
function blank() { return new Paragraph({ children: [new TextRun({ text: "", font: FONT, size: SZ })], spacing: { line: LINE } }); }
function center(text, o = {}) { return p(text, { ...o, alignment: AlignmentType.CENTER }); }
function cell(t, bold, shade) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: t, font: FONT, size: SZ_SMALL, bold })], alignment: AlignmentType.LEFT })],
    shading: shade ? { type: ShadingType.SOLID, color: shade } : undefined,
    width: { size: 50, type: WidthType.PERCENTAGE },
  });
}
function ref(num, txt) {
  return new Paragraph({
    children: [new TextRun({ text: `${num}. ${txt}`, font: FONT, size: SZ_SMALL })],
    spacing: { line: 240, after: 120 },
    alignment: AlignmentType.LEFT,
    indent: { left: convertInchesToTwip(0.0), hanging: convertInchesToTwip(0.0) },
  });
}

async function main() {
  const c = [];

  // ===================== FOLHA DE ROSTO =====================
  c.push(blank(), blank());
  c.push(center("UNIVERSIDADE DO PLANALTO CATARINENSE", { bold: true, size: 28 }));
  c.push(center("Tecnologia em Estética e Cosmetologia (PAR059/22) — 5ª Fase — Turma 2026/01", { size: 22 }));
  c.push(blank(), blank(), blank(), blank());
  c.push(center("PAOLA BORTOLI PINHEIRO LOPES", { bold: true, size: 26 }));
  c.push(blank(), blank(), blank());
  c.push(center([
    { text: "ALOPECIA ANDROGENÉTICA FEMININA E INFECÇÃO POR ", bold: true, size: 28 },
    { text: "HELICOBACTER PYLORI", bold: true, italics: true, size: 28 },
    { text: ": LIMITES DA ATUAÇÃO ESTÉTICA E A NECESSIDADE DO CUIDADO INTEGRATIVO — UM ESTUDO DE CASO", bold: true, size: 28 },
  ]));
  c.push(blank(), blank(), blank(), blank());
  c.push(center("Pré-projeto de pesquisa (estudo de caso) apresentado à disciplina de Seminários I, do curso de Tecnologia em Estética e Cosmetologia da UNIPLAC.", { size: 22, alignment: AlignmentType.CENTER }));
  c.push(center("Orientadoras: Profª. Marcia de Liz e Profª. Mariana Macedo Justi.", { size: 22 }));
  c.push(blank(), blank(), blank(), blank(), blank());
  c.push(center("LAGES — SC", { bold: true, size: 22 }));
  c.push(center("2026", { bold: true, size: 22 }));
  c.push(new Paragraph({ children: [new PageBreak()] }));

  // ===================== RESUMO =====================
  c.push(h("RESUMO", 1));
  c.push(p([
    { text: "A alopecia androgenética feminina (AAF) é classicamente atribuída a fatores genéticos e hormonais, centrados na ação da di-hidrotestosterona (DHT) sobre folículos geneticamente predispostos. Entretanto, a literatura contemporânea demonstra que fatores sistêmicos — como a infecção por " },
    { text: "Helicobacter pylori", italics: true },
    { text: ", a disbiose intestinal, a má absorção de micronutrientes e o estresse oxidativo de origem emocional — podem acelerar a progressão dessa condição. O presente estudo de caso apresenta uma paciente de 60 anos que, com predisposição à AAF, teve progressão acelerada do quadro após três perdas emocionais consecutivas, associadas a gastrite crônica por " },
    { text: "H. pylori", italics: true },
    { text: " e deficiência de vitamina B12 e vitamina D. Propõe-se uma abordagem estética integrativa, conduzida em paralelo ao tratamento médico, com microcorrentes e intradermoterapia (Mescla PHD), discutindo-se os limites da atuação estética e a necessidade do cuidado integral e do encaminhamento médico." },
  ]));
  c.push(p([{ text: "Palavras-chave: ", bold: true }, { text: "Alopecia androgenética feminina; " }, { text: "Helicobacter pylori", italics: true }, { text: "; microbiota intestinal; estresse oxidativo; microcorrentes; intradermoterapia capilar; cuidado integrativo." }]));
  c.push(new Paragraph({ children: [new PageBreak()] }));

  // ===================== 1 TEMA =====================
  c.push(h("1 TEMA", 1));
  c.push(p([
    { text: "Alopecia androgenética feminina e infecção por " },
    { text: "Helicobacter pylori", italics: true },
    { text: ": limites da atuação estética e a necessidade do cuidado integrativo — um estudo de caso." },
  ]));

  // ===================== 2 PERGUNTA =====================
  c.push(h("2 PERGUNTA DA PESQUISA", 1));
  c.push(p([
    { text: "De que maneira a infecção por " },
    { text: "Helicobacter pylori", italics: true },
    { text: " — mediante disbiose intestinal, inflamação sistêmica e má absorção de micronutrientes — atua como fator acelerador da alopecia androgenética feminina, e de que forma a compreensão desse elo fisiopatológico orienta a conduta estética integrativa e o encaminhamento médico?" },
  ]));

  // ===================== 3 PROBLEMÁTICA =====================
  c.push(h("3 PROBLEMÁTICA DA PESQUISA", 1));
  c.push(p([
    { text: "Em uma paciente de 60 anos com alopecia androgenética feminina e infecção ativa por " },
    { text: "Helicobacter pylori", italics: true },
    { text: ", de que modo a cadeia gastrointestinal — gastrite crônica, má absorção de vitamina B12, ferro e zinco e consequente estresse oxidativo — concorre para a aceleração da miniaturização folicular, tornando o tratamento estético isolado insuficiente sem a resolução concomitante da causa sistêmica?" },
  ]));

  // ===================== 4 OBJETIVOS =====================
  c.push(h("4 OBJETIVOS", 1));
  c.push(h("4.1 Objetivo geral", 2));
  c.push(p([
    { text: "Compreender e tratar a alopecia androgenética feminina como desfecho de uma cadeia sistêmica agravada pela infecção por " },
    { text: "Helicobacter pylori", italics: true },
    { text: ", mediante a proposição de um protocolo estético integrativo — microcorrentes associadas à intradermoterapia com Mescla PHD —, conduzido em paralelo ao tratamento médico, com vistas a conter a miniaturização e a elevar a densidade capilar." },
  ]));
  c.push(h("4.2 Objetivos específicos", 2));
  c.push(p("a) Demonstrar que a alopecia androgenética feminina transcende os fatores genéticos e hormonais, sofrendo influência de fatores sistêmicos, nutricionais e inflamatórios;", { firstLine: true }));
  c.push(p([
    { text: "b) Explicitar o elo fisiopatológico entre a infecção por " },
    { text: "Helicobacter pylori", italics: true },
    { text: ", a má absorção de micronutrientes e o estresse oxidativo na aceleração da miniaturização folicular, distinguindo-o da alopecia areata;" },
  ], { firstLine: true }));
  c.push(p("c) Propor e justificar um protocolo estético — microcorrentes e intradermoterapia com Mescla PHD — capaz de contornar a má absorção, conduzido em paralelo à erradicação da infecção;", { firstLine: true }));
  c.push(p("d) Reconhecer os limites da atuação estética e a importância do encaminhamento médico e do cuidado interdisciplinar.", { firstLine: true }));

  // ===================== 5 MÉTODO =====================
  c.push(h("5 MÉTODO", 1));
  c.push(p([
    { text: "Trata-se de pesquisa de abordagem ", },
    { text: "qualitativa", bold: true },
    { text: ", do tipo ", },
    { text: "estudo de caso", bold: true },
    { text: " descritivo, tendo como amostra uma única paciente do sexo feminino, na faixa etária de 60 anos, que apresenta fatores interferentes (infecção por " },
    { text: "H. pylori", italics: true },
    { text: " e deficiências nutricionais) para o tratamento da alopecia androgenética feminina." },
  ]));
  c.push(p("O referencial teórico foi construído a partir de buscas em bases científicas (PubMed, SciELO) e em periódicos de dermatologia e estética. A coleta de dados de aplicabilidade utiliza ficha de anamnese (Anexo I), registro fotográfico padronizado para acompanhamento da evolução e avaliação por tricoscopia com fotovideodermatoscópio da clínica-escola da UNIPLAC."));
  c.push(p([
    { text: "O protocolo prevê atuação ", },
    { text: "concomitante ao tratamento médico", bold: true },
    { text: ": o encaminhamento e a conduta médica para erradicação da " },
    { text: "H. pylori", italics: true },
    { text: " (terapia tríplice/quádrupla a critério do gastroenterologista) e a reposição de micronutrientes (vitamina B12 e vitamina D, conforme exames) precedem e acompanham a intervenção estética local, descrita na seção 7.9." },
  ]));
  c.push(p([
    { text: "Aspectos éticos: ", bold: true },
    { text: "este trabalho seguirá os princípios éticos da pesquisa com seres humanos conforme a Resolução 466/12 do CNS, com aprovação prévia pelo Comitê de Ética em Pesquisa (CEP) da UNIPLAC sob o número de aprovação 6.603.39, e a paciente modelo assinará um Termo de Consentimento Livre e Esclarecido (TCLE)." },
  ]));

  // ===================== 6 INTRODUÇÃO =====================
  c.push(h("6 INTRODUÇÃO", 1));
  c.push(p("A alopecia androgenética feminina (AAF) é uma das principais causas de perda capilar progressiva em mulheres, podendo afetar até 50% delas ao longo da vida. Sua patogênese envolve a miniaturização dos fios, com afinamento progressivo e aumento do espaçamento, frequentemente acompanhada de sinais inflamatórios no couro cabeludo (eritema, oleosidade e pontos amarelos, pretos ou brancos). O diagnóstico apoia-se na tricoscopia, exame indolor e não invasivo realizado com fotovideodermatoscópio. As alterações decorrem, em indivíduos predispostos, da conversão de testosterona em di-hidrotestosterona (DHT) pela enzima 5-alfa-redutase."));
  c.push(p([
    { text: "Neste estudo de caso, apresenta-se uma paciente de 60 anos que, apesar da predisposição genética, apresentou progressão acelerada do quadro após três perdas emocionais consecutivas. O luto desencadeou estresse psicológico e a ativação do eixo hipotálamo-hipófise-adrenal (HPA), que alterou a microbiota intestinal e favoreceu o desenvolvimento de gastrite crônica por " },
    { text: "Helicobacter pylori", italics: true },
    { text: ", com consequente deficiência de micronutrientes (vitamina B12 e vitamina D). A condição gastrointestinal foi previamente avaliada por especialista e diagnosticada por exames laboratoriais e endoscopia, cujos laudos integram os anexos." },
  ]));
  c.push(p([
    { text: "A paciente já havia realizado, em 2025, tratamento capilar na unidade acadêmica da UNIPLAC (aromaterapia, óleos essenciais, argiloterapia e alta frequência), mantendo em casa o uso de tônico com ativo fitoterápico (Capilia Longa, derivado da cúrcuma). Para a " },
    { text: "H. pylori", italics: true },
    { text: ", fez uso de antibioticoterapia e reposição de vitaminas B12 e D. A proposta atual associa microcorrentes — para oxigenação e hidratação do couro cabeludo — e intradermoterapia com Mescla PHD, voltada à alopecia androgenética." },
  ]));

  // ===================== 7 REVISÃO DE LITERATURA =====================
  c.push(h("7 REVISÃO DE LITERATURA", 1));

  c.push(h("7.1 Alopecia androgenética feminina: além da genética e dos hormônios", 2));
  c.push(p("Embora a predisposição genética e a ação androgênica permaneçam pilares etiológicos, o ambiente bioquímico e inflamatório do organismo modula a expressão clínica da doença. Prie et al. (2016) demonstraram que pacientes com alopecia androgenética apresentam atividade antioxidante total plasmática significativamente reduzida (p<0,001), níveis elevados de malondialdeído (marcador de peroxidação lipídica; p<0,001) e atividade da superóxido dismutase (SOD) eritrocitária diminuída (p<0,01), indicando que o estresse oxidativo é fator ativo na miniaturização folicular."));
  c.push(p("Evidências recentes mostram que pacientes com alopecia androgenética apresentam níveis de estresse percebido superiores aos controles, além de mais sintomas de ansiedade e depressão (FRONTIERS IN PSYCHIATRY, 2025). Wang et al. (2024) demonstraram que o estresse psicológico impacta os níveis de fatores neurotróficos nesses pacientes, correlacionando-se com a progressão da doença."));

  c.push(h("7.2 O papel do Helicobacter pylori na queda capilar", 2));
  c.push(p([
    { text: "O " },
    { text: "Helicobacter pylori", italics: true },
    { text: " é uma bactéria gram-negativa que coloniza a mucosa gástrica de cerca de metade da população mundial, associada a gastrite crônica e úlcera péptica e, criticamente para este estudo, à má absorção de micronutrientes essenciais à saúde capilar. Uma das vias mais documentadas é a anemia ferropriva: meta-análise demonstrou correlação significativa entre " },
    { text: "H. pylori", italics: true },
    { text: " e deficiência de ferro, sendo a erradicação combinada à suplementação mais eficaz que a suplementação isolada (DOES HELICOBACTER PYLORI..., 2010; FRONTIERS IN MICROBIOLOGY, 2025)." },
  ]));
  c.push(p([
    { text: "A bactéria também prejudica a produção de fator intrínseco e pode desencadear anemia perniciosa, comprometendo a absorção de vitamina B12 (HELICOBACTER PYLORI ASSOCIATED VITAMIN B12..., 2013; MICRONUTRIENT DEFICIENCIES..., 2017). A deficiência de ferro é, por sua vez, fator de risco independente para a queda capilar feminina: meta-análise de 36 estudos evidenciou ferritina significativamente menor em mulheres com alopecia não-cicatricial (IRON DEFICIENCY..., 2022; KANTOR et al., 2003)." },
  ]));

  c.push(h("7.3 Eixo intestino-cérebro: a microbiota como mediadora do estresse", 2));
  c.push(p("A comunicação bidirecional entre o sistema nervoso central e o entérico — o eixo intestino-cérebro — é mediada pelo nervo vago, pelo eixo HPA e pelo sistema nervoso autônomo. O estresse psicológico, como o luto por perdas consecutivas, ativa esse eixo e altera a composição da microbiota (CARABOTTI et al., 2015). Madison e Kiecolt-Glaser (2024) demonstraram que o estresse reduz a diversidade bacteriana e compromete a barreira intestinal, permitindo a translocação de lipopolissacarídeos (LPS) e desencadeando resposta inflamatória sistêmica. Li et al. (2020) associaram o estresse psicológico a defeitos nas barreiras intestinal e hematoencefálica, mediados pela microbiota."));

  c.push(h("7.4 Disbiose intestinal e alopecia", 2));
  c.push(p("A disbiose foi documentada em pacientes com alopecia areata, com perda de riqueza microbiana e diminuição da diversidade taxonômica, podendo desestabilizar a tolerância imunológica e afetar as células T reguladoras (LU et al., 2023; BIOMEDICINES, 2025; PINTO et al., 2019). Esses achados, embora descritos sobretudo na areata, reforçam o papel do ambiente intestinal e inflamatório na biologia do folículo."));

  c.push(h("7.5 Estresse, neuropeptídeos e biologia do folículo capilar", 2));
  c.push(p("Peters et al. (2001, 2006, 2007) descreveram um eixo cérebro-folículo capilar, pelo qual o estresse psicológico impacta diretamente o crescimento. A substância P — neuropeptídeo liberado no estresse — inibe a proliferação de queratinócitos, aumenta a apoptose em folículos telógenos e promove morfologia catágena, prolongando a fase telógena e atrasando a entrada na anágena."));

  c.push(h("7.6 Deficiências nutricionais e saúde capilar", 2));
  c.push(p("Guo e Katta (2017) revisaram a relação entre dieta, deficiência de nutrientes e queda capilar, abordando eflúvio telógeno, alopecia androgenética e padrão feminino de perda capilar. Entre os nutrientes avaliados estão ferro, zinco, niacina, selênio e vitaminas A, D e E — vários deles diretamente afetados pela má absorção associada à H. pylori."));

  // ---- A PONTE (seção-chave da conexão) ----
  c.push(h("7.7 A ponte: por que o H. pylori afeta a alopecia ANDROGENÉTICA", 2));
  c.push(p([
    { text: "É necessário distinguir os tipos de alopecia. Grande parte da evidência que associa " },
    { text: "diretamente", italics: true },
    { text: " o " },
    { text: "H. pylori", italics: true },
    { text: " à queda capilar refere-se à alopecia AREATA, de natureza autoimune (EXTRAGASTRIC INFECTION..., 2022; CURE OF ALOPECIA AREATA..., 2011; ASSOCIATION BETWEEN..., 2017). Na alopecia ANDROGENÉTICA, a ligação é " },
    { text: "indireta", bold: true },
    { text: ", mediada por mecanismos compartilhados e bem documentados, e é esse o eixo deste trabalho." },
  ]));
  c.push(p([
    { text: "Primeiro, a infecção causa má absorção de ferro, vitamina B12 e zinco, e a deficiência desses micronutrientes — sobretudo a ferritina baixa — associa-se à queda capilar feminina (IRON DEFICIENCY..., 2022; KANTOR et al., 2003). Segundo, a inflamação crônica e a queda das defesas antioxidantes intensificam o estresse oxidativo, demonstradamente elevado na alopecia androgenética (PRIE et al., 2016), acelerando a miniaturização. Portanto, o " },
    { text: "H. pylori", italics: true },
    { text: " não é causa da AAF, mas um fator agravante e acelerador." },
  ]));
  c.push(p([
    { text: "Aplicando ao caso: ", bold: true },
    { text: "os exames da paciente documentaram deficiência de vitamina B12 e vitamina D. A ponte mais direta, para ela, é a má absorção de B12 secundária à gastrite por " },
    { text: "H. pylori", italics: true },
    { text: " (HELICOBACTER PYLORI ASSOCIATED VITAMIN B12..., 2013; MICRONUTRIENT DEFICIENCIES..., 2017), somada ao estresse oxidativo do luto — o que explica por que o tratamento estético isolado tende a falhar sem a resolução da causa gastrointestinal." },
  ]));

  // ---- Apresentação da paciente + cadeia ----
  c.push(h("7.8 Apresentação da paciente e cadeia fisiopatológica do caso", 2));
  c.push(p("Paciente do sexo feminino, 60 anos, com diagnóstico de alopecia androgenética feminina de progressão acelerada e predisposição genética, cujo quadro progrediu de forma incomumente rápida após três perdas emocionais consecutivas. O sofrimento psicológico crônico resultou em: (1) ativação do eixo HPA, com cortisol elevado; (2) disbiose intestinal; (3) gastrite por H. pylori; (4) má absorção de micronutrientes (B12 e vitamina D); (5) intensificação do estresse oxidativo; e (6) aceleração da miniaturização folicular."));
  c.push(blank());
  c.push(center("Figura 1 — Cadeia fisiopatológica proposta para o caso", { bold: true, size: SZ_SMALL, after: 60 }));
  c.push(center([{ text: "PERDAS EMOCIONAIS → ESTRESSE CRÔNICO (eixo HPA ↑cortisol + Substância P) → DISBIOSE INTESTINAL (“leaky gut”) → GASTRITE POR H. PYLORI → MÁ ABSORÇÃO (B12, ferro, zinco) → ESTRESSE OXIDATIVO (↓SOD, ↑ROS) → MINIATURIZAÇÃO FOLICULAR ACELERADA → ALOPECIA ANDROGENÉTICA DE PROGRESSÃO RÁPIDA", bold: true, size: SZ_SMALL }], { after: 60 }));
  c.push(center("Fonte: elaborado pela autora (2026).", { size: SZ_SMALL, italics: true }));

  // ---- Proposta terapêutica ----
  c.push(h("7.9 Proposta terapêutica estética", 2));
  c.push(p([
    { text: "Microcorrentes. ", bold: true },
    { text: "São correntes elétricas de baixíssima intensidade que atuam no nível celular, estimulando a síntese de ATP, a oxigenação tecidual e a microcirculação. Estudo publicado no " },
    { text: "International Journal of Molecular Sciences", italics: true },
    { text: " demonstrou que a estimulação por microcorrentes promove o crescimento capilar em células de papila dérmica humana e em modelo animal, via ativação das vias Wnt/β-catenina e PI3K/AKT/mTOR e aumento de fatores de crescimento (Kim et al., 2021). No couro cabeludo, favorecem a reativação da papila dérmica, a neoangiogênese e a transição telógena → anágena, combatendo a depleção energética causada pelo estresse oxidativo." },
  ]));
  c.push(p([
    { text: "Intradermoterapia (Mescla PHD). ", bold: true },
    { text: "Consiste em microinjeções de ativos diretamente no couro cabeludo, suprindo o folículo localmente e " },
    { text: "contornando a má absorção gastrointestinal", bold: true },
    { text: " causada pela H. pylori. A evidência de eficácia da mesoterapia/intradermoterapia capilar com minoxidil injetável é favorável quando comparada à via tópica (COMPARATIVE STUDY..., 2010; COMPARING THE EFFICACY..., 2019). A mescla utilizada contém:" },
  ]));
  const phd = [
    ["Minoxidil 8 mg", "estimula a circulação no couro cabeludo, prolonga a fase anágena e aumenta a densidade."],
    ["Nanofatores de Crescimento Capilar 1%", "atuam na sinalização celular do folículo, auxiliando regeneração e crescimento."],
    ["Latanoprosta 50 mcg", "estimula o crescimento e pode favorecer o aumento da espessura dos fios."],
    ["Pill Food (aminoácidos e vitaminas)", "L-Metionina, L-Taurina, L-Prolina, Biotina, D-Pantenol, vitaminas B2/B3/B6 e L-Carnitina — nutrição do folículo e formação da fibra capilar."],
    ["Lidocaína 20 mg", "anestésico local para reduzir o desconforto da aplicação."],
  ];
  phd.forEach(([k, v]) => c.push(p([{ text: `• ${k}: `, bold: true }, { text: v }], { indent: { left: convertInchesToTwip(0.3) } })));
  c.push(p([
    { text: "Homecare. ", bold: true },
    { text: "Em casa, a paciente mantém o tônico Capilia Longa (derivado da cúrcuma), que inibe a enzima responsável pela conversão de testosterona em DHT, principal envolvida na miniaturização — sustentando, entre as sessões, o trabalho feito em cabine." },
  ]));

  // ===================== 8 DISCUSSÃO =====================
  c.push(h("8 DISCUSSÃO", 1));
  c.push(p([
    { text: "O caso demonstra que a AAF não pode ser compreendida apenas sob a óptica genético-hormonal. A paciente tinha predisposição, mas foi o encadeamento de fatores sistêmicos — estresse emocional, disbiose, infecção por " },
    { text: "H. pylori", italics: true },
    { text: " e deficiências nutricionais — que acelerou a miniaturização. Confirma-se a literatura: o estresse altera a microbiota (CARABOTTI et al., 2015; MADISON; KIECOLT-GLASER, 2024; LI et al., 2020) e libera neuropeptídeos que agridem o folículo (PETERS et al., 2001, 2006, 2007); a " },
    { text: "H. pylori", italics: true },
    { text: " compromete a absorção de nutrientes-chave (B12, ferro, zinco); e o estresse oxidativo resultante acelera a miniaturização (PRIE et al., 2016)." },
  ]));
  c.push(p("Sob a ótica da prática estética, o caso evidencia tanto a potência quanto os limites da intervenção: microcorrentes e intradermoterapia (Mescla PHD) atuam de forma fundamentada sobre o folículo, mas seriam insuficientes sem a erradicação da H. pylori e a reposição nutricional conduzidas pela equipe médica. Daí a centralidade do cuidado integrativo e do encaminhamento — competência essencial da profissional de estética."));

  // ===================== 9 CONCLUSÃO =====================
  c.push(h("9 CONCLUSÃO", 1));
  c.push(p([
    { text: "Este estudo reforça a necessidade de um olhar holístico sobre a alopecia androgenética feminina. A paciente desenvolveu progressão acelerada não por uma genética “mais agressiva”, mas por uma cadeia de fatores sistêmicos — luto → disbiose → gastrite por " },
    { text: "H. pylori", italics: true },
    { text: " → deficiências nutricionais → estresse oxidativo — que potencializou a predisposição. A proposta estética (microcorrentes e intradermoterapia com Mescla PHD), aliada ao tratamento médico das causas sistêmicas, oferece abordagem abrangente e fundamentada." },
  ]));
  c.push(center([{ text: "A alopecia androgenética feminina exige olhar integrativo. Tratar apenas o couro cabeludo, sem tratar o organismo como um todo, é tratar o sintoma sem abordar a causa.", bold: true, italics: true }]));

  // ===================== 10 REFERÊNCIAS =====================
  c.push(new Paragraph({ children: [new PageBreak()] }));
  c.push(h("10 REFERÊNCIAS", 1));
  const refs = [
    "PRIE, B. E.; IOSIF, L.; TIVIG, I.; STOIAN, I.; GIURCANEANU, C. Oxidative stress in androgenetic alopecia. Journal of Medicine and Life, v. 9, n. 1, p. 79-83, 2016. Disponível em: https://pubmed.ncbi.nlm.nih.gov/27974920/. Acesso em: 30 mar. 2026.",
    "WANG, X. et al. Psychological stress impact neurotrophic factor levels in patients with androgenetic alopecia and correlated with disease progression. World Journal of Psychiatry, v. 14, n. 10, p. 1437, 2024. Disponível em: https://www.wjgnet.com/2220-3206/full/v14/i10/1437.htm. Acesso em: 30 mar. 2026.",
    "ASSOCIATION between androgenetic alopecia and psychological well-being: a systematic review and meta-analysis. Frontiers in Psychiatry, 2025. Disponível em: https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2025.1705957/full. Acesso em: 30 mar. 2026.",
    "EXTRAGASTRIC infection of Helicobacter pylori and alopecia areata: a systematic review and meta-analysis. Reviews in Medical Microbiology, v. 33, n. 1, 2022. Disponível em: https://journals.lww.com/revmedmicrobiol/abstract/2022/01000/extragastric_infection_of_helicobacter_pylori_and.25.aspx. Acesso em: 30 mar. 2026.",
    "CURE of alopecia areata after eradication of Helicobacter pylori: a new association? 2011. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC3158418/. Acesso em: 30 mar. 2026.",
    "ASSOCIATION between Helicobacter pylori infection and alopecia areata: a study in Iranian population. 2017. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC5471101/. Acesso em: 30 mar. 2026.",
    "HELICOBACTER pylori and skin autoimmune diseases. 2014. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC3925859/. Acesso em: 30 mar. 2026.",
    "DOES Helicobacter pylori infection play a role in iron deficiency anemia? A meta-analysis. World Journal of Gastroenterology, 2010. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC2825337/. Acesso em: 30 mar. 2026.",
    "RESEARCH progress on the relationship between Helicobacter pylori infection and iron deficiency anemia. Frontiers in Microbiology, 2025. Disponível em: https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2025.1552630/full. Acesso em: 30 mar. 2026.",
    "IRON deficiency and nonscarring alopecia in women: systematic review and meta-analysis. 2022. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC8928181/. Acesso em: 30 mar. 2026.",
    "THE association of serum ferritin levels with non-scarring alopecia in women. 2022. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC9805541/. Acesso em: 30 mar. 2026.",
    "KANTOR, J. et al. Decreased serum ferritin is associated with alopecia in women. Journal of Investigative Dermatology, 2003. Disponível em: https://www.sciencedirect.com/science/article/pii/S0022202X15304942. Acesso em: 30 mar. 2026.",
    "HELICOBACTER pylori associated vitamin B12 deficiency, pernicious anaemia and subacute combined degeneration of the spinal cord. 2013. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC3794208/. Acesso em: 30 mar. 2026.",
    "MICRONUTRIENT deficiencies in patients with chronic atrophic autoimmune gastritis: a review. 2017. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC5292330/. Acesso em: 30 mar. 2026.",
    "ANNIBALE, B. et al. Nutritional aspects of Helicobacter pylori infection. 2011. Disponível em: https://pubmed.ncbi.nlm.nih.gov/22105725/. Acesso em: 30 mar. 2026.",
    "CARABOTTI, M.; SCIROCCO, A.; MASELLI, M. A.; SEVERI, C. The gut-brain axis: interactions between enteric microbiota, central and enteric nervous systems. Annals of Gastroenterology, v. 28, n. 2, p. 203-209, 2015. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC4367209/. Acesso em: 30 mar. 2026.",
    "MADISON, A.; KIECOLT-GLASER, J. K. Stressed to the core: inflammation and intestinal permeability link stress-related gut microbiota shifts to mental health outcomes. Biological Psychiatry, 2024. Disponível em: https://pubmed.ncbi.nlm.nih.gov/38353184/. Acesso em: 30 mar. 2026.",
    "LI, N. et al. Gut microbiota are associated with psychological stress-induced defections in intestinal and blood-brain barriers. 2020. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC6974438/. Acesso em: 30 mar. 2026.",
    "LU, J. et al. Gut microbiome, metabolome and alopecia areata. Frontiers in Microbiology, v. 14, 2023. Disponível em: https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2023.1281660/full. Acesso em: 30 mar. 2026.",
    "THE multi-faceted role of gut microbiota in alopecia areata. Biomedicines, v. 13, n. 6, p. 1379, 2025. Disponível em: https://www.mdpi.com/2227-9059/13/6/1379. Acesso em: 30 mar. 2026.",
    "PINTO, D. et al. What's new in the pathophysiology of alopecia areata? The possible contribution of skin and gut microbiome. 2019. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC6830027/. Acesso em: 30 mar. 2026.",
    "PETERS, E. M. J. et al. Probing the effects of stress mediators on the human hair follicle: substance P holds central position. American Journal of Pathology, 2007. Disponível em: https://www.sciencedirect.com/science/article/abs/pii/S0002944010624480. Acesso em: 30 mar. 2026.",
    "PETERS, E. M. J. et al. Indications for a brain-hair follicle axis. The FASEB Journal, 2001. Disponível em: https://pubmed.ncbi.nlm.nih.gov/11641256/. Acesso em: 30 mar. 2026.",
    "PETERS, E. M. J. et al. Neurogenic inflammation in stress-induced termination of murine hair growth is promoted by nerve growth factor. 2006. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC1618553/. Acesso em: 30 mar. 2026.",
    "GUO, E. L.; KATTA, R. Diet and hair loss: effects of nutrient deficiency and supplement use. Dermatology Practical & Conceptual, v. 7, n. 1, p. 1-10, jan. 2017. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC5315033/. Acesso em: 30 mar. 2026.",
    "KIM, Y. J.; LIM, H.; PARK, S. Y. et al. Micro-current stimulation has potential effects of hair growth-promotion on human hair follicle-derived papilla cells and animal model. International Journal of Molecular Sciences, v. 22, n. 9, art. 4361, 2021. DOI: 10.3390/ijms22094361. Disponível em: https://www.mdpi.com/1422-0067/22/9/4361. Acesso em: 30 mar. 2026.",
    "COMPARATIVE study between 2% minoxidil topical spray vs. intradermal injection (mesotherapy) for treatment of androgenetic alopecia in female patients. Egyptian Dermatology Online Journal, v. 6, n. 2, 2010. Disponível em: https://www.edoj.org.eg/vol006/0602/005/01.htm. Acesso em: 30 mar. 2026.",
    "COMPARING the efficacy of mesotherapy to topical minoxidil in the treatment of female pattern hair loss. PubMed, 2019. Disponível em: https://pubmed.ncbi.nlm.nih.gov/31032783/. Acesso em: 30 mar. 2026.",
    "REVISTA FT. Tratamento de alopecias através de aplicações de substâncias ativas pelo método de intradermoterapia capilar: revisão da literatura. Disponível em: https://revistaft.com.br/tratamento-de-alopecias-atraves-de-aplicacoes-de-substancias-ativas-pelo-metodo-de-intradermoterapia-capilar-revisao-da-literatura/. Acesso em: 30 mar. 2026.",
    "COMPARISON of dermoscopic findings in female androgenetic alopecia and telogen effluvium and female controls in a tertiary care center. 2022. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC9122275/. Acesso em: 30 mar. 2026.",
  ];
  refs.forEach((r, i) => c.push(ref(i + 1, r)));

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: convertInchesToTwip(1.18), bottom: convertInchesToTwip(0.79), left: convertInchesToTwip(1.18), right: convertInchesToTwip(0.79) } } },
      children: c,
    }],
  });

  const outDir = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\resultados finais";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "Alopecia-Androgenetica-Feminina-Estudo-de-Caso-REVISADO.docx");
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buffer);
  console.log("OK ->", outPath);
}
main().catch(e => { console.error("ERRO:", e); process.exit(1); });
