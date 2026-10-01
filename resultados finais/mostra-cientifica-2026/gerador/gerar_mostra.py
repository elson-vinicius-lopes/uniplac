# -*- coding: utf-8 -*-
import zipfile, re, os, shutil, sys
from xml.sax.saxutils import escape
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import conteudo_mostra as C

TPL = r"C:\Users\elson.lopes\source\repos\uniplac\mostra-cientifica-uniplac"
OUT = r"C:\Users\elson.lopes\source\repos\uniplac\resultados finais\mostra-cientifica-2026"
os.makedirs(OUT, exist_ok=True)

# =============================================================== DOCX helpers
def run(t, bold=False, italic=False):
    rpr = "<w:rPr>"
    if bold: rpr += "<w:b/><w:bCs/>"
    if italic: rpr += "<w:i/><w:iCs/>"
    rpr += "</w:rPr>"
    return ('<w:r>%s<w:t xml:space="preserve">%s</w:t></w:r>' % (rpr, escape(t)))

# Helicobacter pylori em italico quando aparece no corpo
ITAL = re.compile(r'(Helicobacter pylori|H\. pylori|Capilia Longa)')
def runs_italicizados(t, bold=False):
    out = []
    for i, part in enumerate(ITAL.split(t)):
        if not part: continue
        out.append(run(part, bold=bold, italic=bool(i % 2)))
    return "".join(out)

def para(runs_xml, align="both", indent=None, spacing_after=0, spacing_before=0, keep_line="240"):
    ppr = "<w:pPr>"
    if indent: ppr += '<w:ind w:firstLine="%d"/>' % indent
    ppr += '<w:spacing w:before="%d" w:after="%d" w:line="%s" w:lineRule="auto"/>' % (
        spacing_before, spacing_after, keep_line)
    ppr += '<w:jc w:val="%s"/>' % align
    ppr += "</w:pPr>"
    return "<w:p>%s%s</w:p>" % (ppr, runs_xml)

EMPTY = '<w:p><w:pPr><w:spacing w:line="240" w:lineRule="auto"/></w:pPr></w:p>'

def autor_para(nome, fid):
    return ('<w:p><w:pPr><w:spacing w:line="240" w:lineRule="auto"/><w:jc w:val="right"/></w:pPr>'
            '<w:r><w:t xml:space="preserve">%s</w:t></w:r>'
            '<w:r><w:rPr><w:vertAlign w:val="superscript"/></w:rPr>'
            '<w:footnoteReference w:id="%d"/></w:r></w:p>' % (escape(nome), fid))

def build_footnotes(src_xml):
    """Substitui o texto dos footnotes 1..3 mantendo a estrutura do template."""
    out = src_xml
    for i, txt in enumerate(C.FOOTNOTES, start=1):
        m = re.search(r'(<w:footnote w:id="%d">)(.*?)(</w:footnote>)' % i, out, re.S)
        novo = ('<w:p><w:pPr><w:spacing w:line="240" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr>'
                '<w:r><w:rPr><w:vertAlign w:val="superscript"/></w:rPr><w:footnoteRef/></w:r>'
                '<w:r><w:rPr><w:color w:val="000000"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>'
                '<w:t xml:space="preserve"> %s</w:t></w:r></w:p>' % escape(txt))
        out = out[:m.start(2)] + novo + out[m.end(2):]
    return out

def write_docx(template_name, out_name, body_xml):
    src = os.path.join(TPL, template_name)
    dst = os.path.join(OUT, out_name)
    zin = zipfile.ZipFile(src)
    doc = zin.read('word/document.xml').decode('utf-8')
    sect = re.search(r'<w:sectPr.*?</w:sectPr>', doc, re.S).group(0)
    # margens conforme edital: sup/esq 3,0cm (1701 tw) e inf/dir 2,0cm (1134 tw).
    # o topo do template e 0 por causa da imagem de cabecalho -> preservado.
    sect = re.sub(r'w:right="\d+"', 'w:right="1134"', sect)
    sect = re.sub(r'w:bottom="\d+"', 'w:bottom="1134"', sect)
    sect = re.sub(r'w:left="\d+"', 'w:left="1701"', sect)
    head = doc[:doc.index('<w:body>') + len('<w:body>')]
    newdoc = head + body_xml + sect + '</w:body></w:document>'
    fn = build_footnotes(zin.read('word/footnotes.xml').decode('utf-8'))
    zout = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED)
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == 'word/document.xml':
            data = newdoc.encode('utf-8')
        elif item.filename == 'word/footnotes.xml':
            data = fn.encode('utf-8')
        zout.writestr(item, data)
    zout.close(); zin.close()
    return dst

def cabecalho(compacto=False):
    p = [] if compacto else [EMPTY]
    p.append(para(run(C.TITULO, bold=True), align="center"))
    p.append(EMPTY)
    for i, a in enumerate(C.AUTORES, start=1):
        p.append(autor_para(a, i))
    if not compacto:
        p.append(EMPTY)
    return "".join(p)

