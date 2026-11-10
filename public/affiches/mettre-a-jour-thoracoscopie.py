from pathlib import Path

from reportlab.graphics.barcode.qr import QrCodeWidget


ROOT = Path(__file__).parent
SVG_PATH = ROOT / "thoracoscopie-medicale.svg"
URL = "https://www.sobup.online/formations/thoracoscopie-medicale"
MARKER = "<!-- Informations de candidature Thoracoscopie -->"


def qr_markup(url: str, x: int, y: int, size: int) -> str:
    widget = QrCodeWidget(url)
    widget.qr.make()
    modules = widget.qr.modules
    cell = size / len(modules)
    squares = [f'<rect x="{x-12}" y="{y-12}" width="{size+24}" height="{size+24}" rx="9" fill="#fff"/>']
    for row, values in enumerate(modules):
        for col, value in enumerate(values):
            if value:
                squares.append(f'<rect x="{x+col*cell:.2f}" y="{y+row*cell:.2f}" width="{cell+.05:.2f}" height="{cell+.05:.2f}" fill="#0b3d38"/>')
    return "\n".join(squares)


svg = SVG_PATH.read_text(encoding="utf-8")
if MARKER in svg:
    svg = svg.split(MARKER)[0] + "</svg>\n"
svg = svg.replace('height="1200" viewBox="0 0 1600 1200"', 'height="1500" viewBox="0 0 1600 1500"')
svg = svg.replace('width="1600" height="1200" fill="url(#background)"', 'width="1600" height="1500" fill="url(#background)"')
svg = svg.replace('02 · INITIATION À OUAGADOUGOU', '02 · INITIATION EN PRÉSENTIEL')
svg = svg.replace('initiation du 7 au 11 décembre', 'initiation en présentiel du 7 au 11 décembre')

extra = f'''  {MARKER}
  <rect x="72" y="1215" width="1456" height="76" rx="18" fill="#e67e22"/>
  <text x="104" y="1265" font-family="Arial,sans-serif" font-size="39" font-weight="800" fill="#fff">DATE LIMITE DE CANDIDATURE : 15 NOVEMBRE 2026</text>
  <rect x="72" y="1310" width="1456" height="166" rx="20" fill="#e8f5ed"/>
  <text x="99" y="1357" font-family="Arial,sans-serif" font-size="29" font-weight="800" fill="#08796c">FORMATION ET CANDIDATURE EN LIGNE</text>
  <a href="{URL}" target="_blank"><text x="99" y="1410" font-family="Arial,sans-serif" font-size="31" font-weight="800" fill="#0b3d38" text-decoration="underline">www.sobup.online/formations/thoracoscopie-medicale</text></a>
  <text x="99" y="1451" font-family="Arial,sans-serif" font-size="26" fill="#355652">Scannez le QR code pour accéder directement à la fiche.</text>
  {qr_markup(URL, 1352, 1329, 128)}
</svg>
'''
svg = svg.replace("</svg>", extra).rstrip() + "\n"
SVG_PATH.write_text(svg, encoding="utf-8")
print(SVG_PATH)
