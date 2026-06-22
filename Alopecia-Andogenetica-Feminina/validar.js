/* Validador (SDD) — confere os arquivos REVISADO contra os criterios de aceite do SPEC.md.
 * Roda em 0 token de IA. Uso: node validar.js   (sai com codigo 1 se algo falhar)
 */
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");

const BASE = path.resolve(__dirname, "../resultados finais/estudo de caso");
const DOCX = path.join(BASE, "Alopecia-Androgenetica-Feminina-Estudo-de-Caso-REVISADO.docx");
const PPTX = path.join(BASE, "Alopecia-Androgenetica-Feminina-Estudo-de-Caso-REVISADO.pptx");

const strip = xml => xml.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const count = (txt, k) => (txt.match(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length;

let fails = 0;
function check(name, ok, detail) {
  console.log(`${ok ? "PASS" : "FALHA"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
  if (!ok) fails++;
}

async function main() {
  // ---------- DOCX ----------
  console.log("== REVISADO.docx ==");
  const dz = await JSZip.loadAsync(fs.readFileSync(DOCX));
  const dxml = await dz.file("word/document.xml").async("string");
  const dtxt = strip(dxml);
  const refs = count(dtxt, "Disponível em:");
  check("Foco AAG: 'pylori' so coadjuvante (<=6)", count(dtxt, "pylori") <= 6, "n=" + count(dtxt, "pylori"));
  check("Microcorrentes trocadas (<=2)", count(dtxt, "microcorrente") <= 2, "n=" + count(dtxt, "microcorrente"));
  check("Laserterapia presente (laser >=10)", count(dtxt, "laser") >= 10, "n=" + count(dtxt, "laser"));
  check("Fluencia 2 J/cm2 citada (>=2)", count(dtxt, "2 J") >= 2, "n=" + count(dtxt, "2 J"));
  check("Exatamente 26 referencias", refs === 26, "n=" + refs);
  check("Toda referencia tem link (http)", count(dtxt, "http") >= refs, "links=" + count(dtxt, "http"));
  check("ABNT: Times New Roman", dxml.includes("Times New Roman"));

  // ---------- PPTX ----------
  console.log("\n== REVISADO.pptx ==");
  const pz = await JSZip.loadAsync(fs.readFileSync(PPTX));
  const slideFiles = pz.file(/ppt\/slides\/slide\d+\.xml$/);
  const media = pz.file(/ppt\/media\//);
  let ptxt = "";
  for (const f of slideFiles) ptxt += strip(await f.async("string")) + " ";
  const slideRels = pz.file(/ppt\/slides\/_rels\/slide\d+\.xml\.rels$/);
  let minImgs = Infinity;
  for (const f of slideRels) minImgs = Math.min(minImgs, ((await f.async("string")).match(/\/media\//g) || []).length);
  check("Pelo menos 15 slides", slideFiles.length >= 15, "n=" + slideFiles.length);
  check("Imagens embutidas (clinicas + logos, >=8)", media.length >= 8, "n=" + media.length);
  check("Logos UNIPLAC+LABEST em TODO slide (>=2 img/slide)", minImgs >= 2, "min/slide=" + minImgs);
  check("Foco AAG no deck: 'pylori' (<=4)", count(ptxt, "pylori") <= 4, "n=" + count(ptxt, "pylori"));
  check("Laser no deck (>=5)", count(ptxt, "laser") >= 5, "n=" + count(ptxt, "laser"));
  check("Diagnostico: 'tricoscop' e 'Ludwig'", count(ptxt, "tricoscop") > 0 && count(ptxt, "Ludwig") > 0);

  console.log(`\n${fails === 0 ? "TUDO OK — conforme o SPEC.md" : fails + " criterio(s) FALHARAM"}`);
  process.exit(fails === 0 ? 0 : 1);
}
main().catch(e => { console.error("ERRO:", e); process.exit(1); });
