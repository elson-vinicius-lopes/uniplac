/* Roteiro de estudo BREVE e FÁCIL para a apresentação do Relatório (Salete). */
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip } = require("docx");
const fs = require("fs"), path = require("path");
const FONT = "Arial";
const p = (text, o = {}) => new Paragraph({ children: (Array.isArray(text) ? text : [{ text }]).map(t => new TextRun({ text: t.text, font: FONT, size: t.size || o.size || 22, bold: t.bold || o.bold, italics: t.italics })), spacing: { line: 300, after: o.after != null ? o.after : 100 }, alignment: o.align || AlignmentType.LEFT, indent: o.indent });
const h = (t) => new Paragraph({ children: [new TextRun({ text: t, font: FONT, size: 26, bold: true, color: "0070C0" })], spacing: { before: 220, after: 80 } });
const bull = (segs) => p(segs, { indent: { left: convertInchesToTwip(0.3) } });

async function main() {
  const c = [];
  c.push(new Paragraph({ children: [new TextRun({ text: "ROTEIRO DE ESTUDO — APRESENTAÇÃO (SALETE)", font: FONT, size: 30, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: 60 } }));
  c.push(p("Relatório de Atendimentos Capilares • Estética Capilar Avançada e Terapia Capilar II • ~5–7 min", { align: AlignmentType.CENTER, size: 18, after: 200 }));

  c.push(h("DECORE ESTA FRASE (a base de tudo)"));
  c.push(p([{ text: "“A paciente modelo feminina tem alopecia androgenética (genética). A H. pylori atrapalhou a absorção de nutrientes e, com o estresse, ", }, { text: "ACELEROU", bold: true }, { text: " a queda. Tratei em 2 fases — desinflamar e estimular (intradermoterapia PHD + laser vermelho + Capilia Longa). Resultado: mais circulação e fios novos.”", }], { italics: true }));

  c.push(h("O QUE FALAR EM CADA SLIDE (1 frase)"));
  [
    ["1. Capa", "“Sou a Paola; vou apresentar o atendimento capilar de uma paciente modelo feminina.”"],
    ["2. A paciente", "“Paciente modelo feminina, 61 anos, queda no topo há uns 3 anos; o pai tinha calvície.”"],
    ["3. Anamnese", "“Teve H. pylori (já curada), gastrite, alterações hormonais, muito estresse e faz química no cabelo.”"],
    ["4. A ligação", "“A H. pylori atrapalha a absorção de ferro, B12 e zinco — isso acelera a queda. Ela não causa, ela acelera.”"],
    ["5. Diagnóstico", "“Alopecia androgenética feminina, acelerada por intestino, hormônio e estresse.”"],
    ["6. Tratamento", "“Duas fases: primeiro desinflamar (óleo + argila), depois estimular (PHD + laser).”"],
    ["7. Como foi feito", "“Pápulas a cada 2 cm; laser vermelho ~660 nm; em casa o tônico Capilia Longa.”"],
    ["8. Fotos (tricoscopia)", "“Aqui dá pra ver os fios finos (miniaturização) e os espaços entre eles.”"],
    ["9. Resultado", "“Mais circulação e fios novos nos espaços; ela seguiu certinho.”"],
    ["10. Conclusão", "“Tratar o todo: estética + médico. Só o cabelo não basta. Obrigada!”"],
  ].forEach(([s, t]) => c.push(bull([{ text: s + ": ", bold: true }, { text: t }])));

  c.push(h("SE PERGUNTAREM (resposta curta)"));
  [
    ["A H. pylori causa a calvície?", "Não. Ela acelera, porque atrapalha a absorção de nutrientes."],
    ["O que é a Mescla PHD?", "Mistura injetável: minoxidil, fatores de crescimento, latanoprosta e vitaminas."],
    ["Por que laser vermelho?", "Aumenta a circulação e estimula os fios (fotobiomodulação)."],
    ["O que é o Capilia Longa?", "Tônico de cúrcuma que ajuda a segurar a DHT, usado em casa."],
    ["Por que 2 fases?", "Primeiro desinflama o couro; só depois o folículo responde bem ao estímulo."],
  ].forEach(([q, a]) => { c.push(p([{ text: "P: ", bold: true }, { text: q, bold: true }], { after: 20 })); c.push(p([{ text: "R: ", bold: true }, { text: a }], { after: 120 })); });

  c.push(h("NÃO ESQUECER"));
  ["Fale sempre “acelera”, nunca “causa”.", "Diga que foi sob supervisão e com autorização da paciente (TCLE).", "Fale com calma; é rápido (~5–7 min).", "Termine pela frase da conclusão."].forEach(t => c.push(bull([{ text: "• " }, { text: t }])));

  const doc = new Document({ sections: [{ properties: { page: { margin: { top: convertInchesToTwip(0.8), bottom: convertInchesToTwip(0.8), left: convertInchesToTwip(0.9), right: convertInchesToTwip(0.9) } } }, children: c }] });
  const outPath = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\resultados finais\\Roteiro-Estudo-Apresentacao-Salete.docx";
  fs.writeFileSync(outPath, await Packer.toBuffer(doc));
  console.log("OK ->", outPath);
}
main().catch(e => { console.error("ERRO:", e); process.exit(1); });
