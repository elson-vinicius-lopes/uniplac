/* Reestrutura o PPTX no lugar (preserva imagens), a partir do ORIGINAL (idempotente):
 * - Reescreve slides 2-6 (Pergunta, Problemática, Justificativa, Objetivo Geral, Específicos)
 *   com a conexão H. pylori <-> AAF como tese central, em registro formal e H. pylori em itálico
 * - slide7: corrige o elo da cadeia (ferro/B12/zinco + estresse oxidativo)
 * - adiciona 2 slides-ponte da conexão após o slide 7
 * - enxuga referências (remove fontes comerciais fracas dos slides 19/20/21)
 * Saída: ...-REVISADO.pptx (original preservado).
 */
const fs = require("fs");
const JSZip = require("jszip");

const SRC = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\resultados finais\\Alopecia-Androgenetica-Feminina-Estudo-de-Caso.pptx";
const OUT = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\resultados finais\\Alopecia-Androgenetica-Feminina-Estudo-de-Caso-REVISADO.pptx";

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const HP = { t: "Helicobacter pylori", i: true };

function run(seg) {
  if (typeof seg === "string") return `<a:r><a:rPr lang="pt-BR" dirty="0"/><a:t>${esc(seg)}</a:t></a:r>`;
  return `<a:r><a:rPr lang="pt-BR"${seg.i ? ' i="1"' : ''} dirty="0"/><a:t>${esc(seg.t)}</a:t></a:r>`;
}
const runs = segs => (Array.isArray(segs) ? segs : [segs]).map(run).join("");
const pStmt = segs => `<a:p><a:pPr algn="just"><a:buNone/></a:pPr>${runs(segs)}</a:p>`;
const pBullet = segs => `<a:p><a:pPr marL="342900" indent="-228600" algn="just"><a:spcBef><a:spcPts val="600"/></a:spcBef><a:buFont typeface="Arial"/><a:buChar char="•"/></a:pPr>${runs(segs)}</a:p>`;

// substitui o texto do placeholder de corpo, preservando rótulo/título e imagens
function setBody(xml, parasXml) {
  const ph = '<p:ph type="body" idx="1"/>';
  const i = xml.indexOf(ph);
  if (i < 0) throw new Error("body ph nao encontrado");
  const spStart = xml.lastIndexOf("<p:sp>", i);
  const spEnd = xml.indexOf("</p:sp>", i) + 7;
  let sp = xml.slice(spStart, spEnd);
  const ls = sp.indexOf("<a:lstStyle/>") + "<a:lstStyle/>".length;
  const tb = sp.indexOf("</p:txBody>");
  sp = sp.slice(0, ls) + parasXml + sp.slice(tb);
  return xml.slice(0, spStart) + sp + xml.slice(spEnd);
}

