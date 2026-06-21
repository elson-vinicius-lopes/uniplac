/* Estudo de caso REFOCADO em ALOPECIA ANDROGENÉTICA (H. pylori vira só menção).
 * Laserterapia de baixa intensidade (2 J/cm2) no lugar das microcorrentes + intradermoterapia PHD.
 * Cronograma 15/15. Referencias reais com link, autoria citada (sem plagio), 25 fontes diversas + livros.
 * ABNT: Times 12, 1,5, justificado, margens 3/3/2/2 cm.
 */
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip,
        Table, TableRow, TableCell, WidthType, ShadingType, PageBreak } = require("docx");
const fs = require("fs"); const path = require("path");
const FONT = "Times New Roman"; const SZ = 24; const SZS = 20; const LINE = 360;

function p(text, o = {}) {
  const runs = (typeof text === "string") ? [new TextRun({ text, font: FONT, size: o.size || SZ, bold: o.bold, italics: o.italics })]
    : text.map(t => new TextRun({ text: t.text, font: FONT, size: t.size || o.size || SZ, bold: t.bold, italics: t.italics }));
  return new Paragraph({ children: runs, spacing: { line: o.line || LINE, after: o.after != null ? o.after : 120 },
    alignment: o.alignment || AlignmentType.JUSTIFIED, indent: o.firstLine ? { firstLine: convertInchesToTwip(0.5) } : o.indent });
}
function h(text, lvl) {
  return new Paragraph({ children: [new TextRun({ text, font: FONT, size: lvl === 1 ? 26 : 24, bold: true })],
    heading: lvl === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2, spacing: { before: 240, after: 100, line: LINE }, alignment: AlignmentType.LEFT });
}
const blank = () => p("");
const center = (t, o = {}) => p(t, { ...o, alignment: AlignmentType.CENTER });
const bull = (segs) => p(segs, { indent: { left: convertInchesToTwip(0.3) } });
const refp = (segs) => new Paragraph({ children: (Array.isArray(segs) ? segs : [{ text: segs }]).map(t => new TextRun({ text: t.text, font: FONT, size: SZS, italics: t.italics })), spacing: { line: 240, after: 140 }, alignment: AlignmentType.LEFT, indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.5) } });
function cell(t, { bold = false, shade, w = 20 } = {}) {
  return new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t, font: FONT, size: 18, bold })] })],
    shading: shade ? { type: ShadingType.SOLID, color: shade } : undefined, width: { size: w, type: WidthType.PERCENTAGE } });
}

