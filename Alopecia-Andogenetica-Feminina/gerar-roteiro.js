/* Gera o "Roteiro de Apresentação e Estudo" (.docx) para a apresentadora.
 * Slide a slide: o que falar + o que não esquecer; tese, números e banco de perguntas da banca.
 */
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip } = require("docx");
const fs = require("fs");
const path = require("path");
const FONT = "Times New Roman";

function p(text, o = {}) {
  const runs = (Array.isArray(text) ? text : [{ text }]).map(t =>
    new TextRun({ text: t.text, font: FONT, size: t.size || o.size || 24, bold: t.bold || o.bold, italics: t.italics }));
  return new Paragraph({ children: runs, spacing: { line: 312, after: o.after != null ? o.after : 120 }, alignment: o.alignment || AlignmentType.JUSTIFIED, indent: o.indent });
}
function h(text, lvl = 1) {
  return new Paragraph({ children: [new TextRun({ text, font: FONT, size: lvl === 1 ? 28 : 24, bold: true })], heading: lvl === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2, spacing: { before: 240, after: 100 }, alignment: lvl === 1 ? AlignmentType.LEFT : AlignmentType.LEFT });
}
const bullet = (t, o = {}) => p(t, { indent: { left: convertInchesToTwip(0.3) }, ...o });
const blank = () => p("");

// slide: [titulo, falar, naoEsquecer]
function slide(num, titulo, falar, naoEsquecer) {
  const out = [];
  out.push(p([{ text: `Slide ${num} — ${titulo}`, bold: true, size: 24 }], { after: 40 }));
  out.push(p([{ text: "Fale: ", bold: true }, { text: falar }], { after: 40 }));
  if (naoEsquecer) out.push(p([{ text: "Não esqueça: ", bold: true, }, { text: naoEsquecer, italics: true }], { after: 160 }));
  else out.push(blank());
  return out;
}
function qa(q, a) {
  return [ p([{ text: "P: ", bold: true }, { text: q, bold: true }], { after: 20 }), p([{ text: "R: ", bold: true }, { text: a }], { after: 160 }) ];
}

