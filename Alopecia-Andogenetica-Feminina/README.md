# Pipeline do TCC — Alopecia Androgenética Feminina (AAG)

Pipeline **enxuto** e **dirigido por especificação (SDD)** para regenerar o estudo de caso
(`.docx` e `.pptx`) gastando o **mínimo de tokens de IA**.

> **Fonte de verdade:** [`SPEC.md`](SPEC.md). Toda mudança começa lá → ajusta-se o **conteúdo** (JSON)
> → roda-se o **gerador** (código) → roda-se [`validar.js`](validar.js). A IA não reescreve os arquivos finais.

```
output/summary.json  (25 fontes verificadas — cache, NAO re-pesquisar)
SPEC.md
   │
   ├── conteudo-foco-aag.json ─► gerar-docx-foco-aag.js / .ps1 ─► REVISADO.docx
   └── slides-foco-aag.json   ─► gerar-pptx-foco-aag.js        ─► REVISADO.pptx
            (imagens: assets-aag/)        validar.js ─► confere criterios de aceite
```

## Arquivos

| Papel | Arquivo |
|---|---|
| **Especificação (SDD)** | `SPEC.md` |
| **Fontes (cache)** | `../output/summary.json` — 25 referências reais já verificadas. **Não re-pesquisar.** |
| **Conteúdo do documento** | `conteudo-foco-aag.json` (lido pelo gerador Node **e** pelo PowerShell) |
| **Conteúdo dos slides** | `slides-foco-aag.json` |
| **Imagens clínicas** | `assets-aag/` (tricoscopias, escala de Ludwig, registros, Capilia Longa) |
| **Gerador Word (Node)** | `gerar-docx-foco-aag.js` |
| **Gerador Word (sem Node)** | `gerar-docx-foco-aag.ps1` |
| **Gerador PowerPoint** | `gerar-pptx-foco-aag.js` |
| **Validador (aceite)** | `validar.js` |
| **Saídas oficiais** | `../resultados finais/estudo de caso/...-Estudo-de-Caso-REVISADO.{docx,pptx}` |
| **Backup pré-refoco** | `../resultados finais/estudo de caso/_backup-pre-refoco-2026-06-21/` |

## Como regenerar

Pré-requisito: Node.js em `C:\Program Files\nodejs`. Se um terminal novo não reconhecer `node`,
rode `setx PATH "%PATH%;C:\Program Files\nodejs"` e **reabra o terminal**.

```powershell
cd "Alopecia-Andogenetica-Feminina"
node gerar-docx-foco-aag.js   # -> REVISADO.docx (ABNT)
node gerar-pptx-foco-aag.js   # -> REVISADO.pptx (16 slides, imagens + notas)
node validar.js               # confere tudo contra o SPEC.md
```

Sem Node (só o Word): `./gerar-docx-foco-aag.ps1`

## Editar o trabalho (fluxo barato)

1. Atualize `SPEC.md` se a **decisão** mudar.
2. Edite o `*.json` de conteúdo (sem pedir para a IA "reescrever tudo").
3. Rode o gerador + `validar.js`. **Nenhum token de modelo gasto** na geração/validação.

A IA só é necessária para: síntese científica nova, achar/validar fontes novas, ou simular a banca.

## Regras de economia de tokens

1. **Pesquisa roda 1x e fica em cache** (`output/summary.json`). Regenerar **nunca** dispara pesquisa.
2. **Geração e validação são código**, não chat.
3. **Modelo certo para a tarefa**: Haiku/Sonnet no mecânico; Opus só no raciocínio.
4. **Pesquisa nova com orçamento**: ~8 fontes, abrir o resumo, não 25 páginas inteiras.
5. **Commitar tudo no Git** para cada rodada partir do estado anterior.

## Próximo passo (futuro) — CLI `tcc`

Evoluir para uma ferramenta de linha de comando que busca fontes via **APIs oficiais** (PubMed E-utilities,
Crossref, Europe PMC — gratuitas, sem scraping) e mantém uma **biblioteca local** pesquisável por palavra-chave
(0 token). Assim a IA entra só no conteúdo; pesquisa/formatação/geração ficam em código barato.
