# Gera o .docx do estudo de caso (foco AAG) SEM Node/Python.
# Le o conteudo de conteudo-foco-aag.json (UTF-8) e monta OOXML -> .docx (ZIP).
# ABNT: Times New Roman 12, entrelinha 1,5, justificado, margens 3/2/3/2 cm, A4.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$jsonPath  = Join-Path $scriptDir 'conteudo-foco-aag.json'

$utf8 = New-Object System.Text.UTF8Encoding($false)
$raw  = [System.IO.File]::ReadAllText($jsonPath, $utf8)
$data = $raw | ConvertFrom-Json

$NS   = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

function Esc([string]$s) {
  if ($null -eq $s) { return '' }
  $s = $s -replace '&', '&amp;'
  $s = $s -replace '<', '&lt;'
  $s = $s -replace '>', '&gt;'
  return $s
}

function Run($run) {
  $sz = 24
  if ($run.PSObject.Properties.Name -contains 'sz' -and $run.sz) { $sz = [int]$run.sz }
  $rpr = "<w:rPr><w:rFonts w:ascii='Times New Roman' w:hAnsi='Times New Roman' w:cs='Times New Roman'/>"
  if ($run.PSObject.Properties.Name -contains 'b' -and $run.b) { $rpr += '<w:b/>' }
  if ($run.PSObject.Properties.Name -contains 'i' -and $run.i) { $rpr += '<w:i/>' }
  $rpr += "<w:sz w:val='$sz'/><w:szCs w:val='$sz'/></w:rPr>"
  return "<w:r>$rpr<w:t xml:space='preserve'>$(Esc $run.t)</w:t></w:r>"
}

function RunsXml($block) {
  if ($block.PSObject.Properties.Name -contains 'runs' -and $block.runs) {
    $s = ''
    foreach ($r in $block.runs) { $s += (Run $r) }
    return $s
  }
  return (Run ([pscustomobject]@{ t = $block.t }))
}

function Para([string]$runsXml, [string]$jc = 'both', [bool]$firstLine = $false, [int]$after = 120, [int]$line = 360, [int]$before = 0) {
  $ppr = "<w:pPr><w:spacing"
  if ($before -gt 0) { $ppr += " w:before='$before'" }
  $ppr += " w:after='$after' w:line='$line' w:lineRule='auto'/><w:jc w:val='$jc'/>"
  if ($firstLine) { $ppr += "<w:ind w:firstLine='720'/>" }
  $ppr += "</w:pPr>"
  return "<w:p>$ppr$runsXml</w:p>"
}

function CellXml([string]$text, [bool]$bold, [string]$fill, [int]$pct = 1000) {
  $shd = ''
  if ($fill) { $shd = "<w:shd w:val='clear' w:color='auto' w:fill='$fill'/>" }
  $tcpr = "<w:tcPr><w:tcW w:w='$pct' w:type='pct'/>$shd</w:tcPr>"
  $b = ''
  if ($bold) { $b = '<w:b/>' }
  $r = "<w:r><w:rPr><w:rFonts w:ascii='Times New Roman' w:hAnsi='Times New Roman'/>$b<w:sz w:val='18'/><w:szCs w:val='18'/></w:rPr><w:t xml:space='preserve'>$(Esc $text)</w:t></w:r>"
  $p = "<w:p><w:pPr><w:spacing w:after='40' w:line='240' w:lineRule='auto'/></w:pPr>$r</w:p>"
  return "<w:tc>$tcpr$p</w:tc>"
}

$sb = New-Object System.Text.StringBuilder
[void]$sb.Append("<?xml version='1.0' encoding='UTF-8' standalone='yes'?>")
[void]$sb.Append("<w:document xmlns:w='$NS'><w:body>")