# =============================================================== RESUMO SIMPLES
def gerar_simples():
    runs = []
    for rot, txt in C.RESUMO_SIMPLES:
        runs.append(run(rot, bold=True))
        runs.append(runs_italicizados(txt))
    body = cabecalho(compacto=True)
    body += para("".join(runs), align="both", spacing_after=100)
    body += para(run("Palavras-Chave: ", bold=True) + run(C.PALAVRAS_CHAVE),
                 align="both", spacing_after=100)
    body += para(run("DECLARAÇÃO DE USO DE IAG: ", bold=True) + run(C.IAG),
                 align="both", spacing_after=0)
    path = write_docx("TemplateMostraCientfica2026 - Resumo simples.docx",
                      "Mostra-Cientifica-2026-Resumo-Simples-AAF-H-pylori.docx", body)
    palavras = sum(len((r + t).split()) for r, t in C.RESUMO_SIMPLES)
    return path, palavras

# =============================================================== RESUMO EXPANDIDO
def gerar_expandido():
    body = cabecalho()
    body += para(run("RESUMO", bold=True), align="left", spacing_after=60)
    body += para(runs_italicizados(C.RESUMO_150), align="both", spacing_after=120)
    body += para(run("Palavras-chave: ", bold=True) + run(C.PALAVRAS_CHAVE),
                 align="both", spacing_after=120)
    body += EMPTY
    for kind, txt in C.EXPANDIDO:
        if kind == "h":
            body += EMPTY
            body += para(run(txt, bold=True), align="left", spacing_after=60)
        else:
            body += para(runs_italicizados(txt), align="both", indent=851, spacing_after=60)
    body += EMPTY
    body += para(run("DECLARAÇÃO DE USO DA IAG: ", bold=True) + run(C.IAG),
                 align="both", spacing_after=120)
    body += EMPTY
    body += para(run("REFERÊNCIAS", bold=True), align="left", spacing_after=60)
    for r in C.REFERENCIAS:
        body += para(run(r), align="left", spacing_before=12, spacing_after=0)
    path = write_docx("TemplateMostraCientfica2026 - Resumo extendido.docx",
                      "Mostra-Cientifica-2026-Resumo-Expandido-AAF-H-pylori.docx", body)
    palavras = len(C.RESUMO_150.split()) + sum(len(t.split()) for k, t in C.EXPANDIDO)
    return path, palavras

# =============================================================== PPTX
NS_SLD = None

def a_para(txt, sz, bold=False, bullet=True, align="l", space_after=600, color=None):
    ppr = ('<a:pPr indent="%s" lvl="0" marL="%s" rtl="0" algn="%s">'
           '<a:lnSpc><a:spcPct val="100000"/></a:lnSpc>'
           '<a:spcBef><a:spcPts val="0"/></a:spcBef>'
           '<a:spcAft><a:spcPts val="%d"/></a:spcAft>%s</a:pPr>') % (
        '-228600' if bullet else '0', '228600' if bullet else '0', align, space_after,
        '<a:buSzPts val="%d"/><a:buChar char="&#9679;"/>' % sz if bullet else '<a:buNone/>')
    rpr = '<a:rPr lang="pt-BR" sz="%d"%s>%s</a:rPr>' % (
        sz, ' b="1"' if bold else '',
        '<a:solidFill><a:srgbClr val="%s"/></a:solidFill>' % color if color else '')
    return '<a:p>%s<a:r>%s<a:t>%s</a:t></a:r></a:p>' % (ppr, rpr, escape(txt))

def set_ph_text(slide_xml, ph_match, paras_xml):
    """Substitui o conteudo <a:p>...</a:p> do txBody do shape que contem ph_match."""
    i = slide_xml.index(ph_match)
    start = slide_xml.index('<a:lstStyle/>', i) + len('<a:lstStyle/>')
    end = slide_xml.index('</p:txBody>', start)
    return slide_xml[:start] + paras_xml + slide_xml[end:]

