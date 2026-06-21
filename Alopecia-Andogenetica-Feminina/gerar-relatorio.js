/* Gera o RELATÓRIO DE ATENDIMENTOS CAPILARES (Salete) — disciplina Estética Capilar
 * Avançada e Terapia Capilar II. Estrutura conforme regulamento (Profa. Márcia de Liz).
 * ABNT: Times 12, 1,5, justificado, margens 3/3/2/2 cm. Saída em "resultados finais".
 */
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip,
        Table, TableRow, TableCell, WidthType, ShadingType, ImageRun } = require("docx");
const fs = require("fs");
const path = require("path");
const ATT = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\attachments";
function figura(file, w = 360, hgt = 288) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
    children: [new ImageRun({ type: "jpg", data: fs.readFileSync(path.join(ATT, file)), transformation: { width: w, height: hgt } })] });
}
const FONT = "Times New Roman";
const SZ = 24, SZS = 20, LINE = 360;

function p(text, o = {}) {
  const runs = (Array.isArray(text) ? text : [{ text }]).map(t =>
    new TextRun({ text: t.text, font: FONT, size: t.size || o.size || SZ, bold: t.bold || o.bold, italics: t.italics }));
  return new Paragraph({ children: runs, spacing: { line: o.line || LINE, after: o.after != null ? o.after : 120 },
    alignment: o.alignment || AlignmentType.JUSTIFIED, indent: o.firstLine ? { firstLine: convertInchesToTwip(0.5) } : o.indent });
}
function h(text, lvl = 1) {
  return new Paragraph({ children: [new TextRun({ text, font: FONT, size: lvl === 1 ? 26 : 24, bold: true })],
    heading: lvl === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2, spacing: { before: 240, after: 100, line: LINE }, alignment: AlignmentType.LEFT });
}
const center = (t, o = {}) => p(t, { ...o, alignment: AlignmentType.CENTER });
const blank = () => p("");
const bull = (segs) => p(segs, { indent: { left: convertInchesToTwip(0.3) } });
const refp = (t) => new Paragraph({ children: [new TextRun({ text: t, font: FONT, size: SZS })], spacing: { line: 240, after: 120 }, alignment: AlignmentType.LEFT });
function cell(t, bold, shade, w) {
  return new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t, font: FONT, size: SZS, bold })] })],
    shading: shade ? { type: ShadingType.SOLID, color: shade } : undefined, width: { size: w || 50, type: WidthType.PERCENTAGE } });
}

