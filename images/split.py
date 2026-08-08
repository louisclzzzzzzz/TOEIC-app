#!/usr/bin/env python3
"""
Script pour découper une (ou plusieurs) image(s) en 4 quadrants égaux
(haut-gauche, haut-droit, bas-gauche, bas-droit), comme une image en mosaïque 2x2.

Dépendance requise :
    pip install pillow

Utilisation :
    # Découper une seule image
    python decouper_image_en_4.py chemin/vers/image.jpg

    # Découper toutes les images d'un dossier (jpg, jpeg, png, webp)
    python decouper_image_en_4.py chemin/vers/dossier --dossier

    # Choisir le dossier de sortie (par défaut : "decoupes" à côté de l'image)
    python decouper_image_en_4.py image.jpg --sortie mes_resultats
"""

import argparse
import os
from pathlib import Path

from PIL import Image

EXTENSIONS_VALIDES = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

NOMS_QUADRANTS = {
    "haut_gauche": (0, 0),
    "haut_droite": (1, 0),
    "bas_gauche": (0, 1),
    "bas_droite": (1, 1),
}


def decouper_image(chemin_image: Path, dossier_sortie: Path) -> None:
    """Découpe une image en 4 quadrants égaux et enregistre chaque morceau."""
    with Image.open(chemin_image) as img:
        largeur, hauteur = img.size
        demi_largeur = largeur // 2
        demi_hauteur = hauteur // 2

        dossier_sortie.mkdir(parents=True, exist_ok=True)
        nom_base = chemin_image.stem
        extension = chemin_image.suffix

        for nom_quadrant, (col, ligne) in NOMS_QUADRANTS.items():
            gauche = col * demi_largeur
            haut = ligne * demi_hauteur
            # Pour les colonnes/lignes du bas ou de droite,
            # on va jusqu'au bord réel de l'image (gère les dimensions impaires)
            droite = largeur if col == 1 else demi_largeur
            bas = hauteur if ligne == 1 else demi_hauteur

            morceau = img.crop((gauche, haut, droite, bas))
            chemin_sortie = dossier_sortie / f"{nom_base}_{nom_quadrant}{extension}"
            morceau.save(chemin_sortie)
            print(f"  -> {chemin_sortie}")


def traiter_chemin(chemin: Path, est_dossier: bool, dossier_sortie_arg: str) -> None:
    if est_dossier:
        images = [
            f for f in chemin.iterdir()
            if f.is_file() and f.suffix.lower() in EXTENSIONS_VALIDES
        ]
        if not images:
            print(f"Aucune image trouvée dans {chemin}")
            return
        for image in images:
            dossier_sortie = Path(dossier_sortie_arg) if dossier_sortie_arg else chemin / "decoupes"
            print(f"Découpage de {image.name}...")
            decouper_image(image, dossier_sortie)
    else:
        if chemin.suffix.lower() not in EXTENSIONS_VALIDES:
            print(f"Extension non supportée : {chemin.suffix}")
            return
        dossier_sortie = Path(dossier_sortie_arg) if dossier_sortie_arg else chemin.parent / "decoupes"
        print(f"Découpage de {chemin.name}...")
        decouper_image(chemin, dossier_sortie)


def main() -> None:
    parser = argparse.ArgumentParser(description="Découpe une image (ou un dossier d'images) en 4 quadrants.")
    parser.add_argument("chemin", help="Chemin vers l'image ou le dossier à traiter")
    parser.add_argument("--dossier", action="store_true", help="Indique que le chemin est un dossier contenant plusieurs images")
    parser.add_argument("--sortie", default="", help="Dossier de sortie personnalisé (optionnel)")
    args = parser.parse_args()

    chemin = Path(args.chemin)
    if not chemin.exists():
        print(f"Erreur : le chemin '{chemin}' n'existe pas.")
        return

    traiter_chemin(chemin, args.dossier, args.sortie)
    print("Terminé.")


if __name__ == "__main__":
    main()
