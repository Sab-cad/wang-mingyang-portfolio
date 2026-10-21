from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
TEXT_ROOTS = [ROOT / "src", ROOT / "data"]
TEXT_FILES = [ROOT / "index.html"]
EXTENSIONS = {".png", ".jpg", ".jpeg"}
MIN_BYTES = 500_000
MAX_SIDE = 1600

replacements = {}

for source in PUBLIC.rglob("*"):
    if not source.is_file() or source.suffix.lower() not in EXTENSIONS:
        continue
    if source.stat().st_size < MIN_BYTES:
        continue

    target = source.with_suffix(".webp")
    with Image.open(source) as image:
        image = image.convert("RGB")
        image.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=90, method=6)

    old_url = "/" + source.relative_to(PUBLIC).as_posix()
    new_url = "/" + target.relative_to(PUBLIC).as_posix()
    replacements[old_url] = new_url
    source.unlink()

for root in TEXT_ROOTS:
    if root.exists():
        TEXT_FILES.extend(
            path for path in root.rglob("*")
            if path.is_file() and path.suffix.lower() in {".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".html"}
        )

for path in TEXT_FILES:
    if not path.exists():
        continue
    content = path.read_text(encoding="utf-8")
    updated = content
    for old_url, new_url in replacements.items():
        updated = updated.replace(old_url, new_url)
    if updated != content:
        path.write_text(updated, encoding="utf-8")

before_after = sorted(replacements.items())
print(f"Optimized {len(before_after)} assets")
for old_url, new_url in before_after:
    print(f"{old_url} -> {new_url}")