// ---- Textos formais (conexão como tese central) ----
const PERGUNTA = pStmt(["De que maneira a infecção por ", HP, " — mediante disbiose intestinal, inflamação sistêmica e má absorção de micronutrientes — atua como fator acelerador da alopecia androgenética feminina, e de que forma a compreensão desse elo fisiopatológico orienta a conduta estética integrativa e o encaminhamento médico?"]);
const PROBLEMATICA = pStmt(["Em uma paciente de 60 anos com alopecia androgenética feminina e infecção ativa por ", HP, ", de que modo a cadeia gastrointestinal — gastrite crônica, má absorção de vitamina B12, ferro e zinco e consequente estresse oxidativo — concorre para a aceleração da miniaturização folicular, tornando o tratamento estético isolado insuficiente sem a resolução concomitante da causa sistêmica?"]);
const JUSTIFICATIVA = [
  ["A alopecia androgenética feminina não decorre exclusivamente de fatores genéticos e hormonais, sofrendo influência de determinantes sistêmicos."],
  ["A infecção por ", HP, " constitui o elo gastrointestinal do quadro, promovendo gastrite crônica e má absorção de vitamina B12, ferro e zinco."],
  ["A deficiência nutricional, somada à inflamação sistêmica, intensifica o estresse oxidativo e acelera a miniaturização folicular — atuando como fator agravante, e não como causa direta."],
  ["Em razão dessa cadeia, o tratamento estético isolado mostra-se insuficiente sem o enfrentamento da causa gastrointestinal."],
  ["Justifica-se, assim, a abordagem integrativa entre estética e medicina, bem como o reconhecimento dos limites da atuação estética."],
].map(pBullet).join("");
const OBJ_GERAL = pStmt(["Compreender e tratar a alopecia androgenética feminina como desfecho de uma cadeia sistêmica agravada pela infecção por ", HP, ", mediante a proposição de um protocolo estético integrativo — microcorrentes associadas à intradermoterapia com Mescla PHD —, conduzido em paralelo ao tratamento médico, com vistas a conter a miniaturização e a elevar a densidade capilar."]);
const OBJ_ESPEC = [
  ["Demonstrar que a alopecia androgenética feminina transcende os fatores genéticos e hormonais, sofrendo influência de fatores sistêmicos, nutricionais e inflamatórios."],
  ["Explicitar o elo fisiopatológico entre a infecção por ", HP, ", a má absorção de micronutrientes e o estresse oxidativo na aceleração da miniaturização folicular, distinguindo-o da alopecia areata."],
  ["Propor e justificar um protocolo estético — microcorrentes e intradermoterapia com Mescla PHD — capaz de contornar a má absorção, conduzido em paralelo à erradicação da infecção."],
  ["Reconhecer os limites da atuação estética e a importância do encaminhamento médico e do cuidado interdisciplinar."],
].map(pBullet).join("");