def gerar_pptx():
    src = os.path.join(TPL, "Modelo de Apresentação - Fundo Claro - Mostra Científica.pptx")
    dst = os.path.join(OUT, "Mostra-Cientifica-2026-Apresentacao-AAF-H-pylori.pptx")
    zin = zipfile.ZipFile(src)
    sld1 = zin.read('ppt/slides/slide1.xml').decode('utf-8')
    sld2 = zin.read('ppt/slides/slide2.xml').decode('utf-8')
    rel1 = zin.read('ppt/slides/_rels/slide1.xml.rels').decode('utf-8')
    rel2 = zin.read('ppt/slides/_rels/slide2.xml.rels').decode('utf-8')
    # remove notesSlide das rels (nao vamos duplicar notas)
    rel1c = re.sub(r'<Relationship[^>]*notesSlide[^>]*/>', '', rel1)
    rel2c = re.sub(r'<Relationship[^>]*notesSlide[^>]*/>', '', rel2)

    DARK = "0F2B5B"; ACC = "0B5FA5"
    # --- capa
    capa = sld1
    tit = a_para("Alopecia androgenética feminina e saúde gastrointestinal", 1800, bold=True,
                 bullet=False, align="ctr", space_after=0, color=DARK)
    capa = set_ph_text(capa, 'type="ctrTitle"', tit)
    sub = "".join(a_para(l, 1100, bullet=False, align="ctr", space_after=200, color=ACC)
                  for l in C.SUBTITULO_CAPA.split("\n"))
    capa = set_ph_text(capa, 'type="subTitle"', sub)
    # reposiciona para caber no cartao branco da capa
    capa = capa.replace('<a:off x="311702" y="744575"/><a:ext cx="6967500" cy="2052600"/>',
                        '<a:off x="400000" y="700000"/><a:ext cx="6600000" cy="1900000"/>')
    capa = capa.replace('<a:off x="311700" y="3074757"/><a:ext cx="7042500" cy="792600"/>',
                        '<a:off x="400000" y="2700000"/><a:ext cx="6600000" cy="1300000"/>')

    slides = [(capa, rel1c)]
    for titulo, bullets in C.SLIDES:
        s = sld2
        s = set_ph_text(s, 'type="title"',
                        a_para(titulo, 1600, bold=True, bullet=False, align="l",
                               space_after=0, color=DARK))
        n = len(bullets)
        sz = 1400 if n <= 3 else (1300 if n == 4 else (1150 if n <= 6 else 1000))
        gap = 900 if n <= 3 else (700 if n <= 5 else 450)
        body = "".join(a_para(b, sz, space_after=(0 if k == n - 1 else gap), color="1A1A1A")
                       for k, b in enumerate(bullets))
        s = set_ph_text(s, 'type="body"', body)
        # centraliza verticalmente o corpo dentro do cartao branco
        i = s.index('type="body"')
        j = s.index('<a:bodyPr', i)
        s = s[:j] + s[j:].replace('anchor="t"', 'anchor="ctr"', 1)
        # caixa do corpo dentro do cartao branco (cartao termina em ~4.15M EMU)
        s = s.replace('<a:off x="311700" y="445025"/><a:ext cx="8520600" cy="572700"/>',
                      '<a:off x="420000" y="330000"/><a:ext cx="8300000" cy="620000"/>')
        s = s.replace('<a:off x="311700" y="1152475"/><a:ext cx="8520600" cy="2832900"/>',
                      '<a:off x="420000" y="1020000"/><a:ext cx="8300000" cy="3050000"/>')
        slides.append((s, rel2c))

    ct = zin.read('[Content_Types].xml').decode('utf-8')
    pres = zin.read('ppt/presentation.xml').decode('utf-8')
    presrels = zin.read('ppt/_rels/presentation.xml.rels').decode('utf-8')

    # limpa refs a notesSlides antigos
    ct = re.sub(r'<Override[^>]*notesSlide[^>]*/>', '', ct)
    ct = re.sub(r'<Override[^>]*/slide\d+\.xml[^>]*/>', '', ct)
    ct += ''
    novos_ov = "".join(
        '<Override PartName="/ppt/slides/slide%d.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' % (i + 1)
        for i in range(len(slides)))
    ct = ct.replace('</Types>', novos_ov + '</Types>')

    # rels da apresentacao: reconstroi lista de slides
    presrels = re.sub(r'<Relationship[^>]*Type="[^"]*/slide"[^>]*/>', '', presrels)
    base = 900
    add = "".join('<Relationship Id="rIdS%d" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide%d.xml"/>' % (base + i, i + 1)
                  for i in range(len(slides)))
    presrels = presrels.replace('</Relationships>', add + '</Relationships>')
    sldid = "".join('<p:sldId id="%d" r:id="rIdS%d"/>' % (300 + i, base + i)
                    for i in range(len(slides)))
    pres = re.sub(r'<p:sldIdLst>.*?</p:sldIdLst>', '<p:sldIdLst>%s</p:sldIdLst>' % sldid,
                  pres, flags=re.S)

    skip = re.compile(r'^ppt/(slides/slide\d+\.xml$|slides/_rels/|notesSlides/)')
    zout = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED)
    for item in zin.infolist():
        if skip.match(item.filename): continue
        data = zin.read(item.filename)
        if item.filename == '[Content_Types].xml': data = ct.encode('utf-8')
        elif item.filename == 'ppt/presentation.xml': data = pres.encode('utf-8')
        elif item.filename == 'ppt/_rels/presentation.xml.rels': data = presrels.encode('utf-8')
        elif item.filename == 'ppt/notesMasters/notesMaster1.xml': pass
        zout.writestr(item.filename, data)
    for i, (sx, rx) in enumerate(slides, start=1):
        zout.writestr('ppt/slides/slide%d.xml' % i, sx.encode('utf-8'))
        zout.writestr('ppt/slides/_rels/slide%d.xml.rels' % i, rx.encode('utf-8'))
    zout.close(); zin.close()
    return dst, len(slides)

if __name__ == '__main__':
    p1, w1 = gerar_simples(); print("simples:", p1, "palavras:", w1)
    p2, w2 = gerar_expandido(); print("expandido:", p2, "palavras:", w2,
                                      "| resumo150:", len(C.RESUMO_150.split()))
    p3, n = gerar_pptx(); print("pptx:", p3, "slides:", n)
