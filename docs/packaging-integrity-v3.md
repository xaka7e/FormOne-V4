# Packaging integrity repair / Исправление упаковок

This release repairs the 13 catalog product cutouts. It is not a final approval of the decorative fruit/cookie illustrations. The three original hero scenes and the site CSS are unchanged.

В этой версии исправлена целостность 13 упаковок: белые этикетки, прозрачные банки и серебристые пакеты больше не удаляются вместе с фоном. Декоративное окружение пока остаётся прежним и требует отдельной художественной доработки.

## Rebuild and verify / Пересборка и проверка

Use a Python environment with Pillow and CairoSVG. On the first run the repair script downloads the exact public source photos into diagnostics/originals and verifies their SHA-256 against assets/catalog-scenes/sources.json. Original photos are not committed. Then run:

```sh
python scripts/repair-packaging.py
python -m unittest discover -s tests -p test_packaging_integrity.py -v
node --check animation.js
```

With Playwright and Chromium/WebKit installed, serve the project on port 4173 and run both existing browser test files:

```sh
node tests/mobile-story.cjs
node tests/catalog-scenes.cjs
BROWSER=webkit node tests/catalog-scenes.cjs
```

The source RGB pixels must not change during cutout. Only the reviewed outer silhouette controls alpha. A source hash or photo-size change stops processing and requires reviewing the outline again. Do not restore the old color-threshold background removal: labels and reflective packaging connect to the light studio backdrop.

Run the repair script before the Python integrity suite so all 13 verified source fixtures are available. Generated QA files are review aids, not product content. Never publish a visual redesign based solely on tests for file loading: inspect each final image and actual browser screenshots.
