/* Relatorio de pratica — Eletroterapia Avancada 2026/1 (foco: radiofrequencia em braco, Paola).
 * Conteudo em conteudo-relatorio.json. Reutiliza a lib docx do TCC (../Alopecia-Andogenetica-Feminina/node_modules).
 * ABNT: Times 12, 1,5, justificado, margens 3/2/3/2 cm.
 */
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip,
        Table, TableRow, TableCell, WidthType, ShadingType, PageBreak, ImageRun } = require("../Alopecia-Andogenetica-Feminina/node_modules/docx");
const fs = require("fs");
const path = require("path");

const FONT = "Times New Roman", SZ = 24, SZS = 20, LINE = 360;
const jsonFile = process.argv[2] || "conteudo-relatorio.json";
const data = JSON.parse(fs.readFileSync(path.join(__dirname, jsonFile), "utf8"));

function runsOf(block) {
  const arr = block.runs || [{ t: block.t }];
  return arr.map(r => new TextRun({ text: r.t, font: FONT, size: r.sz || SZ, bold: !!r.b, italics: !!r.i }));
}
function para(block, { alignment = AlignmentType.JUSTIFIED, after = 120, line = LINE } = {}) {
  return new Paragraph({ children: runsOf(block), spacing: { line, after }, alignment,
    indent: block.firstLine ? { firstLine: convertInchesToTwip(0.5) } : undefined });
}
function heading(text, lvl) {
  return new Paragraph({ children: [new TextRun({ text, font: FONT, size: lvl === 1 ? 26 : 24, bold: true })],
    heading: lvl === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2, spacing: { before: 240, after: 100, line: LINE }, alignment: AlignmentType.LEFT });
}
function refPara(text) {
  return new Paragraph({ children: [new TextRun({ text, font: FONT, size: SZS })],
    spacing: { line: 240, after: 140 }, alignment: AlignmentType.LEFT, indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.5) } });
}
function cell(text, { bold = false, shade, w = 20 } = {}) {
  return new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, font: FONT, size: 18, bold })] })],
    shading: shade ? { type: ShadingType.SOLID, color: shade } : undefined, width: { size: w, type: WidthType.PERCENTAGE } });
}
function tableOf(block) {
  const w = Math.floor(100 / block.header.length);
  const header = new TableRow({ children: block.header.map(t => cell(t, { bold: true, shade: "D9E2F3", w })) });
  const body = block.rows.map(r => new TableRow({ children: r.map(t => cell(t, { w })) }));
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [header, ...body] });
}

async function main() {
  const c = [];
  for (const b of data.blocks) {
    switch (b.type) {
      case "blank": c.push(new Paragraph({ children: [] })); break;
      case "pagebreak": c.push(new Paragraph({ children: [new PageBreak()] })); break;
      case "center": c.push(para(b, { alignment: AlignmentType.CENTER })); break;
      case "h1": c.push(heading(b.t, 1)); break;
      case "h2": c.push(heading(b.t, 2)); break;
      case "p": c.push(para(b)); break;
      case "ref": c.push(refPara(b.t)); break;
      case "table": c.push(tableOf(b)); break;
      case "placeholder": c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 },
        border: { top: { style: "dashed", size: 4, color: "999999" }, bottom: { style: "dashed", size: 4, color: "999999" }, left: { style: "dashed", size: 4, color: "999999" }, right: { style: "dashed", size: 4, color: "999999" } },
        children: [new TextRun({ text: b.t, font: FONT, size: SZS, italics: true, color: "777777" })] })); break;
      case "image": {
        const sp = path.isAbsolute(b.src) ? b.src : path.resolve(__dirname, b.src);
        if (fs.existsSync(sp)) {
          const ext = path.extname(sp).toLowerCase().replace(".", "");
          const itype = b.itype || (ext === "jpeg" ? "jpg" : ext) || "png";
          c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
            children: [new ImageRun({ type: itype, data: fs.readFileSync(sp), transformation: { width: b.w || 320, height: b.h || 240 } })] }));
        } else {
          c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 },
            border: { top: { style: "dashed", size: 4, color: "999999" }, bottom: { style: "dashed", size: 4, color: "999999" }, left: { style: "dashed", size: 4, color: "999999" }, right: { style: "dashed", size: 4, color: "999999" } },
            children: [new TextRun({ text: b.alt || "[INSERIR FOTO]", font: FONT, size: SZS, italics: true, color: "777777" })] }));
        }
        break;
      }
      default: break;
    }
  }
  const doc = new Document({ sections: [{ properties: { page: { margin: {
    top: convertInchesToTwip(1.18), bottom: convertInchesToTwip(0.79), left: convertInchesToTwip(1.18), right: convertInchesToTwip(0.79) } } }, children: c }] });
  const outPath = path.resolve(__dirname, data.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, await Packer.toBuffer(doc));
  console.log("OK ->", outPath, "| blocos:", data.blocks.length);
}
main().catch(e => { console.error("ERRO:", e); process.exit(1); });
