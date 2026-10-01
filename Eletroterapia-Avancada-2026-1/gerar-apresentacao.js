/* Apresentacao — Eletroterapia Avancada 2026/1 (1 resultado: radiofrequencia no braco da Paola + tabela de medidas).
 * Conteudo em slides-apresentacao.json. Reutiliza pptxgenjs e os logos do TCC.
 */
const pptxgen = require("../Alopecia-Andogenetica-Feminina/node_modules/pptxgenjs");
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(DIR, "slides-apresentacao.json"), "utf8"));
const OUT = path.resolve(DIR, data.outRel);
const ASSETS = path.resolve(DIR, "../Alopecia-Andogenetica-Feminina/assets-aag");
const LOGO_L = path.join(ASSETS, "logo-uniplac.png");
const LOGO_R = path.join(ASSETS, "logo-labest.jpeg");

const PRIM = "0070C0", DARK = "1A1A1A", GRAY = "595959", WHITE = "FFFFFF", LIGHT = "EAF2FB";
const FONT = "Arial";

const p = new pptxgen();
p.layout = "LAYOUT_WIDE";
p.defineSlideMaster({ title: "M", background: { color: WHITE } });

function footer(s) { s.addText(data.footer, { x: 0.4, y: 7.08, w: 12.5, h: 0.32, fontFace: FONT, fontSize: 9, color: GRAY }); }
function logos(s, y, h) {
  if (fs.existsSync(LOGO_L)) s.addImage({ path: LOGO_L, x: 0.25, y: y, w: h * 1.0625, h: h, sizing: { type: "contain", w: h * 1.0625, h: h } });
  if (fs.existsSync(LOGO_R)) s.addImage({ path: LOGO_R, x: 13.33 - 0.25 - h, y: y, w: h, h: h, sizing: { type: "contain", w: h, h: h } });
}
function header(s, title) {
  logos(s, 0.12, 0.88);
  s.addText(title, { x: 1.4, y: 0.1, w: 10.53, h: 1.0, fontFace: FONT, fontSize: 22, bold: true, color: PRIM, align: "center", valign: "middle" });
  s.addShape(p.ShapeType.rect, { x: 0.25, y: 1.12, w: 12.83, h: 0.035, fill: { color: PRIM } });
}
function bullets(s, items, opt = {}) {
  s.addText(items.map(t => ({ text: t, options: { bullet: { code: "2022", indent: 18 }, breakLine: true } })),
    Object.assign({ x: 0.7, y: 1.35, w: 12.0, h: 5.4, fontFace: FONT, fontSize: 18, color: DARK, lineSpacingMultiple: 1.25, paraSpaceAfter: 8, valign: "top" }, opt));
}

for (const sl of data.slides) {
  if (sl.type === "capa") {
    const s = p.addSlide({ masterName: "M" });
    logos(s, 0.35, 1.15);
    s.addShape(p.ShapeType.rect, { x: 0, y: 2.2, w: "100%", h: 2.9, fill: { color: PRIM } });
    s.addText(sl.title, { x: 0.5, y: 2.35, w: 12.3, h: 1.2, align: "center", fontFace: FONT, fontSize: 30, bold: true, color: WHITE });
    s.addText(sl.subtitle, { x: 1.0, y: 3.55, w: 11.3, h: 1.2, align: "center", fontFace: FONT, fontSize: 16, italic: true, color: WHITE });
    s.addText([{ text: sl.author + "\n", options: { fontSize: 15, bold: true } }, { text: sl.sub2, options: { fontSize: 12, color: GRAY } }],
      { x: 0.5, y: 5.5, w: 12.3, h: 1.2, align: "center", fontFace: FONT, color: DARK });
    if (sl.notes) s.addNotes(sl.notes);
    continue;
  }
  const s = p.addSlide({ masterName: "M" });
  header(s, sl.title);
  footer(s);
  if (sl.type === "content") {
    bullets(s, sl.bullets);
  } else if (sl.type === "placeholder") {
    if (sl.bullets) bullets(s, sl.bullets, { h: 1.2 });
    const boxes = sl.boxes || ["[INSERIR FOTO — ANTES]", "[INSERIR FOTO — DEPOIS]"];
    const imgs = sl.images || [];
    const y = sl.bullets ? 2.7 : 1.5, h = 3.8, w = 5.6;
    boxes.slice(0, 2).forEach((label, i) => {
      const x = i === 0 ? 0.9 : 6.85;
      const ip = imgs[i] ? path.resolve(DIR, imgs[i]) : null;
      if (ip && fs.existsSync(ip)) {
        s.addImage({ path: ip, x, y, w, h, sizing: { type: "contain", w, h } });
      } else {
        s.addShape(p.ShapeType.rect, { x, y, w, h, fill: { color: "F2F2F2" }, line: { color: "AAAAAA", width: 1, dashType: "dash" } });
        s.addText(label, { x, y, w, h, align: "center", valign: "middle", fontFace: FONT, fontSize: 16, italic: true, color: "777777" });
      }
    });
  } else if (sl.type === "table") {
    if (sl.intro) s.addText(sl.intro, { x: 0.7, y: 1.3, w: 12.0, h: 0.6, fontFace: FONT, fontSize: 16, color: DARK });
    const head = sl.header.map(t => ({ text: t, options: { bold: true, color: WHITE, fill: { color: PRIM }, fontFace: FONT, fontSize: 16, align: "center", valign: "middle" } }));
    const body = sl.rows.map((r, ri) => r.map((cellTxt, ci) => ({ text: cellTxt, options: { fontFace: FONT, fontSize: 15, bold: ci === 0 || ri === sl.rows.length - 1, color: DARK, fill: { color: ri % 2 ? WHITE : LIGHT }, align: ci === 0 ? "left" : "center", valign: "middle" } })));
    s.addTable([head, ...body], { x: 1.2, y: sl.intro ? 2.1 : 1.5, w: 10.9, colW: sl.colW || null, border: { type: "solid", color: "BFBFBF", pt: 1 }, rowH: 0.7, autoPage: false });
    if (sl.nota) s.addText(sl.nota, { x: 0.7, y: 5.6, w: 12.0, h: 0.8, fontFace: FONT, fontSize: 13, italic: true, color: GRAY });
  }
  if (sl.notes) s.addNotes(sl.notes);
}

p.writeFile({ fileName: OUT }).then(() => { console.log("OK ->", OUT); console.log("Slides:", data.slides.length, "| Tamanho:", (fs.statSync(OUT).size / 1024).toFixed(1), "KB"); });