async function main() {
  const c = [];
  // ===== CAPA =====
  c.push(blank(), center("UNIVERSIDADE DO PLANALTO CATARINENSE — UNIPLAC", { bold: true, size: 26 }));
  c.push(center("Tecnologia em Estética e Cosmetologia — 5ª Fase", { size: 22 }));
  c.push(center("Disciplina: Estética Capilar Avançada e Terapia Capilar II", { size: 22 }));
  c.push(blank(), blank(), blank());
  c.push(center("RELATÓRIO DE ATENDIMENTOS CAPILARES", { bold: true, size: 32 }));
  c.push(blank());
  c.push(center([{ text: "Estudo de caso clínico: alopecia androgenética feminina associada à infecção (tratada) por ", size: 24 },
                 { text: "Helicobacter pylori", italics: true, size: 24 }], {}));
  c.push(blank(), blank(), blank(), blank());
  c.push(center("Acadêmica: Paola Bortoli Pinheiro Lopes", { size: 24 }));
  c.push(center("Modelo: Paciente modelo feminina", { size: 24 }));
  c.push(center("Orientadora: Profa. Márcia de Liz", { size: 24 }));
  c.push(blank(), blank(), blank(), blank(), blank());
  c.push(center("LAGES — SC | 2026", { bold: true, size: 22 }));
  c.push(new Paragraph({ children: [new TextRun({ text: "", font: FONT })], pageBreakBefore: true }));

  // ===== 1. IDENTIFICAÇÃO =====
  c.push(h("1 IDENTIFICAÇÃO DO CASO"));
  c.push(bull([{ text: "Nome: ", bold: true }, { text: "Paciente modelo feminina (mediante TCLE)." }]));
  c.push(bull([{ text: "Idade: ", bold: true }, { text: "61 anos (nascida em 1964)." }]));
  c.push(bull([{ text: "Sexo: ", bold: true }, { text: "Feminino." }]));
  c.push(bull([{ text: "Queixa principal: ", bold: true }, { text: "queda capilar na região do topo (vértice) do couro cabeludo, com rarefação progressiva." }]));
  c.push(bull([{ text: "Tempo de evolução da queixa: ", bold: true }, { text: "aproximadamente 3 anos." }]));

  // ===== 2. ANAMNESE =====
  c.push(h("2 ANAMNESE CAPILAR"));
  c.push(bull([{ text: "Histórico familiar: ", bold: true }, { text: "pai com calvície (alopecia androgenética), indicando predisposição genética." }]));
  c.push(bull([{ text: "Doenças associadas: ", bold: true }, { text: "gastrite crônica (em tratamento) e infecção pregressa por " }, { text: "Helicobacter pylori", italics: true }, { text: " — já tratada e erradicada, confirmada por exames recentes." }]));
  c.push(bull([{ text: "Uso de medicamentos: ", bold: true }, { text: "tratamento medicamentoso para a gastrite; antibioticoterapia prévia para erradicação do " }, { text: "H. pylori", italics: true }, { text: ", já concluída." }]));
  c.push(bull([{ text: "Alterações hormonais: ", bold: true }, { text: "presentes — fator relevante e coadjuvante na alopecia androgenética, somando-se à causa gastrointestinal." }]));
  c.push(bull([{ text: "Histórico de procedimentos químicos: ", bold: true }, { text: "uso de mechas e coloração capilar." }]));
  c.push(bull([{ text: "Hábitos de vida: ", bold: true }, { text: "alimentação razoável, com predomínio de alimentos saudáveis e excessos eventuais; nível de estresse elevado; sono fragmentado, com despertares noturnos." }]));

  // ===== 3. AVALIAÇÃO =====
  c.push(h("3 AVALIAÇÃO CLÍNICA E TRICOSCÓPICA"));
  c.push(p("À avaliação inicial, o couro cabeludo apresentava sinais inflamatórios, posteriormente controlados na fase de desinflamação do protocolo. Os achados compatíveis com a disfunção foram:"));
  c.push(bull([{ text: "Condições do couro cabeludo: ", bold: true }, { text: "inicialmente com sinais inflamatórios; atualmente equilibrado e com microcirculação aumentada após a fase de estímulo." }]));
  c.push(bull([{ text: "Inflamação / descamação / hiperemia / oleosidade: ", bold: true }, { text: "hiperemia e oleosidade na avaliação inicial, reduzidas após a fase de desinflamação." }]));
  c.push(bull([{ text: "Grau de rarefação / miniaturização: ", bold: true }, { text: "rarefação na região do topo/vértice com miniaturização folicular e aumento do espaçamento interfolicular." }]));
  c.push(bull([{ text: "Características compatíveis: ", bold: true }, { text: "afinamento progressivo dos fios e diversidade de calibre — padrão compatível com alopecia androgenética feminina." }]));

  // ===== 4. DIAGNÓSTICO =====
  c.push(h("4 DIAGNÓSTICO ESTÉTICO-FUNCIONAL"));
  c.push(p([{ text: "Alopecia androgenética feminina", bold: true }, { text: ", de predisposição genética (histórico paterno), cuja progressão foi acelerada por fatores sistêmicos. A infecção por " }, { text: "Helicobacter pylori", italics: true }, { text: " e a gastrite crônica comprometeram a absorção de micronutrientes essenciais ao ciclo capilar (ferro/ferritina, vitamina B12 e zinco); somadas às alterações hormonais e ao estresse, criaram um ambiente de deficiência nutricional e estresse oxidativo que intensificou a miniaturização folicular. Importante destacar que o " }, { text: "H. pylori", italics: true }, { text: " atua como fator ACELERADOR, e não como causa direta da alopecia androgenética." }]));
  c.push(p("Justificativa técnica: o diagnóstico fundamenta-se na queixa (queda no topo), no histórico familiar de calvície, nos achados de rarefação e miniaturização na região do vértice e na correlação com a condição gastrointestinal e hormonal documentada."));

  // ===== 5. PROTOCOLO =====
  c.push(h("5 PROTOCOLO TERAPÊUTICO"));
  c.push(p("O protocolo foi conduzido em duas fases. A fase inicial (semestres anteriores) teve foco na desinflamação e no equilíbrio do couro cabeludo; a fase atual concentra-se no estímulo capilar."));

  c.push(h("5.1 Técnicas empregadas", 2));
  c.push(bull([{ text: "Fase 1 — Desinflamação (concluída): ", bold: true }, { text: "aromaterapia/óleos essenciais e argiloterapia para controle da inflamação e da oleosidade do couro cabeludo." }]));
  c.push(bull([{ text: "Fase 2 — Estímulo (atual): ", bold: true }, { text: "intradermoterapia capilar (técnica de pápula) com a Mescla PHD, associada à fotobiomodulação com laser vermelho (LLLT) e à manutenção domiciliar." }]));
  c.push(p([{ text: "Intradermoterapia (técnica de pápula): ", bold: true }, { text: "microinjeções intradérmicas na junção dermoepidérmica, em profundidade de 2 a 4 mm, com agulha 30G, depositando pequenos volumes (cerca de 0,05–0,1 mL) que formam pápulas distribuídas por toda a área de rarefação, " }, { text: "espaçadas a cada 2 cm", bold: true }, { text: ". A técnica papular é a recomendada para alopecia, por reter o ativo no plano dérmico e contornar a má absorção gastrointestinal." }]));
  c.push(p([{ text: "Laser vermelho — fotobiomodulação (LLLT): ", bold: true }, { text: "luz na faixa do vermelho (650–660 nm), de baixa potência, com densidade de potência da ordem de 3–90 mW/cm² e fluência de 1–10 J/cm², em sessões de aproximadamente 20 minutos. A fotobiomodulação aumenta a produção de ATP, melhora a microcirculação do couro cabeludo e prolonga a fase anágena. A modalidade é aprovada pela FDA para a alopecia androgenética desde 2007, e o comprimento de onda de 650 nm associou-se a aumento significativo na contagem capilar em ensaio clínico randomizado." }]));
  c.push(p([{ text: "Observação: ", bold: true, italics: true }, { text: "os parâmetros do laser devem ser conferidos no manual do equipamento efetivamente utilizado e ajustados conforme a tolerância da paciente.", italics: true }]));

  c.push(h("5.2 Equipamentos utilizados", 2));
  c.push(bull([{ text: "• Aparelho de laser vermelho capilar (LLLT / fotobiomodulação);" }]));
  c.push(bull([{ text: "• Seringa com agulha 30G para a intradermoterapia (técnica de pápula);" }]));
  c.push(bull([{ text: "• Fotovideodermatoscópio para tricoscopia e registro da evolução." }]));

  c.push(h("5.3 Cosméticos e princípios ativos aplicados", 2));
  c.push(p([{ text: "Mescla PHD (intradermoterapia): ", bold: true }, { text: "Minoxidil 8 mg (circulação e prolongamento da fase anágena), Nanofatores de Crescimento Capilar 1% (sinalização folicular), Latanoprosta 50 mcg (estímulo ao crescimento e à espessura), Pill Food (L-Metionina, L-Taurina, L-Prolina, Biotina, D-Pantenol, vitaminas B2, B3 e B6 e L-Carnitina — nutrição do folículo) e Lidocaína 20 mg (conforto na aplicação)." }]));
  c.push(p([{ text: "Homecare: ", bold: true }, { text: "tônico Capilia Longa (derivado da cúrcuma), que auxilia na inibição da conversão de testosterona em di-hidrotestosterona (DHT), sustentando, entre as sessões, o resultado obtido em cabine." }]));

  c.push(h("5.4 Frequência das sessões", 2));
  c.push(bull([{ text: "• Intradermoterapia (Mescla PHD): sessões quinzenais;" }]));
  c.push(bull([{ text: "• Laser vermelho (LLLT): 2 a 3 vezes por semana, ~20 min por sessão;" }]));
  c.push(bull([{ text: "• Homecare (Capilia Longa): uso contínuo diário." }]));

  c.push(h("5.5 Orientações domiciliares", 2));
  c.push(bull([{ text: "• Uso contínuo do tônico Capilia Longa, conforme orientação;" }]));
  c.push(bull([{ text: "• Manutenção do tratamento médico da gastrite e acompanhamento gastroenterológico;" }]));
  c.push(bull([{ text: "• Manejo do estresse e cuidados com a higiene do sono;" }]));
  c.push(bull([{ text: "• Alimentação equilibrada, favorecendo a reposição de ferro, B12 e zinco;" }]));
  c.push(bull([{ text: "• Cuidados pós-sessão (evitar agressões químicas próximas às aplicações)." }]));

  c.push(h("5.6 Justificativa do protocolo", 2));
  c.push(p([{ text: "A sequência desinflamar → estimular respeita a fisiologia do couro cabeludo: só após o controle da inflamação o folículo responde bem ao estímulo. A intradermoterapia entrega os ativos diretamente no couro cabeludo, " }, { text: "contornando a má absorção gastrointestinal", bold: true }, { text: " que o " }, { text: "H. pylori", italics: true }, { text: " havia causado; o laser vermelho potencializa a microcirculação e a energia celular (ATP). A escolha é fundamentada em evidências de eficácia da fotobiomodulação e da mesoterapia/intradermoterapia na alopecia androgenética (ver seção 7)." }]));

  // ===== 6. EVOLUÇÃO =====
  c.push(h("6 EVOLUÇÃO CLÍNICA"));
  c.push(bull([{ text: "Resposta ao tratamento: ", bold: true }, { text: "favorável." }]));
  c.push(bull([{ text: "Alterações observadas: ", bold: true }, { text: "aumento da microcirculação do couro cabeludo e surgimento de novos fios nos espaçamentos das áreas anteriormente rarefeitas." }]));
  c.push(bull([{ text: "Ajustes realizados: ", bold: true }, { text: "transição da fase de desinflamação para a fase de estímulo, com introdução da intradermoterapia e do laser vermelho." }]));
  c.push(bull([{ text: "Grau de adesão do modelo: ", bold: true }, { text: "alto — uso contínuo do Capilia Longa por cerca de 2 anos, conclusão do tratamento de erradicação do " }, { text: "H. pylori", italics: true }, { text: " (com cura confirmada) e manutenção do tratamento da gastrite." }]));

  // ===== 7. FUNDAMENTAÇÃO =====
  c.push(h("7 FUNDAMENTAÇÃO CIENTÍFICA"));
  c.push(p("As condutas adotadas fundamentam-se em literatura científica atualizada:"));
  [
    "LOW-LEVEL laser therapy for androgenetic alopecia. Actas Dermo-Sifiliográficas, 2020. Disponível em: https://www.actasdermo.org/en-low-level-laser-therapy-for-androgenetic-articulo-S1578219020303887. Acesso em: 16 jun. 2026.",
    "NOVEL Approach to Treating Androgenetic Alopecia in Females With Photobiomodulation (Low-Level Laser Therapy). 2017. Disponível em: https://pubmed.ncbi.nlm.nih.gov/28328705/. Acesso em: 16 jun. 2026.",
    "LOW-LEVEL light therapy using a helmet-type device for the treatment of androgenetic alopecia: a 16-week, multicenter, randomized, double-blind, sham device-controlled trial. 2020. Disponível em: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7373546/. Acesso em: 16 jun. 2026.",
    "SYSTEMATIC review of mesotherapy: a novel avenue for the treatment of hair loss. Journal of Dermatological Treatment, 2023. Disponível em: https://www.tandfonline.com/doi/full/10.1080/09546634.2023.2245084. Acesso em: 16 jun. 2026.",
    "PRIE, B. E. et al. Oxidative stress in androgenetic alopecia. Journal of Medicine and Life, v. 9, n. 1, p. 79-83, 2016. Disponível em: https://pubmed.ncbi.nlm.nih.gov/27974920/. Acesso em: 16 jun. 2026.",
    "DOES Helicobacter pylori infection play a role in iron deficiency anemia? A meta-analysis. World Journal of Gastroenterology, 2010. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC2825337/. Acesso em: 16 jun. 2026.",
    "IRON deficiency and nonscarring alopecia in women: systematic review and meta-analysis. 2022. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC8928181/. Acesso em: 16 jun. 2026.",
    "GUO, E. L.; KATTA, R. Diet and hair loss: effects of nutrient deficiency and supplement use. Dermatology Practical & Conceptual, v. 7, n. 1, p. 1-10, 2017. Disponível em: https://ncbi.nlm.nih.gov/pmc/articles/PMC5315033/. Acesso em: 16 jun. 2026.",
  ].forEach((r, i) => c.push(refp(`${i + 1}. ${r}`)));

  // ===== 8. REGISTRO FOTOGRÁFICO =====
  c.push(h("8 REGISTRO FOTOGRÁFICO"));
  c.push(p("Mediante autorização da modelo (TCLE), o registro fotográfico foi padronizado, mantendo a mesma iluminação, o mesmo enquadramento e a mesma distância, para fins de comparação evolutiva."));
  c.push(blank());
  c.push(center("Figura 1 — Tricoscopia do couro cabeludo (vista superior)", { bold: true, size: SZS, after: 60 }));
  c.push(figura("salete-imagem-superior-capilar-1.jpeg"));
  c.push(center("Diversidade de calibre dos fios e óstios foliculares, compatível com miniaturização. Fonte: arquivo da autora (2026).", { italics: true, size: SZS }));
  c.push(blank());
  c.push(center("Figura 2 — Tricoscopia do couro cabeludo (vista superior)", { bold: true, size: SZS, after: 60 }));
  c.push(figura("salete-imagem-superior-capilar-2.jpeg"));
  c.push(center("Rarefação e espaçamento interfolicular na região do topo. Fonte: arquivo da autora (2026).", { italics: true, size: SZS }));

  const doc = new Document({ sections: [{ properties: { page: { margin: { top: convertInchesToTwip(1.18), bottom: convertInchesToTwip(0.79), left: convertInchesToTwip(1.18), right: convertInchesToTwip(0.79) } } }, children: c }] });
  const outDir = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\resultados finais";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "Relatorio-de-Atendimentos-Salete.docx");
  fs.writeFileSync(outPath, await Packer.toBuffer(doc));
  console.log("OK ->", outPath);
}
main().catch(e => { console.error("ERRO:", e); process.exit(1); });
