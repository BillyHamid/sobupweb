from pathlib import Path
from reportlab.graphics.barcode.qr import QrCodeWidget


ROOT = Path(__file__).parent
SVG_PATH = ROOT / "echographie-thoracique-v2.svg"
URL = "https://www.sobup.online/formations/echographie-thoracique"
MARKER = "<!-- Informations de candidature EchoT -->"


def qr_markup(url: str, x: int, y: int, size: int) -> str:
    widget = QrCodeWidget(url)
    widget.qr.make()
    modules = widget.qr.modules
    count = len(modules)
    cell = size / count
    squares = [f'<rect x="{x-10}" y="{y-10}" width="{size+20}" height="{size+20}" rx="9" fill="#fff"/>']
    for row, values in enumerate(modules):
        for col, value in enumerate(values):
            if value:
                squares.append(f'<rect x="{x + col*cell:.2f}" y="{y + row*cell:.2f}" width="{cell+.05:.2f}" height="{cell+.05:.2f}" fill="#0b3d38"/>')
    return "\n".join(squares)


svg = SVG_PATH.read_text(encoding="utf-8")
if MARKER in svg:
    svg = svg.split(MARKER)[0] + "</svg>\n"
svg = svg.replace('height="1200" viewBox="0 0 1600 1200"', 'height="1500" viewBox="0 0 1600 1500"')
svg = svg.replace('width="1600" height="1200" fill="url(#background)"', 'width="1600" height="1500" fill="url(#background)"')
svg = svg.replace('font-size="22" fill="#065e52">Société', 'font-size="25" fill="#065e52">Société')
svg = svg.replace('font-size="25" font-weight="800" letter-spacing="5"', 'font-size="29" font-weight="800" letter-spacing="5"')
svg = svg.replace('font-size="24" font-weight="800" fill="#0b3d38">THÉORIE', 'font-size="28" font-weight="800" fill="#0b3d38">THÉORIE')
svg = svg.replace('font-size="24" font-weight="800" fill="#0b3d38">PRATIQUE', 'font-size="28" font-weight="800" fill="#0b3d38">PRATIQUE')
svg = svg.replace('font-size="26" fill="#355652">5 participants', 'font-size="29" fill="#355652">5 participants')
svg = svg.replace('font-size="25" fill="#b9e7dc">Autres participants', 'font-size="29" fill="#b9e7dc">Autres participants')
svg = svg.replace('font-size="28" font-weight="800" fill="#fff">Membres', 'font-size="32" font-weight="800" fill="#fff">Membres')
svg = svg.replace('font-size="25" font-weight="800" fill="#fff">CANDIDATURE', 'font-size="27" font-weight="800" fill="#fff">CANDIDATURE')
svg = svg.replace('x="72" y="48" width="207" height="130"', 'x="72" y="35" width="250" height="158"')
svg = svg.replace('x="88" y="58" width="175" height="110"', 'x="82" y="42" width="230" height="145"')
svg = svg.replace('x="303" y="107"', 'x="347" y="107"')
svg = svg.replace('x="306" y="143"', 'x="350" y="143"')

extra = f'''  {MARKER}
  <rect x="72" y="1215" width="1456" height="76" rx="18" fill="#e67e22"/>
  <text x="104" y="1265" font-family="Arial,sans-serif" font-size="38" font-weight="800" fill="#fff">DATE LIMITE DE CANDIDATURE : 25 OCTOBRE 2026</text>
  <rect x="72" y="1310" width="1456" height="166" rx="20" fill="#e8f5ed"/>
  <text x="99" y="1356" font-family="Arial,sans-serif" font-size="28" font-weight="800" fill="#08796c">FORMATION ET CANDIDATURE EN LIGNE</text>
  <a href="{URL}" target="_blank"><text x="99" y="1409" font-family="Arial,sans-serif" font-size="29" font-weight="800" fill="#0b3d38" text-decoration="underline">www.sobup.online/formations/echographie-thoracique</text></a>
  <text x="99" y="1451" font-family="Arial,sans-serif" font-size="25" fill="#355652">Scannez le QR code pour ouvrir directement la fiche.</text>
  <path d="M895 1335 V1450" stroke="#b5d7cb" stroke-width="2"/>
  <text x="924" y="1356" font-family="Arial,sans-serif" font-size="28" font-weight="800" fill="#08796c">CONTACTS</text>
  <text x="924" y="1396" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#0b3d38">sobup01@gmail.com</text>
  <text x="924" y="1438" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#0b3d38">+226 76 58 01 03 / 70 24 12 24</text>
  {qr_markup(URL, 1352, 1329, 128)}
</svg>
'''
svg = svg.replace("</svg>", extra).rstrip() + "\n"
SVG_PATH.write_text(svg, encoding="utf-8")
print(SVG_PATH)