foreach ($block in $data.blocks) {
  switch ($block.type) {
    'blank'     { [void]$sb.Append('<w:p/>') }
    'pagebreak' { [void]$sb.Append("<w:p><w:r><w:br w:type='page'/></w:r></w:p>") }
    'center'    { [void]$sb.Append((Para (RunsXml $block) 'center' $false 120 360)) }
    'h1'        { [void]$sb.Append((Para (Run ([pscustomobject]@{ t = $block.t; b = $true; sz = 26 })) 'left' $false 100 360 240)) }
    'h2'        { [void]$sb.Append((Para (Run ([pscustomobject]@{ t = $block.t; b = $true; sz = 24 })) 'left' $false 100 360 240)) }
    'ref'       { [void]$sb.Append("<w:p><w:pPr><w:spacing w:after='140' w:line='240' w:lineRule='auto'/><w:jc w:val='left'/><w:ind w:left='720' w:hanging='720'/></w:pPr>" + (Run ([pscustomobject]@{ t = $block.t; sz = 20 })) + "</w:p>") }
    'p' {
      $fl = ($block.PSObject.Properties.Name -contains 'firstLine' -and $block.firstLine)
      [void]$sb.Append((Para (RunsXml $block) 'both' $fl 120 360))
    }
    'table' {
      $grid = "<w:tblGrid>" + ("<w:gridCol w:w='1869'/>" * $block.header.Count) + "</w:tblGrid>"
      $borders = "<w:tblBorders>" +
        "<w:top w:val='single' w:sz='4' w:space='0' w:color='auto'/>" +
        "<w:left w:val='single' w:sz='4' w:space='0' w:color='auto'/>" +
        "<w:bottom w:val='single' w:sz='4' w:space='0' w:color='auto'/>" +
        "<w:right w:val='single' w:sz='4' w:space='0' w:color='auto'/>" +
        "<w:insideH w:val='single' w:sz='4' w:space='0' w:color='auto'/>" +
        "<w:insideV w:val='single' w:sz='4' w:space='0' w:color='auto'/></w:tblBorders>"
      $pct = [int](5000 / $block.header.Count)
      $tbl = "<w:tbl><w:tblPr><w:tblW w:w='5000' w:type='pct'/>$borders</w:tblPr>$grid"
      $hcells = ''
      foreach ($h in $block.header) { $hcells += (CellXml $h $true 'D9E2F3' $pct) }
      $tbl += "<w:tr>$hcells</w:tr>"
      foreach ($row in $block.rows) {
        $cells = ''
        foreach ($c in $row) { $cells += (CellXml $c $false $null $pct) }
        $tbl += "<w:tr>$cells</w:tr>"
      }
      $tbl += "</w:tbl>"
      [void]$sb.Append($tbl)
    }
    default { }
  }
}

# Secao: A4, margens ABNT (3 cm sup/esq, 2 cm inf/dir)
[void]$sb.Append("<w:sectPr><w:pgSz w:w='11906' w:h='16838'/><w:pgMar w:top='1701' w:right='1134' w:bottom='1134' w:left='1701' w:header='708' w:footer='708' w:gutter='0'/></w:sectPr>")
[void]$sb.Append("</w:body></w:document>")
$documentXml = $sb.ToString()

$contentTypes = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>" +
  "<Types xmlns='http://schemas.openxmlformats.org/package/2006/content-types'>" +
  "<Default Extension='rels' ContentType='application/vnd.openxmlformats-package.relationships+xml'/>" +
  "<Default Extension='xml' ContentType='application/xml'/>" +
  "<Override PartName='/word/document.xml' ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'/>" +
  "<Override PartName='/word/styles.xml' ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml'/></Types>"

$rels = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>" +
  "<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'>" +
  "<Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument' Target='word/document.xml'/></Relationships>"

$docRels = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>" +
  "<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'>" +
  "<Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles' Target='styles.xml'/></Relationships>"

$styles = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>" +
  "<w:styles xmlns:w='$NS'><w:docDefaults><w:rPrDefault><w:rPr>" +
  "<w:rFonts w:ascii='Times New Roman' w:hAnsi='Times New Roman' w:cs='Times New Roman'/>" +
  "<w:sz w:val='24'/><w:szCs w:val='24'/><w:lang w:val='pt-BR'/></w:rPr></w:rPrDefault>" +
  "<w:pPrDefault><w:pPr><w:spacing w:after='120' w:line='360' w:lineRule='auto'/><w:jc w:val='both'/></w:pPr></w:pPrDefault>" +
  "</w:docDefaults><w:style w:type='paragraph' w:default='1' w:styleId='Normal'><w:name w:val='Normal'/></w:style></w:styles>"

$outPath = $data.out
if (-not [System.IO.Path]::IsPathRooted($outPath)) {
  $outPath = [System.IO.Path]::GetFullPath((Join-Path $scriptDir $outPath))
}
$outDir  = Split-Path -Parent $outPath
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
if (Test-Path $outPath) { Remove-Item $outPath -Force }

function Add-Entry($zip, $name, $content, $enc) {
  $entry  = $zip.CreateEntry($name, [System.IO.Compression.CompressionLevel]::Optimal)
  $stream = $entry.Open()
  $bytes  = $enc.GetBytes($content)
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Close()
}

$fs  = [System.IO.File]::Open($outPath, [System.IO.FileMode]::Create)
$zip = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
Add-Entry $zip '[Content_Types].xml'            $contentTypes $utf8
Add-Entry $zip '_rels/.rels'                     $rels         $utf8
Add-Entry $zip 'word/_rels/document.xml.rels'    $docRels      $utf8
Add-Entry $zip 'word/styles.xml'                 $styles       $utf8
Add-Entry $zip 'word/document.xml'               $documentXml  $utf8
$zip.Dispose()
$fs.Close()

Write-Output ("OK -> " + $outPath)
Write-Output ("Tamanho: " + [math]::Round((Get-Item $outPath).Length/1KB, 1) + " KB")
Write-Output ("Blocos processados: " + $data.blocks.Count)
