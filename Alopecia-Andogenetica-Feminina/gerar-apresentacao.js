/* Apresentação SIMPLES e BREVE (.pptx) do Relatório de Atendimentos da Salete.
 * Palavras fáceis de decorar. 10 slides. Inclui as tricoscopias e notas do orador.
 */
const pptxgen = require("pptxgenjs");
const path = require("path");
const ATT = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\attachments";
const OUT = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\resultados finais\\Apresentacao-Relatorio-Salete.pptx";

const PRIM = "0070C0", DARK = "1A1A1A", GRAY = "595959", WHITE = "FFFFFF";
const p = new pptxgen();
p.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
p.defineSlideMaster({ title: "M", background: { color: WHITE } });

function content(title, bullets, notes) {
  const s = p.addSlide({ masterName: "M" });
  s.addShape(p.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 1.0, fill: { color: PRIM } });
  s.addText(title, { x: 0.5, y: 0, w: 12.3, h: 1.0, fontFace: "Arial", fontSize: 28, bold: true, color: WHITE, valign: "middle" });
  s.addText(bullets.map(t => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true } })),
    { x: 0.8, y: 1.35, w: 11.7, h: 5.6, fontFace: "Arial", fontSize: 24, color: DARK, lineSpacingMultiple: 1.3, paraSpaceAfter: 10, valign: "top" });
  s.addText("Relatório de Atendimentos Capilares | Estética Capilar Avançada e Terapia Capilar II", { x: 0.5, y: 7.05, w: 12.3, h: 0.35, fontFace: "Arial", fontSize: 10, color: GRAY });
  if (notes) s.addNotes(notes);
  return s;
}

// 1 — CAPA
const capa = p.addSlide({ masterName: "M" });
capa.addShape(p.ShapeType.rect, { x: 0, y: 2.5, w: "100%", h: 2.5, fill: { color: PRIM } });
capa.addText("RELATÓRIO DE ATENDIMENTOS CAPILARES", { x: 0.5, y: 2.7, w: 12.3, h: 0.9, align: "center", fontFace: "Arial", fontSize: 32, bold: true, color: WHITE });
capa.addText("Caso clínico — Alopecia Androgenética e Helicobacter pylori", { x: 0.5, y: 3.7, w: 12.3, h: 0.7, align: "center", fontFace: "Arial", fontSize: 20, italic: true, color: WHITE });
capa.addText([
  { text: "Acadêmica: Paola Bortoli Pinheiro Lopes   •   Modelo: Paciente modelo feminina\n", options: { fontSize: 16, bold: true } },
  { text: "Estética Capilar Avançada e Terapia Capilar II   •   Profa. Márcia de Liz   •   UNIPLAC, 2026", options: { fontSize: 13, color: GRAY } },
], { x: 0.5, y: 5.4, w: 12.3, h: 1.2, align: "center", fontFace: "Arial", color: DARK });
capa.addNotes("Bom dia. Eu sou a Paola. Vou apresentar o atendimento capilar de uma paciente modelo feminina: um caso de alopecia androgenética ligada ao Helicobacter pylori.");

// 2 — A PACIENTE
content("A paciente", [
  "Paciente modelo feminina, 61 anos.",
  "Queixa: queda de cabelo no topo da cabeça.",
  "Há cerca de 3 anos.",
  "Pai com calvície — predisposição genética.",
], "A paciente tem 61 anos e procurou ajuda pela queda no topo da cabeça, que começou há uns 3 anos. O pai dela tinha calvície, ou seja, ela tem a genética.");

// 3 — ANAMNESE
content("O que ela tem (anamnese)", [
  "Teve Helicobacter pylori — já curada.",
  "Gastrite crônica (ainda em tratamento).",
  "Alterações hormonais.",
  "Muito estresse e sono ruim (acorda à noite).",
  "Faz mechas e coloração.",
], "Na conversa com a paciente levantei: ela teve H. pylori, que já foi curada; tem gastrite em tratamento; alterações hormonais; é bem estressada e dorme mal; e faz química no cabelo (mechas e coloração).");

// 4 — A LIGAÇÃO (principal)
content("A ligação: H. pylori e a queda", [
  "A H. pylori dificultou a absorção de nutrientes (ferro, B12 e zinco).",
  "Falta de nutrientes + estresse = couro cabeludo enfraquecido.",
  "Resultado: a queda foi acelerada.",
  "Importante: a H. pylori não CAUSA a alopecia — ela ACELERA.",
], "Este é o ponto principal. A bactéria atrapalha a absorção de ferro, B12 e zinco. Sem nutrientes, e com estresse, o folículo enfraquece e a queda acelera. Atenção: a H. pylori não causa a alopecia; ela acelera.");

// 5 — DIAGNÓSTICO
content("Diagnóstico", [
  "Alopecia Androgenética Feminina.",
  "Origem genética (pai calvo)...",
  "...acelerada por fatores do corpo: intestino, hormônio e estresse.",
], "O diagnóstico é alopecia androgenética feminina. A base é genética, mas o que acelerou foram os fatores do corpo: o intestino (H. pylori), o hormônio e o estresse.");

// 6 — TRATAMENTO (2 fases)
content("O tratamento — 2 fases", [
  "Fase 1 — Desinflamar: óleos essenciais + argiloterapia.",
  "Fase 2 — Estimular: intradermoterapia (Mescla PHD) + laser vermelho.",
  "Em casa: tônico Capilia Longa (uso contínuo).",
], "O tratamento tem 2 fases. Primeiro desinflamei o couro cabeludo com óleos essenciais e argila. Depois entrei na fase de estímulo: intradermoterapia com a Mescla PHD e laser vermelho. Em casa ela usa o tônico Capilia Longa.");

