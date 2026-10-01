/* Gera o ARTIGO CIENTIFICO (.docx) - formato exigido pela orientadora (2026/1).
 * Fonte unica de verdade: conteudo-artigo.json
 * Conferido contra o material OFICIAL da professora:
 *   "ORIENTACOES PARA ELABORACAO DO ARTIGO CIENTIFICO - seminarios II.pptx"
 * ABNT: Arial ou Times New Roman 12; espacamento SIMPLES em todo o texto;
 * justificado (referencias a esquerda); recuo de paragrafo 1,25 cm;
 * margens superior/esquerda 3 cm e inferior/direita 2 cm;
 * citacoes longas, notas de rodape, paginacao, legendas e fontes em 10.
 */
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertMillimetersToTwip,
        Table, TableRow, TableCell, WidthType, ShadingType, PageBreak, ImageRun,
        FootnoteReferenceRun, Header, PageNumber } = require("docx");
const fs = require("fs");
const path = require("path");

const FONT = "Times New Roman";
const SZ = 24;        // 12 pt
const SZ10 = 20;      // 10 pt
const LINE = 240;     // simples
const INDENT = convertMillimetersToTwip(12.5); // 1,25 cm

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "conteudo-artigo.json"), "utf8"));

function runsOf(block) {
  const arr = block.runs || [{ t: block.t }];
  const out = [];
  for (const r of arr) {
    if (r.fn) { out.push(new FootnoteReferenceRun(r.fn)); continue; }
    out.push(new TextRun({ text: r.t, font: FONT, size: r.sz || block.sz || SZ,
      bold: !!r.b, italics: !!r.i, allCaps: !!r.caps }));
  }
  return out;
}
function para(block, opt = {}) {
  const { alignment = AlignmentType.JUSTIFIED, after = 0, line = LINE, indent } = opt;
  return new Paragraph({
    children: runsOf(block),
    spacing: { line, after: block.after !== undefined ? block.after : after },
    alignment: block.align ? AlignmentType[block.align.toUpperCase()] : alignment,
    indent: block.firstLine === false ? undefined : (indent || { firstLine: INDENT }),
  });
}
/* Hierarquia tipografica exigida (Modelo 2 da orientacao oficial):
 *   secao primaria   -> CAIXA ALTA + negrito
 *   secao secundaria -> negrito
 *   secao terciaria  -> negrito + italico
 * Titulos sem indicativo numerico (RESUMO, ABSTRACT, REFERENCIAS,
 * AGRADECIMENTOS, ANEXOS) -> caixa alta, negrito e CENTRALIZADOS. */
function heading(text, lvl, centered = false) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: SZ, bold: true, italics: lvl === 3 })],
    heading: lvl === 1 ? HeadingLevel.HEADING_1 : lvl === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120, line: LINE },
    alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
  });
}
/* Referencias: alinhadas a margem esquerda e separadas entre si por UMA linha
 * em branco de espaco simples (nao por espacamento reduzido). */
function refPara(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: SZ })],
    spacing: { line: LINE, after: 240 }, alignment: AlignmentType.LEFT,
  });
}
function citacaoLonga(text) { // recuo 4 cm, fonte 10, simples
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: SZ10 })],
    spacing: { line: LINE, before: 120, after: 120 },
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: convertMillimetersToTwip(40) },
  });
}
/* Ilustracoes / quadros / tabelas (orientacao oficial):
 *  - titulo na parte SUPERIOR, ALINHADO A ESQUERDA, fonte 12, espacamento simples;
 *  - fonte consultada na parte INFERIOR, fonte 10, simples, alinhada a margem
 *    da ilustracao (esquerda).
 * Titulos de ANEXO/APENDICE: centralizados, negrito e em caixa alta. */
function legenda(text, opts = {}) {
  const anexo = !!opts.anexo;
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: opts.b ? SZ : SZ10, bold: !!opts.b, allCaps: anexo })],
    spacing: { line: LINE, after: opts.after || 0 },
    alignment: anexo ? AlignmentType.CENTER : AlignmentType.LEFT,
  });
}
function cell(text, { bold = false, shade, w = 20 } = {}) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, font: FONT, size: SZ10, bold })],
      spacing: { line: LINE } })],
    shading: shade ? { type: ShadingType.SOLID, color: shade } : undefined,
    width: { size: w, type: WidthType.PERCENTAGE },
  });
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
      case "blank": c.push(new Paragraph({ children: [], spacing: { line: LINE } })); break;
      case "pagebreak": c.push(new Paragraph({ children: [new PageBreak()] })); break;
      case "titulo":
        c.push(new Paragraph({ children: [new TextRun({ text: b.t, font: FONT, size: SZ, bold: true })],
          alignment: AlignmentType.CENTER, spacing: { line: LINE, after: 120 } })); break;
      case "subtitulo":
        c.push(new Paragraph({ children: [new TextRun({ text: b.t, font: FONT, size: SZ })],
          alignment: AlignmentType.CENTER, spacing: { line: LINE, after: 240 } })); break;
      case "autoria":
        c.push(new Paragraph({ children: runsOf(b), alignment: AlignmentType.RIGHT,
          spacing: { line: LINE, after: b.after !== undefined ? b.after : 0 } })); break;
      case "h1": c.push(heading(b.t, 1, !!b.center)); break;
      case "h2": c.push(heading(b.t, 2)); break;
      case "h3": c.push(heading(b.t, 3)); break;
      case "p": c.push(para(b)); break;
      case "p0": c.push(para(b, { indent: undefined })); break; // sem recuo (resumo/abstract)
      case "citacao": c.push(citacaoLonga(b.t)); break;
      case "legenda": c.push(legenda(b.t, b)); break;
      case "ref": c.push(refPara(b.t)); break;
      case "table": c.push(tableOf(b)); break;
      case "image": {
        const sp = path.isAbsolute(b.src) ? b.src : path.resolve(__dirname, b.src);
        c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60, line: LINE },
          children: [new ImageRun({ type: b.itype || "png", data: fs.readFileSync(sp),
            transformation: { width: b.w || 320, height: b.h || 400 } })] }));
        break;
      }
      default: break;
    }
  }

  const footnotes = {};
  Object.entries(data.footnotes).forEach(([k, v]) => {
    // Nota de rodape: fonte 10, espacamento simples e deslocamento de 0,5 cm
    // a partir da segunda linha da mesma nota (recuo pendente).
    footnotes[k] = { children: [new Paragraph({
      children: [new TextRun({ text: v, font: FONT, size: SZ10 })],
      spacing: { line: LINE }, alignment: AlignmentType.JUSTIFIED,
      indent: { left: convertMillimetersToTwip(5), hanging: convertMillimetersToTwip(5) } })] };
  });

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: SZ } } } },
    footnotes,
    sections: [{
      properties: { page: { margin: {
        top: convertMillimetersToTwip(30), bottom: convertMillimetersToTwip(20),
        left: convertMillimetersToTwip(30), right: convertMillimetersToTwip(20),
      } } },
      headers: { default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT, spacing: { line: LINE },
        children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: SZ10 })],
      })] }) },
      children: c,
    }],
  });

  const outPath = path.isAbsolute(data.out) ? data.out : path.resolve(__dirname, data.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, await Packer.toBuffer(doc));
  const refs = data.blocks.filter(b => b.type === "ref").length;
  console.log("OK ->", outPath, "| blocos:", data.blocks.length, "| referencias:", refs);
}
main().catch(e => { console.error("ERRO:", e); process.exit(1); });
