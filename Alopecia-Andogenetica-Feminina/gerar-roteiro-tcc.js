/* Roteiro de estudo para a apresentacao do .pptx do TCC (AAG) — 17 slides.
 * Fala por slide + nao esqueca + banco de perguntas da banca. Estudo de caso (foco AAG).
 */
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip } = require("docx");
const fs = require("fs");
const FONT = "Arial";
const p = (text, o = {}) => new Paragraph({ children: (Array.isArray(text) ? text : [{ text }]).map(t => new TextRun({ text: t.text, font: FONT, size: t.size || o.size || 22, bold: t.bold || o.bold, italics: t.italics })), spacing: { line: 300, after: o.after != null ? o.after : 100 }, alignment: o.align || AlignmentType.LEFT, indent: o.indent });
const h = (t) => new Paragraph({ children: [new TextRun({ text: t, font: FONT, size: 26, bold: true, color: "1F6FB2" })], spacing: { before: 220, after: 80 } });
const bull = (segs) => p(segs, { indent: { left: convertInchesToTwip(0.3) } });

async function main() {
  const c = [];
  c.push(new Paragraph({ children: [new TextRun({ text: "ROTEIRO DE ESTUDO — APRESENTAÇÃO DO TCC", font: FONT, size: 30, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: 60 } }));
  c.push(p("Alopecia Androgenética Feminina — Estudo de caso (laserterapia + intradermoterapia) • 17 slides • ~12–15 min", { align: AlignmentType.CENTER, size: 18, after: 200 }));

  c.push(h("A TESE EM UMA FRASE (decore)"));
  c.push(p([{ text: "“A alopecia androgenética feminina é causada pela ação da ", }, { text: "DHT", bold: true }, { text: " sobre folículos geneticamente predispostos, que miniaturiza o fio. A proposta é tratá-la com ", }, { text: "laserterapia de baixa intensidade (~2 J/cm²)", bold: true }, { text: " e ", }, { text: "intradermoterapia (Mescla PHD)", bold: true }, { text: ", em um cronograma de 15/15 dias. Fatores sistêmicos (incluindo o H. pylori, já erradicado) são apenas coadjuvantes.”" }]));

  c.push(h("NÚMEROS E FATOS PARA DECORAR"));
  [
    "DHT: a 5-alfa-redutase tipo 2 converte testosterona em DHT, que encurta a fase anágena e miniaturiza o folículo (relação anágeno/telógeno normal ~12:1).",
    "Genética: poligênica, herdabilidade ~0,81; gene do receptor androgênico no cromossomo X; pai calvo → risco 5–6× maior.",
    "Prevalência (mulher): de ~1,3% (18–29 anos) a ~11,8% (após 70). Classificação: escala de Ludwig (3 graus).",
    "Tricoscopia: o sinal mais confiável é a anisotricose (variação do calibre dos fios); supera o tricograma (72% vs 62%).",
    "Laser: luz vermelha 655–660 nm; resposta bifásica — ~1–2 J/cm² ESTIMULA, ~5 J/cm² INIBE; por isso usamos ~2 J/cm². RCT: +~41,9 fios/cm².",
    "Intradermoterapia (técnica de pápula): 30G, 2–4 mm, ~0,05–0,1 mL/ponto, pápulas a cada 2 cm. Mescla PHD: Minoxidil 8 mg, Nanofatores 1%, Latanoprosta 50 mcg, Pill Food, Lidocaína.",
    "Cronograma: mês 1 = intradermo 1×/semana; depois = a cada 15 dias alternando laser e intradermo; reavaliação a cada 8 semanas.",
    "Ética: CEP-UNIPLAC nº 6.603.39 + TCLE. Referências: 26, todas com link (artigos e livros).",
  ].forEach(t => c.push(bull([{ text: "• " }, { text: t }])));

  c.push(h("O QUE FALAR EM CADA SLIDE"));
  const S = [
    ["1. Capa", "“Sou a Paola; apresento meu estudo de caso sobre alopecia androgenética feminina.”"],
    ["2. Tema e pergunta", "“Tema: a AAG, a queda mais comum na mulher. Pergunta: como laser de baixa intensidade + intradermoterapia controlam a miniaturização e melhoram a densidade.”"],
    ["3. Objetivos", "“Descrever a fisiopatologia, mostrar o diagnóstico por tricoscopia, fundamentar laser e intradermoterapia e montar um cronograma baseado em evidências.”"],
    ["4. Método", "“Estudo de caso qualitativo, uma paciente de 60 anos; com tricoscopia e foto padronizada; aprovado pelo CEP (nº 6.603.39) e TCLE.”"],
    ["5. O que é a AAG", "“Queda progressiva causada pela DHT em folículos predispostos; na mulher, rarefação no topo, poupando a linha da frente.”"],
    ["6. Fisiopatologia (DHT)", "“A 5-alfa-redutase tipo 2 transforma testosterona em DHT; a DHT encurta a fase de crescimento e afina o fio.”"],
    ["7. Escala de Ludwig", "“Padrão feminino, 3 graus de gravidade (Ludwig); herança poligênica, gene no cromossomo X.”"],
    ["8. Tricoscopia", "“Exame de eleição; o sinal mais confiável é a anisotricose — fios de calibres diferentes; supera o tricograma.”"],
    ["9. Fatores sistêmicos", "“A AAG é genético-hormonal; estresse oxidativo e ferritina baixa modulam; o H. pylori (já erradicado) é apenas coadjuvante.”"],
    ["10. Laserterapia (LLLT)", "“Fotobiomodulação: aumenta o ATP, melhora a circulação e prolonga o crescimento; luz vermelha 655–660 nm. Substitui as microcorrentes.”"],
    ["11. Por que 2 J/cm²", "“Resposta bifásica: dose baixa (~1–2 J/cm²) estimula, dose alta (~5) inibe; por isso usamos ~2 J/cm².”"],
    ["12. Intradermoterapia (PHD)", "“Microinjeções em pápulas a cada 2 cm; a Mescla PHD tem minoxidil, fatores de crescimento, latanoprosta e vitaminas; em casa, Capilia Longa.”"],
    ["13. Apresentação do caso", "“Paciente de 60 anos, pai calvo, H. pylori erradicada; tricoscopia compatível com AAG.”"],
    ["14. Cronograma (15/15)", "“Mês 1: intradermo 1×/semana. Depois: a cada 15 dias, alternando laser e intradermo. Reavaliação a cada 8 semanas.”"],
    ["15. Execução e segurança", "“Fiz 3 das 4 sessões do mês 1 — a 4ª foi suspensa por um desmaio (reação vasovagal, comum a injeções, sem relação com os ativos). Combinar laser e intradermo não é excesso: o excesso é da DOSE do laser, não da soma de técnicas.”"],
    ["16. Discussão e conclusão", "“A AAG é genético-hormonal; laser + intradermoterapia têm respaldo em ensaios clínicos; proposta segura, individualizada e baseada em evidências.”"],
    ["17. Referências", "“26 referências reais, com link — artigos e livros de tricologia/dermatologia.”"],
  ];
  S.forEach(([s, t]) => c.push(bull([{ text: s + ": ", bold: true }, { text: t }])));

  c.push(h("SE A BANCA PERGUNTAR (resposta curta)"));
  const QA = [
    ["Por que trocaram as microcorrentes pelo laser?", "Porque a laserterapia de baixa intensidade (fotobiomodulação) tem respaldo em ensaios clínicos randomizados para a AAG (Yoon, 2020; Sondagar, 2023) e é aprovada para essa indicação."],
    ["Por que a dose de 2 J/cm²?", "Pela resposta bifásica: doses baixas (~1–2 J/cm²) estimulam o folículo e doses altas (~5 J/cm²) inibem (Avci et al., 2014; Pillai e Mysore, 2022). Por isso ficamos na janela baixa."],
    ["O H. pylori não é o foco do trabalho?", "Não. A AAG é primariamente genético-hormonal. O H. pylori já foi erradicado e entra só como coadjuvante, por poder contribuir para deficiências nutricionais."],
    ["Combinar laser e intradermoterapia no mesmo período não é excesso de estímulo?", "Não. O ‘excesso’ na fotobiomodulação refere-se à DOSE do laser (resposta bifásica), não à soma de técnicas, que agem por mecanismos diferentes. Kaiser et al. (2022) mostram combinação pelo menos equivalente à monoterapia e sem efeitos adversos."],
    ["O que foi o desmaio da paciente?", "Uma reação vasovagal — reflexo benigno comum a procedimentos com agulha, ligado à dor/ansiedade, sem relação com os ativos. Conduta: aplicar com a paciente deitada, hidratada e monitorada."],
    ["Como foi feito o diagnóstico?", "Por tricoscopia: anisotricose (variação do calibre dos fios) e miniaturização — sinais compatíveis com AAG (Kuczara et al., 2024; Galliker e Trüeb, 2012)."],
    ["O que é a Mescla PHD?", "Mistura para intradermoterapia: minoxidil 8 mg, nanofatores de crescimento, latanoprosta e vitaminas (Pill Food), com lidocaína para conforto."],
    ["Para que servem os exames anexados?", "São comprovação de que foram realizados pela paciente (com TCLE). O conteúdo deles não é objeto de análise do trabalho, cujo foco é a abordagem estética da AAG."],
    ["As referências são confiáveis?", "Sim: 26 referências reais, em bases acadêmicas (PubMed/PMC, periódicos) e livros-texto, todas com link e autoria citada no texto."],
  ];
  QA.forEach(([q, a]) => { c.push(p([{ text: "P: ", bold: true }, { text: q, bold: true }], { after: 20 })); c.push(p([{ text: "R: ", bold: true }, { text: a }], { after: 120 })); });

  c.push(h("NÃO ESQUECER"));
  ["Foco é a ALOPECIA ANDROGENÉTICA; o H. pylori é só coadjuvante (já erradicado).", "No laser, o que importa é a DOSE (bifásica) — ~2 J/cm² estimula.", "Sempre cite o autor (ex.: ‘segundo Avci et al., 2014…’).", "Os exames são comprovação — não se analisa o conteúdo.", "Fale com calma; domine os slides 9, 10, 11 e 15 (foco, laser, dose e segurança)."].forEach(t => c.push(bull([{ text: "• " }, { text: t }])));

  const doc = new Document({ sections: [{ properties: { page: { margin: { top: convertInchesToTwip(0.8), bottom: convertInchesToTwip(0.8), left: convertInchesToTwip(0.9), right: convertInchesToTwip(0.9) } } }, children: c }] });
  const outPath = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\resultados finais\\estudo de caso\\Roteiro-Estudo-Apresentacao-TCC-AAG.docx";
  fs.writeFileSync(outPath, await Packer.toBuffer(doc));
  console.log("OK ->", outPath);
}
main().catch(e => { console.error("ERRO:", e); process.exit(1); });
