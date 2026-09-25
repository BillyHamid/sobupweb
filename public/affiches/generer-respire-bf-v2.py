"""Compose the second RESPIRE-BF flyer from its photograph and official SOBUP logo."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
PUBLIC = HERE.parent
W, H = 1600, 2000
DEEP = "#0b3d38"
GREEN = "#07594f"
AQUA = "#9af0e4"
ORANGE = "#f5a04a"
IVORY = "#f8f8f0"
INK = "#183f39"
MUTED = "#526a64"
FONT = "C:/Windows/Fonts/arial.ttf"
BOLD = "C:/Windows/Fonts/arialbd.ttf"


def f(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)


def text(x, y, value, size, color, bold=False):
    draw.text((x, y), value, font=f(size, bold), fill=color)


base = Image.open(HERE / "respire-bf-fond-v2.png").convert("RGB")
base = base.resize((W, H), Image.Resampling.LANCZOS).convert("RGBA")

# Keep the photograph, with sufficient contrast under the copy.
veil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
veil_pixels = veil.load()
for y in range(H):
    for x in range(W):
        if y < 1000:
            alpha = 145 if x < 450 else max(0, int(145 * (840 - x) / 390)) if x < 840 else 0
            if alpha:
                veil_pixels[x, y] = (3, 47, 43, alpha)
        elif y >= 1100:
            veil_pixels[x, y] = (248, 248, 240, 246)
        else:
            a = round((y - 1000) * 2.46)
            veil_pixels[x, y] = (248, 248, 240, a)
poster = Image.alpha_composite(base, veil)
draw = ImageDraw.Draw(poster)

# Brand lockup: the original SOBUP mark is used as supplied by the website.
draw.rounded_rectangle((88, 82, 264, 258), radius=35, fill=(255, 255, 255, 244))
logo = Image.open(PUBLIC / "logo.png").convert("RGBA")
logo.thumbnail((158, 158), Image.Resampling.LANCZOS)
poster.alpha_composite(logo, (97 + (158 - logo.width) // 2, 91 + (158 - logo.height) // 2))
draw = ImageDraw.Draw(poster)
text(291, 93, "SOBUP", 82, "white", True)
text(296, 185, "SOCIÉTÉ BURKINABÈ DE PNEUMOLOGIE", 25, AQUA, True)

draw.rounded_rectangle((91, 335, 556, 390), radius=17, fill=(245, 160, 74, 255))
text(119, 346, "FORMATION HYBRIDE", 28, DEEP, True)

text(83, 423, "RESPIRE-BF", 113, "white", True)
draw.rounded_rectangle((92, 574, 654, 582), radius=4, fill=ORANGE)
text(91, 625, "De la question de terrain", 39, "white", True)
text(91, 677, "à la publication scientifique.", 39, "white", True)

draw.rounded_rectangle((89, 812, 690, 934), radius=25, fill=(2, 49, 44, 235), outline=(154, 240, 228, 165), width=2)
text(118, 829, "3 MODULES INDÉPENDANTS", 29, AQUA, True)
text(118, 876, "99 h au total  •  80 % pratique", 28, "white")

# An ivory editorial panel carries the substance in a compact, readable ladder.
draw.rounded_rectangle((72, 1112, 1528, 1658), radius=30, fill=(255, 255, 255, 250), outline=(206, 226, 220, 255), width=2)
text(111, 1151, "UN PARCOURS, TROIS LIVRABLES", 48, DEEP, True)
rows = [
    ("01", "PROTOCOLE DE RECHERCHE", "Un protocole complet, prêt pour un comité d’éthique"),
    ("02", "PUBLICATION SCIENTIFIQUE", "Un article scientifique prêt à soumettre"),
    ("03", "PROJET ET GRANT", "Un grant ou un plan stratégique prêt à présenter"),
]
for i, (num, title, description) in enumerate(rows):
    y = 1239 + i * 132
    if i:
        draw.line((111, y - 18, 1489, y - 18), fill=(216, 232, 225, 255), width=2)
    draw.rounded_rectangle((111, y, 197, y + 84), radius=20, fill=DEEP)
    text(132, y + 22, num, 38, "white", True)
    text(228, y - 5, title, 37, INK, True)
    text(229, y + 48, description, 27, MUTED)

text(90, 1710, "UNE FORMATION SOBUP", 26, GREEN, True)
text(90, 1752, "Avec le Département de Santé Publique de l’Université Joseph KI-ZERBO", 27, MUTED)

draw.rounded_rectangle((73, 1815, 1527, 1939), radius=28, fill=DEEP)
text(110, 1832, "PROGRAMME ET CANDIDATURE", 25, AQUA, True)
text(110, 1871, "www.sobup.online/formations/respire-bf", 39, "white", True)
text(110, 1950, "CV requis  •  Lettre de motivation facultative  •  Dates communiquées ultérieurement", 19, GREEN)

result = HERE / "respire-bf-affiche-v2.png"
poster.convert("RGB").save(result, optimize=True)
print(result)