// ---- Slides-ponte (já existentes) ----
function titleRun(seg) {
  const it = (typeof seg !== "string" && seg.i) ? ' i="1"' : '';
  const txt = typeof seg === "string" ? seg : seg.t;
  return `<a:r><a:rPr lang="pt-BR" b="1"${it} dirty="0"><a:solidFill><a:srgbClr val="0070C0"/></a:solidFill><a:latin typeface="+mn-lt"/></a:rPr><a:t>${esc(txt)}</a:t></a:r>`;
}
function buildSlide(titleSegs, bullets) {
  const tArr = Array.isArray(titleSegs) ? titleSegs : [titleSegs];
  const body = bullets.map(pBullet).join("");
  const titleSp = `<p:sp><p:nvSpPr><p:cNvPr id="4" name="Título 3"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="1143000" y="746284"/><a:ext cx="10458450" cy="701731"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr><p:txBody><a:bodyPr wrap="square" lIns="91440" tIns="45720" rIns="91440" bIns="45720"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/>${tArr.map(titleRun).join("")}</a:p></p:txBody></p:sp>`;
  const bodySp = `<p:sp><p:nvSpPr><p:cNvPr id="3" name="Espaço Reservado para Texto 2"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="971550" y="1428750"/><a:ext cx="10877550" cy="4710113"/></a:xfrm></p:spPr><p:txBody><a:bodyPr><a:normAutofit/></a:bodyPr><a:lstStyle/>${body}</p:txBody></p:sp>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${bodySp}${titleSp}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}
const slideRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout2.xml"/></Relationships>`;
const slide23 = buildSlide(["A PONTE: ", { t: "H. PYLORI", i: true }, " → ALOPECIA ANDROGENÉTICA"], [
  ["A evidência DIRETA de ", HP, " na queda capilar é, em sua maioria, de alopecia AREATA (autoimune) — não da androgenética."],
  ["Na alopecia ANDROGENÉTICA a ligação é INDIRETA, por mecanismos compartilhados e bem documentados:"],
  ["Má absorção de ferro, B12 e zinco → ferritina baixa agrava a queda capilar feminina;"],
  ["Inflamação crônica + queda dos antioxidantes → estresse oxidativo (PRIE et al., 2016) → acelera a miniaturização."],
  ["Conclusão: a ", HP, " não CAUSA a alopecia androgenética — ela a ACELERA, por deficiência nutricional e estresse oxidativo."],
]);
const slide24 = buildSlide("O CASO CLÍNICO EM CADA ELO DA CADEIA", [
  ["Luto (3 perdas) → estresse crônico (eixo HPA ↑cortisol + Substância P);"],
  ["Disbiose intestinal (“leaky gut”) → gastrite crônica por ", HP, ";"],
  ["Exames da paciente: deficiência de vitamina B12 e vitamina D — a ponte mais direta para ela é a má absorção de B12;"],
  ["Estresse oxidativo → miniaturização folicular acelerada → AAF de progressão rápida;"],
  ["Por isso o tratamento estético isolado falha sem resolver a causa gastrointestinal."],
]);

const BANNED = /BIOMETIL|CLINIC CURSOS|cliniccursos|GIORDANI|ELIZA MIZU|elizamizu|rastase|MEDESTEC|MERCADO LIVRE|mercadolivre|SEPHORA/i;
function trimRefs(xml) {
  let removed = 0;
  const out = xml.replace(/<a:p>[\s\S]*?<\/a:p>/g, (b) => {
    const t = (b.match(/<a:t>([\s\S]*?)<\/a:t>/g) || []).join(" ");
    if (BANNED.test(t)) { removed++; return ""; }
    return b;
  });
  return { out, removed };
}

(async () => {
  const zip = await JSZip.loadAsync(fs.readFileSync(SRC));
  const log = {};

  // Reescrever slides 2-6 (texto formal, conexão central)
  const rewrites = { 2: PERGUNTA, 3: PROBLEMATICA, 4: JUSTIFICATIVA, 5: OBJ_GERAL, 6: OBJ_ESPEC };
  for (const n of Object.keys(rewrites)) {
    const f = `ppt/slides/slide${n}.xml`;
    zip.file(f, setBody(await zip.file(f).async("string"), rewrites[n]));
  }
  log.slides_reescritos = Object.keys(rewrites).join(",");

  // slide7 cadeia
  let s7 = await zip.file("ppt/slides/slide7.xml").async("string");
  const oldChain = "Má absorção da B12 e vitamina D → Estresse";
  log.slide7_chain = s7.includes(oldChain) ? 1 : 0;
  zip.file("ppt/slides/slide7.xml", s7.split(oldChain).join("Má absorção de ferro, B12 e zinco → Estresse oxidativo"));

  // novos slides 23/24
  zip.file("ppt/slides/slide23.xml", slide23);
  zip.file("ppt/slides/slide24.xml", slide24);
  zip.file("ppt/slides/_rels/slide23.xml.rels", slideRels);
  zip.file("ppt/slides/_rels/slide24.xml.rels", slideRels);
  let ct = await zip.file("[Content_Types].xml").async("string");
  const s22 = '<Override PartName="/ppt/slides/slide22.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>';
  zip.file("[Content_Types].xml", ct.replace(s22, s22 +
    '<Override PartName="/ppt/slides/slide23.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' +
    '<Override PartName="/ppt/slides/slide24.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>'));
  let pr = await zip.file("ppt/_rels/presentation.xml.rels").async("string");
  zip.file("ppt/_rels/presentation.xml.rels", pr.replace("</Relationships>",
    '<Relationship Id="rId32" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide23.xml"/>' +
    '<Relationship Id="rId33" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide24.xml"/></Relationships>'));
  let pres = await zip.file("ppt/presentation.xml").async("string");
  const after = '<p:sldId id="280" r:id="rId8"/>';
  log.anchor = pres.includes(after) ? 1 : 0;
  zip.file("ppt/presentation.xml", pres.replace(after, after + '<p:sldId id="290" r:id="rId32"/><p:sldId id="291" r:id="rId33"/>'));

  // enxugar referências
  log.refs_removidas = {};
  for (const n of [19, 20, 21]) {
    const f = `ppt/slides/slide${n}.xml`;
    const { out, removed } = trimRefs(await zip.file(f).async("string"));
    zip.file(f, out);
    log.refs_removidas[`slide${n}`] = removed;
  }

  fs.writeFileSync(OUT, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  console.log(JSON.stringify(log));
})().catch(e => { console.error("ERRO:", e); process.exit(1); });
