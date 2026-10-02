# Catalog card artwork — 2026-10-02

## Approved direction / Утверждённое направление

Keep the Chocolate, Creatine Gummies Apple and Vanilla hero scenes unchanged. For the other 13 products, use the flavor and illustrations on the original package: cookies and crumbs, berries, citrus, peach or mango. Keep the dark graphite setting, restrained light and existing site typography. Snow is not a requirement. Original package graphics must not be redrawn.

Три готовые hero-сцены сохранены. Остальные карточки оформлены по вкусам и рисункам упаковок в общей тёмной гамме сайта. Снежная тема снята, логотипы и этикетки не перерисованы.

## Runtime files / Файлы сайта

- `animation.js`: `catalogProducts` contains product text and local scene paths. The animated `featuredProducts` and scene logic are unchanged.
- `styles.css`: `.flavor-art` styles only the new composited scenes; `.scene-art` retains the three existing backgrounds and masks.
- `assets/catalog-scenes/`: 13 ready-to-serve WebP compositions; `sources.json` records the original photo URLs and checksums.
- `index.html`: cache key `catalog-flavors-2`.

The original photos were cropped, background-masked and resized, then composited with decorative SVG food artwork. This is illustrative product scenery, not a change to product formulation. Do not treat the decoration as additional ingredient or health claims.

## Verification / Проверка

Verified source commit: `39a42966884bffe1a4d1cec0ea7295326d6a3fb6`.
GitHub Actions run: `36999731926` on `design/flavor-cards-20261002`.

Checks passed: original mobile animation, unchanged hero asset checksums, warm-background removal while preserving enclosed white labels, JavaScript syntax, 16 loaded catalog images, category filters, no page errors or horizontal overflow at 1440, 768, 390 and 320px widths in Chromium and WebKit.

To rerun browser checks, install Playwright with Chromium/WebKit, serve this directory on port 4173, then run:

```sh
node tests/mobile-story.cjs
node tests/catalog-scenes.cjs
BROWSER=webkit node tests/catalog-scenes.cjs
```

Build scripts and visual QA artifacts remain on `design/flavor-cards-20261002`; they are not required by the static site. The original baseline is `4cebbd416d4c3af19cd2c86ce4a4227fc199f8c6`.
