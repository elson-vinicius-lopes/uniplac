/* Gera o .pptx do seminario REFOCADO em Alopecia Androgenetica (laser 2 J/cm2 + intradermo PHD).
 * Single source of truth: slides-foco-aag.json. Imagens clinicas em assets-aag/. Caminhos relativos.
 * Saida definida por "outRel" no JSON (o arquivo oficial REVISADO.pptx).
 */
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(DIR, "slides-foco-aag.json"), "utf8"));
const ASSETS = path.resolve(DIR, data.assetsRel);
const OUT = path.resolve(DIR, data.outRel);
const asset = f => (f ? path.join(ASSETS, f) : null);
const LOGO_L = asset(data.logoLeft);   // UNIPLAC (esquerda)
const LOGO_R = asset(data.logoRight);  // LABEST (direita)

const PRIM = "0070C0", DARK = "1A1A1A", GRAY = "595959", WHITE = "FFFFFF", LIGHT = "EAF2FB";
const FONT = "Arial";

const p = new pptxgen();
p.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
p.defineSlideMaster({ title: "M", background: { color: WHITE } });

function footer(s) {
  s.addText(data.footer, { x: 0.4, y: 7.08, w: 12.5, h: 0.32, fontFace: FONT, fontSize: 9, color: GRAY });
}
function logos(s, y, h) {
  // Requisito do professor: UNIPLAC a esquerda, LABEST a direita — em todo slide.
  if (LOGO_L && fs.existsSync(LOGO_L)) s.addImage({ path: LOGO_L, x: 0.25, y: y, w: h * 1.0625, h: h, sizing: { type: "contain", w: h * 1.0625, h: h } });
  if (LOGO_R && fs.existsSync(LOGO_R)) s.addImage({ path: LOGO_R, x: 13.33 - 0.25 - h, y: y, w: h, h: h, sizing: { type: "contain", w: h, h: h } });
}
function headerBar(s, title) {
  logos(s, 0.12, 0.88);
  s.addText(title, { x: 1.4, y: 0.1, w: 10.53, h: 1.0, fontFace: FONT, fontSize: 22, bold: true, color: PRIM, align: "center", valign: "middle" });
  s.addShape(p.ShapeType.rect, { x: 0.25, y: 1.12, w: 12.83, h: 0.035, fill: { color: PRIM } });
}
function bulletsBox(s, bullets, opt = {}) {
  s.addText(
    bullets.map(t => ({ text: t, options: { bullet: { code: "2022", indent: 18 }, breakLine: true } })),
    Object.assign({ x: 0.7, y: 1.3, w: 12.0, h: 5.5, fontFace: FONT, fontSize: 18, color: DARK, lineSpacingMultiple: 1.22, paraSpaceAfter: 8, valign: "top" }, opt)
  );
}
function placeImages(s, files, caption) {
  const paths = files.map(f => path.join(ASSETS, f)).filter(fp => fs.existsSync(fp));
  if (!paths.length) return false;
  if (paths.length === 1) {
    s.addImage({ path: paths[0], x: 8.15, y: 1.45, w: 4.6, h: 4.55, sizing: { type: "contain", w: 4.6, h: 4.55 } });
  } else {
    s.addImage({ path: paths[0], x: 8.15, y: 1.4, w: 4.6, h: 2.45, sizing: { type: "contain", w: 4.6, h: 2.45 } });
    s.addImage({ path: paths[1], x: 8.15, y: 4.0, w: 4.6, h: 2.45, sizing: { type: "contain", w: 4.6, h: 2.45 } });
  }
  if (caption) s.addText(caption, { x: 8.0, y: 6.5, w: 4.9, h: 0.5, fontFace: FONT, fontSize: 10, italic: true, color: GRAY, align: "center", valign: "top" });
  return true;
}

for (const sl of data.slides) {
  if (sl.type === "capa") {
    const s = p.addSlide({ masterName: "M" });
    logos(s, 0.35, 1.15);
    s.addShape(p.ShapeType.rect, { x: 0, y: 2.2, w: "100%", h: 2.9, fill: { color: PRIM } });
    s.addText(sl.title, { x: 0.5, y: 2.35, w: 12.3, h: 1.0, align: "center", fontFace: FONT, fontSize: 34, bold: true, color: WHITE });
    s.addText(sl.subtitle, { x: 1.0, y: 3.35, w: 11.3, h: 1.5, align: "center", fontFace: FONT, fontSize: 16, italic: true, color: WHITE });
    s.addText([
      { text: sl.author + "\n", options: { fontSize: 16, bold: true } },
      { text: sl.sub2, options: { fontSize: 12, color: GRAY } },
    ], { x: 0.5, y: 5.5, w: 12.3, h: 1.2, align: "center", fontFace: FONT, color: DARK });
    if (sl.notes) s.addNotes(sl.notes);
    continue;
  }

  const s = p.addSlide({ masterName: "M" });
  headerBar(s, sl.title);
  footer(s);

  if (sl.type === "content") {
    const hasImgs = sl.imgs && sl.imgs.length;
    bulletsBox(s, sl.bullets, hasImgs ? { w: 7.1 } : {});
    if (hasImgs) placeImages(s, sl.imgs, sl.imgCaption);
  } else if (sl.type === "cronograma") {
    const head = sl.header.map(t => ({ text: t, options: { bold: true, color: WHITE, fill: { color: PRIM }, fontFace: FONT, fontSize: 13, valign: "middle", align: "center" } }));
    const body = sl.rows.map((r, ri) => r.map(c => ({ text: c, options: { fontFace: FONT, fontSize: 12, color: DARK, fill: { color: ri % 2 ? WHITE : LIGHT }, valign: "middle" } })));
    s.addTable([head, ...body], { x: 0.6, y: 1.35, w: 12.1, colW: [3.1, 3.3, 2.5, 3.2], border: { type: "solid", color: "BFBFBF", pt: 0.5 }, rowH: 0.55, autoPage: false });
  } else if (sl.type === "refs") {
    bulletsBox(s, sl.items, { fontSize: 14, lineSpacingMultiple: 1.15 });
  }

  if (sl.notes) s.addNotes(sl.notes);
}

p.writeFile({ fileName: OUT }).then(() => {
  console.log("OK ->", OUT);
  console.log("Slides:", data.slides.length, "| Tamanho:", (fs.statSync(OUT).size / 1024 / 1024).toFixed(2), "MB");
});