// 7 — COMO FOI FEITO (detalhado, igual ao Word)
const s7 = p.addSlide({ masterName: "M" });
s7.addShape(p.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 1.0, fill: { color: PRIM } });
s7.addText("Como foi feito (passo a passo)", { x: 0.5, y: 0, w: 12.3, h: 1.0, fontFace: "Arial", fontSize: 28, bold: true, color: WHITE, valign: "middle" });
s7.addText([
  { text: "Intradermoterapia (técnica de pápula): ", options: { bold: true, bullet: { code: "2022" }, breakLine: false } },
  { text: "microinjeções na junção dermoepidérmica; profundidade de 2 a 4 mm; agulha 30G; cerca de 0,05–0,1 mL por ponto; pápulas espaçadas a cada 2 cm por toda a área de rarefação. Sessões quinzenais.", options: { breakLine: true } },
  { text: "Mescla PHD (ativos injetados): ", options: { bold: true, bullet: { code: "2022" }, breakLine: false } },
  { text: "Minoxidil 8 mg, Nanofatores de Crescimento Capilar 1%, Latanoprosta 50 mcg, Pill Food (L-metionina, L-taurina, L-prolina, biotina, D-pantenol, vitaminas B2, B3 e B6, L-carnitina) e Lidocaína 20 mg.", options: { breakLine: true } },
  { text: "Laser vermelho — LLLT / fotobiomodulação: ", options: { bold: true, bullet: { code: "2022" }, breakLine: false } },
  { text: "luz vermelha de 650–660 nm; densidade de potência de 3 a 90 mW/cm²; fluência de 1 a 10 J/cm²; ~20 min por sessão, 2 a 3 vezes por semana. Aumenta o ATP, melhora a microcirculação e prolonga a fase anágena.", options: { breakLine: true } },
  { text: "Homecare (em casa): ", options: { bold: true, bullet: { code: "2022" }, breakLine: false } },
  { text: "tônico Capilia Longa (derivado da cúrcuma), uso diário — auxilia na inibição da conversão de testosterona em DHT.", options: { breakLine: true } },
], { x: 0.8, y: 1.3, w: 11.7, h: 5.65, fontFace: "Arial", fontSize: 16, color: DARK, lineSpacingMultiple: 1.12, paraSpaceAfter: 10, valign: "top" });
s7.addText("Relatório de Atendimentos Capilares | Estética Capilar Avançada e Terapia Capilar II", { x: 0.5, y: 7.05, w: 12.3, h: 0.35, fontFace: "Arial", fontSize: 10, color: GRAY });
s7.addNotes("Aqui detalho o procedimento, igual ao relatório. Intradermoterapia pela técnica de pápula: agulha 30G, profundidade de 2 a 4 mm, cerca de 0,05 a 0,1 mL por ponto, pápulas a cada 2 cm por toda a área, em sessões quinzenais. A Mescla PHD tem minoxidil 8 mg, nanofatores de crescimento, latanoprosta e o Pill Food (aminoácidos e vitaminas). O laser vermelho é de 650 a 660 nm, baixa potência, cerca de 20 minutos, 2 a 3 vezes por semana. Em casa, o tônico Capilia Longa, todos os dias.");

// 8 — TRICOSCOPIA (fotos)
const sFotos = p.addSlide({ masterName: "M" });
sFotos.addShape(p.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 1.0, fill: { color: PRIM } });
sFotos.addText("Registro — tricoscopia do couro cabeludo", { x: 0.5, y: 0, w: 12.3, h: 1.0, fontFace: "Arial", fontSize: 28, bold: true, color: WHITE, valign: "middle" });
sFotos.addImage({ path: path.join(ATT, "salete-imagem-superior-capilar-1.jpeg"), x: 1.1, y: 1.5, w: 4.9, h: 3.92 });
sFotos.addImage({ path: path.join(ATT, "salete-imagem-superior-capilar-2.jpeg"), x: 7.3, y: 1.5, w: 4.9, h: 3.92 });
sFotos.addText("Fios de espessuras diferentes (miniaturização).", { x: 1.1, y: 5.5, w: 4.9, h: 0.6, align: "center", fontFace: "Arial", fontSize: 14, color: DARK });
sFotos.addText("Rarefação e espaços entre os fios.", { x: 7.3, y: 5.5, w: 4.9, h: 0.6, align: "center", fontFace: "Arial", fontSize: 14, color: DARK });
sFotos.addText("Relatório de Atendimentos Capilares", { x: 0.5, y: 7.05, w: 12.3, h: 0.35, fontFace: "Arial", fontSize: 10, color: GRAY });
sFotos.addNotes("Estas são as imagens reais do couro cabeludo da paciente. Na primeira dá pra ver fios de espessuras diferentes, que é a miniaturização. Na segunda dá pra ver a rarefação, os espaços entre os fios.");

// 9 — RESULTADO
content("O resultado", [
  "Couro cabeludo com mais microcirculação.",
  "Apareceram fios novos nos espaços.",
  "Boa adesão da paciente ao tratamento.",
], "O resultado foi bom: o couro cabeludo ficou com mais circulação e apareceram fios novos nos espaços que estavam vazios. A paciente seguiu direitinho o tratamento.");

// 10 — CONCLUSÃO
content("Conclusão", [
  "Tratar o todo: estética + acompanhamento médico.",
  "Tratar só o cabelo não basta — é preciso tratar a causa.",
  "Obrigada!",
], "Para concluir: o segredo foi tratar o conjunto — a estética junto com o médico. Tratar só o cabelo não resolve; tem que tratar a causa. Obrigada!");

p.writeFile({ fileName: OUT }).then(f => console.log("OK ->", f));
