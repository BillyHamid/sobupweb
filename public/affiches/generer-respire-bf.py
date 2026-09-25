"""Compose the RESPIRE-BF flyer from approved text, SOBUP logo and background.

Run with a Python installation containing Pillow. The files live beside this script.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
PUBLIC = HERE.parent
OUT = HERE / "respire-bf-affiche.png"
W, H = 1600, 1200
TEAL = "#0b3d38"
TEAL_2 = "#065e52"
TURQUOISE = "#31b9ae"
ORANGE = "#e67e22"
INK = "#19332f"
FONT_REGULAR = "C:/Windows/Fonts/arial.ttf"
FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


background = Image.open(HERE / "respire-bf-fond.png").convert("RGB")
scale = max(W / background.width, H / background.height)
background = background.resize((round(background.width * scale), round(background.height * scale)), Image.Resampling.LANCZOS)
offset_x = (background.width - W) // 2
offset_y = (background.height - H) // 2
poster = background.crop((offset_x, offset_y, offset_x + W, offset_y + H)).convert("RGBA")

# Guarantee readable copy on varying print and screen backgrounds.
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
pixels = overlay.load()
for y in range(H):
    for x in range(W):
        if y < 1010:
            alpha = 235 if x < 620 else max(0, int(235 * (1050 - x) / 430)) if x < 1050 else 0
            if alpha:
                pixels[x, y] = (255, 252, 244, alpha)
        else:
            pixels[x, y] = (11, 61, 56, 242)
poster = Image.alpha_composite(poster, overlay)
d = ImageDraw.Draw(poster)

# Header with the existing logo, unchanged.
d.rounded_rectangle((70, 42, 215, 187), radius=25, fill=(255, 255, 255, 242))
logo = Image.open(PUBLIC / "logo.png").convert("RGBA")
logo.thumbnail((128, 128), Image.Resampling.LANCZOS)
poster.alpha_composite(logo, (78 + (128 - logo.width) // 2, 50 + (128 - logo.height) // 2))
d = ImageDraw.Draw(poster)
d.text((237, 63), "SOBUP", font=font(60, True), fill=TEAL)
d.text((239, 132), "Société Burkinabè de Pneumologie", font=font(23), fill=TEAL_2)
d.rounded_rectangle((1227, 70, 1532, 122), radius=22, fill=(11, 61, 56, 240))
d.text((1260, 83), "FORMATION HYBRIDE", font=font(19, True), fill="white")

# The main message uses deterministic typography instead of image-generated text.
d.text((88, 221), "RENFORCEMENT SCIENTIFIQUE", font=font(24, True), fill=TEAL_2)
d.text((83, 268), "RESPIRE-BF", font=font(95, True), fill=TEAL)
d.rounded_rectangle((91, 386, 735, 394), radius=3, fill=ORANGE)
d.text((88, 416), "De la question de terrain", font=font(38, True), fill=INK)
d.text((88, 460), "à la publication scientifique.", font=font(38, True), fill=INK)

modules = ["Protocole de recherche", "Publication scientifique", "Projet et Grant"]
for index, label in enumerate(modules, 1):
    y = 549 + (index - 1) * 61
    d.rounded_rectangle((91, y, 137, y + 43), radius=9, fill=TEAL_2)
    d.text((101, y + 7), f"{index:02d}", font=font(23, True), fill="white")
    d.text((157, y + 5), label, font=font(29, True), fill=TEAL)

# Compact, complete pricing. All amounts come from the source RESPIRE-BF document.
d.rounded_rectangle((82, 753, 908, 981), radius=22, fill=(255, 255, 255, 238), outline=(49, 185, 174, 165), width=2)
d.text((111, 778), "TARIFS PAR PERSONNE", font=font(25, True), fill=TEAL_2)
d.text((558, 782), "PAR MODULE", font=font(18, True), fill=TEAL_2)
d.text((737, 782), "3 MODULES", font=font(18, True), fill=TEAL_2)
prices = [
    ("Membres SOBUP à jour", "50 000", "130 000"),
    ("Non-membres", "75 000", "200 000"),
    ("Institutions", "100 000", "270 000"),
]
for index, (label, single, full) in enumerate(prices):
    y = 820 + index * 45
    if index:
        d.line((111, y - 9, 875, y - 9), fill=(220, 232, 228), width=2)
    d.text((111, y), label, font=font(22, True), fill=INK)
    d.text((558, y), single, font=font(21, True), fill=INK)
    d.text((737, y), full, font=font(21, True), fill=INK)
d.text((111, 949), "FCFA  •  3 modules indépendants  •  99 h au total", font=font(17), fill=TEAL_2)

# The two training periods sit beside the pricing without changing the original layout.
d.rounded_rectangle((932, 753, 1532, 981), radius=22, fill=(11, 61, 56, 244))
d.text((961, 773), "DATES DE LA FORMATION", font=font(24, True), fill="#89f3e6")
d.line((961, 814, 1503, 814), fill=(100, 173, 160), width=2)
d.text((961, 829), "EN LIGNE", font=font(19, True), fill="#89f3e6")
d.text((961, 855), "23 novembre au 19 décembre 2026", font=font(24, True), fill="white")
d.text((961, 905), "PRÉSENTIEL", font=font(19, True), fill="#89f3e6")
d.text((961, 931), "4 au 9 janvier 2027", font=font(25, True), fill="white")

# Clear destination and required documents.
d.text((92, 1022), "PROGRAMME ET CANDIDATURE EN LIGNE", font=font(25, True), fill="#89f3e6")
d.text((92, 1067), "www.sobup.online/formations/respire-bf", font=font(35, True), fill="white")
d.text((92, 1129), "CV requis  •  Lettre de motivation facultative", font=font(21), fill="white")
d.text((92, 1165), "Une formation SOBUP avec le Département de Santé Publique de l’UJKZ", font=font(18), fill="#c9e4dc")

poster.convert("RGB").save(OUT, quality=95, optimize=True)
print(OUT)
