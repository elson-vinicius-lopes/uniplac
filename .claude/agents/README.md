# Squad Tricologia Científica — UNIPLAC

Squad de agents especializados para **fechar o trabalho acadêmico**
"Alopecia Androgenética Feminina: Uma Abordagem Integrativa — Influência do
*Helicobacter pylori*, Disbiose Intestinal e Estresse Oxidativo Emocional".

Inspirado no padrão de squads do projeto **Aiox** (`aiox-core/.claude/agents`):
funcional > filosófico, self-contained, escopo claro, heurísticas SE/ENTÃO,
condições de veto, exemplos de output e handoffs entre agents.

## Tese central do trabalho (a "conexão" que precisa ficar explícita)

```
PERDAS EMOCIONAIS CONSECUTIVAS
   → ESTRESSE PSICOLÓGICO CRÔNICO  (eixo HPA↑ cortisol; Substância P → inflamação neurogênica folicular)
   → DISBIOSE INTESTINAL           ("leaky gut"; favorece/agrava H. pylori)
   → GASTRITE POR H. PYLORI        (má absorção de Fe, B12, Zn; anemia ferropriva)
   → DEFICIÊNCIAS NUTRICIONAIS + ESTRESSE OXIDATIVO  (↓SOD, ↓antioxidantes, ↑ROS/MDA)
   → MINIATURIZAÇÃO FOLICULAR ACELERADA
   → ALOPECIA ANDROGENÉTICA FEMININA DE PROGRESSÃO RÁPIDA
→ Proposta terapêutica (estética): Microcorrentes + Intradermoterapia com Mescla PHD + Homecare (tônico Capilia Longa)
```

> **Caso real:** paciente **Salete, 60 anos** (modelo do estudo). Autora/estudante:
> **Paola Bortoli Pinheiro Lopes** (Tecnologia em Estética e Cosmetologia, UNIPLAC).
> Protocolo confirmado: **microcorrentes + Mescla PHD** (Minoxidil 8mg, Nanofatores,
> Latanoprosta, Pill Food, Lidocaína) — **sem PDRN nem dutasterida** (eram de um
> rascunho antigo). Deficiências documentadas da paciente: **B12 e Vitamina D**.

> **Ponto científico crítico (o "elo fraco" que a banca vai atacar):** a maior
> parte da evidência direta *H. pylori* ↔ queda capilar é de **alopecia AREATA**
> (autoimune), não da **androgenética**. A ponte para a AAF precisa ser feita por
> **mecanismos compartilhados e bem documentados** (deficiência de ferro/ferritina,
> B12 e zinco; estresse oxidativo na AAG — Prie 2016; inflamação sistêmica;
> microcirculação). Os agents **nunca conflam** as duas alopecias — eles
> explicitam a ponte mecanística. É exatamente isto que significa "estar mais
> conectado a H. pylori e Alopecia Androgenética".

## Agents do squad

| Agent | Papel | Quando usar |
|---|---|---|
| `orquestrador-tcc` | Maestro do squad | Coordenar o fechamento do trabalho, rotear missões, rodar o pipeline Word/PPTX |
| `especialista-tricologia` | Conteúdo médico-científico | Fortalecer/explicitar a conexão H. pylori ↔ AAF; mecanismos; justificativa terapêutica |
| `revisor-cientifico` | Revisão, ABNT e antiplágio | Conferir citações, referências (NBR 6023/10520), coerência Word↔PPTX, perspectiva de banca |
| `engenheiro-docx` | Geração do Word | Manter/rodar `gerar-docx.js`, formatação ABNT, gerar o .docx final |
| `designer-pptx` | Geração dos slides | Construir/reestruturar o .pptx focado na conexão; adicionar/remover slides |

## Como invocar

No Claude Code, dentro do projeto `uniplac`:

```
@orquestrador-tcc Missão: fortalecer-conexao — deixe a ligação H. pylori ↔ AAF explícita no Word e no PPTX
@especialista-tricologia Missão: mapear-conexao
@designer-pptx Missão: reestruturar-slides — foco na junção dos dois problemas
@revisor-cientifico Missão: auditar-referencias
@engenheiro-docx Missão: gerar-word
```

## Pipeline recomendado para "fechar o trabalho"

1. `especialista-tricologia` → reforça a conexão no conteúdo-fonte (.md)
2. `revisor-cientifico` → audita evidências, ABNT e coerência
3. `engenheiro-docx` → regenera o `.docx`
4. `designer-pptx` → reestrutura o `.pptx` (slides focados na conexão)
5. `orquestrador-tcc` → consolida tudo em `resultados finais/`

## Arquivos de referência (FONTE DA VERDADE)

Os entregáveis **reais e oficiais** são o par em `resultados finais/`:

- **Word final**: `resultados finais/Alopecia-Androgentica-Feminina-Estudo-de-Caso.docx`
- **PPTX final**: `resultados finais/Alopecia-Androgenetica-Feminina-Estudo-de-Caso.pptx`

Apoio / contexto:
- Caso clínico (rascunho da autora): `Alopecia-Andogenetica-Feminina/trabalho-iniciado/Estudo De Caso = Paola Bortoli.docx`
- Ética (citar): `Alopecia-Andogenetica-Feminina/Comite-de-etica-que-precisa-ser-citado-no-trabalho/`
- Plano de ensino: `Alopecia-Andogenetica-Feminina/Plano-de-ensino-seminario-2026-1/`

> ⚠️ **NÃO** use como fonte da verdade o `trabalho-iniciado/...Estudo-de-Caso.md` nem o
> `gerar-docx.js`: são um **rascunho antigo divergente** (continham PDRN/dutasterida).
