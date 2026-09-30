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
BAND_TOP = 995  # haut du bandeau foncé ; remonté pour loger les deux lignes du bas
FONT_REGULAR = "C:/Windows/Fonts/arial.ttf"
FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


background = Image.open(HERE / "respire-bf-fond.png").convert("RGB")
scale = max(W / background.width, H / background.height)
background = background.resize((round(background.width * scale), round(background.height * scale)), Image.Resampling.LANCZOS)
offset_x = (background.width - W) // 2
offset_y = (background.height - H) // 2
cover = background.crop((offset_x, offset_y, offset_x + W, offset_y + H))

# The photo shares the poster's exact ratio, so there is no crop margin to zoom
# out into. To make the subject smaller we shrink the photo and pin it to the
# top-right: the strip it frees on the left sits under the opaque cream veil,
# and the one at the bottom under the dark band. The full-size photo stays
# underneath so no flat colour ever shows through.
SUBJECT_SCALE = 0.93
shrunk = cover.resize((round(W * SUBJECT_SCALE), round(H * SUBJECT_SCALE)), Image.Resampling.LANCZOS)
pad_x, pad_y = W - shrunk.width, H - shrunk.height

# Anchored bottom-right so the subject shrinks downwards; anchoring at the top
# lifted his head and made him read as larger. The freed strips are filled by
# stretching the photo's own edge pixels — laying the full-size photo underneath
# instead leaves a hard, visible seam across the blurred building.
poster = Image.new("RGB", (W, H))
poster.paste(shrunk, (pad_x, pad_y))
poster.paste(shrunk.crop((0, 0, shrunk.width, 1)).resize((shrunk.width, pad_y), Image.Resampling.BILINEAR), (pad_x, 0))
poster.paste(poster.crop((pad_x, 0, pad_x + 1, H)).resize((pad_x, H), Image.Resampling.BILINEAR), (0, 0))
poster = poster.convert("RGBA")

# Guarantee readable copy on varying print and screen backgrounds.
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
pixels = overlay.load()
for y in range(H):
    for x in range(W):
        if y < BAND_TOP:
            alpha = 235 if x < 620 else max(0, int(235 * (1050 - x) / 430)) if x < 1050 else 0
            if alpha:
                pixels[x, y] = (255, 252, 244, alpha)
        else:
            pixels[x, y] = (11, 61, 56, 242)
poster = Image.alpha_composite(poster, overlay)
d = ImageDraw.Draw(poster)

