import os
import subprocess
from pathlib import Path
from markdown_it import MarkdownIt

docs_dir = Path(r'F:\PKA\Code\KT\docs')
md_files = [
    'SRS_Dac_Ta_Yeu_Cau.md',
    'Test_Plan_Kiem_Thu.md',
    'Test_Cases_Chi_Tiet.md'
]

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if not os.path.exists(edge_path):
    edge_path = r'C:\Program Files\Microsoft\Edge\Application\msedge.exe'

css = """
@page {
    size: A4;
    margin: 16mm 14mm 16mm 14mm;
}
@media print {
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
}
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #111827;
    line-height: 1.55;
    font-size: 9.5pt;
    margin: 0;
    padding: 0;
}
h1 {
    font-size: 16.5pt;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 4pt;
    margin-top: 18pt;
    margin-bottom: 8pt;
    page-break-after: avoid;
}
h2 {
    font-size: 13pt;
    font-weight: 700;
    color: #1e293b;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 3pt;
    margin-top: 14pt;
    margin-bottom: 6pt;
    page-break-after: avoid;
}
h3 {
    font-size: 11pt;
    font-weight: 600;
    color: #334155;
    margin-top: 11pt;
    margin-bottom: 4pt;
    page-break-after: avoid;
}
h4 {
    font-size: 9.8pt;
    font-weight: 600;
    color: #475569;
    margin-top: 8pt;
    margin-bottom: 3pt;
    page-break-after: avoid;
}
p {
    margin-top: 3pt;
    margin-bottom: 6pt;
    text-align: justify;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin: 8pt 0 12pt 0;
    font-size: 8.5pt;
    page-break-inside: auto;
}
thead {
    display: table-header-group;
}
tr {
    page-break-inside: avoid;
    page-break-after: auto;
}
th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 600;
    padding: 5pt 6pt;
    border: 1px solid #cbd5e1;
    text-align: left;
}
td {
    padding: 4.5pt 6pt;
    border: 1px solid #cbd5e1;
    vertical-align: top;
    word-break: break-word;
}
tr:nth-child(even) {
    background-color: #f8fafc;
}
code {
    font-family: "JetBrains Mono", Consolas, Monaco, monospace;
    font-size: 8.3pt;
    background-color: #f1f5f9;
    padding: 1.5pt 3.5pt;
    border-radius: 3pt;
    color: #0f172a;
    border: 1px solid #e2e8f0;
}
pre {
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 4pt;
    padding: 7pt 9pt;
    font-family: "JetBrains Mono", Consolas, Monaco, monospace;
    font-size: 8.3pt;
    overflow-x: auto;
    white-space: pre-wrap;
    page-break-inside: avoid;
    margin: 6pt 0 10pt 0;
}
pre code {
    background: none;
    padding: 0;
    border: none;
}
ul, ol {
    margin-top: 3pt;
    margin-bottom: 6pt;
    padding-left: 18pt;
}
li {
    margin-bottom: 2pt;
}
hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 12pt 0;
}
blockquote {
    border-left: 3px solid #3b82f6;
    background-color: #eff6ff;
    padding: 5pt 8pt;
    margin: 6pt 0;
    color: #1e3a8a;
    font-size: 9pt;
}
"""

md = MarkdownIt('gfm-like', {'linkify': False})

def convert_all():
    for filename in md_files:
        md_path = docs_dir / filename
        pdf_name = filename.replace('.md', '.pdf')
        pdf_path = docs_dir / pdf_name
        html_path = docs_dir / filename.replace('.md', '_temp.html')
        
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        html_body = md.render(content)
        title = filename.replace('.md', '')
        full_html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>{css}</style>
</head>
<body>
{html_body}
</body>
</html>"""

        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(full_html)
            
        cmd = [
            edge_path,
            '--headless=new',
            '--disable-gpu',
            '--no-pdf-header-footer',
            '--run-all-compositor-stages-before-draw',
            f'--print-to-pdf={pdf_path}',
            f'file:///{str(html_path).replace(os.sep, "/")}'
        ]
        
        res = subprocess.run(cmd, capture_output=True, text=True)
        if os.path.exists(html_path):
            os.remove(html_path)
            
        if os.path.exists(pdf_path):
            size_kb = os.path.getsize(pdf_path) / 1024
            print(f"SUCCESS: {pdf_name} ({size_kb:.1f} KB)")
        else:
            print(f"ERROR: {pdf_name}")
            print(res.stderr)

if __name__ == '__main__':
    convert_all()