async function main() {
  const c = [];

  // ===== FOLHA DE ROSTO =====
  c.push(blank(), center("UNIVERSIDADE DO PLANALTO CATARINENSE — UNIPLAC", { bold: true, size: 26 }));
  c.push(center("Tecnologia em Estética e Cosmetologia — 5ª Fase — Turma 2026/01", { size: 22 }));
  c.push(blank(), blank(), blank());
  c.push(center("PAOLA BORTOLI PINHEIRO LOPES", { bold: true, size: 24 }));
  c.push(blank(), blank(), blank());
  c.push(center("ALOPECIA ANDROGENÉTICA FEMININA: FISIOPATOLOGIA, DIAGNÓSTICO TRICOSCÓPICO E PROPOSTA TERAPÊUTICA COM LASERTERAPIA DE BAIXA INTENSIDADE E INTRADERMOTERAPIA — ESTUDO DE CASO", { bold: true, size: 28 }));
  c.push(blank(), blank(), blank(), blank());
  c.push(center("Estudo de caso apresentado à disciplina de Seminários, do curso de Tecnologia em Estética e Cosmetologia da UNIPLAC.", { size: 22 }));
  c.push(center("Orientadoras: Profa. Marcia de Liz e Profa. Mariana Macedo Justi.", { size: 22 }));
  c.push(blank(), blank(), blank(), blank(), blank());
  c.push(center("LAGES — SC | 2026", { bold: true, size: 22 }));
  c.push(new Paragraph({ children: [new PageBreak()] }));

  // ===== RESUMO =====
  c.push(h("RESUMO", 1));
  c.push(p([
    { text: "A alopecia androgenética feminina (AAF) é a principal causa de rarefação capilar progressiva na mulher, decorrente da ação da di-hidrotestosterona (DHT) sobre folículos geneticamente predispostos, com miniaturização folicular. Este estudo de caso aborda a fisiopatologia, o diagnóstico tricoscópico e uma proposta terapêutica estética baseada em laserterapia de baixa intensidade (fotobiomodulação, com fluência de aproximadamente 2 J/cm²) e intradermoterapia capilar com a Mescla PHD, conduzida em paralelo ao acompanhamento médico. Apresenta-se uma paciente de 60 anos com AAF de predisposição genética; fatores sistêmicos — estresse oxidativo, deficiências nutricionais e infecção gastrointestinal prévia por " },
    { text: "Helicobacter pylori", italics: true },
    { text: " (já erradicada) — são considerados coadjuvantes. Propõe-se um cronograma terapêutico estruturado e fundamentado em evidências científicas atuais." },
  ]));
  c.push(p([{ text: "Palavras-chave: ", bold: true }, { text: "Alopecia androgenética feminina; di-hidrotestosterona; fotobiomodulação; laser de baixa intensidade; intradermoterapia capilar; tricoscopia." }]));
  c.push(new Paragraph({ children: [new PageBreak()] }));

  // ===== 1 TEMA =====
  c.push(h("1 TEMA", 1));
  c.push(p("Alopecia androgenética feminina: fisiopatologia, diagnóstico tricoscópico e proposta terapêutica estética com laserterapia de baixa intensidade e intradermoterapia — um estudo de caso."));

  // ===== 2 PERGUNTA =====
  c.push(h("2 PERGUNTA DA PESQUISA", 1));
  c.push(p("Como um protocolo estético fundamentado em laserterapia de baixa intensidade (fotobiomodulação) e intradermoterapia capilar pode contribuir para o controle da miniaturização folicular e a melhora da densidade capilar em uma paciente com alopecia androgenética feminina?"));

  // ===== 3 PROBLEMÁTICA =====
  c.push(h("3 PROBLEMÁTICA DA PESQUISA", 1));
  c.push(p("A alopecia androgenética feminina é condição crônica, progressiva e de grande impacto na autoestima. Diante de uma paciente de 60 anos com predisposição genética e quadro instalado, como estruturar um protocolo estético seguro, individualizado e baseado em evidências — combinando fotobiomodulação e intradermoterapia — capaz de frear a miniaturização, prolongar a fase anágena e elevar a densidade capilar?"));

  // ===== 4 OBJETIVOS =====
  c.push(h("4 OBJETIVOS", 1));
  c.push(h("4.1 Objetivo geral", 2));
  c.push(p("Propor e conduzir um protocolo estético integrativo para o controle da alopecia androgenética feminina, baseado em laserterapia de baixa intensidade e intradermoterapia capilar, fundamentado na literatura científica atual."));
  c.push(h("4.2 Objetivos específicos", 2));
  c.push(p("a) Descrever a fisiopatologia e a base genético-hormonal da alopecia androgenética feminina;", { firstLine: true }));
  c.push(p("b) Apresentar o diagnóstico estético-funcional por meio da avaliação tricoscópica;", { firstLine: true }));
  c.push(p("c) Fundamentar e detalhar o uso da laserterapia de baixa intensidade (fotobiomodulação) e da intradermoterapia com a Mescla PHD;", { firstLine: true }));
  c.push(p("d) Estruturar um cronograma terapêutico individualizado, com frequência e parâmetros baseados em evidências.", { firstLine: true }));

  // ===== 5 MÉTODO =====
  c.push(h("5 MÉTODO", 1));
  c.push(p("Trata-se de pesquisa qualitativa, do tipo estudo de caso descritivo, tendo como amostra uma única paciente do sexo feminino, de 60 anos, com diagnóstico de alopecia androgenética feminina. O referencial teórico foi construído a partir de artigos científicos indexados (PubMed/PMC, periódicos de dermatologia e tricologia) e de livros-texto da área. A coleta de dados utilizou ficha de anamnese, avaliação por tricoscopia (fotovideodermatoscópio) e registro fotográfico padronizado. A intervenção estética foi conduzida em paralelo ao acompanhamento médico. O trabalho seguirá os princípios éticos da Resolução 466/12 do CNS, com aprovação pelo Comitê de Ética em Pesquisa (CEP) da UNIPLAC sob o nº 6.603.39 e assinatura do Termo de Consentimento Livre e Esclarecido (TCLE)."));

  // ===== 6 INTRODUÇÃO =====
  c.push(h("6 INTRODUÇÃO", 1));
  c.push(p([
    { text: "A alopecia androgenética (AAG) é a forma mais comum de perda capilar progressiva, decorrente da ação da di-hidrotestosterona (DHT) sobre folículos geneticamente predispostos. Conforme Ho, Sood e Zito (2024), no couro cabeludo afetado há aumento da produção de DHT, elevação da enzima 5-alfa-redutase e maior densidade de receptores androgênicos, o que encurta a fase anágena e conduz à miniaturização folicular progressiva. Na mulher, o quadro manifesta-se como rarefação difusa da região do topo, com preservação da linha frontal de implantação (SINGAL; SONTHALIA; VERMA, 2013)." },
  ]));
  c.push(p([
    { text: "Este estudo apresenta uma paciente de 60 anos com AAF de predisposição genética. Embora o eixo genético-hormonal seja o determinante principal, fatores sistêmicos podem modular a expressão clínica; a paciente apresentou, no passado, infecção por " },
    { text: "Helicobacter pylori", italics: true },
    { text: " (já erradicada) e gastrite crônica — condição mencionada como coadjuvante, sem constituir o foco deste trabalho, que recai sobre a alopecia androgenética e sua abordagem estética." },
  ]));

  // ===== 7 REVISÃO =====
  c.push(h("7 REVISÃO DE LITERATURA", 1));

  c.push(h("7.1 Fisiopatologia da alopecia androgenética", 2));
  c.push(p([
    { text: "A patogênese da AAG centra-se na conversão da testosterona em DHT pela 5-alfa-redutase. Ho, Sood e Zito (2024) descrevem a redução da relação anágeno/telógeno (normalmente cerca de 12:1) e a miniaturização progressiva, sendo a isoforma tipo 2 da 5-alfa-redutase a principal envolvida. Ntshingila et al. (2023) acrescentam que o excesso de DHT, gerado pela 5-alfa-redutase tipo 2 (SRD5A2), substitui fios terminais por velos e encurta a fase anágena. Ustuner (2013), por sua vez, ressalva o paradoxo de a DHT estimular pelos em outras regiões corporais enquanto promove miniaturização no couro cabeludo, apontando lacunas no modelo clássico e o possível papel de fatores adicionais." },
  ]));

  c.push(h("7.2 Base genética", 2));
  c.push(p("Martinez-Jacobo et al. (2018) caracterizam a AAG como fenótipo poligênico, com herdabilidade estimada em 0,81; o gene do receptor androgênico (AR), localizado no cromossomo X, contribui com até 40% do risco genético, e estudos de associação genômica ampla (GWAS) identificaram loci de risco como o 2q35 (gene WNT10A), sugerindo vias independentes de androgênios. De acordo com Ho, Sood e Zito (2024), filhos de pais calvos apresentam risco relativo 5 a 6 vezes maior, o que é coerente com o histórico familiar da paciente (pai com calvície)."));

  c.push(h("7.3 Quadro clínico, classificação e epidemiologia", 2));
  c.push(p("Singal, Sonthalia e Verma (2013) relatam que a prevalência da AAF aumenta com a idade — de aproximadamente 1,3% entre 18 e 29 anos a cerca de 11,8% após os 70 anos — e classificam a gravidade pela escala de Ludwig (três estágios), caracterizada pelo afinamento difuso da coroa com preservação da linha frontal."));

  c.push(h("7.4 Diagnóstico tricoscópico", 2));
  c.push(p("A tricoscopia é o exame de eleição para o diagnóstico não invasivo. A revisão sistemática de Kuczara et al. (2024), com 34 estudos e 2.860 pacientes, identificou a variabilidade do diâmetro dos fios (anisotricose) como o marcador mais confiável da AAG (presente em cerca de 94% dos casos, e em torno de 90% na forma feminina), seguida dos pelos velos (cerca de 78% nas mulheres). Galliker e Trüeb (2012), em 162 mulheres, demonstraram que a tricoscopia supera o tricograma (72% versus 62%), adotando o limiar de 20% de diversidade de calibre. Michelle, Shilpa e Leelavathy (2022) correlacionaram a redução do diâmetro e da densidade com a gravidade do quadro (p<0,001)."));

  c.push(h("7.5 Fatores sistêmicos associados", 2));
  c.push(p([
    { text: "Embora a AAG seja primariamente genético-hormonal, fatores sistêmicos podem modular sua progressão. Prie et al. (2016) evidenciaram estresse oxidativo em pacientes com AAG, com redução da capacidade antioxidante total e elevação do malondialdeído (p<0,001) e queda da superóxido dismutase. Kantor et al. (2003) associaram a ferritina sérica baixa à alopecia feminina (média de 37,3 ng/mL nas pacientes versus 59,5 ng/mL nos controles). No presente caso, a infecção prévia por " },
    { text: "Helicobacter pylori", italics: true },
    { text: " (já erradicada) e a gastrite crônica são consideradas coadjuvantes, na medida em que distúrbios gastrointestinais podem contribuir para deficiências de micronutrientes relevantes ao ciclo capilar." },
  ]));

  c.push(h("7.6 Laserterapia de baixa intensidade (fotobiomodulação)", 2));
  c.push(p("A laserterapia de baixa intensidade (LLLT), ou fotobiomodulação, é modalidade não invasiva, segura e aprovada para a AAG. Avci et al. (2014) sintetizam os parâmetros típicos: comprimentos de onda de 655 nm (vermelho) e 780 nm (infravermelho), fluências de 1 a 10 J/cm² e densidade de potência de 3 a 90 mW/cm², descrevendo uma resposta bifásica em que doses baixas (em torno de 1 J/cm²) estimulam, enquanto doses elevadas (cerca de 5 J/cm²) inibem. Pillai e Mysore (2022) recomendam luz vermelha/infravermelha (600–950 nm, mais comumente 655 nm), fluências de 1 a 10 J/cm² e sessões de 15 a 20 minutos, três vezes por semana, por cerca de seis meses. Com base nessa janela estimulatória, este protocolo adota fluência baixa de aproximadamente 2 J/cm²."));
  c.push(p("As evidências clínicas amparam a frequência e os parâmetros. Scarpim et al. (2022) utilizaram laser de 660 nm, 100 mW, com aplicação pontual de 30 segundos por ponto (3 J por ponto, pontos espaçados em 1 cm), duas vezes por semana durante 10 semanas, observando maior ganho de densidade nas primeiras cinco semanas. Sondagar et al. (2023), em ensaio clínico randomizado, aplicaram a LLLT duas vezes por semana por 16 semanas, com melhora da densidade capilar. Yoon et al. (2020), em ensaio randomizado duplo-cego com dispositivo do tipo capacete (655 nm; 2,36 mW/cm²; 25 minutos em dias alternados; 16 semanas), obtiveram aumento de aproximadamente 41,9 fios/cm² (p<0,001). Wang e Chen (2025) propõem uma fase ativa de três meses seguida de manutenção a cada 4 a 6 semanas, o que fundamenta o cronograma proposto."));

  c.push(h("7.7 Intradermoterapia capilar", 2));
  c.push(p("A intradermoterapia (mesoterapia capilar) consiste na administração de microinjeções de ativos diretamente no couro cabeludo, garantindo biodisponibilidade local. Uzel et al. (2021), em ensaio clínico randomizado e controlado por placebo com 54 mulheres, aplicaram minoxidil intradérmico a 0,5% (2 mL por sessão) em sessões semanais por 10 semanas, com aumento da razão entre fios terminais e velos. Aledani et al. (2024), em revisão sistemática, registram que diversos protocolos adotam sessões semanais e posicionam a mesoterapia como alternativa eficaz ao minoxidil tópico. Stefanis et al. (2024) observaram melhora de densidade com mesoterapia de fatores de crescimento (uma sessão a cada 1 a 2 semanas, 6 a 8 sessões). Quanto à dutasterida intradérmica, Sanabria et al. (2025) compararam esquemas mensal e trimestral, e Nohria et al. (2024) não observaram melhora significativa com aplicações trimestrais — o que ampara a priorização de ativos como minoxidil e fatores de crescimento na mescla utilizada."));

  c.push(h("7.8 Embasamento em livros-texto", 2));
  c.push(p("O tema é amplamente consolidado em livros-texto de tricologia e dermatologia. Olsen (1994), em Disorders of Hair Growth: Diagnosis and Treatment (McGraw-Hill), dedica seção específica à alopecia androgenética. Blume-Peytavi et al. (2008), em Hair Growth and Disorders (Springer), abordam a AAG masculina e feminina. Chandrashekar (2018), no IADVL Textbook of Trichology (JP Medical), traz capítulo dedicado ao tema, e Anastassakis (2022), em Androgenetic Alopecia From A to Z (Springer), dedica a obra inteira à condição, da ciência básica ao diagnóstico."));

  // ===== 8 APRESENTAÇÃO DO CASO =====
  c.push(h("8 APRESENTAÇÃO DO CASO", 1));
  c.push(p([
    { text: "Paciente do sexo feminino, 60 anos, com queixa de queda capilar e rarefação na região do topo do couro cabeludo, de evolução de cerca de três anos. Apresenta predisposição genética (pai com calvície). No histórico, relata infecção prévia por " },
    { text: "Helicobacter pylori", italics: true },
    { text: " (já erradicada, confirmada por exames), gastrite crônica em acompanhamento, alterações hormonais, nível elevado de estresse e sono fragmentado; possui histórico de procedimentos químicos (mechas e coloração). À tricoscopia, observam-se diversidade de calibre dos fios (anisotricose), miniaturização e aumento do espaçamento interfolicular — achados compatíveis com alopecia androgenética feminina (KUCZARA et al., 2024; GALLIKER; TRÜEB, 2012)." },
  ]));
  c.push(p("Na fase inicial do acompanhamento, realizou-se a desinflamação e o equilíbrio do couro cabeludo; em seguida, iniciou-se a fase de estímulo, objeto da proposta terapêutica a seguir."));

  // ===== 9 PROPOSTA TERAPÊUTICA E CRONOGRAMA =====
  c.push(h("9 PROPOSTA TERAPÊUTICA E CRONOGRAMA", 1));
  c.push(p("A proposta combina duas frentes complementares de estímulo, conduzidas em paralelo ao acompanhamento médico:"));

  c.push(h("9.1 Laserterapia de baixa intensidade (fotobiomodulação)", 2));
  c.push(p("Laser vermelho na faixa de 655–660 nm, de baixa potência, com densidade de potência de 3 a 90 mW/cm² e fluência baixa de aproximadamente 2 J/cm² (dentro da janela estimulatória da resposta bifásica), em sessões de cerca de 20 minutos. A fotobiomodulação aumenta a síntese de ATP, melhora a microcirculação do couro cabeludo e prolonga a fase anágena (AVCI et al., 2014; PILLAI; MYSORE, 2022; YOON et al., 2020). Esta modalidade substitui as microcorrentes utilizadas anteriormente."));

  c.push(h("9.2 Intradermoterapia com a Mescla PHD (técnica de pápula)", 2));
  c.push(p("Microinjeções intradérmicas na junção dermoepidérmica, em profundidade de 2 a 4 mm, com agulha 30G, depositando cerca de 0,05 a 0,1 mL por ponto, formando pápulas espaçadas a cada 2 cm por toda a área de rarefação. A Mescla PHD contém: Minoxidil 8 mg; Nanofatores de Crescimento Capilar 1%; Latanoprosta 50 mcg; Pill Food (L-metionina, L-taurina, L-prolina, biotina, D-pantenol, vitaminas B2, B3 e B6 e L-carnitina); e Lidocaína 20 mg. A entrega local dos ativos é fundamentada em Uzel et al. (2021), Aledani et al. (2024) e Stefanis et al. (2024). Em casa, mantém-se o tônico Capilia Longa (derivado da cúrcuma), que auxilia na inibição da conversão em DHT."));

  c.push(h("9.3 Cronograma terapêutico", 2));
  c.push(p("O cronograma inicia-se com uma fase intensiva semanal no primeiro mês e, a seguir, adota o esquema quinzenal (a cada 15 dias), alternando intradermoterapia e laserterapia:"));
  const rows = [
    ["Período", "Procedimento", "Frequência", "Detalhamento", "Base científica"],
    ["Semanas 1–4 (Mês 1)", "Intradermoterapia (Mescla PHD)", "1×/semana (4 sessões)", "Técnica de pápula; 30G; 2–4 mm; ~0,05–0,1 mL/ponto; pápulas a cada 2 cm", "Uzel et al. (2021); Aledani et al. (2024)"],
    ["A partir do Mês 2 — quinzena A (a cada 15 dias)", "Laserterapia (fotobiomodulação)", "1 sessão / 15 dias", "655–660 nm; ~2 J/cm²; 3–90 mW/cm²; ~20 min. Recomenda-se laser domiciliar 2–3×/semana entre as sessões", "Avci et al. (2014); Pillai e Mysore (2022); Yoon et al. (2020)"],
    ["Mês 2 em diante — quinzena B (intercalada)", "Intradermoterapia (Mescla PHD)", "1 sessão / 15 dias (alternando com o laser)", "Mesma técnica de pápula da fase 1", "Stefanis et al. (2024); Aledani et al. (2024)"],
    ["A cada 8 semanas", "Reavaliação (tricoscopia + foto padronizada)", "Bimestral", "Comparação de densidade e diâmetro dos fios", "Kuczara et al. (2024); Michelle et al. (2022)"],
    ["Após ~6 meses", "Manutenção (laser + intradermo espaçados)", "Mensal / conforme resposta", "Manutenção dos ganhos obtidos", "Wang e Chen (2025)"],
  ];
  c.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows.map((r, i) => new TableRow({
    children: r.map(txt => cell(txt, { bold: i === 0, shade: i === 0 ? "D9E2F3" : undefined, w: 20 })),
  })) }));
  c.push(blank());
  c.push(p([{ text: "Observação: ", bold: true, italics: true }, { text: "a literatura de fotobiomodulação favorece frequências maiores de laser (2 a 3 vezes por semana). Por isso, no esquema quinzenal em cabine, recomenda-se complementar com laser domiciliar entre as visitas, conforme o modelo de Yoon et al. (2020). Os parâmetros do equipamento devem ser conferidos no manual e ajustados à tolerância da paciente.", italics: true }]));

  // ===== 10 DISCUSSÃO =====
  c.push(h("10 DISCUSSÃO", 1));
  c.push(p("O caso reafirma que a alopecia androgenética feminina é, primariamente, uma condição genético-hormonal mediada pela DHT (HO; SOOD; ZITO, 2024; NTSHINGILA et al., 2023), cujo diagnóstico se apoia na tricoscopia (KUCZARA et al., 2024; GALLIKER; TRÜEB, 2012). A proposta terapêutica combina duas abordagens com respaldo científico: a laserterapia de baixa intensidade, cuja eficácia e segurança foram demonstradas em ensaios clínicos randomizados (SONDAGAR et al., 2023; YOON et al., 2020), e a intradermoterapia capilar, que entrega ativos diretamente no couro cabeludo (UZEL et al., 2021; STEFANIS et al., 2024). A adoção de fluência baixa (~2 J/cm²) alinha-se à resposta bifásica descrita por Avci et al. (2014) e Pillai e Mysore (2022). Os fatores sistêmicos — estresse oxidativo (PRIE et al., 2016), deficiências nutricionais (KANTOR et al., 2003) e a infecção gastrointestinal prévia — são tratados como coadjuvantes, mantendo-se a alopecia androgenética como foco central."));

  // ===== 11 CONCLUSÃO =====
  c.push(h("11 CONCLUSÃO", 1));
  c.push(p("A alopecia androgenética feminina exige abordagem individualizada e fundamentada em evidências. A combinação de laserterapia de baixa intensidade (fotobiomodulação, ~2 J/cm²) e intradermoterapia capilar com a Mescla PHD, organizada em um cronograma estruturado e conduzida em paralelo ao acompanhamento médico, constitui uma proposta segura e tecnicamente coerente para o controle da miniaturização e a melhora da densidade capilar. A avaliação tricoscópica seriada permite acompanhar objetivamente a resposta ao tratamento."));

  // ===== 12 REFERÊNCIAS =====
  c.push(new Paragraph({ children: [new PageBreak()] }));
  c.push(h("12 REFERÊNCIAS", 1));
  const refs = [
    "ALEDANI, E. M. et al. Mesotherapy as a promising alternative to minoxidil for androgenetic alopecia: a systematic review. Cureus, v. 16, n. 5, e59705, 2024. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC11152360/. Acesso em: 16 jun. 2026.",
    "ANASTASSAKIS, K. Androgenetic alopecia from A to Z: vol. 1 – basic science, diagnosis, etiology, and related disorders. Cham: Springer, 2022. Disponível em: https://link.springer.com/book/10.1007/978-3-030-76111-0. Acesso em: 16 jun. 2026.",
    "AVCI, P. et al. Low-level laser (light) therapy (LLLT) for treatment of hair loss. Lasers in Surgery and Medicine, v. 46, n. 2, p. 144-151, 2014. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC3944668/. Acesso em: 16 jun. 2026.",
    "BLUME-PEYTAVI, U.; TOSTI, A.; WHITING, D. A.; TRÜEB, R. M. (org.). Hair growth and disorders. Berlin: Springer, 2008. Disponível em: https://www.abebooks.com/9783540469087/Hair-Growth-Disorders-3540469087/plp. Acesso em: 16 jun. 2026.",
    "CHANDRASHEKAR, B. S. (org.). IADVL textbook of trichology. New Delhi: JP Medical, 2018. Disponível em: https://books.google.com/books/about/IADVL_Textbook_of_Trichology.html?id=hya7tQEACAAJ. Acesso em: 16 jun. 2026.",
    "GALLIKER, N. A.; TRÜEB, R. M. Value of trichoscopy versus trichogram for diagnosis of female androgenetic alopecia. International Journal of Trichology, v. 4, n. 1, p. 19-22, 2012. Disponível em: https://pubmed.ncbi.nlm.nih.gov/22628985/. Acesso em: 16 jun. 2026.",
    "HO, C. H.; SOOD, T.; ZITO, P. M. Androgenetic alopecia. In: StatPearls. Treasure Island (FL): StatPearls Publishing, 2024. Disponível em: https://www.ncbi.nlm.nih.gov/books/NBK430924/. Acesso em: 16 jun. 2026.",
    "KANTOR, J. et al. Decreased serum ferritin is associated with alopecia in women. Journal of Investigative Dermatology, v. 121, n. 5, p. 985-988, 2003. Disponível em: https://pubmed.ncbi.nlm.nih.gov/14708596/. Acesso em: 16 jun. 2026.",
    "KUCZARA, K. et al. Trichoscopy of androgenetic alopecia: a systematic review. Journal of Clinical Medicine, v. 13, n. 7, 1962, 2024. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC11012765/. Acesso em: 16 jun. 2026.",
    "MARTINEZ-JACOBO, L. et al. Genetic and molecular aspects of androgenetic alopecia. Indian Journal of Dermatology, Venereology and Leprology, v. 84, n. 3, p. 263-268, 2018. Disponível em: https://ijdvl.com/genetic-and-molecular-aspects-of-androgenetic-alopecia/. Acesso em: 16 jun. 2026.",
    "MICHELLE, V.; SHILPA, K.; LEELAVATHY, B. A clinico-trichoscopic analysis of hair density and diameter variability in relation to severity grading of female pattern hair loss. International Journal of Trichology, v. 14, n. 5, p. 162-171, 2022. Disponível em: https://pubmed.ncbi.nlm.nih.gov/36404884/. Acesso em: 16 jun. 2026.",
    "NOHRIA, A. et al. Outcomes of androgenetic alopecia treated with dutasteride mesotherapy: a case series. JAAD Case Reports, 2024. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC11647129/. Acesso em: 16 jun. 2026.",
    "NTSHINGILA, S. et al. Androgenetic alopecia: an update. JAAD International, v. 13, p. 150-158, 2023. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC10562178/. Acesso em: 16 jun. 2026.",
    "OLSEN, E. A. (org.). Disorders of hair growth: diagnosis and treatment. New York: McGraw-Hill, 1994. Disponível em: https://www.abebooks.com/9780070479340/Disorders-Hair-Growth-Diagnosis-Treatment-0070479348/plp. Acesso em: 16 jun. 2026.",
    "PILLAI, J. K.; MYSORE, V. Role of low-level light therapy (LLLT) in androgenetic alopecia. Journal of Cutaneous and Aesthetic Surgery, v. 14, n. 4, p. 385-391, 2022. Disponível em: https://jcasonline.com/role-of-low-level-light-therapy-lllt-in-androgenetic-alopecia/. Acesso em: 16 jun. 2026.",
    "PRIE, B. E. et al. Oxidative stress in androgenetic alopecia. Journal of Medicine and Life, v. 9, n. 1, p. 79-83, 2016. Disponível em: https://pubmed.ncbi.nlm.nih.gov/27974920/. Acesso em: 16 jun. 2026.",
    "SANABRIA, B. et al. Monthly versus quarterly dutasteride mesotherapy for male androgenetic alopecia: a randomized trial. Journal of the European Academy of Dermatology and Venereology, 2025. Disponível em: https://pubmed.ncbi.nlm.nih.gov/41328478/. Acesso em: 16 jun. 2026.",
    "SCARPIM, A. C. et al. Photobiomodulation effectiveness in treating androgenetic alopecia. Photobiomodulation, Photomedicine, and Laser Surgery, v. 40, n. 6, p. 387-394, 2022. Disponível em: https://pubmed.ncbi.nlm.nih.gov/35749704/. Acesso em: 16 jun. 2026.",
    "SINGAL, A.; SONTHALIA, S.; VERMA, P. Female pattern hair loss. Indian Journal of Dermatology, Venereology and Leprology, v. 79, n. 5, p. 626-640, 2013. Disponível em: https://ijdvl.com/female-pattern-hair-loss/. Acesso em: 16 jun. 2026.",
    "SONDAGAR, D. M. et al. Efficacy of low-level laser therapy in androgenetic alopecia: a randomized controlled trial. International Journal of Trichology, 2023. Disponível em: https://pubmed.ncbi.nlm.nih.gov/37305186/. Acesso em: 16 jun. 2026.",
    "STEFANIS, A. J. et al. Efficacy of platelet-rich plasma versus mesotherapy with recombinant growth factors and stem cell-conditioned media in androgenetic alopecia: a retrospective study. Skin Appendage Disorders, v. 10, n. 5, p. 376-382, 2024. Disponível em: https://karger.com/sad/article/10/5/376/908183/Efficacy-of-Platelet-Rich-Plasma-versus. Acesso em: 16 jun. 2026.",
    "USTUNER, E. T. Cause of androgenic alopecia: crux of the matter. Plastic and Reconstructive Surgery – Global Open, v. 1, n. 7, e64, 2013. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC4174066/. Acesso em: 16 jun. 2026.",
    "UZEL, B. P. K. et al. Intradermal injections with 0.5% minoxidil for the treatment of female androgenetic alopecia: a randomized, placebo-controlled trial. Dermatologic Therapy, v. 34, n. 1, 2021. Disponível em: https://doi.org/10.1111/dth.14622. Acesso em: 16 jun. 2026.",
    "WANG, Y.-F.; CHEN, Y.-C. Clinical trial comparing three wavelengths in photobiomodulation therapy for hair loss. Photobiomodulation, Photomedicine, and Laser Surgery, v. 43, n. 7, p. 288-293, 2025. Disponível em: https://pubmed.ncbi.nlm.nih.gov/40398915/. Acesso em: 16 jun. 2026.",
    "YOON, J. S. et al. Low-level light therapy using a helmet-type device for the treatment of androgenetic alopecia: a 16-week, multicenter, randomized, double-blind, sham device-controlled trial. Medicine (Baltimore), v. 99, n. 29, e21181, 2020. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC7373546/. Acesso em: 16 jun. 2026.",
  ];
  refs.forEach(r => c.push(refp([{ text: r }])));

  const doc = new Document({ sections: [{ properties: { page: { margin: { top: convertInchesToTwip(1.18), bottom: convertInchesToTwip(0.79), left: convertInchesToTwip(1.18), right: convertInchesToTwip(0.79) } } }, children: c }] });
  const outDir = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\resultados finais\\estudo de caso";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "Alopecia-Androgenetica-Feminina-Estudo-de-Caso-FOCO-AAG.docx");
  fs.writeFileSync(outPath, await Packer.toBuffer(doc));
  console.log("OK ->", outPath, "| referencias:", refs.length);
}
main().catch(e => { console.error("ERRO:", e); process.exit(1); });