# Header. The card follows the logo's landscape ratio instead of being square,
# which lets the logo grow without pushing down into the headline.
LOGO_CARD = (70, 40, 300, 182)
d.rounded_rectangle(LOGO_CARD, radius=25, fill=(255, 255, 255, 242))
logo = Image.open(PUBLIC / "logo.png").convert("RGBA")
logo.thumbnail((210, 210), Image.Resampling.LANCZOS)
card_w, card_h = LOGO_CARD[2] - LOGO_CARD[0], LOGO_CARD[3] - LOGO_CARD[1]
poster.alpha_composite(logo, (LOGO_CARD[0] + (card_w - logo.width) // 2, LOGO_CARD[1] + (card_h - logo.height) // 2))
d = ImageDraw.Draw(poster)
d.text((322, 63), "SOBUP", font=font(60, True), fill=TEAL)
d.text((324, 132), "Société Burkinabè de Pneumologie", font=font(23), fill=TEAL_2)

# The programme name belongs in the badge: the headline already says "hybride".
badge_font = font(23, True)
badge_w = round(badge_font.getlength("RESPIRE-BF")) + 66
d.rounded_rectangle((1532 - badge_w, 70, 1532, 124), radius=22, fill=(11, 61, 56, 240))
d.text((1532 - badge_w + 33, 83), "RESPIRE-BF", font=badge_font, fill="white")

# The official designation is the headline. Three lines at 58 pt measure 583 px,
# which stays inside the 640 px opaque part of the light panel.
TITLE_LINES = ["Formation hybride", "en recherche", "en santé respiratoire"]
for index, line in enumerate(TITLE_LINES):
    d.text((83, 212 + index * 70), line, font=font(58, True), fill=TEAL)
d.rounded_rectangle((91, 450, 735, 458), radius=3, fill=ORANGE)

# Pedagogical split, in chips right under the rule: it was buried in the footer
# where nobody read it, and the 80 % practice is the strongest selling point.
chips = [("20 % de théorie", TEAL_2, "white"), ("80 % de pratique", ORANGE, "white"), ("99 h au total", None, TEAL_2)]
chip_x = 88
for label, fill_colour, text_colour in chips:
    chip_font = font(21, True)
    chip_w = round(chip_font.getlength(label)) + 36
    if fill_colour:
        d.rounded_rectangle((chip_x, 478, chip_x + chip_w, 522), radius=15, fill=fill_colour)
    else:
        d.rounded_rectangle((chip_x, 478, chip_x + chip_w, 522), radius=15, outline=(49, 185, 174, 230), width=2)
    d.text((chip_x + 18, 488), label, font=chip_font, fill=text_colour)
    chip_x += chip_w + 13

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
d.text((111, 949), "Montants en FCFA  •  3 modules indépendants", font=font(17), fill=TEAL_2)

# The two training periods sit beside the pricing without changing the original layout.
d.rounded_rectangle((932, 753, 1532, 981), radius=22, fill=(11, 61, 56, 244))
d.text((961, 768), "DATES DE LA FORMATION", font=font(24, True), fill="#89f3e6")
d.line((961, 806, 1503, 806), fill=(100, 173, 160), width=2)
d.text((961, 818), "EN LIGNE", font=font(18, True), fill="#89f3e6")
d.text((961, 841), "14 décembre 2026 au 10 janvier 2027", font=font(23, True), fill="white")
d.text((961, 878), "PRÉSENTIEL", font=font(18, True), fill="#89f3e6")
d.text((961, 901), "18 au 23 janvier 2027", font=font(23, True), fill="white")
# The deadline gets its own high-contrast bar: it is the one date that expires.
d.rounded_rectangle((961, 936, 1503, 971), radius=11, fill=ORANGE)
d.text((978, 944), "INSCRIPTION ET PAIEMENT AVANT LE 5 DÉCEMBRE 2026", font=font(17, True), fill="white")

# Clear destination and required documents.
# The kicker and URL give back a few pixels so the two practical lines below can
# grow: at 21 and 18 pt in a pale grey they were unreadable on the dark band.
d.text((92, 1002), "PROGRAMME ET CANDIDATURE EN LIGNE", font=font(21, True), fill="#89f3e6")
d.text((92, 1032), "www.sobup.online/formations/respire-bf", font=font(35, True), fill="white")
d.text((92, 1086), "CV requis  •  Candidature entièrement en ligne", font=font(32), fill="white")
d.text((92, 1135), "3 modules indépendants  •  Certificat délivré pour chaque module validé", font=font(29), fill="#e6f7f1")

# Contacts, dans la moitié droite du bandeau restée vide. Les deux numéros sont
# sur des lignes séparées : à la suite, la ligne était trop large pour grossir.
d.line((1050, 1004, 1050, 1178), fill=(100, 173, 160), width=2)
d.text((1085, 998), "CONTACT", font=font(21, True), fill="#89f3e6")
for row, value in enumerate(["sobup01@gmail.com", "+226 76 58 01 03", "+226 70 24 12 24"]):
    y = 1032 + row * 50
    d.ellipse((1085, y + 14, 1101, y + 30), fill=ORANGE)
    d.text((1120, y), value, font=font(38, True), fill="white")

poster.convert("RGB").save(OUT, quality=95, optimize=True)
print(OUT)
