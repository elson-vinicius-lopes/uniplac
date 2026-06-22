# SPEC — Estudo de Caso: Alopecia Androgenética Feminina (AAG)

> **Spec-Driven Development (SDD).** Este documento é a **fonte de verdade**. Toda mudança no trabalho
> começa aqui (o quê / por quê / critérios de aceite); depois muda-se o **conteúdo** (JSON) e roda-se o
> **gerador** (código). A IA não reescreve os arquivos finais — ela ajusta a spec e o conteúdo.

## 1. Objetivo

Produzir os entregáveis oficiais do estudo de caso, **focados em alopecia androgenética feminina**.
Título (reduzido, jun/2026): **"Alopecia androgenética feminina com tricoscopia e tratamentos associados: um estudo de caso"**.

| Entregável | Caminho canônico |
|---|---|
| Documento (ABNT) | `../resultados finais/estudo de caso/Alopecia-Androgenetica-Feminina-Estudo-de-Caso-REVISADO.docx` |
| Apresentação | `../resultados finais/estudo de caso/Alopecia-Androgenetica-Feminina-Estudo-de-Caso-REVISADO.pptx` |
| Roteiro de apresentação | `../resultados finais/estudo de caso/Roteiro-de-Apresentacao-e-Estudo.docx` (gerado de `slides-foco-aag.json`) |

### Etapa atual = PRÉ-PROJETO (revisão da professora, jun/2026)

Documento reduzido à ordem oficial (ETAPAS / classroom): **1 Tema · 2 Pergunta · 3 Problemática · 4 Objetivos
(4.1 geral / 4.2 específicos) · 5 Método · 6 Revisão de Literatura (6.1 Introdução + subtítulos) · 7 Cronograma ·
8 Referências · ANEXOS**. Slides na ordem do classroom (Pergunta, Problemática, Justificativa, Objetivos,
Introdução, desenvolvimento por tópicos, Método, Cronograma, Referências).

**Removido e GUARDADO** em `_guardado/` (para etapas seguintes): Resumo, Apresentação do caso, Execução real,
Discussão e Conclusão. **Não reincluir** nesta etapa.

- Objetivo geral (texto da professora): "Avaliar os resultados de um protocolo estético baseado na fotobiomodulação e na intradermoterapia capilar para o controle da alopecia androgenética feminina."
- Método com parâmetros: **laser vermelho 655–660 nm, ~2 J/cm², 3–90 mW/cm², ~20 min/sessão**; Mescla PHD (composição + técnica de pápula 30G/2–4 mm/0,05–0,1 mL por ponto); frequência pelo cronograma.
- Anexos: **ficha(s) de anamnese pendente(s)** — placeholder no documento.

## 2. Decisão de foco (o "porquê")

O trabalho **era centrado em _Helicobacter pylori_** e foi **refocado para alopecia androgenética**:
- _H. pylori_ deixa de ser tese central e vira **fator coadjuvante** (mantém-se a menção, não o foco).
- **Microcorrentes → laserterapia de baixa intensidade** (fotobiomodulação, fluência ~**2 J/cm²**).
- Mantém-se a **intradermoterapia com a Mescla PHD** e um **cronograma quinzenal (15/15)**.

## 3. Requisitos

- **ABNT**: Times New Roman 12, entrelinha 1,5, justificado, margens 3/2/3/2 cm, A4.
- **Referências**: **26**, reais e verificadas (link conferido), autoria citada no texto (**sem plágio**),
  sem repetir o mesmo artigo, com diversidade de fontes + **livros** (Olsen; Blume-Peytavi; Chandrashekar; Anastassakis).
- **Registro da execução real (estudo de caso)**: documentar o que foi efetivamente feito — no 1º mês, **3 de 4 sessões** de intradermoterapia (4ª suspensa por episódio vasovagal/desmaio da paciente); no 2º mês, laser na 1ª quinzena e laser + intradermoterapia na 2ª. Justificar a **segurança de combinar** laser + intradermoterapia (Kaiser et al., 2022; o "excesso" é da dose do laser, não da combinação).
- **Laser**: parâmetros detalhados (655–660 nm; 3–90 mW/cm²; ~2 J/cm²) com base em artigos (Avci; Pillai & Mysore; Yoon; Sondagar; Scarpim; Wang & Chen).
- **Intradermoterapia**: técnica de pápula + fórmula da Mescla PHD (Uzel; Aledani; Stefanis).
- **Cronograma**: 1×/semana no 1º mês, depois 15/15 alternando laser e intradermoterapia, reavaliação bimestral, manutenção após ~6 meses.
- **Deck**: usar as **imagens clínicas reais** (tricoscopias, escala de Ludwig, registros da paciente, Capilia Longa) — **não** usar o infográfico de _H. pylori_ nem imagens de estoque.
- **Cabeçalho-padrão (requisito do professor)**: em **todos os slides**, **escudo da UNIPLAC à esquerda** e **emblema da LABEST à direita** (logos em `assets-aag/logo-uniplac.png` e `logo-labest.jpeg`, configurados em `slides-foco-aag.json`).

## 4. Fonte de verdade → implementação (pipeline)

```
output/summary.json (25 fontes verificadas, cache — NAO re-pesquisar)
SPEC.md (este arquivo)
        │
        ├── conteudo-foco-aag.json  ──►  gerar-docx-foco-aag.js (Node)  ─┐
        │                                gerar-docx-foco-aag.ps1 (s/ Node)├─►  REVISADO.docx
        │
        └── slides-foco-aag.json    ──►  gerar-pptx-foco-aag.js (Node)   ──►  REVISADO.pptx
                  (imagens em assets-aag/)
                                         validar.js  ──►  confere contra a Seção 5
```

Os geradores `.docx` (Node e PowerShell) leem **o mesmo** `conteudo-foco-aag.json` (sem duplicação de conteúdo).

## 5. Critérios de aceite (executáveis em `validar.js`)

**Documento (.docx)**
- `pylori` ≤ 6 (coadjuvante) · `microcorrente` ≤ 2 · `laser` ≥ 10 · `2 J` ≥ 2
- exatamente **26** referências, todas com link `http`
- fonte Times New Roman presente

**Apresentação (.pptx)**
- ≥ 15 slides · ≥ 8 imagens embutidas (clínicas + logos)
- **logos UNIPLAC + LABEST em todo slide** (≥ 2 imagens/slide)
- `pylori` ≤ 4 · `laser` ≥ 5 · contém `tricoscop` e `Ludwig`

## 6. Como rodar

```powershell
cd "Alopecia-Andogenetica-Feminina"
node gerar-docx-foco-aag.js   # -> REVISADO.docx
node gerar-pptx-foco-aag.js   # -> REVISADO.pptx
node validar.js               # confere os criterios de aceite
```

## 7. Papéis (harness / agents / memórias / handoff)

- **orquestrador-tcc** — roteia o pedido e roda o pipeline.
- **engenheiro-docx** — dono dos geradores `.docx`; **designer-pptx** — dono do deck.
- **especialista-tricologia** — conteúdo científico; **revisor-cientifico** — audita ABNT, citações, antiplágio e simula a banca (usar **antes** de regenerar).
- **Memórias** (`.claude/.../memory/`): ambiente (Node/Python), economia de tokens, estado do TCC. Atualizar quando a spec mudar.
- **Backup**: originais pré-refoco em `../resultados finais/estudo de caso/_backup-pre-refoco-2026-06-21/`.

## 8. Fora de escopo (por ora)

CLI `tcc` (busca local de fontes via APIs PubMed/Crossref/Europe PMC) — planejado, ver README.