async function main() {
  const c = [];
  c.push(new Paragraph({ children: [new TextRun({ text: "ROTEIRO DE APRESENTAÇÃO E ESTUDO", font: FONT, size: 32, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }));
  c.push(p([{ text: "Seminário — Alopecia Androgenética Feminina e Helicobacter pylori | Apresentadora: Paola Bortoli | Duração-alvo: 15–20 min", size: 20 }], { alignment: AlignmentType.CENTER, after: 200 }));

  c.push(h("A TESE EM UMA FRASE (decore)"));
  c.push(p([{ text: "O ", }, { text: "Helicobacter pylori", italics: true }, { text: " não ", }, { text: "causa", bold: true }, { text: " a alopecia androgenética — ele a ", }, { text: "acelera", bold: true }, { text: ": a gastrite crônica leva à má absorção de B12, ferro e zinco e ao estresse oxidativo, que aceleram a miniaturização de um folículo já geneticamente predisposto. Por isso o tratamento estético isolado não basta sem tratar a causa gastrointestinal." }]));

  c.push(h("NÚMEROS E FATOS PARA DECORAR"));
  [
    "A AAF pode afetar até 50% das mulheres ao longo da vida.",
    "Paciente: 60 anos; três perdas emocionais (luto); H. pylori ativo; deficiência de vitamina B12 e vitamina D (exames/endoscopia).",
    "A evidência DIRETA de H. pylori e queda capilar é, em sua maioria, de alopecia AREATA (autoimune); na ANDROGENÉTICA a ligação é INDIRETA (ponte mecanística).",
    "Prie et al. (2016): na alopecia androgenética há ↓SOD, ↑malondialdeído (MDA) e ↓capacidade antioxidante — o estresse oxidativo é fator ativo.",
    "Meta-análise (36 estudos): mulheres com alopecia não-cicatricial têm ferritina significativamente mais baixa.",
    "Protocolo: microcorrentes + intradermoterapia Mescla PHD (Minoxidil 8 mg, Nanofatores de Crescimento 1%, Latanoprosta 50 mcg, Pill Food, Lidocaína 20 mg) + homecare com tônico Capilia Longa (cúrcuma; inibe a conversão em DHT).",
    "Ética: CEP UNIPLAC nº 6.603.39 + TCLE; método: estudo de caso qualitativo e descritivo, com tricoscopia e registro fotográfico.",
  ].forEach(t => c.push(bullet([{ text: "• " }, { text: t }])));

  c.push(h("ROTEIRO SLIDE A SLIDE"));
  const S = [
    ["1", "Capa", "Apresente-se: nome, curso (Tecnologia em Estética e Cosmetologia), orientadoras, e leia o título do estudo de caso destacando que o foco é a LIGAÇÃO entre o H. pylori e a alopecia androgenética.", "Diga 'estudo de caso' e 'cuidado integrativo'."],
    ["2", "Pergunta da pesquisa", "Leia a pergunta e explique que o trabalho investiga COMO o H. pylori atua como fator acelerador da alopecia androgenética e como isso orienta a conduta da esteticista.", "A palavra-chave é 'acelerador', não 'causador'."],
    ["3", "Problemática", "Contextualize a paciente de 60 anos: como a cadeia gastrointestinal (gastrite → má absorção de B12/ferro/zinco → estresse oxidativo) acelera a miniaturização e torna o tratamento estético isolado insuficiente.", "Cadeia GI → miniaturização."],
    ["4", "Justificativa", "Explique por que o tema importa: a AAF não é só genética/hormonal; o H. pylori é o elo gastrointestinal; sem tratar a causa, a estética sozinha falha.", "O elo gastrointestinal é o centro."],
    ["5", "Objetivo geral", "Apresente a meta: compreender e tratar a AAF como desfecho de uma cadeia sistêmica agravada pelo H. pylori, com protocolo estético integrativo em paralelo ao tratamento médico.", "Integrativo + paralelo ao médico."],
    ["6", "Objetivos específicos", "Liste os 4 objetivos: (a) ir além de genética/hormônios; (b) explicitar o elo H. pylori→má absorção→oxidativo; (c) propor o protocolo PHD; (d) reconhecer os limites da estética.", "Distinção areata × androgenética."],
    ["7", "Cadeia fisiopatológica", "Percorra a sequência: perdas → estresse (HPA + Substância P) → disbiose → gastrite por H. pylori → má absorção (ferro, B12, zinco) → estresse oxidativo → miniaturização acelerada → AAF.", "Saiba recitar a cadeia na ordem."],
    ["8", "A PONTE (H. pylori → AAF)", "ESTE É O SLIDE-CHAVE. Explique que a evidência direta é de areata, mas na androgenética a ligação é indireta — por ferro/B12/zinco e estresse oxidativo. Conclua: acelera, não causa.", "Se decorar só um slide, é este."],
    ["9", "O caso em cada elo", "Amarre cada elo da cadeia aos achados reais da paciente: luto, H. pylori+, B12 e Vit D baixas, oxidação → miniaturização. A ponte mais direta para ela é a má absorção de B12.", "Ligar a teoria ao caso real."],
    ["10", "Por que esse protocolo", "Justifique: microcorrentes repõem ATP e estimulam circulação; a intradermoterapia PHD entrega nutrientes localmente, contornando a má absorção; tudo em paralelo ao tratamento médico.", "Contornar a má absorção."],
    ["11", "Introdução", "Defina a AAF: miniaturização por ação da DHT (5-alfa-redutase) em predispostos; diagnóstico por tricoscopia; e a influência de fatores sistêmicos.", "DHT, 5-alfa-redutase, tricoscopia."],
    ["12", "Método", "Estudo de caso qualitativo e descritivo (n=1, 60 anos); anamnese, tricoscopia com fotovideodermatoscópio, registro fotográfico; tratamento médico (erradicação + reposição) em paralelo. Cite a ética (CEP 6.603.39 + TCLE).", "Sempre citar a aprovação ética."],
    ["13", "Protocolo terapêutico", "Detalhe os ativos da Mescla PHD e a função de cada um (Minoxidil, Nanofatores, Latanoprosta, Pill Food, Lidocaína) e as microcorrentes.", "Saber o porquê de cada ativo."],
    ["14", "Cronograma", "Apresente as fases (abril: avaliações/reparo; maio: intradermoterapia + microcorrentes; junho em diante: manutenção) e reforce a investigação com o gastroenterologista.", "Tratamento concomitante ao médico."],
    ["15–17", "Registros fotográficos", "Mostre a evolução por tricoscopia/foto padronizada (quando disponível). Comente o que observar: densidade, espessura, sinais inflamatórios.", "Se faltar a foto do microscópio, explique que está em obtenção."],
    ["18", "Homecare — Capilia Longa", "Explique o uso domiciliar do tônico (cúrcuma), que inibe a conversão em DHT e prolonga em casa o resultado da cabine.", "Capilia Longa = manutenção da DHT."],
    ["19–23", "Referências", "NÃO leia uma a uma. Diga que o trabalho se baseia em literatura revisada por pares (PubMed, PMC, Frontiers) e cite 2–3 autores-chave (Prie 2016; Kim 2021).", "Mostrar solidez, sem ler tudo."],
    ["24", "Encerramento", "Feche com a frase de impacto: 'A AAF exige olhar integrativo; tratar só o couro cabeludo é tratar o sintoma, não a causa.' Agradeça e abra para perguntas.", "Terminar pela tese central."],
  ];
  S.forEach(s => slide(...s).forEach(x => c.push(x)));

  c.push(h("BANCO DE PERGUNTAS DA BANCA (com respostas)"));
  const QA = [
    ["O H. pylori causa a alopecia androgenética?", "Não. Ele atua como fator acelerador: a gastrite causa má absorção de B12, ferro e zinco e estresse oxidativo, que aceleram a miniaturização de um folículo já predisposto. A relação é indireta."],
    ["Por que usar estudos de alopecia areata se o caso é androgenética?", "Eles são usados como ponte mecanística (mostram que o H. pylori afeta o folículo via inflamação/imunidade/nutrição), não como prova direta na androgenética. O trabalho deixa essa distinção explícita."],
    ["Qual a evidência de que a deficiência de ferro/ferritina piora a queda feminina?", "Meta-análise de 36 estudos mostrou ferritina significativamente mais baixa em mulheres com alopecia não-cicatricial (PMC, 2022); Kantor et al. (2003) também associam ferritina baixa à queda."],
    ["Por que B12 e vitamina D especificamente nesta paciente?", "Foram as deficiências documentadas nos exames dela. A B12 liga-se diretamente ao H. pylori (a gastrite reduz o fator intrínseco, prejudicando a absorção da B12)."],
    ["A esteticista pode injetar/prescrever esses ativos?", "A atuação é estética e integrativa; a intradermoterapia segue a competência e a legislação da área. A erradicação do H. pylori e a reposição nutricional são conduzidas pelo médico — daí a importância do encaminhamento. O trabalho reconhece esse limite."],
    ["Por que microcorrentes?", "Porque o estresse oxidativo depleta o ATP folicular; as microcorrentes reativam a produção de ATP, melhoram a microcirculação e favorecem a transição da fase telógena para a anágena (Kim et al., 2021)."],
    ["O que é a Mescla PHD e por que cada ativo?", "É a mescla de intradermoterapia: Minoxidil 8 mg (circulação/anágena), Nanofatores de Crescimento (sinalização do folículo), Latanoprosta (crescimento/espessura), Pill Food (aminoácidos e vitaminas) e Lidocaína (conforto). Entrega nutrientes localmente, contornando a má absorção."],
    ["Como foi feito o diagnóstico do H. pylori e das deficiências?", "Por avaliação médica prévia: endoscopia e exames laboratoriais, cujos laudos integram os anexos do trabalho."],
    ["Qual o papel do luto/estresse na cadeia?", "O estresse ativa o eixo HPA (cortisol) e libera Substância P (inflamação neurogênica no folículo — Peters et al.) e altera a microbiota (disbiose — Carabotti, Madison, Li), abrindo caminho para a gastrite e a má absorção."],
    ["O que é o Capilia Longa?", "Um tônico de uso domiciliar derivado da cúrcuma que ajuda a inibir a conversão de testosterona em DHT, sustentando entre as sessões o resultado obtido em cabine."],
    ["Como vocês avaliam o resultado?", "Por tricoscopia e registro fotográfico padronizado, acompanhando densidade e espessura dos fios e sinais inflamatórios ao longo do protocolo."],
    ["Quais as limitações do estudo?", "É um estudo de caso (n=1), portanto não generalizável; depende da adesão da paciente e do sucesso do tratamento médico da causa sistêmica."],
  ];
  QA.forEach(x => qa(...x).forEach(y => c.push(y)));

  c.push(h("DICAS FINAIS DE APRESENTAÇÃO"));
  [
    "Nunca diga que o H. pylori 'causa' a alopecia androgenética — diga 'acelera' / 'agrava'.",
    "Repita a tese no início (slide 2) e no fim (slide 24) — é o fio condutor.",
    "Fale com calma; ~40–50 segundos por slide de conteúdo cabe no tempo.",
    "Domine os slides 7, 8 e 9 (cadeia, ponte e caso) — é onde a banca foca.",
    "Tenha os laudos (endoscopia/exames) à mão para citar se perguntarem.",
  ].forEach(t => c.push(bullet([{ text: "• " }, { text: t }])));

  const doc = new Document({ sections: [{ properties: { page: { margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(0.8), left: convertInchesToTwip(1), right: convertInchesToTwip(0.8) } } }, children: c }] });
  const outDir = "C:\\Users\\elson.lopes\\source\\repos\\uniplac\\resultados finais";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "Roteiro-de-Apresentacao-e-Estudo.docx");
  fs.writeFileSync(outPath, await Packer.toBuffer(doc));
  console.log("OK ->", outPath);
}
main().catch(e => { console.error("ERRO:", e); process.exit(1); });
