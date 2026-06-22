/* Aplica ajustes ABNT (M5, L6) e injeta a secao ANEXOS (exames como comprovacao)
 * na fonte-unica conteudo-foco-aag.json, preservando a formatacao do arquivo.
 * Idempotente: nao duplica os anexos se ja existirem.
 */
const fs = require("fs"), path = require("path");
const jp = path.join(__dirname, "conteudo-foco-aag.json");
let s = fs.readFileSync(jp, "utf8");
const log = [];

// --- M5: ressalva sobre a dose da Mescla PHD vs estudos citados ---
const m5a = "e Stefanis et al. (2024). Em casa, mantém-se";
const m5b = "e Stefanis et al. (2024); ressalva-se, contudo, que a concentração e a dose dos ativos da Mescla PHD correspondem ao protocolo institucional adotado, e não à concentração específica testada nesses estudos. Em casa, mantém-se";
if (s.includes(m5a)) { s = s.replace(m5a, m5b); log.push("M5 aplicado"); } else log.push("M5 nao encontrado");

// --- L6: 'Michelle et al.' (3 autores) -> nomes por extenso (NBR 10520) ---
const l6a = "Kuczara et al. (2024); Michelle et al. (2022)";
const l6b = "Kuczara et al. (2024); Michelle, Shilpa e Leelavathy (2022)";
if (s.includes(l6a)) { s = s.replace(l6a, l6b); log.push("L6 aplicado"); } else log.push("L6 nao encontrado");

// --- ANEXOS (exames como comprovacao) ---
if (s.includes('"ANEXOS"')) {
  log.push("ANEXOS ja existem - pulado");
} else {
  const dir = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\attachments\\paciente\\exames";
  const ex = [
    ["A", "exame-2025-anatamo-patologico-1.png", 315, "2025"],
    ["B", "exame-2025-anatamo-patologico-2.png", 308, "2025"],
    ["C", "exame-2025-desc.png", 319, "2025"],
    ["D", "exame-2025-pic-1.png", 309, "2025"],
    ["E", "exame-2025-pic-2.png", 293, "2025"],
    ["F", "exame-2026-desc.png", 330, "2026"],
    ["G", "exame-2026-pictures.png", 290, "2026"],
  ];
  const blocks = [
    { type: "pagebreak" },
    { type: "h1", t: "ANEXOS" },
    { type: "p", t: "Os exames a seguir são apresentados exclusivamente como comprovação de sua realização pela paciente, mediante autorização (Termo de Consentimento Livre e Esclarecido). Seu conteúdo não constitui objeto de análise neste estudo de caso." },
  ];
  for (const [letra, fname, w, ano] of ex) {
    blocks.push({ type: "center", runs: [{ t: "Anexo " + letra + " — Comprovante de exame realizado (" + ano + ")", b: true, sz: 20 }] });
    blocks.push({ type: "image", src: path.join(dir, fname), w: w, h: 470 });
    blocks.push({ type: "center", runs: [{ t: "Fonte: arquivo da paciente.", i: true, sz: 18 }] });
    blocks.push({ type: "blank" });
  }
  const anexoJson = blocks.map(b => "    " + JSON.stringify(b)).join(",\n");
  const marker = 'PMC7373546/. Acesso em: 16 jun. 2026."}';
  if (s.includes(marker)) { s = s.replace(marker, marker + ",\n" + anexoJson); log.push("ANEXOS inseridos (" + ex.length + " exames)"); }
  else log.push("marcador YOON nao encontrado - ANEXOS NAO inseridos");
}

fs.writeFileSync(jp, s);
console.log(log.join(" | "));
