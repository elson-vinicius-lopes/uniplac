/* Gera o Roteiro de apresentacao (.docx) a partir das NOTAS de cada slide em slides-foco-aag.json.
 * Mantem o roteiro sempre alinhado ao deck. Saida: Roteiro-de-Apresentacao-e-Estudo.docx
 */
const { Document, Packer, Paragraph, TextRun, AlignmentType, convertInchesToTwip } = require("docx");
const fs = require("fs");
const path = require("path");

const FONT = "Times New Roman", SZ = 24, LINE = 360;
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "slides-foco-aag.json"), "utf8"));

const p = (runs, o = {}) => new Paragraph({
  children: (Array.isArray(runs) ? runs : [{ t: runs }]).map(r => new TextRun({ text: r.t, font: FONT, size: r.sz || SZ, bold: r.b, italics: r.i })),
  spacing: { line: o.line || LINE, after: o.after != null ? o.after : 120 },
  alignment: o.align || AlignmentType.JUSTIFIED,
});
const head = (t, sz = 26) => p([{ t, b: true, sz }], { align: AlignmentType.LEFT, after: 80 });

const banca = [
  ["A gastrite / H. pylori causa a alopecia androgenética?", "Não. A alopecia androgenética é genético-hormonal (ação da DHT). A gastrite e o H. pylori são coadjuvantes: podem reduzir a absorção de ferro e B12 e aumentar o estresse oxidativo, agravando a miniaturização de um folículo já predisposto."],
  ["Por que fotobiomodulação (e não microcorrentes)?", "Porque a fotobiomodulação tem eficácia demonstrada em ensaios clínicos randomizados na AAG, é não invasiva e segura: aumenta o ATP da célula, melhora a microcirculação e prolonga a fase anágena (Avci et al., 2014; Yoon et al., 2020)."],
  ["Por que dose baixa de ~2 J/cm²?", "Pela resposta bifásica: dose baixa estimula e dose alta inibe (Avci et al., 2014). 2 J/cm² fica na janela que estimula o crescimento."],
  ["É seguro combinar laser e intradermoterapia?", "Sim. A literatura de terapia combinada mostra benefício ao menos equivalente à monoterapia, sem efeitos adversos atribuíveis à combinação (Kaiser et al., 2022). O excesso a evitar é o da dose do laser, não a soma das técnicas."],
  ["A esteticista pode aplicar a intradermoterapia?", "Dentro da competência e da legislação da área. A erradicação do H. pylori e a reposição nutricional são conduzidas pelo médico — por isso o trabalho ocorre em paralelo ao acompanhamento médico."],
  ["Como você avalia o resultado?", "Por tricoscopia seriada e registro fotográfico padronizado, acompanhando densidade e espessura dos fios ao longo do protocolo."],
];
const dicas = [
  "Nunca diga que a gastrite/H. pylori \"causa\" a alopecia androgenética — diga \"agrava\" / \"coadjuvante\".",
  "Fale com calma; cerca de 40 a 50 segundos por slide de conteúdo cabe no tempo.",
  "Domine o Método e o Cronograma — é onde a banca costuma focar.",
  "Tenha os laudos (endoscopia/exames) à mão para citar se perguntarem.",
];

const c = [];
c.push(p([{ t: "ROTEIRO DE APRESENTAÇÃO E ESTUDO", b: true, sz: 30 }], { align: AlignmentType.CENTER }));
c.push(p([{ t: "Seminário — Alopecia androgenética feminina com tricoscopia e tratamentos associados | Apresentadora: Paola Bortoli | Duração-alvo: 12–15 min", sz: 20 }], { align: AlignmentType.CENTER, after: 240 }));

c.push(head("A IDEIA CENTRAL (decore)"));
c.push(p("A alopecia androgenética feminina é genético-hormonal (ação da DHT) e diagnosticada por tricoscopia. O tratamento estético combina fotobiomodulação (laser vermelho ~655–660 nm, ~2 J/cm²) e intradermoterapia capilar (Mescla PHD), conduzido em paralelo ao acompanhamento médico. Fatores como gastrite e H. pylori são coadjuvantes — agravam, não causam."));

c.push(head("ROTEIRO SLIDE A SLIDE"));
data.slides.forEach((s, i) => {
  const titulo = s.type === "capa" ? "Capa" : s.title;
  c.push(p([{ t: `Slide ${i + 1} — ${titulo}`, b: true }], { align: AlignmentType.LEFT, after: 40 }));
  if (s.notes) c.push(p([{ t: "Fale: ", b: true }, { t: s.notes }]));
});

c.push(head("BANCO DE PERGUNTAS DA BANCA (com respostas)"));
banca.forEach(([q, a]) => {
  c.push(p([{ t: "P: ", b: true }, { t: q, b: true }], { after: 20 }));
  c.push(p([{ t: "R: " }, { t: a }]));
});

c.push(head("DICAS FINAIS DE APRESENTAÇÃO"));
dicas.forEach(d => c.push(p([{ t: "• " + d }], { align: AlignmentType.LEFT, after: 60 })));

const doc = new Document({
  sections: [{
    properties: { page: { margin: { top: convertInchesToTwip(1.18), bottom: convertInchesToTwip(0.79), left: convertInchesToTwip(1.18), right: convertInchesToTwip(0.79) } } },
    children: c,
  }],
});
const outPath = path.resolve(__dirname, "../resultados finais/estudo de caso/Roteiro-de-Apresentacao-e-Estudo.docx");
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log("OK ->", outPath, "| slides no roteiro:", data.slides.length); });
